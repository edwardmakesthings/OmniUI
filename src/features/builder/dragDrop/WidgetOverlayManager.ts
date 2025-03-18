import { EntityId } from "@/core/types/EntityTypes";
import dropZoneManager, { DropPosition, DropZoneConfig } from "./DropZone";
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
 * Configuration for widget drop zones
 */
export interface WidgetDropZoneConfig {
    // Widget-level config
    widgetConfig: DropZoneConfig;
    // Component-level config
    componentConfig: DropZoneConfig;
    // Container-specific config
    containerConfig: DropZoneConfig;
    // Cross-widget config
    crossWidgetConfig: DropZoneConfig;
}

/**
 * Options for configuring drop zones with additional settings
 */
export interface DropZoneOptions extends Partial<DropZoneConfig> {
    // Additional options beyond DropZoneConfig
    availablePositions?: DropPosition[];
    isContainer?: boolean;
    highlightClass?: string;
}

/**
 * Manager for widget overlay system handling drop targets and drop operations
 */
export class WidgetOverlayManager {
    // Singleton instance
    private static instance: WidgetOverlayManager;

    // Current state
    private currentTarget: DropTargetInfo | null = null;

    // Default drop zone configurations
    private dropZoneConfigs: WidgetDropZoneConfig = {
        // Widget-level defaults (only inside)
        widgetConfig: {
            zones: {
                [DropPosition.INSIDE]: { size: '100%', position: 'middle' }
            },
            orientation: 'vertical',
            priorities: [DropPosition.INSIDE]
        },

        // Regular component config
        componentConfig: {
            zones: {
                [DropPosition.BEFORE]: { size: '30%', position: 'start' },
                [DropPosition.AFTER]: { size: '30%', position: 'end' },
                [DropPosition.INSIDE]: { size: '40%', position: 'middle', requiresContainer: true }
            },
            orientation: 'vertical',
            priorities: [DropPosition.INSIDE, DropPosition.BEFORE, DropPosition.AFTER]
        },

        // Container-specific config (prioritizes INSIDE)
        containerConfig: {
            zones: {
                [DropPosition.BEFORE]: { size: '20%', position: 'start' },
                [DropPosition.AFTER]: { size: '20%', position: 'end' },
                [DropPosition.INSIDE]: { size: '60%', position: 'middle' }
            },
            orientation: 'vertical',
            priorities: [DropPosition.INSIDE, DropPosition.BEFORE, DropPosition.AFTER]
        },

        // Cross-widget drop config (prefers INSIDE for cross-widget)
        crossWidgetConfig: {
            zones: {
                [DropPosition.INSIDE]: { size: '100%', position: 'middle' }
            },
            orientation: 'vertical',
            priorities: [DropPosition.INSIDE]
        }
    };

    private constructor() { }

    public static getInstance(): WidgetOverlayManager {
        if (!WidgetOverlayManager.instance) {
            WidgetOverlayManager.instance = new WidgetOverlayManager();
        }
        return WidgetOverlayManager.instance;
    }

    /**
     * Find the best drop target at the specified position
     * @param widgetId The widget to search in
     * @param x The x coordinate
     * @param y The y coordinate
     * @returns The drop target information
     */
    findDropTargetAtPosition(
        widgetId: EntityId,
        x: number,
        y: number
    ): DropTargetInfo {
        // Get drag source for cross-widget detection
        const dragSource = useDragDrop.getState().dragSource;
        const isCrossWidgetDrag = dragSource?.data?.widgetId &&
            dragSource.data.widgetId !== widgetId &&
            dragSource.data.widgetId !== 'palette';

        if (isCrossWidgetDrag) {
            console.log(`Cross-widget drag detected from ${dragSource?.data?.widgetId} to ${widgetId}`);
        }

        // Find all components at this position
        const components = dropZoneManager.findAllComponentsAtPosition(widgetId, x, y);

        // Sort by depth - deepest first (most nested)
        components.sort((a, b) => b.depth - a.depth);

        // If no components were found, return the widget itself as target
        if (components.length === 0) {
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
                    dragSource?.data?.widgetId,
                    isCrossWidgetDrag
                );
            }

