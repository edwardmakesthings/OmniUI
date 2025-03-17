/**
 * @file src/services/builderService.ts
 * Central service that coordinates all widget and component operations across the application.
 * This service is the single source of truth for component creation, manipulation, and deletion.
 */

import { ComponentConfig } from "@/core/base/ComponentConfig";
import eventBus from "@/core/eventBus/eventBus";
import { EntityId } from "@/core/types/EntityTypes";
import { Position, Size } from "@/core/types/Geometry";
import { useWidgetStore, Widget, WidgetComponent } from "@/features/builder/stores/widgetStore";
import { useComponentStore } from "@/store/componentStore";
import { useUIStore } from "@/store/uiStore";

import { useEffect } from "react";

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

/**
 * Builder service that coordinates actions across different stores
 */
export const builderService = {
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
            const componentStore = useComponentStore.getState();
            const widgetStore = useWidgetStore.getState();

            // Create component instance
            const instance = componentStore.createFromDefinition(
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

            const component = widgetStore.addComponentToWidget(
                widgetId,
                definitionId,
                instance.id,
                position
            );

            if (!component) {
                // Clean up the orphaned instance
                componentStore.deleteInstance(instance.id);
                return null;
            }

            // Handle parent relationship if specified
            if (options.parentId) {
                widgetStore.moveComponent(
                    widgetId,
                    component.id,
                    options.parentId
                );
            }

            // Handle selection if requested
            if (options.autoSelect && component) {
                useUIStore.getState().selectComponent(
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
            const widget = useWidgetStore.getState().createWidget(name, position);

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
            useWidgetStore.getState().updateWidget(widgetId, { position });

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
            const uiStore = useUIStore.getState();
            if (uiStore.selectedWidgetId === widgetId) {
                uiStore.deselectAll();
            }

            useWidgetStore.getState().deleteWidget(widgetId);

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
            const widgetStore = useWidgetStore.getState();
            const componentStore = useComponentStore.getState();
            const uiStore = useUIStore.getState();

            // Find the component to get its instance ID and parent
            const component = widgetStore.findComponent(widgetId, componentId);
            if (!component) return false;

            const parentId = component.parentId;

            // First, deselect if it's selected
            if (uiStore.selectedComponentId === componentId) {
                uiStore.deselectAll();
            }

            // Then, delete the component from the widget
            widgetStore.removeComponent(widgetId, componentId);

            // Finally, clean up the instance
            try {
                componentStore.deleteInstance(component.instanceId);
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
    moveComponent(
        sourceWidgetId: EntityId,
        componentId: EntityId,
        newParentId?: EntityId,
        destinationWidgetId?: EntityId,
        copyInstanceData: boolean = true
    ): boolean {
        try {
            const widgetStore = useWidgetStore.getState();
            const componentStore = useComponentStore.getState();
            const uiStore = useUIStore.getState();

            // Find current parent for event notification
            const component = widgetStore.findComponent(sourceWidgetId, componentId);
            if (!component) return false;

            // const oldParentId = component.parentId;
            const isCrossWidgetMove = destinationWidgetId && destinationWidgetId !== sourceWidgetId;

            // For cross-widget moves, we may need to handle component instances
            if (isCrossWidgetMove && copyInstanceData) {
                // Get all components being moved (including children)
                const sourceWidget = widgetStore.getWidget(sourceWidgetId);
                if (!sourceWidget) return false;

                // Helper function to get all descendant components
                const getDescendants = (rootId: EntityId): WidgetComponent[] => {
                    const result: WidgetComponent[] = [];
                    const collectChildren = (parentId: EntityId) => {
                        const children = sourceWidget.components.filter(c => c.parentId === parentId);
                        result.push(...children);
                        children.forEach(child => collectChildren(child.id));
                    };
                    collectChildren(rootId);
                    return result;
                };

                // Get component and its descendants
                const componentsToMove = [component, ...getDescendants(componentId)];

                // For each component, create a new instance in the component store
                componentsToMove.forEach(comp => {
                    const originalInstance = componentStore.getInstance(comp.instanceId);
                    if (originalInstance) {
                        // Create a copy of the instance
                        const newInstance = componentStore.createFromDefinition(
                            comp.definitionId,
                            originalInstance.overrides || {}
                        );

                        // Update the component reference to point to the new instance
                        comp.instanceId = newInstance.id;
                    }
                });
            }

            // Move the component using the widgetStore function
            widgetStore.moveComponent(
                sourceWidgetId,
                componentId,
                newParentId,
                destinationWidgetId
            );

            // If this was the selected component, update selection state
            if (uiStore.selectedComponentId === componentId) {
                if (isCrossWidgetMove) {
                    // If moved to another widget, select in the new widget
                    if (destinationWidgetId) {
                        uiStore.selectComponent(componentId, destinationWidgetId);
                    }
                } else {
                    // Just update the selection to reflect new parent if needed
                    uiStore.selectComponent(componentId, sourceWidgetId);
                }
            }

            // Notify about movement in a single consistent way
            // The widgetStore.moveComponent method already sends appropriate events
            // based on whether it's a cross-widget move

            return true;
        } catch (error) {
            console.error("Error moving component:", error);
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
            console.log(`[BUILDER] Reordering component ${componentId} to be ${position} ${targetId}`);
            console.log(`[BUILDER] Container: ${containerId}`);

            // Get widget to verify components exist
            const widgetStore = useWidgetStore.getState();
            const widget = widgetStore.getWidget(widgetId);

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
            const siblings = widget.components.filter(c =>
                isRootLevel ? !c.parentId : c.parentId === containerId
            );

            console.log(`[BUILDER] Before reordering:`);
            console.log(siblings.map(s => ({ id: s.id, zIndex: s.zIndex })));

            // Call widgetStore's reorderComponents
            useWidgetStore.getState().reorderComponents(
                widgetId,
                containerId,
                componentId,
                targetId,
                position
            );

            // Verify reordering took effect
            const updatedWidget = widgetStore.getWidget(widgetId);
            if (updatedWidget) {
                const updatedSiblings = updatedWidget.components.filter(c =>
                    isRootLevel ? !c.parentId : c.parentId === containerId
                ).sort((a, b) => a.zIndex - b.zIndex);

                console.log(`[BUILDER] After reordering:`);
                console.log(updatedSiblings.map(s => ({ id: s.id, zIndex: s.zIndex })));

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
     * Find a component by its instance ID across all widgets
     * @param instanceId The instance ID to search for
     * @returns Object with component info or null values if not found
     */
    findComponentByInstanceId(instanceId: EntityId) {
        return useWidgetStore.getState().findComponentByInstanceId(instanceId);
    },

    /**
     * Get information about a component including its instance
     * @param widgetId Widget containing the component
     * @param componentId Component to get info for
     * @returns Detailed component information or null if not found
     */
    getComponentInfo(widgetId: EntityId, componentId: EntityId) {
        try {
            const widgetStore = useWidgetStore.getState();
            const componentStore = useComponentStore.getState();

            // Find the component in the widget
            const component = widgetStore.findComponent(widgetId, componentId);
            if (!component) return null;

            // Get the instance
            let instance = null;
            let type = null;
            try {
                instance = componentStore.getInstance(component.instanceId);
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
            const widgetStore = useWidgetStore.getState();
            const uiStore = useUIStore.getState();

            // Find the component by instance ID
            const { component, widgetId } = widgetStore.findComponentByInstanceId(instanceId);
            if (!component || !widgetId) return false;

            // Select the component
            uiStore.selectComponent(component.id, widgetId);
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
            const widgetStore = useWidgetStore.getState();

            // Update the component
            widgetStore.updateComponent(widgetId, componentId, updates);

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
        const widgetStore = useWidgetStore.getState();
        const componentStore = useComponentStore.getState();
        const uiStore = useUIStore.getState();

        // First clear selection state
        uiStore.deselectAll();

        // Reset UI store
        uiStore.resetState();

        // Reset widget store first (contains references to components)
        const widgetResult = widgetStore.purgeStore();

        // Then reset component store
        const componentResult = componentStore.purgeStore({
            keepSystemComponents: options.keepSystemComponents,
            resetToDefaults: true
        });

        return {
            widgetCount: widgetResult.widgetCount,
            definitionCount: componentResult.definitionCount,
            instanceCount: componentResult.instanceCount
        };
    }
};

/**
 * Hook to set up component deletion handler
 */
export function useBuilderServiceEventHandlers() {
    useEffect(() => {
        // Set up handler for component deletion
        const handleComponentDelete = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { componentId, widgetId } = customEvent.detail;

            if (componentId && widgetId) {
                builderService.deleteComponent(widgetId, componentId);
            }
        };

        // Set up handler for component info requests
        const handleComponentInfo = (event: Event) => {
            const customEvent = event as CustomEvent;
            const { componentId, widgetId } = customEvent.detail;

            if (componentId && widgetId) {
                // Get info but don't do anything with it here
                // The requester will need to set up their own event listener
                // for the response
                const info = builderService.getComponentInfo(widgetId, componentId);

                // Dispatch the response event
                const responseEvent = new CustomEvent('component:info', {
                    detail: info
                });
                document.dispatchEvent(responseEvent);
            }
        };

        // Add event listeners
        document.addEventListener('component:delete', handleComponentDelete);
        document.addEventListener('component:getInfo', handleComponentInfo);

        // Clean up
        return () => {
            document.removeEventListener('component:delete', handleComponentDelete);
            document.removeEventListener('component:getInfo', handleComponentInfo);
        };
    }, []);
}