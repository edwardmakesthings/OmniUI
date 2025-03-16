import { BasePanel } from "../BasePanel";
import { usePanelConfig, useUIStore } from "@/store/uiStore";
import { TreeView, TreeItem } from "@/components/ui/atoms/TreeView";
import { useWidgetStore } from "@/features/builder/stores/widgetStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EntityId } from "@/core/types/EntityTypes";
import { WidgetIcon } from "@/components/ui/icons";
import { componentIconMap } from "@/registry/componentRenderers";
import { PushButton } from "@/components/ui/atoms";
import { useEventSubscription } from "@/hooks/useEventBus";
import eventBus from "@/core/eventBus/eventBus";

const LayoutPanel = () => {
    const layoutHierarchyConfig = usePanelConfig("LAYOUT_HIERARCHY");
    const widgetStore = useWidgetStore();
    const selectionState = useUIStore();
    const widgets = widgetStore.getVisibleWidgets();

    // State for tracking expanded items in tree view
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [forceRender, setForceRender] = useState(0);

    // Track initial expansion
    const initialExpansionRef = useRef(false);

    // Get selected component info from selection store
    const selectedTreeItem = useMemo(() => {
        const { selectedComponentId, selectedWidgetId } = selectionState;
        if (!selectedComponentId || !selectedWidgetId) return null;

        // Format: widgetId/componentId
        return `${selectedWidgetId}/${selectedComponentId}`;
    }, [selectionState.selectedComponentId, selectionState.selectedWidgetId]);

    // Make the layout hierarchy store globally available for cross-component access
    useEffect(() => {
        // Create a global reference to this component's functionality
        window._layoutHierarchyStore = {
            selectItem: (id: EntityId) => {
                // Handle widget-only selection
                if (id && !id.includes("/")) {
                    widgetStore.setActiveWidget(id as EntityId);
                    selectionState.selectComponent(null, id as EntityId, {
                        syncWithLayoutPanel: false,
                    });
                    return;
                }

                // Handle component selection (format: widgetId/componentId)
                if (id) {
                    const [widgetId, componentId] = id.split("/") as [
                        EntityId,
                        EntityId
                    ];
                    selectionState.selectComponent(componentId, widgetId, {
                        syncWithLayoutPanel: false,
                    });
                } else {
                    // Handle deselection
                    selectionState.deselectAll();
                }
            },
            getSelectedItems: () => {
                const { selectedComponentId, selectedWidgetId } =
                    selectionState;
                if (!selectedComponentId || !selectedWidgetId) return [];
                return [`${selectedWidgetId}/${selectedComponentId}`];
            },
            refreshView: () => setForceRender((prev) => prev + 1),
        };

        return () => {
            delete window._layoutHierarchyStore;
        };
    }, [selectionState, widgetStore]);

    // Mark this panel for targeting from events
    useEffect(() => {
        const panelElement = document.querySelector(".layout-hierarchy-panel");
        if (panelElement) {
            panelElement.setAttribute("data-panel-id", "layout-hierarchy");
        }
    }, []);

    // Only expand widgets on initial render
    useEffect(() => {
        if (initialExpansionRef.current) return;
        initialExpansionRef.current = true;

        if (widgets.length > 0) {
            const widgetIds = widgets.map((w) => w.id);
            setExpandedIds(widgetIds);
        }
    }, [widgets]);

    // Handle widget updates
    useEventSubscription(
        "widget:updated",
        (event) => {
            console.log("Layout panel received widget update:", event.data);
            setForceRender((prev) => prev + 1);

            // Auto-expand the widget that was updated
            if (event.data?.widgetId) {
                const { widgetId } = event.data;
                setExpandedIds((prev) => {
                    if (!prev.includes(widgetId)) {
                        return [...prev, widgetId];
                    }
                    return prev;
                });
            }
        },
        []
    );

    // Handle component addition
    useEventSubscription(
        "component:added",
        (event) => {
            // console.log(
            //     "Layout panel received component addition:",
            //     event.data
            // );
            setForceRender((prev) => prev + 1);

            // Auto-expand the parent widget
            if (event.data?.widgetId) {
                const { widgetId } = event.data;
                setExpandedIds((prev) => {
                    if (!prev.includes(widgetId)) {
                        return [...prev, widgetId];
                    }
                    return prev;
                });
            }
        },
        []
    );

    // Handle component deletion
    useEventSubscription(
        "component:deleted",
        () => {
            setForceRender((prev) => prev + 1);
        },
        []
    );

    // Handle component updates
    useEventSubscription(
        "component:updated",
        () => {
            setForceRender((prev) => prev + 1);
        },
        []
    );

    // Handle hierarchy changes
    useEventSubscription(
        "hierarchy:changed",
        () => {
            setForceRender((prev) => prev + 1);
        },
        []
    );

    // Build tree data for widgets and their components
    const treeData = useMemo(() => {
        try {
            return widgets.map((widget) => {
                // Get the component hierarchy for this widget
                const hierarchy = widgetStore.getComponentHierarchy(widget.id);
                // The hierarchy already includes the widget as the first item
                // Just return the first element from the hierarchy array
                if (hierarchy.length > 0) {
                    return hierarchy[0];
                }

                // Fallback in case the hierarchy is empty
                return {
                    id: widget.id,
                    label: widget.label || "Widget",
                    icon: componentIconMap.Widget || WidgetIcon,
                    children: [],
                    canDrop: true,
                    canDrag: false,
                };
            });
        } catch (err) {
            console.error("Error building tree data:", err);
            return [];
        }
    }, [widgets, widgetStore, forceRender]);

    // Handle tree item movement
    const handleTreeMove = useCallback(
        (items) => {
            if (!items.length || !items[0].id) return;

            // Extract widget ID from the first element
            const widgetId = items[0].id as EntityId;
            const widget = widgetStore.getWidget(widgetId);
            if (!widget) return;

            // Process the updated tree structure
            const processUpdatedHierarchy = (
                treeItems,
                parentId = undefined
            ) => {
                treeItems.forEach((item, index) => {
                    // Skip widget items
                    if (!item.id.includes("/")) {
                        if (item.children) {
                            processUpdatedHierarchy(item.children);
                        }
                        return;
                    }

                    // Extract component ID from combined ID (format: widgetId/componentId)
                    const [, componentId] = item.id.split("/") as [
                        string,
                        EntityId
                    ];

                    // Find the component in the widget
                    const component = widget.components.find(
                        (c) => c.id === componentId
                    );
                    if (!component) return;

                    // Update parent and z-index if needed
                    if (
                        component.parentId !== parentId ||
                        component.zIndex !== index
                    ) {
                        // Move component to new parent if needed
                        if (component.parentId !== parentId) {
                            widgetStore.moveComponent(
                                widgetId,
                                componentId,
                                parentId
                            );
                        }

                        // Update z-index to match tree order
                        widgetStore.updateComponent(widgetId, componentId, {
                            zIndex: index,
                        });
                    }

                    // Process children recursively
                    if (item.children) {
                        processUpdatedHierarchy(item.children, componentId);
                    }
                });
            };

            // Start processing from root
            processUpdatedHierarchy(items);

            // Notify about hierarchy changes
            eventBus.publish("hierarchy:changed", { widgetId });
        },
        [widgetStore]
    );

    // Handle selection
    const handleSelectionChange = useCallback(
        (ids: string[]) => {
            if (!ids.length) {
                // Deselect all
                selectionState.deselectAll();
                return;
            }

            const selectedId = ids[0];

            // If a component is selected (format: widget-123/component-456)
            if (selectedId.includes("/")) {
                // Extract widget and component IDs
                const [widgetId, componentId] = selectedId.split("/") as [
                    EntityId,
                    EntityId
                ];

                // Set the selection in the selection store
                selectionState.selectComponent(componentId, widgetId, {
                    syncWithLayoutPanel: false,
                });
            } else {
                // Just a widget selected, no component
                widgetStore.setActiveWidget(selectedId as EntityId);

                // Clear component selection
                selectionState.selectComponent(null, selectedId as EntityId, {
                    syncWithLayoutPanel: false,
                });
            }
        },
        [selectionState, widgetStore]
    );

    // Delete selected component
    const handleDeleteComponent = useCallback(() => {
        selectionState.deleteSelectedComponent();
    }, [selectionState]);

    // Manual refresh button handler
    const handleManualRefresh = useCallback(() => {
        setForceRender((prev) => prev + 1);
    }, []);

    return (
        <BasePanel
            {...layoutHierarchyConfig}
            className="layout-hierarchy-panel"
        >
            <h2 className="text-lg font-bold p-3 border-b border-accent-dark-neutral">
                Layout Hierarchy
            </h2>

            {widgets.length === 0 ? (
                <div className="p-4 text-center text-font-dark-muted">
                    No widgets available
                </div>
            ) : (
                <>
                    <div className="p-2 flex justify-between">
                        <PushButton
                            onClick={handleDeleteComponent}
                            variant="ghost"
                            className="text-xs"
                            disabled={!selectionState.selectedComponentId}
                        >
                            Delete
                        </PushButton>
                        <PushButton
                            onClick={handleManualRefresh}
                            variant="ghost"
                            className="text-xs"
                        >
                            Refresh
                        </PushButton>
                    </div>
                    <TreeView
                        items={treeData}
                        selectedIds={selectedTreeItem ? [selectedTreeItem] : []}
                        expandedIds={expandedIds}
                        onSelectionChange={handleSelectionChange}
                        onExpansionChange={setExpandedIds}
                        onMove={handleTreeMove}
                        maxHeight="calc(100vh - 60px)"
                    />
                </>
            )}
        </BasePanel>
    );
};

export default LayoutPanel;
