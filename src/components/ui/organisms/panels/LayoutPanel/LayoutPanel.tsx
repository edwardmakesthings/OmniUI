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
import { builderService } from "@/store";

const LayoutPanel = () => {
    const layoutHierarchyConfig = usePanelConfig("LAYOUT_HIERARCHY");
    const widgetStore = useWidgetStore();
    const selectionState = useUIStore();
    const widgets = widgetStore.getVisibleWidgets();

    // State for tracking expanded items in tree view
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [forceRender, setForceRender] = useState(0);
    const [isProcessingDrag, setIsProcessingDrag] = useState(false);

    // Track initial expansion
    const initialExpansionRef = useRef(false);
    const hierarchyDataRef = useRef<any[]>([]);

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
            setForceRender((prev) => prev + 1);

            // Auto-expand the parent widget and parent component if applicable
            if (event.data?.widgetId) {
                const { widgetId, parentId } = event.data;

                setExpandedIds((prev) => {
                    let newExpanded = [...prev];

                    // Add widget ID if not already expanded
                    if (!newExpanded.includes(widgetId)) {
                        newExpanded.push(widgetId);
                    }

                    // Add parent component ID if applicable
                    if (parentId) {
                        const parentItemId = `${widgetId}/${parentId}`;
                        if (!newExpanded.includes(parentItemId)) {
                            newExpanded.push(parentItemId);
                        }
                    }

                    return newExpanded;
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

    // Handle component reordering
    useEventSubscription(
        "component:reordered",
        () => {
            setForceRender((prev) => prev + 1);
        },
        []
    );

    // Fetch all widget hierarchies asynchronously
    useEffect(() => {
        // Skip if there are no widgets
        if (widgets.length === 0) return;

        const fetchAllHierarchies = async () => {
            const hierarchies = await Promise.all(
                widgets.map(async (widget) => {
                    try {
                        const hierarchy =
                            await widgetStore.getComponentHierarchy(widget.id);
                        return hierarchy[0] || null;
                    } catch (error) {
                        console.error(
                            `Error fetching hierarchy for widget ${widget.id}:`,
                            error
                        );
                        return null;
                    }
                })
            );

            // Filter out null values and update state
            const validHierarchies = hierarchies.filter((h) => h !== null);
            hierarchyDataRef.current = validHierarchies;
            setForceRender((prev) => prev + 1);
        };

        fetchAllHierarchies();
    }, [widgets, widgetStore, forceRender]);

    // Build tree data for widgets and their components
    const treeData = useMemo(() => {
        // Use the pre-fetched hierarchy data if available
        if (hierarchyDataRef.current.length > 0) {
            return hierarchyDataRef.current;
        }

        // Default fallback if hierarchy data isn't available yet
        return widgets.map((widget) => ({
            id: widget.id,
            label: widget.label || "Widget",
            icon: componentIconMap.Widget || WidgetIcon,
            children: [],
            canDrop: true,
            canDrag: false,
        }));
    }, [widgets, forceRender]);

    // Handle tree item movement - completely rewritten to use array-based ordering
    const handleTreeMove = useCallback(
        async (items) => {
            if (isProcessingDrag || !items.length || !items[0].id) return;

            setIsProcessingDrag(true);

            try {
                // Find the modified widget (first level items are widgets)
                const widgetId = items[0].id.split("/")[0] as EntityId;
                const widget = widgetStore.getWidget(widgetId);
                if (!widget) {
                    console.error("Widget not found:", widgetId);
                    return;
                }

                console.log(
                    "Processing hierarchy update for widget:",
                    widgetId
                );

                // Used to track which components we've processed to avoid duplicates
                const processedComponents = new Set<EntityId>();

                // Recursive function to process the tree structure
                const processTreeItems = async (
                    treeItems,
                    containerId: EntityId = widgetId
                ) => {
                    // Process root-level children if this is a widget
                    if (!treeItems[0]?.id.includes("/")) {
                        // This is a widget, process its children
                        if (treeItems[0]?.children?.length) {
                            await processTreeItems(
                                treeItems[0].children,
                                widgetId
                            );
                        }
                        return;
                    }

                    // Process each child in order
                    for (let i = 0; i < treeItems.length; i++) {
                        const item = treeItems[i];

                        // Skip if we've already processed this component
                        const [, componentId] = item.id.split("/") as [
                            string,
                            EntityId
                        ];
                        if (processedComponents.has(componentId)) continue;

                        // Mark as processed
                        processedComponents.add(componentId);

                        const component = widget.components.find(
                            (c) => c.id === componentId
                        );
                        if (!component) {
                            console.warn(
                                `Component ${componentId} not found in widget ${widgetId}`
                            );
                            continue;
                        }

                        // Get the previous component in the list for ordering
                        let targetId: EntityId | null = null;
                        let position: "before" | "after" = "after";

                        if (i > 0) {
                            // Get the previous component in the list
                            const [, prevComponentId] = treeItems[
                                i - 1
                            ].id.split("/") as [string, EntityId];
                            targetId = prevComponentId;
                            position = "after";
                        } else if (i === 0 && treeItems.length > 1) {
                            // First item - position before the next item
                            const [, nextComponentId] = treeItems[
                                i + 1
                            ].id.split("/") as [string, EntityId];
                            targetId = nextComponentId;
                            position = "before";
                        }

                        // Check if parent needs updating
                        const expectedParentId =
                            containerId === widgetId ? undefined : containerId;

                        if (component.parentId !== expectedParentId) {
                            // Move component to the new parent
                            console.log(
                                `Moving component ${componentId} to parent ${
                                    expectedParentId || "root"
                                }`
                            );
                            builderService.moveComponent(
                                widgetId,
                                componentId,
                                expectedParentId
                            );

                            // Explicitly notify about component movement
                            eventBus.publish("component:moved", {
                                widgetId,
                                componentId,
                                parentId: expectedParentId,
                            });
                        }

                        // Reorder within the container if we have a target
                        if (targetId && treeItems.length > 1) {
                            console.log(
                                `Reordering component ${componentId} to be ${position} ${targetId}`
                            );
                            builderService.reorderComponents(
                                widgetId,
                                containerId,
                                componentId,
                                targetId,
                                position
                            );

                            // Explicitly notify about component reordering
                            eventBus.publish("component:reordered", {
                                widgetId,
                                containerId,
                                componentId,
                                targetId,
                                position,
                            });
                        }

                        // Process children recursively if they exist
                        if (item.children && item.children.length > 0) {
                            await processTreeItems(item.children, componentId);
                        }
                    }
                };

                // Start the recursive processing
                await processTreeItems(items);

                // Notify about the hierarchy change
                eventBus.publish("hierarchy:changed", { widgetId });

                // Explicitly notify the widget to refresh
                eventBus.publish("widget:updated", {
                    widgetId,
                    action: "hierarchy-updated",
                });

                // Add DOM event for legacy components that might not use eventBus
                document.dispatchEvent(
                    new CustomEvent("widget-updated", {
                        detail: { widgetId, action: "hierarchy-updated" },
                    })
                );

                // Force re-render of components
                document.dispatchEvent(
                    new CustomEvent("component-hierarchy-changed", {
                        detail: { widgetId },
                    })
                );

                console.log("Tree move processing complete");

                // Force a refresh of the panel
                setForceRender((prev) => prev + 1);

                // Small delay before allowing new drags to ensure all updates are processed
                setTimeout(() => {
                    setIsProcessingDrag(false);
                }, 100);
            } catch (error) {
                console.error("Error processing tree move:", error);
                setIsProcessingDrag(false);
            }
        },
        [widgetStore, isProcessingDrag]
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
                    openPropertyPanel: true,
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
        // Clear the current hierarchy data to force refetch
        hierarchyDataRef.current = [];
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
