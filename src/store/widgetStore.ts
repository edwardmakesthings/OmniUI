import { nanoid } from "nanoid";
import { Position, PositionUtils, Size, SizeUtils } from "@/core/types/Geometry";
import { EntityId, createEntityId } from "@/core/types/EntityTypes";
import { Node } from "@xyflow/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ComponentConfig } from "@/core/base/ComponentConfig";
import { useComponentStore } from "@/store/componentStore";
import { useEffect } from "react";
import { ButtonIcon, InputIcon, LabelIcon, PanelIcon, WidgetIcon } from "@/components/ui";
import { UnitType } from "@/core/types/Measurement";
import { notifyWidgetChange } from "@/core/eventBus/widgetEvents";
import { componentIconMap } from "@/registry/componentRenderers";

// Widget display types
export type WidgetDisplayType = 'canvas' | 'modal' | 'drawer' | 'embedded';

// Widget represets a container for components
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
        position?: Position
    ) => WidgetComponent | null;

    moveComponent: (
        widgetId: EntityId,
        componentId: EntityId,
        newParentId?: EntityId, // undefined means move to root
        position?: Position
    ) => void;

    // Get component hierarchy
    getComponentHierarchy: (widgetId: EntityId) => {
        id: EntityId;
        type: string;
        label: string;
        children: any[];
    }[];

    reorderComponents: (
        widgetId: EntityId,
        containerId: EntityId,
        componentId: EntityId,
        targetId: EntityId,
        position: 'before' | 'after'
    ) => void;

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

            addComponentToWidget: (widgetId, definitionId, position) => {
                const widget = get().widgets[widgetId];
                if (!widget) return null;

                // Create component instance
                const componentStore = useComponentStore.getState();
                try {
                    // Determine default size based on component type
                    const definition = componentStore.getDefinition(definitionId);
                    let defaultSize = {
                        width: { value: 100, unit: 'px' },
                        height: { value: 40, unit: 'px' }
                    };

                    // Adjust size based on component type
                    if (definition.type === 'Panel' || definition.type === 'ScrollBox') {
                        defaultSize = {
                            width: { value: 200, unit: 'px' },
                            height: { value: 150, unit: 'px' }
                        };
                    } else if (definition.type === 'Input') {
                        defaultSize = {
                            width: { value: 160, unit: 'px' },
                            height: { value: 32, unit: 'px' }
                        };
                    } else if (definition.type === 'Label') {
                        defaultSize = {
                            width: { value: 120, unit: 'px' },
                            height: { value: 24, unit: 'px' }
                        };
                    }

                    const instance = componentStore.createFromDefinition(
                        definitionId,
                        {
                            // Default config for this component
                            layout: {
                                position: {
                                    x: { value: 0, unit: 'px' },
                                    y: { value: 0, unit: 'px' }
                                },
                                size: defaultSize
                            }
                        } as ComponentConfig
                    );

                    // Create widget component reference
                    const componentId = createEntityId(`component-${nanoid(6)}`);
                    const newComponent: WidgetComponent = {
                        id: componentId,
                        definitionId,
                        instanceId: instance.id,
                        position,
                        size: defaultSize as Size,
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

                    notifyWidgetChange(widgetId, 'componentAdded');

                    return newComponent;

                } catch (error) {
                    console.error("Failed to create component instance:", error);
                    return null;
                }
            },

            updateComponent: (widgetId, componentId, updates) => {
                set(state => {
                    const widget = state.widgets[widgetId];
                    if (!widget) return state;

                    const updatedComponents = widget.components.map(c => c.id == componentId ? { ...c, ...updates } : c);

                    notifyWidgetChange(widgetId, 'componentUpdated');

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

            removeComponent: (widgetId, componentId) => {
                set(state => {
                    const widget = state.widgets[widgetId];
                    if (!widget) return state;

                    const updatedComponents = widget.components.filter(c => c.id !== componentId);
                    notifyWidgetChange(widgetId, 'componentRemoved');

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

            addChildComponent: (
                widgetId: EntityId,
                parentComponentId: EntityId,
                definitionId: EntityId,
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

                // First, check if parent exists and is a container
                const parentComponent = widget.components.find(comp => comp.id === parentComponentId);

                if (!parentComponent) {
                    console.error(`Parent component ${parentComponentId} not found in widget ${widgetId}`);
                    return null;
                }

                try {
                    // Create component instance from definition
                    const componentStore = useComponentStore.getState();
                    const instance = componentStore.createFromDefinition(
                        definitionId,
                        {
                            layout: {
                                position,
                                size: {
                                    width: { value: 100, unit: "px" },
                                    height: { value: 40, unit: "px" }
                                }
                            }
                        } as ComponentConfig
                    );

                    // Create component reference for widget
                    const componentId = createEntityId(`component-${nanoid(6)}`);
                    const newComponent: WidgetComponent = {
                        id: componentId,
                        definitionId,
                        instanceId: instance.id,
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

                    notifyWidgetChange(widgetId, 'hierarchyChanged');

                    return newComponent;
                } catch (error) {
                    console.error('Error creating child component:', error);
                    return null;
                }
            },

            moveComponent: (
                widgetId: EntityId,
                componentId: EntityId,
                newParentId?: EntityId // undefined means move to root
            ) => {
                set(state => {
                    const widget = state.widgets[widgetId];
                    if (!widget) return state;

                    // Find the component to move
                    const componentToMove = widget.components.find(c => c.id === componentId);
                    if (!componentToMove) return state;

                    // Find the old parent (if any)
                    const oldParentId = componentToMove.parentId;
                    const oldParent = oldParentId ? widget.components.find(c => c.id === oldParentId) : null;

                    // Find the new parent (if any)
                    const newParent = newParentId ? widget.components.find(c => c.id === newParentId) : null;

                    // Check for circular reference (can't make a component its own ancestor)
                    if (newParentId) {
                        let current = newParent;
                        let foundCircular = false;

                        while (current && current.parentId) {
                            if (current.parentId === componentId) {
                                console.warn("Cannot create circular reference in component hierarchy");
                                foundCircular = true;
                                break;
                            }
                            current = widget.components.find(c => c.id === current!.parentId);
                        }

                        if (foundCircular) return state;
                    }

                    // Update components array with all necessary changes
                    const updatedComponents = widget.components.map(c => {
                        if (c.id === componentId) {
                            // This is the component being moved
                            return {
                                ...c,
                                parentId: newParentId || undefined // Set to undefined if no new parent
                            };
                        }
                        else if (c.id === oldParentId && oldParent) {
                            // This is the old parent - remove child from its childIds
                            return {
                                ...c,
                                childIds: c.childIds?.filter(id => id !== componentId) || []
                            };
                        }
                        else if (c.id === newParentId && newParent) {
                            // This is the new parent - add child to its childIds
                            return {
                                ...c,
                                childIds: [...(c.childIds || []), componentId]
                            };
                        }
                        // No changes needed for other components
                        return c;
                    });

                    // Return updated state
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

                // Update zIndex for proper layering
                const widget = get().widgets[widgetId];
                if (!widget) return;

                if (newParentId) {
                    // Set zIndex within parent's children group
                    const siblings = widget.components.filter(c => c.parentId === newParentId);
                    siblings.forEach((comp, index) => {
                        get().updateComponent(widgetId, comp.id, {
                            zIndex: index
                        });
                    });
                } else {
                    // Update root-level component zIndexes
                    const rootComponents = widget.components.filter(c => !c.parentId);
                    rootComponents.forEach((comp, index) => {
                        get().updateComponent(widgetId, comp.id, {
                            zIndex: index + 10 // Add base z-index for root components
                        });
                    });
                }

                // Trigger a layout hierarchy update event
                setTimeout(() => {
                    const layoutHierarchyPanel = document.querySelector('[data-panel-id="layout-hierarchy"]');
                    if (layoutHierarchyPanel) {
                        const event = new CustomEvent('widget-updated', {
                            detail: { widgetId }
                        });
                        layoutHierarchyPanel.dispatchEvent(event);
                    }
                }, 0);

                notifyWidgetChange(widgetId, 'hierarchyChanged');

            },

            // Implementation for the hierarchy getter
            getComponentHierarchy: (widgetId: EntityId, includeWidget = true) => {
                const widget = get().widgets[widgetId];
                if (!widget) return [];

                // Debug logging to help diagnose hierarchy issues
                console.log(`Building hierarchy for widget ${widgetId} with ${widget.components.length} components`);

                // Log parent-child relationships
                const parentChildMap = {};
                widget.components.forEach(c => {
                    const key = c.parentId ? c.parentId : 'root';
                    if (!parentChildMap[key]) {
                        parentChildMap[key] = [];
                    }
                    parentChildMap[key].push({
                        id: c.id,
                        type: c.instanceId ? useComponentStore.getState().instances[c.instanceId]?.type : 'unknown'
                    });
                });

                console.log('Parent-child relationships:', parentChildMap);



                // Get component store to access instances
                const componentStore = useComponentStore.getState();

                // Recursively build tree
                const buildTree = (component) => {
                    try {
                        // Get the instance, with fallback if not found
                        let instance;
                        try {
                            instance = componentStore.instances[component.instanceId];
                        } catch (err) {
                            console.warn(`Instance not found for component ${component.id}`);
                        }

                        // Find child components
                        const childComponents = widget.components.filter(c => c.parentId === component.id);
                        console.log(`Component ${component.id} has ${childComponents.length} children`);

                        // Determine icon based on component type
                        let icon = PanelIcon;
                        if (instance?.type && componentIconMap[instance.type]) {
                            icon = componentIconMap[instance.type];
                        }

                        return {
                            // Use combined widget/component ID for tree identification
                            id: `${widgetId}/${component.id}`,
                            type: instance?.type || 'unknown',
                            label: instance?.label || component.id.toString().split('-')[0],
                            icon,
                            // Control drag/drop based on component type
                            canDrop: instance?.type === 'Panel' || instance?.type === 'ScrollBox',
                            canDrag: true,
                            // Include data about component for later use
                            data: {
                                componentId: component.id,
                                widgetId,
                                instanceId: component.instanceId
                            },
                            // Include parent reference for easier hierarchy management
                            parentId: component.parentId ? `${widgetId}/${component.parentId}` : undefined,
                            // Process children recursively
                            children: childComponents.map(buildTree)
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
                console.log(`Found ${rootComponents.length} root components`);

                // Map widget as the root with components as children
                return [{
                    id: widgetId,
                    type: 'Widget',
                    label: widget.label || 'Widget',
                    icon: WidgetIcon,
                    canDrop: true, // Widget can accept top-level components
                    canDrag: false, // Widget itself can't be dragged in the hierarchy
                    children: rootComponents.map(buildTree)
                }];
            },

            reorderComponents: (
                widgetId: EntityId,
                containerId: EntityId,
                componentId: EntityId,
                targetId: EntityId,
                position: 'before' | 'after'
            ) => {
                set(state => {
                    const widget = state.widgets[widgetId];
                    if (!widget) return state;

                    // Find the container component
                    const container = widget.components.find(c => c.id === containerId);
                    if (!container) return state;

                    // Get all current children of the container
                    const children = widget.components.filter(c => c.parentId === containerId);

                    // Find the component that's being reordered
                    const component = widget.components.find(c => c.id === componentId);
                    if (!component) return state;

                    // Find the target component
                    const target = widget.components.find(c => c.id === targetId);
                    if (!target) return state;

                    // First, update component's parent if needed
                    if (component.parentId !== containerId) {
                        // Remove from old parent's children
                        if (component.parentId) {
                            const oldParent = widget.components.find(c => c.id === component.parentId);
                            if (oldParent) {
                                const updatedOldParent = {
                                    ...oldParent,
                                    childIds: oldParent.childIds.filter(id => id !== componentId)
                                };

                                // Update old parent
                                const componentsWithUpdatedOldParent = widget.components.map(c =>
                                    c.id === oldParent.id ? updatedOldParent : c
                                );

                                // Update component's parent reference
                                const updatedComponent = {
                                    ...component,
                                    parentId: containerId
                                };

                                // Add to new parent's children
                                const updatedNewParent = {
                                    ...container,
                                    childIds: [...container.childIds, componentId]
                                };

                                // Create updated components array with all changes
                                const updatedComponents = componentsWithUpdatedOldParent.map(c => {
                                    if (c.id === componentId) return updatedComponent;
                                    if (c.id === containerId) return updatedNewParent;
                                    return c;
                                });

                                return {
                                    widgets: {
                                        ...state.widgets,
                                        [widgetId]: {
                                            ...widget,
                                            components: updatedComponents
                                        }
                                    }
                                };
                            }
                        }
                    }

                    // Now handle reordering for components already in this container
                    // Get the z-index of the target component
                    const targetIndex = children.findIndex(c => c.id === targetId);
                    if (targetIndex === -1) return state;

                    // Determine new z-index based on position
                    const newZIndex = position === 'before' ? target.zIndex : target.zIndex + 1;

                    // Update z-indexes of all affected components
                    const updatedComponents = widget.components.map(c => {
                        // If this is the component being moved, update its z-index
                        if (c.id === componentId) {
                            return {
                                ...c,
                                zIndex: newZIndex,
                                parentId: containerId // Ensure parent is set
                            };
                        }

                        // If this is a component that needs to shift due to insertion
                        if (c.parentId === containerId) {
                            if (position === 'before' && c.zIndex >= target.zIndex && c.id !== componentId) {
                                // Shift up components after insertion point
                                return {
                                    ...c,
                                    zIndex: c.zIndex + 1
                                };
                            }
                            else if (position === 'after' && c.zIndex > target.zIndex && c.id !== componentId) {
                                // Shift up components after insertion point
                                return {
                                    ...c,
                                    zIndex: c.zIndex + 1
                                };
                            }
                        }

                        // No change needed for other components
                        return c;
                    });

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
                // .forEach(widget => {
                //     nodes.push({
                //         id: widget.id,
                //         type: 'widget',
                //         position: PositionUtils.toXYPosition(widget.position),
                //         data: widget,
                //         draggable: true,
                //         selectable: true
                //     });
                // });

                // return nodes;
            },

            /**
             * Get a widget by its ID.
             * @param id The ID of the widget to get.
             * @returns The widget with the given ID, or undefined if it doesn't exist.
             */
            getWidget: (id) => {
                return get().widgets[id];
            },

            /**
             * Get all visible widgets. If a display type is provided, only
             * widgets with that display type are returned.
             * @param displayType The display type to filter by.
             * @returns An array of visible widgets.
             */
            getVisibleWidgets: (displayType) => {
                const { widgets } = get();

                return Object.values(widgets).filter(widget =>
                    widget.isVisible &&
                    (!displayType || widget.displayType === displayType)
                );
            },

            /**
             * Purge the store by clearing all or some widgets and their components.
             * Returns an object with a single property: `widgetCount`, which is the count of widgets that were cleared.
             * @param {Object} [options] - Optional parameters to control the purge behavior.
             * @param {boolean} [options.keepWidgets=false] - If true, widgets and their components will not be cleared.
             * @returns {Object} - An object with a single property: `widgetCount`, which is the count of widgets that were cleared.
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
             * Set the active widget.
             * @param id The ID of the widget to set as active.
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

// Custom hook for subscribing to widget changes
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