            if (!isInvalid) {
                // Use this container
                return this.determineDropTargetInfo(
                    widgetId,
                    target.id,
                    element,
                    x, y,
                    dragSource?.data?.widgetId,
                    isCrossWidgetDrag
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
                dragSource?.data?.widgetId,
                isCrossWidgetDrag
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
        };
    }

    /**
     * Determine drop target information based on component and position
     * @param widgetId The widget ID
     * @param componentId The component ID
     * @param element The component element
     * @param x The x coordinate
     * @param y The y coordinate
     * @param sourceWidgetId The source widget ID if cross-widget
     * @param isCrossWidgetDrag Whether this is a cross-widget drag
     * @returns The drop target information
     */
    private determineDropTargetInfo(
        widgetId: EntityId,
        componentId: EntityId,
        element: HTMLElement,
        x: number,
        y: number,
        sourceWidgetId?: EntityId,
        isCrossWidgetDrag: boolean = false
    ): DropTargetInfo {
        // Determine if this is a container component
        const isContainer =
            element.hasAttribute('data-is-container') &&
            element.getAttribute('data-is-container') === 'true';

        // Get parent ID for hierarchy operations
        const parentId = element.getAttribute('data-parent-id') as EntityId | undefined;

        // Select configuration based on component type and drag context
        let dropConfig: Partial<DropZoneConfig> = {};

        // For cross-widget drag operations, use special config (prefers INSIDE)
        if (isCrossWidgetDrag) {
            dropConfig = this.dropZoneConfigs.crossWidgetConfig;
        }
        // For containers, use container-specific config
        else if (isContainer) {
            dropConfig = this.dropZoneConfigs.containerConfig;
        }
        // For regular components, use standard component config
        else {
            dropConfig = this.dropZoneConfigs.componentConfig;
        }

        // Available drop positions based on component type
        const availablePositions = isContainer
            ? [DropPosition.BEFORE, DropPosition.AFTER, DropPosition.INSIDE]
            : [DropPosition.BEFORE, DropPosition.AFTER];

        // Set up drop zone options
        const dropOptions: DropZoneOptions = {
            ...dropConfig,
            availablePositions,
            isContainer
        };

        // Calculate drop position using the enhanced dropZoneManager
        const position = dropZoneManager.calculateDropPosition(
            element,
            x,
            y,
            dropOptions
        );

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
     * Update the current drop target
     * @param target The drop target info or null to clear
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

            // Determine if this is a cross-widget operation for styling
            const isCrossWidget = target.sourceWidgetId &&
                target.sourceWidgetId !== target.widgetId &&
                target.sourceWidgetId !== 'palette';

            // Add a special class for cross-widget drops
            if (isCrossWidget && target.element) {
                target.element.classList.add('cross-widget-drop-target');
            }

            // Set the drop position using dropZoneManager
            dropZoneManager.setDropPosition(
                target.componentId,
                target.element,
                target.position
            );

            // Also directly set the attribute for more reliable styling
            if (target.element && target.position) {
                target.element.setAttribute(`data-drop-${target.position}`, 'true');
            }
        } else if (!target.componentId && target.widgetId) {
            // Handle widget-level drop indicators
            const widgetElement = document.querySelector(`[data-widget-id="${target.widgetId}"]`);
            if (widgetElement instanceof HTMLElement) {
                widgetElement.classList.add("widget-drop-target");
            }
        }
    }

    /**
     * Clear all drop indicators
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
                element.classList.remove('cross-widget-drop-target');

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
     * Clean up all drop indicators in a widget
     * @param widgetId Widget ID to clean
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
                element.classList.remove('cross-widget-drop-target');

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
     * Emergency cleanup of all drop indicators in the DOM
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
        document.querySelectorAll('.drop-highlight, .drop-target, .container-highlight, .cross-widget-drop-target').forEach(element => {
            element.classList.remove('drop-highlight');
            element.classList.remove('drop-target');
            element.classList.remove('container-highlight');
            element.classList.remove('cross-widget-drop-target');
        });
    }

    /**
     * Handle an actual drop operation
     * @param dragData Data being dragged
     * @param dragType Type of dragged item
     * @param position Position for the drop
     * @returns Whether the drop was successful
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
        const isCrossWidgetDrop = (sourceWidgetId &&
            sourceWidgetId !== destinationWidgetId &&
            sourceWidgetId !== 'palette') ?? false;

        if (isCrossWidgetDrop) {
            console.log(`Processing cross-widget drop from ${sourceWidgetId} to ${destinationWidgetId}`);
        }

        try {
            // Handle component definition drops (new components)
            if (dragType === "component-definition") {
                return this.handleComponentDefinitionDrop(
                    dragData,
                    destinationWidgetId,
                    targetComponentId,
                    dropPosition,
                    targetParentId,
                    position
                );
            }
            // Handle existing component drops (moving components)
            else if (dragType === "component") {
                return this.handleComponentDrop(
                    dragData,
                    destinationWidgetId,
                    targetComponentId,
                    dropPosition,
                    targetParentId,
                    sourceWidgetId,
                    isCrossWidgetDrop
                );
            }

            return false;
        } catch (error) {
            console.error("Error handling drop in WidgetOverlayManager:", error);
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
     * Handle dropping a component definition
     */
    private handleComponentDefinitionDrop(
        dragData: any,
        destinationWidgetId: EntityId,
        targetComponentId: EntityId | null,
        dropPosition: DropPosition | null,
        targetParentId: EntityId | undefined,
        position?: Position
    ): boolean {
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

        return false;
    }

    /**
     * Handle dropping an existing component
     */
    private handleComponentDrop(
        dragData: any,
        destinationWidgetId: EntityId,
        targetComponentId: EntityId | null,
        dropPosition: DropPosition | null,
        targetParentId: EntityId | undefined,
        sourceWidgetId: EntityId | undefined,
        isCrossWidgetDrop: boolean
    ): boolean {
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

        // Use isCrossWidgetDrop for logging and special handling
        if (isCrossWidgetDrop) {
            console.log(`Processing cross-widget component move from ${actualSourceWidgetId} to ${destinationWidgetId}`);

            // You could apply special handling for cross-widget drops here
            // For example, different validation rules or notifications
        }

        // Prevent dropping onto itself (only in same widget)
        if (!isCrossWidgetDrop && sourceComponentId === targetComponentId) {
            console.warn("Cannot drop component onto itself");
            return false;
        }

        // Check for circular reference (only in same widget)
        if (!isCrossWidgetDrop &&
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
            // We might use different options for cross-widget moves
            const copyInstanceData = isCrossWidgetDrop; // Always copy instances in cross-widget moves

            const success = builderService.moveComponent(
                actualSourceWidgetId,
                sourceComponentId,
                targetComponentId, // New parent ID
                destinationWidgetId, // Destination widget if different
                copyInstanceData
            );

            if (success) {
                // Use isCrossWidgetDrop to determine which event to publish
                if (isCrossWidgetDrop) {
                    // Cross-widget movement
                    eventBus.publish("component:moved", {
                        componentId: sourceComponentId,
                        sourceWidgetId: actualSourceWidgetId,
                        destinationWidgetId,
                        newParentId: targetComponentId,
                        isCrossWidget: true // Add flag for listeners
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

        return false;
    }

    /**
     * Get the current drop target
     * @returns Current drop target or null
     */
    getCurrentTarget(): DropTargetInfo | null {
        return this.currentTarget;
    }

    /**
     * Check if a move would create a circular reference
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
export const widgetOverlayManager = WidgetOverlayManager.getInstance();
export default widgetOverlayManager;
