/**
 * @file src/services/builderService.ts
 * Central service that coordinates all widget and component operations across the application.
 * This service is the single source of truth for component creation, manipulation, and deletion.
 */
import { useCallback } from "react";
import { ComponentConfig } from "@/core/base/ComponentConfig";
import eventBus from "@/core/eventBus/eventBus";
import { createEntityId, EntityId } from "@/core/types/EntityTypes";
import { Position, Size } from "@/core/types/Geometry";
import { useWidgetStore, Widget, WidgetComponent } from "@/features/builder/stores/widgetStore";
import { useComponentStore, useUIStore } from "@/store";
import { useEventSubscription } from "@/hooks/useEventBus";
import { nanoid } from "nanoid";

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
         * Delete a component from a widget with improved instance cleanup
         *
         * @param widgetId Widget containing the component
         * @param componentId Component to delete
         * @returns True if deleted successfully
         */
        deleteComponent(widgetId: EntityId, componentId: EntityId): boolean {
            try {
                // Find the component to get its instance ID and parent
                const widgetStoreState = widgetStore.getState();
                const componentStoreState = componentStore.getState();

                // Validate the widget exists
                const widget = widgetStoreState.getWidget(widgetId);
                if (!widget) {
                    console.error(`Widget ${widgetId} not found, cannot delete component`);
                    return false;
                }

                // Find the component with error handling
                const component = widget.components.find(c => c.id === componentId);
                if (!component) {
                    // console.warn(`Component ${componentId} not found in widget ${widgetId}, may have been already deleted`);

                    // Special case: Check if this was just a mistake in the component ID format
                    // Sometimes IDs get mangled in the UI
                    const potentialMatch = widget.components.find(c =>
                        c.id.toLowerCase().includes(componentId.toLowerCase()) ||
                        (componentId.includes('-') && c.id.includes(componentId.split('-')[1]))
                    );

                    if (potentialMatch) {
                        console.log(`Found potential match for ${componentId}: ${potentialMatch.id}`);
                        return this.deleteComponent(widgetId, potentialMatch.id);
                    }

                    return false;
                }

                // Keep track of the parent for hierarchy updates
                const parentId = component.parentId;

                // Get all descendants of this component
                const findAllDescendants = (parentId: EntityId): EntityId[] => {
                    const descendants: EntityId[] = [];

                    // Find direct children
                    const directChildren = widget.components
                        .filter(c => c.parentId === parentId)
                        .map(c => c.id);

                    descendants.push(...directChildren);

                    // Recursively find grandchildren
                    directChildren.forEach(childId => {
                        descendants.push(...findAllDescendants(childId));
                    });

                    return descendants;
                };

                // Get all components to be deleted (the main component + all descendants)
                const descendantIds = findAllDescendants(componentId);
                const allComponentIds = [componentId, ...descendantIds];

                console.log(`Deleting component ${componentId} with ${descendantIds.length} descendants`);

                // Check if any of these are currently selected
                const selectedComponentId = uiStore.getState().selectedComponentId;
                if (selectedComponentId && allComponentIds.includes(selectedComponentId)) {
                    uiStore.getState().deselectAll();
                }

                // Track all instance IDs that need to be cleaned up
                const instancesToDelete: EntityId[] = [];

                // Collect instance IDs from the target component and all its descendants
                allComponentIds.forEach(id => {
                    const comp = widget.components.find(c => c.id === id);
                    if (comp && comp.instanceId) {
                        instancesToDelete.push(comp.instanceId);
                    }
                });

                console.log(`Found ${instancesToDelete.length} instances to clean up`);

                // First, remove the components from the widget
                // Using the built-in removeComponent method which handles hierarchy
                widgetStoreState.removeComponent(widgetId, componentId, {
                    removeChildren: true
                });

                // Now clean up component instances one by one, with error handling
                let instancesDeleted = 0;
                let instanceErrors = 0;

                instancesToDelete.forEach(instanceId => {
                    try {
                        // First validate the instance exists to avoid noisy errors
                        try {
                            componentStoreState.getInstance(instanceId);
                            componentStoreState.deleteInstance(instanceId);
                            instancesDeleted++;
                        } catch (e) {
                            // Instance already gone or never existed, just log it
                            console.info(`Instance ${instanceId} already removed or doesn't exist`);
                            instanceErrors++;
                        }
                    } catch (err) {
                        // Don't let instance deletion failures stop the process
                        console.warn(`Failed to delete instance ${instanceId}:`, err);
                        instanceErrors++;
                    }
                });

                console.log(`Deleted ${instancesDeleted} instances, encountered ${instanceErrors} errors`);

                // Publish detailed deletion event
                eventBus.publish("component:deleted", {
                    componentId,
                    widgetId,
                    parentId,
                    childrenDeleted: descendantIds.length,
                    instancesDeleted,
                    instanceErrors,
                    timestamp: Date.now()
                });

                // Force a hierarchy update
                eventBus.publish("hierarchy:changed", {
                    widgetId,
                    action: "component-deleted",
                    timestamp: Date.now()
                });

                return true;
            } catch (error) {
                console.error(`Failed to delete component ${componentId}:`, error);
                return false;
            }
        },

        /**
         * Move a component to a new parent within a widget or to another widget
         * with proper handling of the entire component hierarchy.
         *
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

                // Get the widget store state
                const widgetStoreState = widgetStore.getState();

                // Verify source component exists
                const component = widgetStoreState.findComponent(sourceWidgetId, componentId);
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
                        widgetStoreState
                    );

                    if (isCyclical) {
                        console.error(`[Builder] Circular reference detected in component hierarchy`);
                        return false;
                    }
                }

                // Get the source widget
                const sourceWidget = widgetStoreState.getWidget(sourceWidgetId);
                if (!sourceWidget) {
                    console.error(`[Builder] Source widget ${sourceWidgetId} not found`);
                    return false;
                }

                // Find current parent for event notification
                const oldParentId = component.parentId;
                const isCrossWidgetMove = destinationWidgetId && destinationWidgetId !== sourceWidgetId;

                // Get all components that need to be moved together (the component and all its descendants)
                const getAllDescendants = (parentId: EntityId): WidgetComponent[] => {
                    const result: WidgetComponent[] = [];

                    // Find the immediate children
                    const children = sourceWidget.components.filter(c => c.parentId === parentId);

                    // Add them to the result
                    result.push(...children);

                    // Recursively add their descendants
                    for (const child of children) {
                        const grandchildren = getAllDescendants(child.id);
                        result.push(...grandchildren);
                    }

                    return result;
                };

                // For cross-widget moves, we need special handling for component instances
                if (isCrossWidgetMove && copyInstanceData) {
                    // Get the destination widget to verify it exists
                    const destinationWidget = widgetStoreState.getWidget(destinationWidgetId);
                    if (!destinationWidget) {
                        console.error(`[Builder] Destination widget ${destinationWidgetId} not found`);
                        return false;
                    }

                    // Process all components to be moved
                    try {
                        // Get the root component to move
                        const rootComponent = component;

                        // Get all descendants that should move with it
                        const descendants = getAllDescendants(componentId);

                        // Combine into one array including the root
                        const allComponentsToMove = [rootComponent, ...descendants];

                        console.log(`[Builder] Moving component ${componentId} with ${descendants.length} descendants`);

                        // Create a map of old instance IDs to new instance IDs
                        const instanceMap = new Map<EntityId, EntityId>();

                        // First pass: create new instances for all components in the hierarchy
                        for (const comp of allComponentsToMove) {
                            try {
                                // Get the original instance
                                const originalInstance = componentStore.getState().getInstance(comp.instanceId);

                                // Create a new instance from the same definition
                                const newInstance = componentStore.getState().createFromDefinition(
                                    comp.definitionId,
                                    originalInstance ? originalInstance.overrides || {} : {}
                                );

                                // Add to map
                                instanceMap.set(comp.instanceId, newInstance.id);

                                console.log(`[Builder] Created new instance ${newInstance.id} for component ${comp.id}`);
                            } catch (error) {
                                console.error(`[Builder] Error creating instance for component ${comp.id}:`, error);

                                // Continue with best effort - create a basic instance even if we can't get the original
                                try {
                                    const newInstance = componentStore.getState().createFromDefinition(
                                        comp.definitionId,
                                        {}
                                    );
                                    instanceMap.set(comp.instanceId, newInstance.id);
                                } catch (innerError) {
                                    console.error(`[Builder] Failed fallback instance creation:`, innerError);
                                }
                            }
                        }

                        // Now perform the actual move with the instance map
                        const success = widgetStoreState.moveComponent(
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
                                    console.warn(`[Builder] Cleanup error:`, err);
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
                            oldParentId,
                            isCrossWidget: true,
                            timestamp: Date.now()
                        });

                        // Notify about hierarchy changes on both widgets
                        eventBus.publish("hierarchy:changed", {
                            widgetId: sourceWidgetId,
                            action: "component-moved",
                            componentId,
                            timestamp: Date.now()
                        });

                        eventBus.publish("hierarchy:changed", {
                            widgetId: destinationWidgetId,
                            action: "component-moved",
                            componentId,
                            timestamp: Date.now()
                        });

                        // Send widget update events for UI refresh
                        eventBus.publish("widget:updated", {
                            widgetId: sourceWidgetId,
                            action: "hierarchy-updated",
                            timestamp: Date.now()
                        });

                        eventBus.publish("widget:updated", {
                            widgetId: destinationWidgetId,
                            action: "hierarchy-updated",
                            timestamp: Date.now()
                        });

                        return true;
                    } catch (error) {
                        console.error(`[Builder] Error during cross-widget move:`, error);
                        return false;
                    }
                } else {
                    // Same-widget move or move without copying instance data
                    const success = widgetStoreState.moveComponent(
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

                    // Handle cross-widget vs. same-widget events differently
                    if (isCrossWidgetMove) {
                        eventBus.publish("component:moved", {
                            componentId,
                            sourceWidgetId,
                            destinationWidgetId,
                            parentId: newParentId,
                            oldParentId,
                            isCrossWidget: true,
                            timestamp: Date.now()
                        });

                        // Notify about hierarchy changes on both widgets
                        eventBus.publish("hierarchy:changed", {
                            widgetId: sourceWidgetId,
                            action: "component-moved",
                            timestamp: Date.now()
                        });

                        eventBus.publish("hierarchy:changed", {
                            widgetId: destinationWidgetId,
                            action: "component-moved",
                            timestamp: Date.now()
                        });
                    } else {
                        // Same-widget move events
                        eventBus.publish("component:moved", {
                            componentId,
                            widgetId: sourceWidgetId,
                            oldParentId,
                            newParentId,
                            timestamp: Date.now()
                        });

                        eventBus.publish("hierarchy:changed", {
                            widgetId: sourceWidgetId,
                            action: "component-moved",
                            timestamp: Date.now()
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
         * Rebuilds widget component hierarchies by completely replacing each widget's components
         * with a fresh structure based on the TreeView data.
         *
         * @param treeData The hierarchical data from TreeView
         * @returns Success status and operation details
         */
        rebuildComponentHierarchyFromTree: (treeData: any[]): OperationResult => {
            try {
                console.log("Starting simplified rebuild from tree");

                // Step 1: Collect all widgets and components that exist currently
                const widgetStore = useWidgetStore.getState();

                // Track all widgets
                const widgets = new Map<EntityId, Widget>();

                // Map to look up components by ID
                const componentLookup = new Map<string, {
                    component: WidgetComponent,
                    widgetId: EntityId
                }>();

                // Track components by instance ID
                const instanceToComponentMap = new Map<EntityId, {
                    componentId: EntityId,
                    widgetId: EntityId
                }>();

                // Collect all widgets in the tree
                const widgetIds = new Set<EntityId>();
                for (const node of treeData) {
                    if (!node.id || node.id.includes('/')) continue;
                    widgetIds.add(node.id as EntityId);
                }

                // Get all widgets and their components
                for (const widgetId of widgetIds) {
                    const widget = widgetStore.getWidget(widgetId);
                    if (!widget) {
                        console.warn(`Widget ${widgetId} not found`);
                        continue;
                    }

                    widgets.set(widgetId, widget);

                    // Index all components for lookup
                    for (const component of widget.components) {
                        // Store by widget+component ID
                        componentLookup.set(`${widgetId}/${component.id}`, {
                            component,
                            widgetId
                        });

                        // Also store by just component ID for easier lookup
                        componentLookup.set(component.id, {
                            component,
                            widgetId
                        });

                        // Track by instance ID too
                        instanceToComponentMap.set(component.instanceId, {
                            componentId: component.id,
                            widgetId
                        });
                    }
                }

                console.log(`Found ${widgets.size} widgets and ${componentLookup.size / 2} components`);

                // CRITICAL STEP: First record all component locations BEFORE any changes
                // This will let us detect moves for cleanup later
                const originalLocations = new Map<string, string>(); // componentId -> widgetId

                for (const widgetId of widgetIds) {
                    const widget = widgets.get(widgetId);
                    if (!widget) continue;

                    for (const component of widget.components) {
                        originalLocations.set(component.id, widgetId);
                    }
                }

                // Step 2: For each widget in the tree, create a completely new set of components
                for (const widgetNode of treeData) {
                    if (!widgetNode.id || widgetNode.id.includes('/')) continue;

                    const widgetId = widgetNode.id as EntityId;
                    const widget = widgets.get(widgetId);

                    if (!widget) {
                        console.warn(`Skipping missing widget ${widgetId}`);
                        continue;
                    }

                    // Create a new empty array for components
                    const newComponents: WidgetComponent[] = [];

                    // Map from original component IDs to new component IDs (for cross-widget moves)
                    const idMapping = new Map<string, EntityId>();

                    console.log(`Rebuilding components for widget ${widgetId}`);

                    // First pass: Process all components in this widget's subtree
                    const processComponent = (node: any, parentId?: EntityId, index: number = 0) => {
                        // Skip non-component nodes
                        if (!node.id || !node.id.includes('/')) return;

                        // Parse the node ID
                        const [sourceWidgetId, sourceComponentId] = node.id.split('/') as [EntityId, EntityId];

                        // Find the source component
                        let componentInfo = componentLookup.get(`${sourceWidgetId}/${sourceComponentId}`);
                        if (!componentInfo) {
                            componentInfo = componentLookup.get(sourceComponentId);
                        }

                        if (!componentInfo) {
                            console.warn(`Component not found: ${node.id}`);
                            return;
                        }

                        const sourceComponent = componentInfo.component;
                        const isCrossWidgetMove = sourceWidgetId !== widgetId;

                        // Generate a new ID if this is a cross-widget move
                        const newComponentId = isCrossWidgetMove
                            ? createEntityId(`component-${nanoid(6)}`)
                            : sourceComponentId;

                        // Store the mapping
                        if (isCrossWidgetMove) {
                            idMapping.set(sourceComponentId, newComponentId);
                            console.log(`Mapping ${sourceComponentId} to ${newComponentId} in widget ${widgetId}`);
                        }

                        // Create the new component
                        const newComponent: WidgetComponent = {
                            id: newComponentId,
                            definitionId: sourceComponent.definitionId,
                            instanceId: sourceComponent.instanceId, // Reuse the instance ID
                            position: sourceComponent.position,
                            size: sourceComponent.size,
                            zIndex: index,
                            parentId: parentId,
                            childIds: [], // Will be populated in second pass
                            actionBindings: sourceComponent.actionBindings,
                            layoutConfig: sourceComponent.layoutConfig
                        };

                        // Add to the new components list
                        newComponents.push(newComponent);

                        // Process children
                        if (node.children && node.children.length > 0) {
                            node.children.forEach((child: any, childIndex: number) => {
                                processComponent(child, newComponentId, childIndex);
                            });
                        }
                    };

                    // Process all components in this widget's subtree
                    if (widgetNode.children && widgetNode.children.length > 0) {
                        widgetNode.children.forEach((child: any, index: number) => {
                            processComponent(child, undefined, index);
                        });
                    }

                    // Second pass: Rebuild childIds arrays based on parentId references
                    for (const component of newComponents) {
                        // Reset childIds array
                        component.childIds = [];
                    }

                    // Rebuild child links based on parent references
                    for (const component of newComponents) {
                        if (component.parentId) {
                            // Find the parent
                            const parent = newComponents.find(c => c.id === component.parentId);
                            if (parent) {
                                // Add this component's ID to the parent's childIds
                                parent.childIds.push(component.id);
                            }
                        }
                    }

                    // Third pass: Update parent IDs for moved components
                    for (const component of newComponents) {
                        if (component.parentId && idMapping.has(component.parentId)) {
                            component.parentId = idMapping.get(component.parentId)!;
                        }
                    }

                    console.log(`Created ${newComponents.length} components for widget ${widgetId}`);

                    // STEP 3: COMPLETELY REPLACE the widget's components with the new set
                    widgetStore.updateWidget(widgetId, {
                        components: newComponents
                    });

                    // Publish events for UI updates
                    eventBus.publish("hierarchy:changed", {
                        widgetId,
                        timestamp: Date.now(),
                        action: "hierarchy-rebuilt"
                    });

                    eventBus.publish("widget:updated", {
                        widgetId,
                        action: "hierarchy-updated",
                        timestamp: Date.now()
                    });
                }

                // Step 4: Clear any component cache that might be causing issues
                setTimeout(() => {
                    // Force the layout to refresh
                    eventBus.publish("layout:refreshed", { timestamp: Date.now() });
                }, 100);

                return {
                    success: true,
                    data: {
                        widgetsUpdated: widgets.size
                    }
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
    // Define handler for component deletion
    const handleComponentDeleted = useCallback((event: any) => {
        const { componentId, widgetId } = event.data;

        if (componentId && widgetId) {
            builderService.deleteComponent(widgetId, componentId);
        }
    }, []);

    // Define handler for component info requests
    const handleComponentInfoRequest = useCallback((event: any) => {
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
    }, []);

    // Use the subscription hook to handle subscriptions and cleanup
    useEventSubscription(
        'component:deleted',
        handleComponentDeleted,
        [handleComponentDeleted],
        'BuilderService-DeleteHandler'
    );

    useEventSubscription(
        'component:getInfo',
        handleComponentInfoRequest,
        [handleComponentInfoRequest],
        'BuilderService-InfoRequestHandler'
    );
}

export const builderService = createBuilderService({
    componentStore: useComponentStore,
    widgetStore: useWidgetStore,
    uiStore: useUIStore
});

export default builderService;