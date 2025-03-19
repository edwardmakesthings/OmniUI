/**
 * @file src/services/builderService.ts
 * Central service that coordinates all widget and component operations across the application.
 * This service is the single source of truth for component creation, manipulation, and deletion.
 */
import { useEffect } from "react";
import { ComponentConfig } from "@/core/base/ComponentConfig";
import eventBus from "@/core/eventBus/eventBus";
import { EntityId } from "@/core/types/EntityTypes";
import { Position, Size } from "@/core/types/Geometry";
import { useWidgetStore, Widget, WidgetComponent } from "@/features/builder/stores/widgetStore";
import { useComponentStore, useUIStore } from "@/store";

/**
 * Result object for operations that may succeed or fail
 */
export interface OperationResult<T = any> {
    success: boolean;
    data?: T;
    error?: Error;
}

/**
 * Option sets for component creation
 */
export interface baseComponentOptions {
    size?: Size;
    autoSelect?: boolean;
    openPropertyPanel?: boolean;
    overrides?: Partial<ComponentConfig>;
}

export interface allComponentOptions extends baseComponentOptions {
    position?: Position;
    parentId?: EntityId;
}

export interface BuilderDependencies {
    componentStore: typeof useComponentStore;
    widgetStore: typeof useWidgetStore;
    uiStore: typeof useUIStore;
}

/**
 * Builder service that coordinates actions across different stores
 */
