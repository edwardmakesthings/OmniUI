/**
 * @file components/ui/organisms/panels/LayoutPanel/LayoutPanel.tsx
 * Component for displaying and manipulating the layout hierarchy.
 * Handles component movement, selection, and hierarchy visualization.
 */
import {
    ComponentType,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { BasePanel } from "../BasePanel";
import { PushButton } from "@/components/ui/atoms";
import { TreeItemData, TreeView } from "@/components/ui/atoms/TreeView";
import { WidgetIcon } from "@/components/ui/icons";
import { componentIconMap } from "@/registry/componentRenderers";
import { EntityId } from "@/core/types/EntityTypes";
import { useWidgetStore } from "@/features/builder/stores/widgetStore";
import { useDragTracking, usePanelConfig } from "@/store/uiStore";
import { useComponentSelection } from "@/hooks/useComponentSelection";
import { useEventSubscription } from "@/hooks/useEventBus";
import { builderService } from "@/store";
import eventBus from "@/core/eventBus/eventBus";
import { IconProps } from "@/lib/icons/types";

const LayoutPanel = () => {
    // Config and stores
    const layoutHierarchyConfig = usePanelConfig("LAYOUT_HIERARCHY");

    // Selection handling
    const selection = useComponentSelection({
        syncWithLayoutPanel: false, // Prevent infinite syncing loops
    });

    // Drag state from UI store
    const { startDrag, updateDragTarget, endDrag } = useDragTracking();

    // State
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [forceRender, setForceRender] = useState(0);
    const [isProcessingDrag, setIsProcessingDrag] = useState(false);
    const [lastOperation, setLastOperation] = useState<string | null>(null);

    // Refs
    const initialExpansionRef = useRef(false);
    const hierarchyDataRef = useRef<any[]>([]);
    const lastUpdateTimeRef = useRef<number>(0);
    const operationInProgressRef = useRef(false);
    const refreshQueuedRef = useRef(false);
    const lastForceRefreshTimeRef = useRef<number>(0);

    // Memoized data
    const widgets = useWidgetStore.getState().getVisibleWidgets();

    // Track currently selected tree item
    const selectedTreeItem = useMemo(() => {
        const { selectedComponentId, selectedWidgetId } = selection;
        if (!selectedComponentId || !selectedWidgetId) return null;
        return `${selectedWidgetId}/${selectedComponentId}`;
    }, [selection.selectedComponentId, selection.selectedWidgetId]);

    // Refresh functions
    const debouncedRefresh = useCallback(() => {
        const now = Date.now();
        // Ensure we don't refresh too often
        if (now - lastUpdateTimeRef.current > 200) {
            lastUpdateTimeRef.current = now;
            setForceRender((prev) => prev + 1);
        } else if (!refreshQueuedRef.current) {
            // Queue a refresh if we can't do it now
            refreshQueuedRef.current = true;
            setTimeout(() => {
                lastUpdateTimeRef.current = Date.now();
                setForceRender((prev) => prev + 1);
                refreshQueuedRef.current = false;
            }, 250);
        }
    }, []);

    const forceRefresh = useCallback(() => {
        lastUpdateTimeRef.current = Date.now();
        lastForceRefreshTimeRef.current = Date.now();
        hierarchyDataRef.current = []; // Clear hierarchy data to force complete refresh
        setForceRender((prev) => prev + 1);
    }, []);

    // Tree drag event handlers
    const handleTreeDragStart = useCallback(
        (draggedId: string, dragData: any) => {
            console.log(`Tree drag started: ${draggedId}`, dragData);

            // Reset operation state before starting a new drag
            operationInProgressRef.current = false;
            setLastOperation(null);

            // Extract widget and component IDs
            let sourceWidgetId: EntityId | undefined;
            let sourceComponentId: EntityId | undefined;

            if (draggedId.includes("/")) {
                [sourceWidgetId, sourceComponentId] = draggedId.split("/") as [
                    EntityId,
                    EntityId
                ];
            } else {
                sourceWidgetId = draggedId as EntityId;
            }

            // Start drag tracking in UIStore
            startDrag({
                sourceId: draggedId,
                sourceWidgetId,
                sourceComponentId,
                dragType: "layout-hierarchy",
            });
        },
        [startDrag]
    );

    const handleTreeDragOver = useCallback(
        (targetId: string, _data: any) => {
            // Extract widget and component IDs
            let targetWidgetId: EntityId | undefined;
            let targetComponentId: EntityId | undefined;

            if (targetId.includes("/")) {
                [targetWidgetId, targetComponentId] = targetId.split("/") as [
                    EntityId,
                    EntityId
                ];
            } else {
                targetWidgetId = targetId as EntityId;
            }

            // Update drag target info
            updateDragTarget({
                targetId,
                targetWidgetId,
                targetComponentId,
            });
        },
        [updateDragTarget]
    );

    const handleTreeDragEnd = useCallback(() => {
        // End drag tracking
        endDrag();
    }, [endDrag]);

    // Function to find parent in tree structure
    const findParentInTree = useCallback(
        (items: TreeItemData[], childId: string): string | null => {
            for (const item of items) {
                // Check if this item is the parent
                if (item.children?.some((child) => child.id === childId)) {
                    return item.id;
                }

                // Check children recursively
                if (item.children?.length) {
                    const parent = findParentInTree(item.children, childId);
                    if (parent) return parent;
                }
            }
            return null;
        },
        []
    );

    // Data extraction helpers
    const getDragData = useCallback((item: TreeItemData) => {
        if (item.id.includes("/")) {
            const [widgetId, componentId] = item.id.split("/");
            return { widgetId, componentId, ...item.data };
        }
        return { widgetId: item.id, ...item.data };
    }, []);

    const getDropData = useCallback(
        (item: TreeItemData) => {
            return getDragData(item);
        },
        [getDragData]
    );

    // Create Widget icon fallback
    const SafeWidgetIcon = useMemo(() => {
        // Try icon from component map
        const IconFromMap = componentIconMap?.Widget as
            | ComponentType<IconProps>
            | undefined;

        if (IconFromMap && typeof IconFromMap === "function") {
            return IconFromMap;
        }

        if (WidgetIcon && typeof WidgetIcon === "function") {
            return WidgetIcon;
        }

        // Fallback
        return (props: IconProps) => (
            <div
                style={{
                    width: props.size || 16,
                    height: props.size || 16,
                    backgroundColor: "currentColor",
                    borderRadius: 2,
                    opacity: 0.5,
                }}
                {...props}
            />
        );
    }, []);

    /**
     * Handle TreeView item moves by synchronizing the widget store with the updated tree structure.
     * This directly rebuilds the component hierarchy from the TreeView data.
     */
    const handleTreeMove = useCallback(
        async (draggedIdOrItems: string | TreeItemData[]) => {
            // Prevent concurrent operations
            if (isProcessingDrag || operationInProgressRef.current) return;

            try {
                setIsProcessingDrag(true);
                operationInProgressRef.current = true;

                // Only process complete tree updates
                if (typeof draggedIdOrItems === "string") {
                    console.log(
                        "Direct TreeItem drag not supported, waiting for TreeView update"
                    );
                    return;
                }

                // Get the updated hierarchy from TreeView
                const updatedHierarchy = draggedIdOrItems;

                // Use builderService to completely rebuild the widget hierarchy
                const result =
                    builderService.rebuildComponentHierarchyFromTree(
                        updatedHierarchy
                    );

                if (result.success) {
                    console.log(
                        `Successfully updated ${result.data?.updatedWidgets} widgets`
                    );
                } else {
                    console.error(
                        "Failed to rebuild component hierarchy:",
                        result.error
                    );
                }

                // Force a refresh to update the UI
                await new Promise((resolve) => setTimeout(resolve, 100));
                forceRefresh();

                console.log("[Layout] Hierarchy sync completed successfully");
            } catch (error) {
                console.error("[Layout] Error synchronizing hierarchy:", error);
            } finally {
                // Prevent rapid re-triggers
                setTimeout(() => {
                    setIsProcessingDrag(false);
                    operationInProgressRef.current = false;
                }, 300);
            }
        },
        [isProcessingDrag, forceRefresh]
    );

    // Handle selection change
    const handleSelectionChange = useCallback(
        (ids: string[]) => {
            if (!ids.length) {
                selection.deselect();
                return;
            }

            const selectedId = ids[0];

            // Handle component selection (format: widgetId/componentId)
            if (selectedId.includes("/")) {
                const [widgetId, componentId] = selectedId.split("/") as [
                    EntityId,
                    EntityId
                ];
                selection.select(componentId, widgetId);
            } else {
                // Just a widget selected
                selection.selectWidget(selectedId as EntityId);
            }
        },
        [selection]
    );

    // Handle deletion
    const handleDeleteComponent = useCallback(() => {
        selection.deleteSelected();
    }, [selection]);

    // Handle manual refresh
    const handleManualRefresh = useCallback(() => {
        hierarchyDataRef.current = [];
        lastUpdateTimeRef.current = 0;
        console.log(widgets);
        forceRefresh();
        eventBus.publish("layout:refreshed", { timestamp: Date.now() });
    }, [forceRefresh]);

    // Mark panel with data attribute
    useEffect(() => {
        const panelElement = document.querySelector(".layout-hierarchy-panel");
        if (panelElement) {
            panelElement.setAttribute("data-panel-id", "layout-hierarchy");
        }
    }, []);

    // Auto-expand widgets on initial render
    useEffect(() => {
        if (initialExpansionRef.current || !widgets.length) return;

        initialExpansionRef.current = true;
        const widgetIds = widgets.map((w) => w.id);
        setExpandedIds(widgetIds);
    }, [widgets]);

    // Handle store reset events
    useEventSubscription(
        "store:reset",
        () => {
            // Clear hierarchy data and force refresh
            hierarchyDataRef.current = [];
            lastUpdateTimeRef.current = 0;
            initialExpansionRef.current = false;
            setExpandedIds([]);
            setForceRender(0);
            operationInProgressRef.current = false;
            refreshQueuedRef.current = false;
            setIsProcessingDrag(false);
            setLastOperation(null);
            forceRefresh();
        },
        [forceRefresh]
    );

    // Subscribe to events for refreshing
    useEventSubscription(
        "widget:updated",
        (event) => {
            // Force refresh for hierarchy updates
            if (event.data?.action === "hierarchy-updated") {
                forceRefresh();
            } else {
                debouncedRefresh();
            }

            // Auto-expand updated widget
            if (event.data?.widgetId) {
                setExpandedIds((prev) => {
                    if (!prev.includes(event.data.widgetId)) {
                        return [...prev, event.data.widgetId];
                    }
                    return prev;
                });
            }
        },
        [debouncedRefresh, forceRefresh]
    );

    // Subscribe to instance repaired events
    useEventSubscription(
        "component:instanceRepaired",
        (event) => {
            console.info(
                `Component instance repaired: ${event.data.instanceId}, refreshing hierarchy`
            );

            // Refresh but with less priority than not found
            debouncedRefresh();
        },
        [debouncedRefresh]
    );

    useEventSubscription(
        "hierarchy:changed",
        (event) => {
            if (
                event.data?.action === "hierarchy-rebuilt" ||
                event.data?.action === "component-moved"
            ) {
                console.info(
                    `Hierarchy changed with action ${event.data.action}, forcing refresh`
                );
                forceRefresh();
            } else {
                debouncedRefresh();
            }
        },
        [forceRefresh, debouncedRefresh]
    );

    useEventSubscription(
        "component:added",
        (event) => {
            forceRefresh();

            // Auto-expand parent
            if (event.data?.widgetId) {
                setExpandedIds((prev) => {
                    let newExpanded = [...prev];

                    // Add widget ID if needed
                    if (!newExpanded.includes(event.data.widgetId)) {
                        newExpanded.push(event.data.widgetId);
                    }

                    // Add parent component ID if applicable
                    if (event.data.parentId) {
                        const parentItemId = `${event.data.widgetId}/${event.data.parentId}`;
                        if (!newExpanded.includes(parentItemId)) {
                            newExpanded.push(parentItemId);
                        }
                    }

                    return newExpanded;
                });
            }
        },
        [forceRefresh]
    );

    // Subscribe to additional events
    useEventSubscription("component:deleted", forceRefresh, [forceRefresh]);
    useEventSubscription("component:updated", debouncedRefresh, [
        debouncedRefresh,
    ]);
    useEventSubscription("hierarchy:changed", forceRefresh, [forceRefresh]);
    useEventSubscription("component:reordered", forceRefresh, [forceRefresh]);
    useEventSubscription("component:moved", forceRefresh, [forceRefresh]);

    // Fetch widget hierarchies
    useEffect(() => {
        if (widgets.length === 0) {
            hierarchyDataRef.current = [];
            return;
        }

        // Skip repeated fetches, but ALWAYS fetch after a forceRefresh
        const now = Date.now();
        if (
            now - lastUpdateTimeRef.current < 100 &&
            hierarchyDataRef.current.length > 0 &&
            hierarchyDataRef.current.length === widgets.length &&
            lastForceRefreshTimeRef.current < lastUpdateTimeRef.current
        ) {
            return;
        }

        lastUpdateTimeRef.current = now;

        const fetchHierarchies = async () => {
            try {
                const widgetStore = useWidgetStore.getState();
                const results = [];

                // Process each widget individually with error handling
                for (const widget of widgets) {
                    try {
                        const hierarchy =
                            await widgetStore.getComponentHierarchy(
                                widget.id,
                                { debug: false } // Only enable debug when needed
                            );

                        if (hierarchy && hierarchy.length > 0) {
                            results.push(hierarchy[0]);
                        }
                    } catch (error) {
                        console.error(
                            `Error fetching hierarchy for widget ${widget.id}:`,
                            error
                        );

                        // Add a fallback hierarchy instead of failing
                        results.push({
                            id: widget.id,
                            type: "Widget",
                            label: widget.label || "Widget",
                            icon: SafeWidgetIcon,
                            canDrop: true,
                            canDrag: false,
                            children: [],
                        });
                    }
                }

                if (results.length > 0 || hierarchyDataRef.current.length > 0) {
                    hierarchyDataRef.current = results;
                    setForceRender((prev) => prev + 1);
                }
            } catch (error) {
                console.error("Error fetching hierarchies:", error);
                // Don't update hierarchy data on error, keep existing data
            }
        };

        fetchHierarchies();
    }, [widgets, forceRender, SafeWidgetIcon]);

    // Build tree data
    const treeData = useMemo(() => {
        // Use pre-fetched data if available
        if (hierarchyDataRef.current.length > 0) {
            return hierarchyDataRef.current;
        }

        // Fallback
        return widgets.map((widget) => ({
            id: widget.id,
            label: widget.label || "Widget",
            icon: SafeWidgetIcon,
            children: [],
            canDrop: true,
            canDrag: false,
        }));
    }, [widgets, forceRender, SafeWidgetIcon]);

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
                            disabled={!selection.selectedComponentId}
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

                    {/* Status indicator for debugging */}
                    {process.env.NODE_ENV !== "production" && (
                        <div className="text-xs p-1 bg-accent-dark-neutral/20 mx-2 rounded">
                            Last Operation: {lastOperation}
                        </div>
                    )}

                    <TreeView
                        items={treeData}
                        selectedIds={selectedTreeItem ? [selectedTreeItem] : []}
                        expandedIds={expandedIds}
                        maxHeight="calc(100vh - 70px)"
                        className="overflow-y-auto"
                        onSelectionChange={handleSelectionChange}
                        onExpansionChange={setExpandedIds}
                        onMove={handleTreeMove}
                        onDragStart={handleTreeDragStart}
                        onDragOver={handleTreeDragOver}
                        onDragEnd={handleTreeDragEnd}
                        getDragData={getDragData}
                        getDropData={getDropData}
                    />
                </>
            )}
        </BasePanel>
    );
};

export default LayoutPanel;
