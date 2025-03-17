import { EntityId } from "@/core/types/EntityTypes";
import dropZoneManager, { DropPosition } from "./DropZone";
import { builderService } from "@/store";
import eventBus from "@/core/eventBus/eventBus";
import { useWidgetStore } from "@/features/builder/stores/widgetStore";
import { Position } from "@/core/types/Geometry";
import useDragDrop from "./DragDropCore";

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
    sourceWidgetId?: EntityId
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
        // console.log(`[FindTarget] Looking for drop target at (${x}, ${y}) in widget ${widgetId}`);

        // Find all components at this position
        const components = dropZoneManager.findAllComponentsAtPosition(widgetId, x, y);

        // Sort by depth - deepest first (most nested)
        components.sort((a, b) => b.depth - a.depth);

        // Enhance logging for cross-widget operations
        const dragSource = useDragDrop.getState().dragSource;
        const isCrossWidgetDrag = dragSource?.data?.widgetId &&
            dragSource.data.widgetId !== widgetId &&
            dragSource.data.widgetId !== 'palette';

        if (isCrossWidgetDrag) {
            console.log(`Cross-widget drag detected from ${dragSource?.data?.widgetId} to ${widgetId}`);
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
                isContainer: true,
                sourceWidgetId: dragSource?.data?.widgetId
            };
        }

        // We're only interested in components that can be containers
        // Filter for container components first
        const containerComponents = components.filter(component => {
            const element = component.element as HTMLElement;
            return element.getAttribute('data-is-container') === 'true';
        });

        // If we have container components, use the deepest one
        if (containerComponents.length > 0) {
            const target = containerComponents[0]; // Already sorted by depth
            const element = target.element as HTMLElement;

            // Check if this is a problematic target that shouldn't receive drops
            const isInvalid = element.hasAttribute('data-no-drop') ||
                element.classList.contains('non-droppable');

            if (isInvalid && containerComponents.length > 1) {
                // Try the next container if this one is invalid
                const nextTarget = containerComponents[1];
                return this.determineDropTargetInfo(
                    widgetId,
                    nextTarget.id,
                    nextTarget.element as HTMLElement,
                    x, y,
                    dragSource?.data?.widgetId
                );
            }

            if (!isInvalid) {
                // Use this container
                return this.determineDropTargetInfo(
                    widgetId,
                    target.id,
                    element,
                    x, y,
                    dragSource?.data?.widgetId
                );
            }
        }

        // If no valid containers found, fall back to the deepest component for before/after positions
        if (components.length > 0) {
            const target = components[0];
            const element = target.element as HTMLElement;
            return this.determineDropTargetInfo(
                widgetId,
                target.id,
                element,
                x, y,
                dragSource?.data?.widgetId
            );
        }

        // Last resort - use the widget
        return {
            widgetId,
            componentId: null,
            position: DropPosition.INSIDE,
            element: null,
            canDrop: true,
            isContainer: true,
            sourceWidgetId: dragSource?.data?.widgetId
        }
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
        y: number,
        sourceWidgetId?: EntityId
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
            sourceWidgetId
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
            widgetId: destinationWidgetId,
            componentId: targetComponentId,
            position: dropPosition,
            parentId: targetParentId,
            sourceWidgetId,
        } = this.currentTarget;

        // Determine if this is a cross-widget operation
        const isCrossWidgetDrop = sourceWidgetId && sourceWidgetId !== destinationWidgetId && sourceWidgetId !== 'palette';

        if (isCrossWidgetDrop) {
            console.log(`Processing cross-widget drop from ${sourceWidgetId} to ${destinationWidgetId}`);
        }

        try {
            // Handle component definition drops (new components)
            if (dragType === "component-definition") {
                const definitionId = dragData.definitionId || dragData.id;
                if (!definitionId) return false;

                // Drop inside container
                if (targetComponentId && dropPosition === DropPosition.INSIDE) {
                    const result = builderService.addChildComponent(
                        destinationWidgetId,
                        targetComponentId,
                        definitionId,
                        position || {
                            x: { value: 10, unit: "px" },
                            y: { value: 10, unit: "px" },
                        }
                    );

                    if (result) {
                        eventBus.publish("component:added", {
                            componentId: result.id,
                            widgetId: destinationWidgetId,
                            parentId: targetComponentId,
                        });
                        return true;
                    }
                }
                // Drop before/after component
                else if (
                    targetComponentId &&
                    (dropPosition === DropPosition.BEFORE ||
                        dropPosition === DropPosition.AFTER)
                ) {
                    // Add to widget first
                    const result = builderService.addComponentToWidget(
                        destinationWidgetId,
                        definitionId,
                        position || {
                            x: { value: 10, unit: "px" },
                            y: { value: 10, unit: "px" },
                        }
                    );

                    if (result) {
                        // Move to correct parent
                        builderService.moveComponent(
                            destinationWidgetId,
                            result.id,
                            targetParentId
                        );

                        // Reorder
                        builderService.reorderComponents(
                            destinationWidgetId,
                            targetParentId || destinationWidgetId,
                            result.id,
                            targetComponentId,
                            dropPosition === DropPosition.BEFORE
                                ? "before"
                                : "after"
                        );

                        eventBus.publish("component:added", {
                            componentId: result.id,
                            widgetId: destinationWidgetId,
                            parentId: targetParentId,
                        });
                        return true;
                    }
                }
                // Drop directly on widget
                else if (!targetComponentId) {
                    const result = builderService.addComponentToWidget(
                        destinationWidgetId,
                        definitionId,
                        position || {
                            x: { value: 10, unit: "px" },
                            y: { value: 10, unit: "px" },
                        }
                    );

                    if (result) {
                        eventBus.publish("component:added", {
                            componentId: result.id,
                            widgetId: destinationWidgetId,
                        });
                        return true;
                    }
                }
            }
            // Handle existing component drops (moving components)
            else if (dragType === "component") {
                const sourceComponentId = dragData.id || dragData.data?.id;

                // Use the source widget ID from the drag data, or from the current target
                const actualSourceWidgetId =
                    dragData.widgetId ||
                    dragData.data?.widgetId ||
                    sourceWidgetId;

                if (!sourceComponentId || !actualSourceWidgetId) {
                    console.error("Missing source component or widget ID in drag data");
                    return false;
                }

                // Skip palette items (they aren't actual components to move)
                if (actualSourceWidgetId === 'palette') {
                    console.warn("Cannot move palette items - they should be added as new components");
                    return false;
                }

                // Log the cross-widget operation with full details
                if (actualSourceWidgetId !== destinationWidgetId) {
                    console.log(`Cross-widget component move:
                    Component: ${sourceComponentId}
                    From: ${actualSourceWidgetId}
                    To: ${destinationWidgetId}
                    Target: ${targetComponentId || "widget root"}
                    Position: ${dropPosition || "inside"}
                `);
                }

                // Prevent dropping onto itself (only in same widget)
                if (actualSourceWidgetId === destinationWidgetId && sourceComponentId === targetComponentId) {
                    return false;
                }

                // Check for circular reference (only in same widget)
                if (actualSourceWidgetId === destinationWidgetId &&
                    targetComponentId &&
                    dropPosition === DropPosition.INSIDE) {

                    if (this.wouldCreateCircularReference(
                        destinationWidgetId,
                        sourceComponentId,
                        targetComponentId
                    )) {
                        console.warn("Cannot create circular reference in component hierarchy");
                        return false;
                    }
                }

                // Drop inside container
                if (targetComponentId && dropPosition === DropPosition.INSIDE) {
                    const success = builderService.moveComponent(
                        actualSourceWidgetId,
                        sourceComponentId,
                        targetComponentId, // New parent ID
                        destinationWidgetId // Destination widget if different
                    );

                    if (success) {
                        if (actualSourceWidgetId !== destinationWidgetId) {
                            // Cross-widget movement
                            eventBus.publish("component:moved", {
                                componentId: sourceComponentId,
                                sourceWidgetId: actualSourceWidgetId,
                                destinationWidgetId,
                                newParentId: targetComponentId
                            });
                        } else {
                            // Same-widget movement
                            eventBus.publish("component:updated", {
                                componentId: sourceComponentId,
                                widgetId: destinationWidgetId,
                                parentId: targetComponentId,
                            });
                        }
                        return true;
                    }
                }
                // Drop before/after component
                else if (
                    targetComponentId &&
                    (dropPosition === DropPosition.BEFORE ||
                        dropPosition === DropPosition.AFTER)
                ) {
                    // First move to the right parent (possibly in a different widget)
                    const moveSuccess = builderService.moveComponent(
                        actualSourceWidgetId,
                        sourceComponentId,
                        targetParentId, // Move to the target's parent
                        destinationWidgetId // Destination widget if different
                    );

                    if (moveSuccess) {
                        // Then reorder within the destination widget
                        builderService.reorderComponents(
                            destinationWidgetId,
                            targetParentId || destinationWidgetId,
                            sourceComponentId,
                            targetComponentId,
                            dropPosition === DropPosition.BEFORE
                                ? "before"
                                : "after"
                        );

                        if (actualSourceWidgetId !== destinationWidgetId) {
                            // Cross-widget movement
                            eventBus.publish("component:moved", {
                                componentId: sourceComponentId,
                                sourceWidgetId: actualSourceWidgetId,
                                destinationWidgetId,
                                newParentId: targetParentId
                            });
                        } else {
                            // Same-widget movement
                            eventBus.publish("component:updated", {
                                componentId: sourceComponentId,
                                widgetId: destinationWidgetId,
                                parentId: targetParentId,
                            });
                        }
                        return true;
                    }
                }
                // Drop directly on widget
                else if (!targetComponentId) {
                    const success = builderService.moveComponent(
                        actualSourceWidgetId,
                        sourceComponentId,
                        undefined, // Move to root level
                        destinationWidgetId // Destination widget if different
                    );

                    if (success) {
                        if (actualSourceWidgetId !== destinationWidgetId) {
                            // Cross-widget movement
                            eventBus.publish("component:moved", {
                                componentId: sourceComponentId,
                                sourceWidgetId: actualSourceWidgetId,
                                destinationWidgetId
                            });
                        } else {
                            // Same-widget movement
                            eventBus.publish("component:updated", {
                                componentId: sourceComponentId,
                                widgetId: destinationWidgetId,
                            });
                        }
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
            if (destinationWidgetId) {
                eventBus.publish("hierarchy:changed", { widgetId: destinationWidgetId });
            }

            // Also notify source widget about hierarchy change for cross-widget moves
            if (isCrossWidgetDrop && sourceWidgetId) {
                eventBus.publish("hierarchy:changed", { widgetId: sourceWidgetId });
            }
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
