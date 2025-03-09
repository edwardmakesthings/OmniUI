import { nanoid } from "nanoid";
import { Position, PositionUtils, Size, SizeUtils } from "@/core/types/Geometry";
import { EntityId, createEntityId } from "@/core/types/EntityTypes";
import { Node } from "@xyflow/react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ComponentConfig } from "@/core/base/ComponentConfig";
import { useComponentStore } from "@/store/componentStore";
import { useEffect } from "react";

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

    // Utility operations
    convertToNodes: () => FlowWidgetNode[];
    getWidget: (id: EntityId) => Widget | undefined;
    getVisibleWidgets: (displayType?: WidgetDisplayType) => Widget[];

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
                    const instance = componentStore.createFromDefinition(
                        definitionId,
                        {
                            // Default config for this component
                            layout: {
                                position: {
                                    x: { value: 0, unit: 'px' },
                                    y: { value: 0, unit: 'px' }
                                },
                                size: {
                                    width: { value: 100, unit: 'px' },
                                    height: { value: 40, unit: 'px' }
                                }
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
                        size: {
                            width: { value: 100, unit: 'px' },
                            height: { value: 40, unit: 'px' }
                        },
                        zIndex: widget.components.length
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
                        data: widget
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