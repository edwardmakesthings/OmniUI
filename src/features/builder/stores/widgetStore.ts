/**
 * @file src/store/widgetStore.ts
 * Widget store for managing the container structure of components
 * and their layout relationships.
 */
import { nanoid } from "nanoid";
import { Position, PositionUtils, Size, SizeUtils } from "@/core/types/Geometry";
import { EntityId, createEntityId } from "@/core/types/EntityTypes";
import { Node } from "@xyflow/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
import { PanelIcon, WidgetIcon } from "@/components/ui";
import { UnitType } from "@/core/types/Measurement";
import { componentIconMap } from "@/registry/componentRenderers";
import eventBus from "@/core/eventBus/eventBus";

// Widget display types
export type WidgetDisplayType = 'canvas' | 'modal' | 'drawer' | 'embedded';

// Widget represents a container for components
export interface Widget {
    id: EntityId;
    name: string;
    label: string;
    position: Position;
    size: Size;
    components: WidgetComponent[];
    layoutType: "grid" | "free";
    isEditMode: boolean;

    // Display properties
    displayType: WidgetDisplayType;
    isVisible: boolean;
    zIndex: number;

    // Make Widget compatible with Record<string, unknown> for react-flow
    [key: string]: unknown;
}

// Widget component reference
export interface WidgetComponent {
    id: EntityId;
    definitionId: EntityId;
    instanceId: EntityId; // Reference to the actual component instance
    position: Position;
    size: Size;
    zIndex: number;

    // Hierarchy properties
    parentId?: EntityId;  // Parent component ID (null for root-level components)
    childIds: EntityId[]; // IDs of child components

    // For layout containers, define how children are positioned
    layoutConfig?: {
        type: 'grid' | 'flow' | 'absolute';
        columns?: number;
        gap?: number;
    };

    // For tracking connected widgets (e.g., button that opens another widget)
    actionBindings?: {
        targetWidgetId?: EntityId;
        action?: string;
    };
}

// ReactFlow node type with Widget data
export type FlowWidgetNode = Node<Widget>;

// Store interface
export interface WidgetStore {
    widgets: Record<string, Widget>;
    activeWidgetId: EntityId | null;

    // Widget operations
    createWidget: (name: string, position: Position, displayType?: WidgetDisplayType) => Widget;
    updateWidget: (id: EntityId, updates: Partial<Widget>) => void;
    deleteWidget: (id: EntityId) => void;

    // Widget visibility operations
    showWidget: (id: EntityId) => void;
    hideWidget: (id: EntityId) => void;
    toggleWidget: (id: EntityId) => void;

    // Component operations
    addComponentToWidget: (
        widgetId: EntityId,
        definitionId: EntityId,
        instanceId: EntityId,
        position: Position
    ) => WidgetComponent | null;
    updateComponent: (
        widgetId: EntityId,
        componentId: EntityId,
        updates: Partial<WidgetComponent>
    ) => void;
    removeComponent: (widgetId: EntityId, componentId: EntityId) => void;

    // Navigation/action operations
    bindComponentToWidget: (
        sourceWidgetId: EntityId,
        componentId: EntityId,
        targetWidgetId: EntityId,
        action?: string
    ) => void;

    // Hierarchy management
    addChildComponent: (
        widgetId: EntityId,
        parentComponentId: EntityId,
        definitionId: EntityId,
        instanceId: EntityId,
        position?: Position
    ) => WidgetComponent | null;

    moveComponent: (
        sourceWidgetId: EntityId,
        componentId: EntityId,
        newParentId?: EntityId, // undefined means move to root
        destinationWidgetId?: EntityId, // undefined means same widget as source
    ) => void;

    // Get component hierarchy
    getComponentHierarchy: (
        widgetId: EntityId,
        options?: { debug?: boolean, includeWidget?: boolean }
    ) => Promise<{
        id: string;
        type: string;
        label: string;
        icon: any;
        canDrop: boolean;
        canDrag: boolean;
        data?: {
            componentId: EntityId;
            widgetId: EntityId;
            instanceId: EntityId;
            definitionId: EntityId;
        };
        parentId?: string;
        children: any[];
    }[]>;

    reorderComponents: (
        widgetId: EntityId,
        containerId: EntityId,
        componentId: EntityId,
        targetId: EntityId,
        position: 'before' | 'after'
    ) => void;

    // Component lookup
    findComponent: (widgetId: EntityId, componentId: EntityId) => WidgetComponent | null;
    findComponentByInstanceId: (instanceId: EntityId) => {
        component: WidgetComponent | null,
        widgetId: EntityId | null
    };

