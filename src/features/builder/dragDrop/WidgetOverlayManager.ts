import { EntityId } from "@/core/types/EntityTypes";
import dropZoneManager, { DropPosition } from "./DropZone";
import { builderService } from "@/store";
import eventBus from "@/core/eventBus/eventBus";
import { useWidgetStore } from "@/features/builder/stores/widgetStore";
import { Position } from "@/core/types/Geometry";

/**
 * Result of a drop target detection operation
 */
export interface DropTargetInfo {
    widgetId: EntityId;
    componentId: EntityId | null;
    position: DropPosition | null;
    element: HTMLElement | null;
    canDrop: boolean;
    isContainer: boolean;
    parentId?: EntityId;
}

/**
 * Manager for widget overlay operations
 * Provides centralized handling of component drag and drop within widgets
 *
 * @path src/features/builder/dragDrop/WidgetOverlayManager.ts
 */
export class WidgetOverlayManager {
    // Current state
    private currentTarget: DropTargetInfo | null = null;

    /**
     * Finds the best drop target at a given position within a widget
     */
    findDropTargetAtPosition(
        widgetId: EntityId,
        x: number,
        y: number
    ): DropTargetInfo {
        console.log(`[FindTarget] Looking for drop target at (${x}, ${y}) in widget ${widgetId}`);

        // Find all components at this position
        const components = dropZoneManager.findAllComponentsAtPosition(widgetId, x, y);

        // Sort by depth - deepest first (most nested)
        components.sort((a, b) => b.depth - a.depth);

        console.log(`[FindTarget] Found ${components.length} components at position`);
        if (components.length > 0) {
            console.log(`[FindTarget] Deepest component: ${components[0].id} (depth: ${components[0].depth})`);
        }

        // If no components were found, return the widget itself as target
        if (components.length === 0) {
            console.log(`[FindTarget] No components found, using widget as target`);
            return {
                widgetId,
                componentId: null,
                position: DropPosition.INSIDE,
                element: null,
                canDrop: true,
                isContainer: true
            };
        }

        // Use the deepest (most nested) component first
        const target = components[0];
        const element = target.element as HTMLElement;

        // Check if this is a problematic target that shouldn't receive drops
        const isInvalid = element.hasAttribute('data-no-drop') ||
            element.classList.contains('non-droppable');

        if (isInvalid) {
            console.log(`[FindTarget] Target ${target.id} is invalid for dropping, trying parent`);
            // Try the parent instead
            if (components.length > 1) {
                const parentTarget = components[1];
                return this.determineDropTargetInfo(
                    widgetId,
                    parentTarget.id,
                    parentTarget.element as HTMLElement,
                    x, y
                );
            }

            // If no valid parent, use the widget
            return {
                widgetId,
                componentId: null,
                position: DropPosition.INSIDE,
                element: null,
                canDrop: true,
                isContainer: true
            };
        }

        // Process the target to determine drop position and other properties
        return this.determineDropTargetInfo(widgetId, target.id, element, x, y);
    }

    /**
     * Helper method to determine full drop target information
     * Extracted to make the main method cleaner and allow for recursion
     */
    private determineDropTargetInfo(
        widgetId: EntityId,
        componentId: EntityId,
        element: HTMLElement,
        x: number,
        y: number
    ): DropTargetInfo {
        // Determine if this is a container component
        const isContainer =
            element.hasAttribute('data-is-container') &&
            element.getAttribute('data-is-container') === 'true';

        // Get parent ID for hierarchy operations
        const parentId = element.getAttribute('data-parent-id') as EntityId | undefined;

        // Available drop positions based on component type
        const availablePositions = isContainer
            ? [DropPosition.BEFORE, DropPosition.AFTER, DropPosition.INSIDE]
            : [DropPosition.BEFORE, DropPosition.AFTER];

        // Calculate drop position using our enhanced algorithm
        const position = dropZoneManager.calculateDropPosition(
            element,
            x,
            y,
            isContainer,
            availablePositions
        );

        console.log(`[FindTarget] Target ${componentId} (container: ${isContainer}), position: ${position}`);

        return {
            widgetId,
            componentId,
            position,
            element,
            canDrop: true, // We'll assume we can drop, validation happens at drop time
            isContainer,
            parentId,
        };
    }