export function createBuilderService(dependencies: BuilderDependencies) {
    const {
        componentStore,
        widgetStore,
        uiStore
    } = dependencies;



    return {
        /**
         * Core component creation function - internal use only
         * This provides the base functionality that other methods build upon
         */
        _createComponent(
            widgetId: EntityId,
            definitionId: EntityId,
            options: allComponentOptions = {}
        ): WidgetComponent | null {
            try {
                // Create component instance
                const instance = componentStore.getState().createFromDefinition(
                    definitionId,
                    options.overrides || {}
                );

                if (!instance || !instance.id) {
                    console.error("Failed to create component instance");
                    return null;
                }

                // Add to widget
                const position = options.position || {
                    x: { value: 10, unit: "px" },
                    y: { value: 10, unit: "px" }
                };

                const component = widgetStore.getState().addComponentToWidget(
                    widgetId,
                    definitionId,
                    instance.id,
                    position
                );

                if (!component) {
                    // Clean up the orphaned instance
                    componentStore.getState().deleteInstance(instance.id);
                    return null;
                }

                // Handle parent relationship if specified
                if (options.parentId) {
                    widgetStore.getState().moveComponent(
                        widgetId,
                        component.id,
                        options.parentId
                    );
                }

                // Handle selection if requested
                if (options.autoSelect && component) {
                    uiStore.getState().selectComponent(
                        component.id,
                        widgetId,
                        { openPropertyPanel: options.openPropertyPanel }
                    );
                }

                return component;
            } catch (error) {
                console.error("Error creating component:", error);
                return null;
            }
        },

        /**
         * Create a new widget with the given name and position.
         * @param name The name to give the new widget
         * @param position The position to place the new widget
         * @returns The new widget, or null if an error occurred
         */
        createWidget(name: string, position: Position): Widget | null {
            try {
                const widget = widgetStore.getState().createWidget(name, position);

                // Notify about widget creation
                eventBus.publish("widget:created", {
                    widgetId: widget.id
                });

                return widget;
            } catch (error) {
                console.error("Error creating widget:", error);
                return null;
            }
        },

        /**
         * Update the position of a widget
         * @param widgetId The ID of the widget to update
         * @param position The new position of the widget
         * @returns True if successful, false if an error occurred
         */
        updateWidgetPosition(widgetId: EntityId, position: Position): boolean {
            try {
                widgetStore.getState().updateWidget(widgetId, { position });

                // Notify about position update
                eventBus.publish("widget:updated", {
                    widgetId: widgetId,
                    action: "moved"
                });

                return true;
            } catch (error) {
                console.error("Error updating widget position:", error);
                return false;
            }
        },

        /**
         * Delete a widget from the canvas
         * @param widgetId Widget ID to delete
         * @returns True if deletion was successful
         */
        deleteWidget(widgetId: EntityId): boolean {
            try {
                // Deselect any selected components in widget
                if (uiStore.getState().selectedWidgetId === widgetId) {
                    uiStore.getState().deselectAll();
                }

                widgetStore.getState().deleteWidget(widgetId);

                // Notify about deletion
                eventBus.publish("widget:deleted", {
                    widgetId: widgetId,
                });

                return true;
            } catch (error) {
                console.error("Error deleting widget:", error);
                return false;
            }
        },

        /**
         * Add a component to the root level of a widget
         *
         * @param widgetId Target widget ID
         * @param definitionId Component definition ID
         * @param position Position in the widget
         * @param options Additional options for creation
         * @returns The created widget component or null if failed
         */
        addComponentToWidget(
            widgetId: EntityId,
            definitionId: EntityId,
            position: Position,
            options: baseComponentOptions = {}
        ): WidgetComponent | null {
            const component = this._createComponent(widgetId, definitionId, {
                position,
                size: options.size,
                overrides: options.overrides,
                autoSelect: options.autoSelect !== false,
                openPropertyPanel: options.openPropertyPanel !== false
            });

            if (component) {
                // Notify about component addition
                eventBus.publish("component:added", {
                    componentId: component.id,
                    widgetId: widgetId
                });
            }

            return component;
        },

        /**
         * Add a child component to a parent component
         *
         * @param widgetId Widget containing the parent component
         * @param parentId Parent component ID
         * @param definitionId Definition ID for the new component
         * @param position Optional position override
         * @param options Additional component options
         * @returns The created component or null if failed
         */
        addChildComponent(
            widgetId: EntityId,
            parentId: EntityId,
            definitionId: EntityId,
            position?: Position,
            options: baseComponentOptions = {}
        ): WidgetComponent | null {
            const component = this._createComponent(widgetId, definitionId, {
                position,
                parentId,
                size: options.size,
                overrides: options.overrides,
                autoSelect: options.autoSelect !== false,
                openPropertyPanel: options.openPropertyPanel !== false
            });

            if (component) {
                // Notify about child component addition
                eventBus.publish("component:added", {
                    componentId: component.id,
                    widgetId,
                    parentId
                });
            }

            return component;
        },

        /**
         * Delete a component from a widget
         * @param widgetId Widget containing the component
         * @param componentId Component to delete
         * @returns True if deleted successfully
         */
        deleteComponent(widgetId: EntityId, componentId: EntityId): boolean {
            try {
                // Find the component to get its instance ID and parent
                const component = widgetStore.getState().findComponent(widgetId, componentId);
                if (!component) return false;

                const parentId = component.parentId;

                // First, deselect if it's selected
                if (uiStore.getState().selectedComponentId === componentId) {
                    uiStore.getState().deselectAll();
                }

                // Then, delete the component from the widget
                widgetStore.getState().removeComponent(widgetId, componentId);

                // Finally, clean up the instance
                try {
                    componentStore.getState().deleteInstance(component.instanceId);
                } catch (error) {
                    console.warn("Could not delete component instance:", error);
                    // Continue even if instance deletion fails
                }

                // Notify about deletion
                eventBus.publish("component:deleted", {
                    componentId,
                    widgetId,
                    parentId
                });

                return true;
            } catch (error) {
                console.error("Failed to delete component:", error);
                return false;
            }
        },

        /**
         * Move a component to a new parent within a widget or to another widget
         * @param sourceWidgetId Widget containing the component
         * @param componentId Component to move
         * @param newParentId New parent ID or undefined for root level
         * @param destinationWidgetId Optional destination widget if different from source
         * @param copyInstanceData Whether to create copies of component instances when moving between widgets
         * @returns True if moved successfully
         */
        moveComponent: (
            sourceWidgetId: EntityId,
            componentId: EntityId,
            newParentId?: EntityId,
            destinationWidgetId?: EntityId,
            copyInstanceData: boolean = true
        ): boolean => {
            try {
                console.log(`[Builder] Moving component ${componentId} from widget ${sourceWidgetId}`);
                console.log(`[Builder] Target: widget=${destinationWidgetId || sourceWidgetId}, parent=${newParentId || 'root'}`);

                // Verify source component exists
                const component = widgetStore.getState().findComponent(sourceWidgetId, componentId);
                if (!component) {
                    console.error(`[Builder] Component ${componentId} not found in widget ${sourceWidgetId}`);
                    return false;
                }

                // Prevent circular references - component can't be its own parent
                if (newParentId === componentId) {
                    console.error(`[Builder] Circular reference detected - component cannot be its own parent`);
                    return false;
                }

                // Check for deeper circular references in the hierarchy
                if (newParentId) {
                    const isCyclical = isCircularReference(
                        sourceWidgetId,
                        componentId,
                        newParentId,
                        widgetStore.getState()
                    );

                    if (isCyclical) {
                        console.error(`[Builder] Circular reference detected in component hierarchy`);
                        return false;
                    }
                }

                // Find current parent for event notification
                const oldParentId = component.parentId;
                const isCrossWidgetMove = destinationWidgetId && destinationWidgetId !== sourceWidgetId;

                // For cross-widget moves, we need special handling for component instances
                if (isCrossWidgetMove && copyInstanceData) {
                    // Get the destination widget to verify it exists
                    const destinationWidget = widgetStore.getState().getWidget(destinationWidgetId);
                    if (!destinationWidget) {
                        console.error(`[Builder] Destination widget ${destinationWidgetId} not found`);
                        return false;
                    }

                    // Helper function to get all descendant components
                    const getDescendants = (rootId: EntityId, widgetId: EntityId): { component: any, depth: number }[] => {
                        const result: { component: any, depth: number }[] = [];
                        const sourceWidget = widgetStore.getState().getWidget(widgetId);
                        if (!sourceWidget) return result;

                        const collectChildren = (parentId: EntityId, depth: number) => {
                            const children = sourceWidget.components.filter(c => c.parentId === parentId);
                            children.forEach(child => {
                                result.push({ component: child, depth });
                                collectChildren(child.id, depth + 1);
                            });
                        };

                        collectChildren(rootId, 0);
                        return result;
                    };

                    // Process all components to be moved, ordered by depth (parents first)
                    try {
                        // First, create a map of old instance IDs to new instance IDs
                        const instanceMap = new Map<EntityId, EntityId>();

                        // Start with the root component
                        const rootInstanceId = component.instanceId;
                        const rootInstance = componentStore.getState().getInstance(rootInstanceId);

                        if (rootInstance) {
                            // Create a copy of the instance
                            const newRootInstance = componentStore.getState().createFromDefinition(
                                component.definitionId,
                                rootInstance.overrides || {}
                            );

                            instanceMap.set(rootInstanceId, newRootInstance.id);

                            // Now process all descendants
                            const descendants = getDescendants(componentId, sourceWidgetId);

                            // Sort by depth so we process parents before children
                            descendants.sort((a, b) => a.depth - b.depth);

                            for (const { component: childComp } of descendants) {
                                const originalInstance = componentStore.getState().getInstance(childComp.instanceId);
                                if (originalInstance) {
                                    // Create a copy of the instance
                                    const newChildInstance = componentStore.getState().createFromDefinition(
                                        childComp.definitionId,
                                        originalInstance.overrides || {}
                                    );

                                    instanceMap.set(childComp.instanceId, newChildInstance.id);
                                }
                            }

                            // Now perform the move operation with the updated instance IDs
                            const success = widgetStore.getState().moveComponent(
                                sourceWidgetId,
                                componentId,
                                newParentId,
                                destinationWidgetId,
                                instanceMap
                            );

                            if (!success) {
                                // Clean up created instances on failure
                                for (const newInstanceId of instanceMap.values()) {
                                    try {
                                        componentStore.getState().deleteInstance(newInstanceId);
                                    } catch (err) {
                                        // Ignore cleanup errors
                                    }
                                }

                                console.error(`[Builder] Failed to move component across widgets`);
                                return false;
                            }

                            // Notify about the cross-widget move
                            eventBus.publish("component:moved", {
                                componentId,
                                sourceWidgetId,
                                destinationWidgetId,
                                parentId: newParentId,
                                isCrossWidget: true,
                            });

                            eventBus.publish("hierarchy:changed", {
                                widgetId: sourceWidgetId,
                            });

                            eventBus.publish("hierarchy:changed", {
                                widgetId: destinationWidgetId,
                            });

                            return true;
                        } else {
                            console.error(`[Builder] Root instance not found for component ${componentId}`);
                            return false;
                        }
                    } catch (error) {
                        console.error(`[Builder] Error during cross-widget move:`, error);
                        return false;
                    }
                } else {
                    // Same-widget move or move without copying instance data
                    const success = widgetStore.getState().moveComponent(
                        sourceWidgetId,
                        componentId,
                        newParentId,
                        destinationWidgetId
                    );

                    if (!success) {
                        console.error(`[Builder] Failed to move component within widget`);
                        return false;
                    }

                    // If this was the selected component, update selection state
                    if (uiStore.getState().selectedComponentId === componentId) {
                        const targetWidgetId = destinationWidgetId || sourceWidgetId;
                        uiStore.getState().selectComponent(componentId, targetWidgetId);
                    }

                    // Notify about the move
                    if (isCrossWidgetMove) {
                        eventBus.publish("component:moved", {
                            componentId,
                            sourceWidgetId,
                            destinationWidgetId,
                            parentId: newParentId,
                            isCrossWidget: true,
                        });

                        eventBus.publish("hierarchy:changed", {
                            widgetId: sourceWidgetId,
                        });

                        eventBus.publish("hierarchy:changed", {
                            widgetId: destinationWidgetId,
                        });
                    } else {
                        eventBus.publish("component:moved", {
                            componentId,
                            widgetId: sourceWidgetId,
                            oldParentId,
                            newParentId,
                        });

                        eventBus.publish("hierarchy:changed", {
                            widgetId: sourceWidgetId,
                        });
                    }

                    return true;
                }
            } catch (error) {
                console.error("[Builder] Error moving component:", error);
                return false;
            }
        },
        /**
         * Reorder components within a container
         *
         * @param widgetId Widget containing the components
         * @param containerId Container/parent component ID
         * @param componentId Component to reorder
         * @param targetId Target component to position relative to
         * @param position Whether to place before or after the target
         * @returns True if reordered successfully
         */
        reorderComponents(
            widgetId: EntityId,
            containerId: EntityId,
            componentId: EntityId,
            targetId: EntityId,
            position: 'before' | 'after'
        ): boolean {
            try {
                // Debug logging
                // console.log(`[BUILDER] Reordering component ${componentId} to be ${position} ${targetId}`);
                // console.log(`[BUILDER] Container: ${containerId}`);

                // Get widget to verify components exist
                const widget = widgetStore.getState().getWidget(widgetId);

                if (!widget) {
                    console.error(`[BUILDER] Widget ${widgetId} not found`);
                    return false;
                }

                // Verify component exists
                const component = widget.components.find(c => c.id === componentId);
                if (!component) {
                    console.error(`[BUILDER] Component ${componentId} not found`);
                    return false;
                }

                // Verify target exists
                const target = widget.components.find(c => c.id === targetId);
                if (!target) {
                    console.error(`[BUILDER] Target ${targetId} not found`);
                    return false;
                }

                // Verify container exists if it's not the widget itself
                if (containerId !== widgetId) {
                    const container = widget.components.find(c => c.id === containerId);
                    if (!container) {
                        console.error(`[BUILDER] Container ${containerId} not found`);
                        return false;
                    }

                    // Verify target is a child of the container
                    if (target.parentId !== containerId) {
                        console.error(`[BUILDER] Target ${targetId} is not a child of container ${containerId}`);
                        return false;
                    }
                } else {
                    // For root level, verify target has no parent
                    if (target.parentId) {
                        console.error(`[BUILDER] Target ${targetId} is not at root level`);
                        return false;
                    }
                }

                // Log current state before reordering
                const isRootLevel = containerId === widgetId;
                // const siblings = widget.components.filter(c =>
                //     isRootLevel ? !c.parentId : c.parentId === containerId
                // );

                // console.log(`[BUILDER] Before reordering:`);
                // console.log(siblings.map(s => ({ id: s.id, zIndex: s.zIndex })));

                // Call widgetStore's reorderComponents
                widgetStore.getState().reorderComponents(
                    widgetId,
                    containerId,
                    componentId,
                    targetId,
                    position
                );

                // Verify reordering took effect
                const updatedWidget = widgetStore.getState().getWidget(widgetId);
                if (updatedWidget) {
                    const updatedSiblings = updatedWidget.components.filter(c =>
                        isRootLevel ? !c.parentId : c.parentId === containerId
                    ).sort((a, b) => a.zIndex - b.zIndex);

                    // console.log(`[BUILDER] After reordering:`);
                    // console.log(updatedSiblings.map(s => ({ id: s.id, zIndex: s.zIndex })));

                    // Check if the component is in the expected position
                    const componentIndex = updatedSiblings.findIndex(c => c.id === componentId);
                    const targetIndex = updatedSiblings.findIndex(c => c.id === targetId);

                    if (componentIndex === -1) {
                        console.error(`[BUILDER] Component ${componentId} not found after reordering`);
                        return false;
                    }

                    if (targetIndex === -1) {
                        console.error(`[BUILDER] Target ${targetId} not found after reordering`);
                        return false;
                    }

                    // const expectedIndex = position === 'before' ? targetIndex : targetIndex + 1;
                    if (position === 'before' && componentIndex > targetIndex) {
                        console.warn(`[BUILDER] Component ${componentId} is not before ${targetId}`);
                    } else if (position === 'after' && componentIndex !== targetIndex + 1) {
                        console.warn(`[BUILDER] Component ${componentId} is not after ${targetId}`);
                    }
                }

                // Notify about hierarchy change
                eventBus.publish("component:reordered", {
                    componentId,
                    widgetId,
                    containerId,
                    targetId,
                    position
                });

                eventBus.publish("hierarchy:changed", { widgetId });

                return true;
            } catch (error) {
                console.error("[BUILDER] Error reordering components:", error);
                return false;
            }
        },

        /**
         * Rebuilds widget component hierarchies based on TreeView structure.
         * Supports cross-widget component moves and complete hierarchy reconstruction.
         *
         * @param treeData The hierarchical data from TreeView
         * @returns Success status and operation details
         */
        rebuildComponentHierarchyFromTree: (treeData: any[]): OperationResult => {
            try {
                // Step 1: Collect information about all widgets and components
                const widgetStore = useWidgetStore.getState();
                const componentStore = useComponentStore.getState();
                const widgets = new Map<EntityId, Widget>();
                const allComponentsMap = new Map<string, {
                    component: WidgetComponent,
                    widgetId: EntityId,
                    instance: any  // The actual component instance
                }>();

                // Track statistics for result
                const stats = {
                    widgetsUpdated: 0,
                    componentsMoved: 0,
                    componentsReordered: 0
                };

                // Collect all widgets and their components
                for (const widgetNode of treeData) {
                    if (!widgetNode.id || widgetNode.id.includes('/')) continue;

                    const widgetId = widgetNode.id as EntityId;
                    const widget = widgetStore.getWidget(widgetId);

                    if (!widget) {
                        console.warn(`Widget ${widgetId} not found, skipping`);
                        continue;
                    }

                    widgets.set(widgetId, widget);

                    // Collect all components in this widget
                    for (const component of widget.components) {
                        // Create lookup key as "componentId" (without widget prefix)
                        const key = component.id;

                        try {
                            // Get component instance
                            const instance = componentStore.getInstance(component.instanceId);

                            allComponentsMap.set(key, {
                                component,
                                widgetId,
                                instance
                            });
                        } catch (error) {
                            console.warn(`Could not get instance for component ${component.id}`, error);
                        }
                    }
                }

                // Step 2: Process the tree to determine new component locations and hierarchy
                interface ComponentPlacement {
                    componentId: EntityId;
                    originalWidgetId: EntityId;
                    targetWidgetId: EntityId;
                    parentId?: EntityId;
                    zIndex: number;
                    childIds: EntityId[];
                    instance: any;
                    isCrossWidgetMove: boolean;
                }

                // Map of widget ID -> component placements
                const widgetPlacements = new Map<EntityId, ComponentPlacement[]>();

                // Helper function to extract component data from tree
                const processNode = (
                    node: any,
                    widgetId: EntityId,
                    parentId?: EntityId,
                    index = 0
                ) => {
                    if (!node.id || !node.id.includes('/')) return;

                    // Extract component ID from "widgetId/componentId" format
                    const [_nodeWidgetId, componentId] = node.id.split('/') as [EntityId, EntityId];
                    if (!componentId) return;

                    // Normalize data to have proper widget ID reference
                    const targetWidgetId = widgetId;

                    // Get component info
                    let originalWidgetId;
                    let instance;

                    // Try to find existing component across all widgets
                    const componentInfo = allComponentsMap.get(componentId);
                    if (componentInfo) {
                        originalWidgetId = componentInfo.widgetId;
                        instance = componentInfo.instance;
                    } else {
                        console.warn(`Component ${componentId} not found in any widget`);
                        return;
                    }

                    // Determine if this is a cross-widget move
                    const isCrossWidgetMove = originalWidgetId !== targetWidgetId;

                    // Get widget placements array
                    if (!widgetPlacements.has(targetWidgetId)) {
                        widgetPlacements.set(targetWidgetId, []);
                    }
                    const placements = widgetPlacements.get(targetWidgetId)!;

                    // Add component placement
                    placements.push({
                        componentId,
                        originalWidgetId,
                        targetWidgetId,
                        parentId,
                        zIndex: index,
                        childIds: [],
                        instance,
                        isCrossWidgetMove
                    });

                    // Process children
                    if (node.children && node.children.length > 0) {
                        node.children.forEach((child: any, childIndex: number) => {
                            processNode(child, targetWidgetId, componentId, childIndex);
                        });
                    }
                };

                // Process each widget in the tree data
                for (const widgetNode of treeData) {
                    if (!widgetNode.id || widgetNode.id.includes('/')) continue;

                    const widgetId = widgetNode.id as EntityId;

                    // Process widget children
                    if (widgetNode.children && widgetNode.children.length > 0) {
                        widgetNode.children.forEach((child: any, index: number) => {
                            processNode(child, widgetId, undefined, index);
                        });
                    }
                }

                // Step 3: Update each widget with new component structure
                for (const [widgetId, placements] of widgetPlacements.entries()) {
                    const widget = widgets.get(widgetId);
                    if (!widget) continue;

                    // Build child ID lists
                    for (const placement of placements) {
                        if (!placement.parentId) continue; // Skip root components

                        // Find parent placement
                        const parentPlacement = placements.find(p => p.componentId === placement.parentId);
                        if (parentPlacement) {
                            parentPlacement.childIds.push(placement.componentId);
                        }
                    }

                    // Handle cross-widget moves
                    const crossWidgetMoves = placements.filter(p => p.isCrossWidgetMove);
                    for (const move of crossWidgetMoves) {
                        // For each cross-widget move, we need to:
                        // 1. Create a new component instance in the target widget
                        // 2. Copy over properties from the original component

                        // Get original component
                        const originalInfo = allComponentsMap.get(move.componentId);
                        if (!originalInfo) continue;

                        const { component: originalComponent, instance: originalInstance } = originalInfo;

                        // Create new instance in component store
                        try {
                            const newInstance = componentStore.createFromDefinition(
                                originalComponent.definitionId,
                                originalInstance ? originalInstance.overrides || {} : {}
                            );

                            // Update instance reference in placement
                            move.instance = newInstance;

                            // Create a new component in the target widget
                            const position = originalComponent.position || {
                                x: { value: 10, unit: "px" },
                                y: { value: 10, unit: "px" }
                            };

                            const newComponent = widgetStore.addComponentToWidget(
                                widgetId,
                                originalComponent.definitionId,
                                newInstance.id,
                                position
                            );

                            if (newComponent) {
                                // Update component ID in placement to new component
                                move.componentId = newComponent.id;

                                stats.componentsMoved++;
                            } else {
                                console.error(`Failed to create component in target widget ${widgetId}`);
                            }

                            // Delete original component from source widget
                            widgetStore.removeComponent(move.originalWidgetId, originalComponent.id);
                        } catch (error) {
                            console.error(`Error during cross-widget move for component ${move.componentId}`, error);
                        }
                    }

                    // Get updated components (in case any were added/removed)
                    const updatedWidget = widgetStore.getWidget(widgetId);
                    if (!updatedWidget) continue;

                    // Update components in widget with new hierarchy information
                    const updatedComponents = [...updatedWidget.components];

                    // Process placements to set parentId and zIndex
                    for (const placement of placements) {
                        // Skip placements with cross-widget moves that failed
                        if (placement.isCrossWidgetMove && !updatedWidget.components.find(c => c.id === placement.componentId)) {
                            continue;
                        }

                        // Find component in updated components
                        const componentIndex = updatedComponents.findIndex(c => c.id === placement.componentId);
                        if (componentIndex === -1) continue;

                        // Update component with placement info
                        updatedComponents[componentIndex] = {
                            ...updatedComponents[componentIndex],
                            parentId: placement.parentId,
                            zIndex: placement.zIndex,
                            childIds: placement.childIds
                        };

                        stats.componentsReordered++;
                    }

                    // Sort components by zIndex
                    const orderedComponents = [...updatedComponents].sort((a, b) => {
                        // Find placements for both components
                        const placementA = placements.find(p => p.componentId === a.id);
                        const placementB = placements.find(p => p.componentId === b.id);

                        // If both have placements, sort by zIndex
                        if (placementA && placementB) {
                            return placementA.zIndex - placementB.zIndex;
                        }

                        // If only one has a placement, it comes first
                        if (placementA) return -1;
                        if (placementB) return 1;

                        // If neither has a placement, keep original order
                        return 0;
                    });

                    // Update the widget with the new component ordering
                    widgetStore.updateWidget(widgetId, {
                        components: orderedComponents
                    });

                    stats.widgetsUpdated++;

                    // Notify about hierarchy change
                    eventBus.publish("hierarchy:changed", { widgetId });
                }

                return {
                    success: true,
                    data: stats
                };
            } catch (error) {
                console.error("Error rebuilding component hierarchy from tree:", error);
                return { success: false, error: error as Error };
            }
        },

        /**
         * Find a component by its instance ID across all widgets
         * @param instanceId The instance ID to search for
         * @returns Object with component info or null values if not found
         */
        findComponentByInstanceId(instanceId: EntityId) {
            return widgetStore.getState().findComponentByInstanceId(instanceId);
        },

        /**
         * Get information about a component including its instance
         * @param widgetId Widget containing the component
         * @param componentId Component to get info for
         * @returns Detailed component information or null if not found
         */
        getComponentInfo(widgetId: EntityId, componentId: EntityId) {
            try {
                // Find the component in the widget
                const component = widgetStore.getState().findComponent(widgetId, componentId);
                if (!component) return null;

                // Get the instance
                let instance = null;
                let type = null;
                try {
                    instance = componentStore.getState().getInstance(component.instanceId);
                    type = instance.type;
                } catch (error) {
                    console.warn("Could not get component instance:", error);
                }

                return {
                    componentId,
                    widgetId,
                    instanceId: component.instanceId,
                    type,
                    component,
                    instance
                };
            } catch (error) {
                console.error("Failed to get component info:", error);
                return null;
            }
        },

        /**
         * Select a component by its instance ID
         * @param instanceId Instance ID to select
         * @returns True if component was found and selected
         */
        selectComponentByInstanceId(instanceId: EntityId): boolean {
            try {
                // Find the component by instance ID
                const { component, widgetId } = widgetStore.getState().findComponentByInstanceId(instanceId);
                if (!component || !widgetId) return false;

                // Select the component
                uiStore.getState().selectComponent(component.id, widgetId);
                return true;
            } catch (error) {
                console.error("Failed to select component by instance ID:", error);
                return false;
            }
        },

        /**
         * Update a component's properties
         *
         * @param widgetId Widget containing the component
         * @param componentId Component to update
         * @param updates Changes to apply
         * @returns True if update was successful
         */
        updateComponent(
            widgetId: EntityId,
            componentId: EntityId,
            updates: Partial<WidgetComponent>
        ): boolean {
            try {
                // Update the component
                widgetStore.getState().updateComponent(widgetId, componentId, updates);

                // Notify about update
                eventBus.publish("component:updated", {
                    componentId,
                    widgetId
                });

                return true;
            } catch (error) {
                console.error("Error updating component:", error);
                return false;
            }
        },

        /**
         * Reset all stores to their default state
         * @param options Options for controlling what is kept
         * @returns Count of items cleared from stores
         */
        resetAllStores(options = { keepSystemComponents: true }): {
            widgetCount: number,
            definitionCount: number,
            instanceCount: number
        } {
            // First clear selection state
            uiStore.getState().deselectAll();

            // Reset UI store
            uiStore.getState().resetState();

            // Reset widget store first (contains references to components)
            const widgetResult = widgetStore.getState().purgeStore();

            // Then reset component store
            const componentResult = componentStore.getState().purgeStore({
                keepSystemComponents: options.keepSystemComponents,
                resetToDefaults: true
            });

            return {
                widgetCount: widgetResult.widgetCount,
                definitionCount: componentResult.definitionCount,
                instanceCount: componentResult.instanceCount
            };
        }
    }
};