    // Utility operations
    convertToNodes: () => FlowWidgetNode[];
    getWidget: (id: EntityId) => Widget | undefined;
    getVisibleWidgets: (displayType?: WidgetDisplayType) => Widget[];
    purgeStore: (options?: {
        keepWidgets?: boolean;
    }) => {
        widgetCount: number;
    };

    // State operations
    setActiveWidget: (id: EntityId | null) => void;
}

/**
 * Widget store for managing widget containers and their component hierarchy.
 * This store maintains the structure of widgets and components but delegates
 * actual component instance management to the component store.
 */
export const useWidgetStore = create<WidgetStore>()(
    persist(
        (set, get) => ({
            widgets: {},
            activeWidgetId: null,

            /**
             * Creates a new widget with the given name, position, and display type.
             * If displayType is not specified, it defaults to 'canvas'.
             * If the new widget is the first one or a canvas type, it will be set as the active widget.
             * @param name The name of the new widget
             * @param position The position of the new widget
             * @param displayType The display type of the new widget (optional, defaults to 'canvas')
             * @returns The newly created widget
             */
            createWidget: (name, position, displayType = 'canvas') => {
                const id = createEntityId(`widget-${nanoid(6)}`);
                const newWidget: Widget = {
                    id,
                    name,
                    label: name,
                    position,
                    size: SizeUtils.fromValue([300, 200], SizeUtils.minimum()),
                    components: [],
                    layoutType: "free",
                    isEditMode: true,
                    displayType,
                    isVisible: displayType === 'canvas', // Only canvas widgets are visible by default
                    zIndex: displayType === 'modal' ? 1000 : 0,
                    dragHandle: '.drag-handle__widget',
                };

                set(state => ({
                    widgets: {
                        ...state.widgets,
                        [id]: newWidget
                    },
                    // Set as active widget if it's the first one or a canvas type
                    activeWidgetId: state.activeWidgetId === null && displayType === 'canvas' ? id : state.activeWidgetId
                }));

                return newWidget;
            },

            /**
             * Updates the given widget with the given partial updates.
             * If the widget does not exist, this function does nothing.
             * @param id The ID of the widget to be updated
             * @param updates The partial updates to be applied to the widget
             */
            updateWidget: (id, updates) => {
                set(state => {
                    const widget = state.widgets[id];
                    if (!widget) return state;

                    return {
                        widgets: {
                            ...state.widgets,
                            [id]: {
                                ...widget,
                                ...updates
                            }
                        }
                    };
                });
            },

            /**
             * Deletes a widget by its ID from the store. If the widget being deleted
             * is the active widget, the active widget is updated to another visible
             * canvas widget if available. If no such widget is available, the active
             * widget is set to null. This function ensures that the store remains
             * consistent after a widget is removed.
             *
             * @param id - The ID of the widget to be deleted.
             */
            deleteWidget: (id) => {
                set(state => {
                    const newWidgets = { ...state.widgets };
                    delete newWidgets[id];

                    // Update active widget if necessary
                    let newActiveWidgetId = state.activeWidgetId;
                    if (newActiveWidgetId === id) {
                        // Find another visible canvas widget
                        const canvasWidgets = Object.values(newWidgets)
                            .filter(w => w.displayType === 'canvas' && w.isVisible);

                        newActiveWidgetId = canvasWidgets.length > 0 ? canvasWidgets[0].id : null;
                    }

                    return {
                        widgets: newWidgets,
                        activeWidgetId: newActiveWidgetId
                    };
                });
            },

            /**
             * Sets the given widget to be visible.
             * If the widget does not exist, this function does nothing.
             * @param id The ID of the widget to be shown
             */
            showWidget: (id) => {
                set(state => {
                    const widget = state.widgets[id];
                    if (!widget) return state;

                    return {
                        widgets: {
                            ...state.widgets,
                            [id]: {
                                ...widget,
                                isVisible: true
                            }
                        }
                    };
                });
            },

            /**
             * Sets the given widget to be invisible.
             * If the widget does not exist, this function does nothing.
             * @param id The ID of the widget to be hidden
             */
            hideWidget: (id) => {
                set(state => {
                    const widget = state.widgets[id];
                    if (!widget) return state;

                    return {
                        widgets: {
                            ...state.widgets,
                            [id]: {
                                ...widget,
                                isVisible: false
                            }
                        }
                    };
                });
            },

            /**
             * Toggles the visibility of the specified widget.
             * If the widget is currently visible, it will be hidden, and vice versa.
             * If the widget does not exist, this function does nothing.
             * @param id The ID of the widget to be toggled
             */
            toggleWidget: (id) => {
                set(state => {
                    const widget = state.widgets[id];
                    if (!widget) return state;

                    return {
                        widgets: {
                            ...state.widgets,
                            [id]: {
                                ...widget,
                                isVisible: !widget.isVisible
                            }
                        }
                    };
                });
            },

            /**
             * Add a component to a widget using the given definition and instance IDs.
             * @param widgetId ID of the widget to add the component to
             * @param definitionId ID of the component definition
             * @param instanceId ID of the component instance
             * @param position Position for the component in the widget
             * @returns The created widget component or null if failed
             */
            addComponentToWidget: (
                widgetId: EntityId,
                definitionId: EntityId,
                instanceId: EntityId,
                position: Position
            ) => {
                // Parameter validation to prevent instanceId/position confusion
                if (!instanceId || typeof instanceId !== 'string') {
                    console.error("Invalid instanceId parameter. Expected EntityId, got:", instanceId);
                    return null;
                }

                // Validate that position is actually a Position object
                if (!position || !position.x || !position.y) {
                    console.error("Invalid position parameter. Expected Position object, got:", position);
                    return null;
                }

                const widget = get().widgets[widgetId];
                if (!widget) return null;

                // Create widget component reference
                const componentId = createEntityId(`component-${nanoid(6)}`);
                const newComponent: WidgetComponent = {
                    id: componentId,
                    definitionId,
                    instanceId,
                    position,
                    size: {
                        width: { value: 100, unit: 'px' },
                        height: { value: 40, unit: 'px' }
                    },
                    zIndex: widget.components.length,
                    childIds: []
                };

                // Add to widget
                set(state => {
                    const updatedWidget = {
                        ...widget,
                        components: [...widget.components, newComponent]
                    };

                    return {
                        widgets: {
                            ...state.widgets,
                            [widgetId]: updatedWidget
                        }
                    };
                });

                // If the widget is NOT in edit mode, recalculate and update the size after component addition
                if (!widget.isEditMode) {
                    // Recalculate widget size after component addition
                    setTimeout(() => {
                        const updatedWidget = get().widgets[widgetId];
                        if (!updatedWidget) return;

                        // Find boundaries of all components
                        let maxRight = 0;
                        let maxBottom = 0;
                        const padding = { x: 20, y: 20 };

                        updatedWidget.components.forEach(comp => {
                            const right = comp.position.x.value + comp.size.width.value;
                            const bottom = comp.position.y.value + comp.size.height.value;

                            maxRight = Math.max(maxRight, right);
                            maxBottom = Math.max(maxBottom, bottom);
                        });

                        // Calculate total size with padding
                        const totalWidth = maxRight + padding.x;
                        const totalHeight = maxBottom + padding.y;

                        // Enforce minimum size
                        const minWidth = 200;
                        const minHeight = 100;

                        const newSize = {
                            width: { value: Math.max(minWidth, totalWidth), unit: "px" },
                            height: { value: Math.max(minHeight, totalHeight), unit: "px" }
                        };

                        // Update widget size
                        get().updateWidget(widgetId, { size: newSize as Size });
                    }, 50); // Slight delay to ensure the component is fully added
                }

                eventBus.publish("component:added", { widgetId, componentId });

                return newComponent;
            },

            /**
             * Update a component in a widget
             * @param widgetId ID of the widget containing the component
             * @param componentId ID of the component to update
             * @param updates Changes to apply to the component
             */
            updateComponent: (widgetId, componentId, updates) => {
                set(state => {
                    const widget = state.widgets[widgetId];
                    if (!widget) return state;

                    const updatedComponents = widget.components.map(c => c.id == componentId ? { ...c, ...updates } : c);

                    eventBus.publish("component:updated", { widgetId, componentId });

                    return {
                        widgets: {
                            ...state.widgets,
                            [widgetId]: {
                                ...widget,
                                components: updatedComponents
                            }
                        }
                    };
                });
            },

            /**
             * Remove a component from a widget
             * @param widgetId ID of the widget containing the component
             * @param componentId ID of the component to remove
             */
            removeComponent: (widgetId, componentId) => {
                set(state => {
                    const widget = state.widgets[widgetId];
                    if (!widget) return state;

                    const updatedComponents = widget.components.filter(c => c.id !== componentId);

                    eventBus.publish("component:deleted", { widgetId, componentId });

                    return {
                        widgets: {
                            ...state.widgets,
                            [widgetId]: {
                                ...widget,
                                components: updatedComponents
                            }
                        }
                    };
                });
            },

            /**
             * Find a component in a widget by its ID
             * @param widgetId ID of the widget to search in
             * @param componentId ID of the component to find
             * @returns The component or null if not found
             */
            findComponent: (widgetId, componentId) => {
                const widget = get().widgets[widgetId];
                if (!widget) return null;

                return widget.components.find(c => c.id === componentId) || null;
            },

            /**
             * Find a component by its instance ID across all widgets
             * @param instanceId The instance ID to search for
             * @returns Object with the component and its widget ID, or null values if not found
             */
            findComponentByInstanceId: (instanceId) => {
                const widgets = get().widgets;

                for (const widgetId in widgets) {
                    const widget = widgets[widgetId];
                    const component = widget.components.find(c => c.instanceId === instanceId);

                    if (component) {
                        return { component, widgetId: widgetId as EntityId };
                    }
                }

                return { component: null, widgetId: null };
            },

            /**
             * Bind a component to a widget for navigation/action
             * @param sourceWidgetId The widget containing the component
             * @param componentId The component to bind
             * @param targetWidgetId The target widget to show/hide
             * @param action The action to perform (default: 'show')
             */
            bindComponentToWidget: (sourceWidgetId, componentId, targetWidgetId, action = 'show') => {
                set(state => {
                    const sourceWidget = state.widgets[sourceWidgetId];
                    if (!sourceWidget) return state;

                    const updatedComponents = sourceWidget.components.map(c => {
                        if (c.id === componentId) {
                            return {
                                ...c,
                                actionBindings: {
                                    targetWidgetId,
                                    action
                                }
                            };
                        }
                        return c;
                    });

                    return {
                        widgets: {
                            ...state.widgets,
                            [sourceWidgetId]: {
                                ...sourceWidget,
                                components: updatedComponents
                            }
                        }
                    };
                });
            },

            /**
             * Add a child component to a parent component within a widget
             * @param widgetId The widget ID
             * @param parentComponentId The parent component ID
             * @param definitionId The component definition ID
             * @param instanceId The component instance ID
             * @param position The optional position override (defaults to 10,10)
             * @returns The created widget component or null if failed
             */
            addChildComponent: (
                widgetId: EntityId,
                parentComponentId: EntityId,
                definitionId: EntityId,
                instanceId: EntityId,
                position = {
                    x: { value: 10, unit: "px" as UnitType },
                    y: { value: 10, unit: "px" as UnitType }
                }
            ) => {
                const state = get();
                const widget = state.widgets[widgetId];

                if (!widget) {
                    console.error(`Widget ${widgetId} not found`);
                    return null;
                }

                // First, check if parent exists
                const parentComponent = widget.components.find(comp => comp.id === parentComponentId);

                if (!parentComponent) {
                    console.error(`Parent component ${parentComponentId} not found in widget ${widgetId}`);
                    return null;
                }

                try {
                    // Create component reference for widget
                    const componentId = createEntityId(`component-${nanoid(6)}`);
                    const newComponent: WidgetComponent = {
                        id: componentId,
                        definitionId,
                        instanceId,
                        position,
                        size: {
                            width: { value: 100, unit: "px" },
                            height: { value: 40, unit: "px" }
                        },
                        zIndex: parentComponent.childIds?.length || 0,
                        parentId: parentComponentId,
                        childIds: []
                    };

                    // Update the parent component's childIds
                    const updatedParent = {
                        ...parentComponent,
                        childIds: [...(parentComponent.childIds || []), componentId]
                    };

                    // Update the widget state
                    set(state => {
                        // Map all components, updating the parent
                        const updatedComponents = widget.components.map(comp =>
                            comp.id === parentComponentId ? updatedParent : comp
                        );

                        // Add the new component to the list
                        updatedComponents.push(newComponent);

                        return {
                            widgets: {
                                ...state.widgets,
                                [widgetId]: {
                                    ...widget,
                                    components: updatedComponents
                                }
                            }
                        };
                    });

                    eventBus.publish('hierarchy:changed', { widgetId });

                    return newComponent;
                } catch (error) {
                    console.error('Error creating child component:', error);
                    return null;
                }
            },

            /**
             * Move a component within or between widgets
             * @param sourceWidgetId Source widget containing the component
             * @param componentId The component to move
             * @param newParentId New parent ID or undefined for root level (optional)
             * @param destinationWidgetId Destination widget if different from source (optional)
             */
            moveComponent: (
                sourceWidgetId: EntityId,
                componentId: EntityId,
                newParentId?: EntityId, // undefined means move to root
                destinationWidgetId?: EntityId, // undefined means same widget as source
            ) => {
                set(state => {
                    // Get source widget and destination widget (same as source if not specified)
                    const sourceWidget = state.widgets[sourceWidgetId];
                    const destWidgetId = destinationWidgetId || sourceWidgetId;
                    const destWidget = state.widgets[destWidgetId];

                    if (!sourceWidget || !destWidget) {
                        console.error("Source or destination widget not found");
                        return state;
                    }

                    // Find the component to move
                    const componentToMove = sourceWidget.components.find(c => c.id === componentId);
                    if (!componentToMove) {
                        console.error(`Component ${componentId} not found in source widget`);
                        return state;
                    }

                    // For same-widget moves, check for circular reference
                    if (destWidgetId === sourceWidgetId && newParentId) {
                        let current = sourceWidget.components.find(c => c.id === newParentId);
                        let foundCircular = false;

                        // Check if the new parent is a descendant of the component being moved
                        while (current && current.parentId) {
                            if (current.parentId === componentId) {
                                console.warn("Cannot create circular reference in component hierarchy");
                                foundCircular = true;
                                break;
                            }
                            current = sourceWidget.components.find(c => c.id === current!.parentId);
                        }

                        if (foundCircular) return state;
                    }

                    // Create a new state object
                    const newState = { ...state };

                    // Handle same-widget moves (simpler case)
                    if (destWidgetId === sourceWidgetId) {
                        const oldParentId = componentToMove.parentId;

                        // Update the component's parent
                        const updatedComponents = sourceWidget.components.map(c => {
                            if (c.id === componentId) {
                                // Update the moved component
                                return { ...c, parentId: newParentId || undefined };
                            }
                            else if (c.id === oldParentId) {
                                // Update old parent's childIds
                                return {
                                    ...c,
                                    childIds: c.childIds.filter(id => id !== componentId)
                                };
                            }
                            else if (c.id === newParentId) {
                                // Update new parent's childIds
                                return {
                                    ...c,
                                    childIds: [...c.childIds, componentId]
                                };
                            }
                            return c;
                        });

                        // Update the widget
                        newState.widgets[sourceWidgetId] = {
                            ...sourceWidget,
                            components: updatedComponents
                        };
                    }
                    // Handle cross-widget moves
                    else {
                        // Helper function to get a component and all its descendants
                        const getComponentWithChildren = (
                            components: WidgetComponent[],
                            rootId: EntityId
                        ): WidgetComponent[] => {
                            const result: WidgetComponent[] = [];

                            // First get the root component
                            const rootComponent = components.find(c => c.id === rootId);
                            if (!rootComponent) return result;

                            // Add root component
                            result.push(rootComponent);

                            // Recursively add children
                            const addChildren = (parentId: EntityId) => {
                                const children = components.filter(c => c.parentId === parentId);
                                for (const child of children) {
                                    result.push(child);
                                    addChildren(child.id);
                                }
                            };

                            // Start recursion from root
                            addChildren(rootId);
                            return result;
                        };

                        // Get the component and all its descendants
                        const componentsToMove = getComponentWithChildren(sourceWidget.components, componentId);

                        // 1. Remove components from source widget
                        newState.widgets[sourceWidgetId] = {
                            ...sourceWidget,
                            components: sourceWidget.components.filter(c =>
                                !componentsToMove.some(moveComp => moveComp.id === c.id)
                            )
                        };

                        // 2. Update parent references in source widget components
                        newState.widgets[sourceWidgetId].components = newState.widgets[sourceWidgetId].components.map(c => {
                            // Check if this component has any of the moved components as children
                            const updatedChildIds = c.childIds.filter(childId =>
                                !componentsToMove.some(moveComp => moveComp.id === childId)
                            );

                            // Only update if childIds changed
                            if (updatedChildIds.length !== c.childIds.length) {
                                return { ...c, childIds: updatedChildIds };
                            }
                            return c;
                        });

                        // 3. Update the moved components with new parent references
                        const modifiedComponentsToMove = componentsToMove.map(c => {
                            // If this is the root component being moved, update its parent
                            if (c.id === componentId) {
                                return { ...c, parentId: newParentId || undefined };
                            }

                            // For child components, keep them as they are
                            return c;
                        });

                        // 4. Add components to destination widget
                        newState.widgets[destWidgetId] = {
                            ...destWidget,
                            components: [...destWidget.components, ...modifiedComponentsToMove]
                        };

                        // 5. Update new parent childIds in destination widget if specified
                        if (newParentId) {
                            newState.widgets[destWidgetId].components = newState.widgets[destWidgetId].components.map(c => {
                                if (c.id === newParentId) {
                                    return {
                                        ...c,
                                        childIds: [...c.childIds, componentId]
                                    };
                                }
                                return c;
                            });
                        }
                    }

                    return newState;
                });

                // Generate events based on whether this is a cross-widget move
                const isCrossWidgetMove = destinationWidgetId && destinationWidgetId !== sourceWidgetId;

                if (isCrossWidgetMove) {
                    // Notify about cross-widget movement
                    eventBus.publish('component:moved', {
                        sourceWidgetId,
                        destinationWidgetId,
                        componentId,
                        parentId: newParentId
                    });

                    // Notify about hierarchy changes in both widgets
                    eventBus.publish('hierarchy:changed', { widgetId: sourceWidgetId });
                    eventBus.publish('hierarchy:changed', { widgetId: destinationWidgetId });
                } else {
                    // Notify about same-widget movement
                    eventBus.publish('component:moved', {
                        widgetId: sourceWidgetId,
                        componentId,
                        parentId: newParentId
                    });

                    // Notify about hierarchy change
                    eventBus.publish('hierarchy:changed', { widgetId: sourceWidgetId });
                }
            },

            /**
             * Get the component hierarchy for a widget
             * @param widgetId The widget to get the hierarchy for
             * @param options Optional configuration for hierarchy generation
             * @returns Component hierarchy tree
             */
            getComponentHierarchy: (
                widgetId: EntityId,
                options: { debug?: boolean, includeWidget?: boolean } = {}
            ) => {
                const { debug = false, includeWidget = true } = options;
                const widget = get().widgets[widgetId];
                if (!widget) return Promise.resolve([]);

                // Debug logging to help diagnose hierarchy issues
                if (debug) {
                    console.log(`Building hierarchy for widget ${widgetId} with ${widget.components.length} components`);

                    // Log parent-child relationships
                    const parentChildMap: Record<string, Array<{ id: EntityId, type: string }>> = {};
                    widget.components.forEach(c => {
                        const key = c.parentId ? c.parentId : 'root';
                        if (!parentChildMap[key]) {
                            parentChildMap[key] = [];
                        }

                        parentChildMap[key].push({
                            id: c.id,
                            type: c.definitionId.toString().split('-')[0] // Simplified type for debugging
                        });
                    });

                    console.log('Parent-child relationships:', parentChildMap);
                }

                // Import component store dynamically to avoid circular dependencies
                const getComponent = async (instanceId: EntityId) => {
                    try {
                        // Try to dynamically load the component store
                        const module = await import('@/store/componentStore');
                        const componentStore = module.useComponentStore.getState();
                        return componentStore.getInstance(instanceId);
                    } catch (error) {
                        if (debug) {
                            console.error(`Failed to load instance ${instanceId}:`, error);
                        }
                        return null;
                    }
                };

                // Recursively build tree
                const buildTree = async (component: WidgetComponent): Promise<{
                    id: string;
                    type: string;
                    label: string;
                    icon: any;
                    canDrop: boolean;
                    canDrag: boolean;
                    data?: {
                        componentId: EntityId;
                        widgetId: EntityId;
                        instanceId: EntityId;
                        definitionId: EntityId;
                    };
                    parentId?: string;
                    children: any[];
                }> => {
                    try {
                        // Find child components
                        const childComponents = widget.components.filter(c => c.parentId === component.id);
                        if (debug) {
                            console.log(`Component ${component.id} has ${childComponents.length} children`);
                        }

                        // Get component instance
                        let instance;
                        try {
                            instance = await getComponent(component.instanceId);
                        } catch (err) {
                            if (debug) {
                                console.warn(`Instance not found for component ${component.id}`);
                            }
                        }

                        // Determine component type and label
                        const instanceType = instance?.type || 'unknown';
                        const instanceLabel = instance?.label || component.id.toString().split('-')[0];

                        // Determine icon based on component type
                        let icon = componentIconMap["Panel"];
                        if (componentIconMap[instanceType]) {
                            icon = componentIconMap[instanceType];
                        }

                        // Determine if component can accept children
                        const canAcceptChildren =
                            instanceType === 'Panel' ||
                            instanceType === 'ScrollBox' ||
                            instanceType === 'Drawer' ||
                            instanceType === 'Tabs';

                        return {
                            // Use combined widget/component ID for tree identification
                            id: `${widgetId}/${component.id}`,
                            type: instanceType,
                            label: instanceLabel,
                            icon: icon,
                            // Control drag/drop based on component type
                            canDrop: canAcceptChildren,
                            canDrag: true,
                            // Include data about component for later use
                            data: {
                                componentId: component.id,
                                widgetId,
                                instanceId: component.instanceId,
                                definitionId: component.definitionId
                            },
                            // Include parent reference for easier hierarchy management
                            parentId: component.parentId ? `${widgetId}/${component.parentId}` : undefined,
                            // Process children recursively
                            children: await Promise.all(childComponents.map(buildTree))
                        };
                    } catch (error) {
                        console.error(`Error building tree for component ${component.id}:`, error);
                        return {
                            id: `${widgetId}/${component.id}`,
                            type: 'error',
                            label: `Error: ${component.id}`,
                            icon: PanelIcon,
                            canDrop: false,
                            canDrag: false,
                            children: []
                        };
                    }
                };

                // Find root-level components (no parent)
                const rootComponents = widget.components.filter(c => !c.parentId);
                if (debug) {
                    console.log(`Found ${rootComponents.length} root components`);
                }

                // Create and execute async function to build hierarchy
                const buildFullHierarchy = async () => {
                    const rootNodes = await Promise.all(rootComponents.map(buildTree));

                    // If includeWidget is false, return just the root components
                    if (!includeWidget) {
                        return rootNodes;
                    }

                    // Map widget as the root with components as children
                    return [{
                        id: widgetId,
                        type: 'Widget',
                        label: widget.label || 'Widget',
                        icon: WidgetIcon,
                        canDrop: true, // Widget can accept top-level components
                        canDrag: false, // Widget itself can't be dragged in the hierarchy
                        children: rootNodes
                    }];
                };

                // Start the hierarchy building process
                // Note: This returns a Promise - components using this will need to handle it
                return buildFullHierarchy();
            },

            /**
             * Reorder components within a container
             * @param widgetId Widget containing the components
             * @param containerId Container/parent component ID
             * @param componentId Component to reorder
             * @param targetId Target component to position relative to
             * @param position Whether to place before or after the target
             */
            reorderComponents: (
                widgetId: EntityId,
                containerId: EntityId,
                componentId: EntityId,
                targetId: EntityId,
                position: 'before' | 'after'
            ) => {
                set(state => {
                    // Debug logging
                    console.log(`ARRAY REORDER: ${componentId} ${position} ${targetId} in ${containerId}`);

                    const widget = state.widgets[widgetId];
                    if (!widget) return state;

                    // Get a reference to the current components array
                    const originalComponents = widget.components;

                    // Determine if we're working with root or container level
                    const isRootLevel = containerId === widgetId;

                    // Find our component in the array
                    const componentToMove = originalComponents.find(c => c.id === componentId);
                    if (!componentToMove) {
                        console.error(`Component ${componentId} not found`);
                        return state;
                    }

                    // Find the target component in the array
                    const targetComponent = originalComponents.find(c => c.id === targetId);
                    if (!targetComponent) {
                        console.error(`Target ${targetId} not found`);
                        return state;
                    }

                    // Create a fresh array without the component we're moving
                    const arrayWithoutComponent = originalComponents.filter(c => c.id !== componentId);

                    // Find position of the target in the new array
                    const targetPosition = arrayWithoutComponent.findIndex(c => c.id === targetId);
                    if (targetPosition === -1) {
                        console.error(`Target ${targetId} not found after filtering`);
                        return state;
                    }

                    // Calculate insertion position
                    const insertPosition = position === 'before' ? targetPosition : targetPosition + 1;

                    // Update parentId if needed (moving to a new parent)
                    const newParentId = isRootLevel ? undefined : containerId;
                    const isParentChanging = componentToMove.parentId !== newParentId;

                    // Clone component with updated parentId if needed
                    const updatedComponent = isParentChanging
                        ? { ...componentToMove, parentId: newParentId }
                        : componentToMove;

                    // Build the final array by inserting at the right position
                    const result = [
                        ...arrayWithoutComponent.slice(0, insertPosition),
                        updatedComponent,
                        ...arrayWithoutComponent.slice(insertPosition)
                    ];

                    // Update parent relationships if parent is changing
                    if (isParentChanging) {
                        // Handle old parent (remove from childIds)
                        if (componentToMove.parentId) {
                            const oldParentIndex = result.findIndex(c => c.id === componentToMove.parentId);
                            if (oldParentIndex !== -1) {
                                result[oldParentIndex] = {
                                    ...result[oldParentIndex],
                                    childIds: result[oldParentIndex].childIds.filter(id => id !== componentId)
                                };
                            }
                        }

                        // Handle new parent (add to childIds)
                        if (newParentId) {
                            const newParentIndex = result.findIndex(c => c.id === newParentId);
                            if (newParentIndex !== -1) {
                                result[newParentIndex] = {
                                    ...result[newParentIndex],
                                    childIds: [...(result[newParentIndex].childIds || []), componentId]
                                };
                            }
                        }
                    }

                    // Log the results for debugging
                    console.log("BEFORE:", originalComponents.map(c => c.id).join(", "));
                    console.log("AFTER:", result.map(c => c.id).join(", "));

                    // Replace the entire components array with our new one
                    return {
                        widgets: {
                            ...state.widgets,
                            [widgetId]: {
                                ...widget,
                                components: result
                            }
                        }
                    };
                });

                // Send notifications about the change
                eventBus.publish('component:reordered', { widgetId, containerId, componentId, targetId, position });
                eventBus.publish('hierarchy:changed', { widgetId });
            },

            /**
             * Convert widgets to ReactFlow nodes
             * @returns Array of node objects for ReactFlow
             */
            convertToNodes: () => {
                const { widgets } = get();

                // Convert widgets to proper ReactFlow node format
                return Object.values(widgets)
                    .filter(widget =>
                        widget.displayType === 'canvas' &&
                        widget.isVisible
                    )
                    .map(widget => ({
                        id: widget.id,
                        type: 'widget',
                        position: PositionUtils.toXYPosition(widget.position),
                        data: widget,
                        dragHandle: '.drag-handle__widget'
                    }));
            },

            /**
             * Get a widget by its ID
             * @param id The ID of the widget to get
             * @returns The widget or undefined if not found
             */
            getWidget: (id) => {
                return get().widgets[id];
            },

            /**
             * Get all visible widgets of the optional type
             * @param displayType Optional display type filter
             * @returns Array of visible widgets
             */
            getVisibleWidgets: (displayType) => {
                const { widgets } = get();

                return Object.values(widgets).filter(widget =>
                    widget.isVisible &&
                    (!displayType || widget.displayType === displayType)
                );
            },

            /**
             * Purge the store by clearing widgets
             * @param options Options for controlling what is kept
             * @returns Count of widgets cleared
             */
            purgeStore: (options = {}) => {
                const state = get();
                const { keepWidgets = false } = options;

                // Count for return value
                const widgetCount = Object.keys(state.widgets).length;

                // Set new state
                if (!keepWidgets) {
                    set({
                        widgets: {},
                        activeWidgetId: null
                    });
                }

                return { widgetCount };
            },

            /**
             * Set the active widget
             * @param id The ID of the widget to set as active
             */
            setActiveWidget: (id) => {
                set({ activeWidgetId: id });
            },
        }),
        {
            name: 'omni-ui-widgets'
        }
    )
);

/**
 * Hook for subscribing to widget changes
 * @param callback Callback function to run on widget changes
 */
export const useWidgetChanges = (callback: () => void) => {
    useEffect(() => {
        // Use Zustand's built-in subscription mechanism
        const unsubscribe = useWidgetStore.subscribe(_state => {
            // This callback is triggered on any state change
            callback();
        });

        return unsubscribe;
    }, [callback]);
};

/**
 * Hook to get the active widget
 * @returns The currently active widget or undefined
 */
export function useActiveWidget() {
    const activeWidgetId = useWidgetStore(state => state.activeWidgetId);
    const getWidget = useWidgetStore(state => state.getWidget);

    return activeWidgetId ? getWidget(activeWidgetId) : undefined;
}

/**
 * Hook to get a widget by ID
 * @param id Widget ID to retrieve
 * @returns The widget or undefined
 */
export function useWidget(id: EntityId | null) {
    const getWidget = useWidgetStore(state => state.getWidget);
    return id ? getWidget(id) : undefined;
}