    /**
     * Updates the current drop target and manages indicators
     */
    updateDropTarget(target: DropTargetInfo | null): void {
        // Clear existing indicators
        this.clearCurrentIndicators();

        if (!target) {
            this.currentTarget = null;
            return;
        }

        // Update stored target
        this.currentTarget = target;

        // Show indicators based on target type
        if (target.componentId && target.position && target.element) {
            // For component targets
            console.log(`Setting drop position: ${target.componentId} -> ${target.position}`);

            // Ensure all previous drop attributes are cleared
            if (target.element) {
                target.element.setAttribute('data-drop-before', 'false');
                target.element.setAttribute('data-drop-after', 'false');
                target.element.setAttribute('data-drop-inside', 'false');
            }

            // Set the new drop position
            dropZoneManager.setDropPosition(
                target.componentId,
                target.element,
                target.position,
                target.isContainer
            );

            // Also directly set the attribute for more reliable styling
            if (target.element && target.position) {
                target.element.setAttribute(`data-drop-${target.position}`, 'true');
            } else if (!target.componentId && target.widgetId) {
                // Handle widget-level drop indicators if needed
                // We could show a special indicator for the widget itself
                const widgetElement = document.querySelector(`[data-widget-id="${target.widgetId}"]`);
                if (widgetElement instanceof HTMLElement) {
                    widgetElement.classList.add("widget-drop-target");
                }
            }
        }
    }

    /**
     * Enhanced clearCurrentIndicators method with aggressive cleanup
     * for the WidgetOverlayManager, focusing on direct DOM cleanup.
     */
    clearCurrentIndicators(): void {
        console.log("AGGRESSIVE CLEANUP: Clearing all drop indicators and attributes");

        // If we have a current target, clear its indicators first
        if (this.currentTarget && this.currentTarget.componentId) {
            const element = document.querySelector(`[data-component-id="${this.currentTarget.componentId}"]`);
            if (element instanceof HTMLElement) {
                // Reset all data attributes
                element.setAttribute('data-drop-before', 'false');
                element.setAttribute('data-drop-after', 'false');
                element.setAttribute('data-drop-inside', 'false');

                // Remove all highlight classes
                element.classList.remove('drop-highlight');
                element.classList.remove('drop-target');
                element.classList.remove('container-highlight');

                // Reset any inline styles that might have been added
                element.style.outline = '';
                element.style.boxShadow = '';
                element.style.backgroundColor = '';
            }
        }

        // Get the widget ID for broader cleanup
        const widgetId = this.currentTarget?.widgetId;
        if (widgetId) {
            // Clear ALL component indicators in this widget
            this.cleanAllComponentsInWidget(widgetId);

            // Also clear widget-level indicators
            const widgetElement = document.querySelector(`[data-widget-id="${widgetId}"]`);
            if (widgetElement instanceof HTMLElement) {
                widgetElement.classList.remove('widget-drop-target');
            }
        }

        // Reset current target
        this.currentTarget = null;

        // Use dropZoneManager to clear all states as a backup
        dropZoneManager.clearAllDropStates();

        // Global emergency cleanup
        this.globalEmergencyCleanup();
    }