/**
 * Helper function to detect circular references in component hierarchy
 */
function isCircularReference(
    widgetId: EntityId,
    sourceComponentId: EntityId,
    targetParentId: EntityId,
    widgetStoreState: any
): boolean {
    // Get the widget
    const widget = widgetStoreState.getWidget(widgetId);
    if (!widget) return false;

    // Check if target parent is a descendant of the source component
    let currentId = targetParentId;
    const visited = new Set<EntityId>();

    while (currentId) {
        // Prevent infinite loops
        if (visited.has(currentId)) {
            return true;
        }
        visited.add(currentId);

        // If current component is the source, we have a cycle
        if (currentId === sourceComponentId) {
            return true;
        }

        // Find the current component to get its parent
        const currentComponent = widget.components.find((c: WidgetComponent) => c.id === currentId);
        if (!currentComponent || !currentComponent.parentId) {
            break;
        }

        // Move up to the parent
        currentId = currentComponent.parentId;
    }

    return false;
}

/**
 * Hook to set up component event handlers using eventBus
 */
export function useBuilderServiceEventHandlers() {
    useEffect(() => {
        // Subscribe to component delete events
        const deleteSubscriptionId = eventBus.subscribe('component:deleted', (event) => {
            const { componentId, widgetId } = event.data;

            if (componentId && widgetId) {
                builderService.deleteComponent(widgetId, componentId);
            }
        });

        // Subscribe to component info requests
        const infoSubscriptionId = eventBus.subscribe('component:getInfo', (event) => {
            const { componentId, widgetId } = event.data;

            if (componentId && widgetId) {
                const info = builderService.getComponentInfo(widgetId, componentId);

                // Publish the response with eventBus
                eventBus.publish('component:info', {
                    componentId,
                    widgetId,
                    instanceId: info?.instanceId,
                    type: info?.type,
                    instance: info?.instance
                });
            }
        });

        // Clean up subscriptions
        return () => {
            eventBus.unsubscribe(deleteSubscriptionId);
            eventBus.unsubscribe(infoSubscriptionId);
        };
    }, []);
}

export const builderService = createBuilderService({
    componentStore: useComponentStore,
    widgetStore: useWidgetStore,
    uiStore: useUIStore
});

export default builderService;