    /**
     * Clean all components in a specific widget
     */
    private cleanAllComponentsInWidget(widgetId: EntityId): void {
        // Get all components in this widget
        const components = document.querySelectorAll(`[data-widget-id="${widgetId}"] [data-component-id]`);

        components.forEach(element => {
            if (element instanceof HTMLElement) {
                // Clear data attributes
                element.setAttribute('data-drop-before', 'false');
                element.setAttribute('data-drop-after', 'false');
                element.setAttribute('data-drop-inside', 'false');

                // Clear classes
                element.classList.remove('drop-highlight');
                element.classList.remove('drop-target');
                element.classList.remove('container-highlight');

                // Clear inline styles
                element.style.outline = '';
                element.style.boxShadow = '';
                element.style.backgroundColor = '';

                // Find and remove actual indicator elements
                const indicators = element.querySelectorAll('.drop-indicator');
                indicators.forEach(indicator => {
                    if (indicator.parentElement) {
                        indicator.parentElement.removeChild(indicator);
                    }
                });

                // Also clean up child containers
                const childContainer = element.querySelector('[data-children-container="true"]');
                if (childContainer instanceof HTMLElement) {
                    childContainer.style.outline = '';
                    childContainer.style.boxShadow = '';
                    childContainer.style.backgroundColor = '';
                    childContainer.classList.remove('drop-highlight');
                }
            }
        });
    }

    /**
     * Global emergency cleanup - call this for persistent indicators
     */
    globalEmergencyCleanup(): void {
        // Find and remove ALL indicator elements in the entire document
        document.querySelectorAll('.drop-indicator, .drop-indicator-before, .drop-indicator-after, .drop-indicator-inside').forEach(indicator => {
            if (indicator.parentElement) {
                indicator.parentElement.removeChild(indicator);
            }
        });

        // Reset ALL drop attributes on ALL components
        document.querySelectorAll('[data-drop-before="true"], [data-drop-after="true"], [data-drop-inside="true"]').forEach(element => {
            if (element instanceof HTMLElement) {
                element.setAttribute('data-drop-before', 'false');
                element.setAttribute('data-drop-after', 'false');
                element.setAttribute('data-drop-inside', 'false');
            }
        });

        // Clear any highlight classes
        document.querySelectorAll('.drop-highlight, .drop-target, .container-highlight').forEach(element => {
            element.classList.remove('drop-highlight');
            element.classList.remove('drop-target');
            element.classList.remove('container-highlight');
        });
    }

    /**
     * Handles an actual drop event based on the current target
     */
    handleDrop(
        dragData: any,
        dragType: "component-definition" | "component",
        position?: Position
    ): boolean {
        if (!this.currentTarget) return false;

        const {
            widgetId,
            componentId,
            position: dropPosition,
            parentId,
        } = this.currentTarget;

        try {
            // Handle component definition drops (new components)
            if (dragType === "component-definition") {
                const definitionId = dragData.definitionId || dragData.id;
                if (!definitionId) return false;

                // Drop inside container
                if (componentId && dropPosition === DropPosition.INSIDE) {
                    const result = builderService.addChildComponent(
                        widgetId,
                        componentId,
                        definitionId,
                        position || {
                            x: { value: 10, unit: "px" },
                            y: { value: 10, unit: "px" },
                        }
                    );

                    if (result) {
                        eventBus.publish("component:added", {
                            componentId: result.id,
                            widgetId,
                            parentId: componentId,
                        });
                        return true;
                    }
                }
                // Drop before/after component
                else if (
                    componentId &&
                    (dropPosition === DropPosition.BEFORE ||
                        dropPosition === DropPosition.AFTER)
                ) {
                    // Add to widget first
                    const result = builderService.addComponentToWidget(
                        widgetId,
                        definitionId,
                        position || {
                            x: { value: 10, unit: "px" },
                            y: { value: 10, unit: "px" },
                        }
                    );

                    if (result) {
                        // Move to correct parent
                        builderService.moveComponent(
                            widgetId,
                            result.id,
                            parentId
                        );

                        // Reorder
                        builderService.reorderComponents(
                            widgetId,
                            parentId || widgetId,
                            result.id,
                            componentId,
                            dropPosition === DropPosition.BEFORE
                                ? "before"
                                : "after"
                        );

                        eventBus.publish("component:added", {
                            componentId: result.id,
                            widgetId,
                            parentId,
                        });
                        return true;
                    }
                }
                // Drop directly on widget
                else if (!componentId) {
                    const result = builderService.addComponentToWidget(
                        widgetId,
                        definitionId,
                        position || {
                            x: { value: 10, unit: "px" },
                            y: { value: 10, unit: "px" },
                        }
                    );

                    if (result) {
                        eventBus.publish("component:added", {
                            componentId: result.id,
                            widgetId,
                        });
                        return true;
                    }
                }
            }
            // Handle existing component drops (moving components)
            else if (dragType === "component") {
                const sourceComponentId = dragData.id;
                if (!sourceComponentId) return false;

                // Prevent dropping onto itself
                if (sourceComponentId === componentId) return false;

                // Check for circular reference
                if (componentId && dropPosition === DropPosition.INSIDE) {
                    if (
                        this.wouldCreateCircularReference(
                            widgetId,
                            sourceComponentId,
                            componentId
                        )
                    ) {
                        console.warn(
                            "Cannot create circular reference in component hierarchy"
                        );
                        return false;
                    }
                }

                // Drop inside container
                if (componentId && dropPosition === DropPosition.INSIDE) {
                    const success = builderService.moveComponent(
                        widgetId,
                        sourceComponentId,
                        componentId
                    );

                    if (success) {
                        eventBus.publish("component:updated", {
                            componentId: sourceComponentId,
                            widgetId,
                            parentId: componentId,
                        });
                        return true;
                    }
                }
                // Drop before/after component
                else if (
                    componentId &&
                    (dropPosition === DropPosition.BEFORE ||
                        dropPosition === DropPosition.AFTER)
                ) {
                    // Move to correct parent
                    builderService.moveComponent(
                        widgetId,
                        sourceComponentId,
                        parentId
                    );

                    // Reorder
                    builderService.reorderComponents(
                        widgetId,
                        parentId || widgetId,
                        sourceComponentId,
                        componentId,
                        dropPosition === DropPosition.BEFORE
                            ? "before"
                            : "after"
                    );

                    eventBus.publish("component:updated", {
                        componentId: sourceComponentId,
                        widgetId,
                        parentId,
                    });
                    return true;
                }
                // Drop directly on widget
                else if (!componentId) {
                    const success = builderService.moveComponent(
                        widgetId,
                        sourceComponentId,
                        undefined // Root level
                    );

                    if (success) {
                        eventBus.publish("component:updated", {
                            componentId: sourceComponentId,
                            widgetId,
                        });
                        return true;
                    }
                }
            }

            return false;
        } catch (error) {
            console.error(
                "Error handling drop in WidgetOverlayManager:",
                error
            );
            return false;
        } finally {
            // Always clear indicators
            this.clearCurrentIndicators();
            this.currentTarget = null;

            // Notify about hierarchy change
            eventBus.publish("hierarchy:changed", { widgetId });
        }
    }

    /**
     * Gets the current drop target
     */
    getCurrentTarget(): DropTargetInfo | null {
        return this.currentTarget;
    }

    /**
     * Check if a drop operation would create a circular reference
     * (dropping a parent into its own descendant)
     */
    wouldCreateCircularReference(
        widgetId: EntityId,
        sourceId: EntityId,
        targetId: EntityId
    ): boolean {
        try {
            const store = useWidgetStore.getState();
            const widget = store.getWidget(widgetId);
            if (!widget) return true; // Safer to prevent the operation if we can't verify

            // Function to check if a component is a descendant of another
            const isDescendantOf = (
                ancestorId: EntityId,
                componentId: EntityId
            ): boolean => {
                if (ancestorId === componentId) return true;

                const component = widget.components.find(
                    (c) => c.id === componentId
                );
                if (!component || !component.parentId) return false;

                return isDescendantOf(ancestorId, component.parentId);
            };

            // Check if target is a descendant of source
            return isDescendantOf(sourceId, targetId);
        } catch (error) {
            console.error("Error checking for circular reference:", error);
            return true; // Safer to prevent the operation if we can't verify
        }
    }
}

// Export singleton instance
export const widgetOverlayManager = new WidgetOverlayManager();
export default widgetOverlayManager;
