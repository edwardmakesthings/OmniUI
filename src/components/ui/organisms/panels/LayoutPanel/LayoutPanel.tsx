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
import { layoutComponentIconMap as componentIconMap } from "@/registry/componentRenderers";
import { EntityId } from "@/core/types/EntityTypes";
import { useWidgetStore } from "@/features/builder/stores/widgetStore";
import { useDragTracking, usePanelConfig } from "@/store/uiStore";
import { useComponentSelection } from "@/hooks/useComponentSelection";
import { useEventSubscription } from "@/hooks/useEventBus";
import { builderService } from "@/store";
import eventBus from "@/core/eventBus/eventBus";
import { IconProps } from "@/lib/icons/types";
import { cn } from "@/lib/utils";

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

    /**
     * Enhanced drag data getter for the TreeView
     * Ensures widget information is properly included
     */
    const getDragData = useCallback((item: TreeItemData) => {
        // Check if this is a widget node (id will be just the widget ID without a slash)
        if (!item.id.includes("/")) {
            return {
                widgetId: item.id,
                isWidget: true,
                canDrag: false, // Widgets shouldn't be draggable
                canDrop: true,
                label: item.label,
                ...item.data,
            };
        }

        // This is a component node (format: widgetId/componentId)
        const [widgetId, componentId] = item.id.split("/");
        return {
            widgetId,
            componentId,
            isComponent: true,
            label: item.label,
            type: item.type,
            ...item.data,
        };
    }, []);

    /**
     * Enhanced getDropData function for TreeView
     * Important for determining valid drop targets
     */
    const getDropData = useCallback(
        (item: TreeItemData, draggedItem?: TreeItemData | null) => {
            // Check if this is a widget node (id will be just the widget ID without a slash)
            const isWidget = !item.id.includes("/");

            // Create base result object
            const result = {
                canAcceptDrop: true,
                id: item.id,
                isWidget,
                isComponent: !isWidget,
                label: item.label,
                ...item.data,
            };

            // Add more detailed info if it's a widget
            if (isWidget) {
                const widget = useWidgetStore
                    .getState()
                    .getWidget(item.id as EntityId);
                if (widget) {
                    // Add widget-specific info
                    return {
                        ...result,
                        isEmpty: widget.components.length === 0,
                        canAcceptDrop: true, // Widgets can always accept drops
                        forcedDropPosition: "inside" as const, // Always drop inside widgets
                        dropClassName: cn(
                            "widget-drop-target",
                            widget.components.length === 0 &&
                                "empty-widget-drop-zone"
                        ),
                        widgetLabel: widget.label || "Widget",
                    };
                }
            }

            // If not a widget, it's a component - check if it can accept children
            const canAcceptChildren =
                item.canDrop !== false &&
                (item.type === "Panel" ||
                    item.type === "ScrollBox" ||
                    item.type === "Container");

            // Prevent dropping if this isn't a container component
            if (!isWidget && !canAcceptChildren) {
                return {
                    ...result,
                    canAcceptDrop: false,
                    reason: "This component cannot contain other components",
                };
            }

            // Prevent self-drop
            if (draggedItem && item.id === draggedItem.id) {
                return {
                    ...result,
                    canAcceptDrop: false,
                    reason: "Cannot drop onto itself",
                };
            }

            // Prevent circular references
            if (
                draggedItem &&
                draggedItem.id &&
                isCircularDrop(draggedItem.id, item.id)
            ) {
                return {
                    ...result,
                    canAcceptDrop: false,
                    reason: "Cannot create circular structure",
                };
            }

            return result;
        },
        [useWidgetStore]
    );

    /**
     * Helper function to check if a drop would create a circular structure
     */
    const isCircularDrop = useCallback(
        (sourceId: string, targetId: string): boolean => {
            // If source or target are not components, no circular reference is possible
            if (!sourceId.includes("/") || !targetId.includes("/")) {
                return false;
            }

            // Parse the IDs
            const [sourceWidgetId, sourceComponentId] = sourceId.split("/");
            const [targetWidgetId, targetComponentId] = targetId.split("/");

            // If they're in different widgets, no circular reference is possible
            if (sourceWidgetId !== targetWidgetId) {
                return false;
            }

            // Get the widget
            const widget = useWidgetStore
                .getState()
                .getWidget(sourceWidgetId as EntityId);
            if (!widget) return false;

            // Function to check if a component is in the ancestry chain of another
            const isAncestor = (
                descendantId: string,
                ancestorId: string,
                visited = new Set<string>()
            ): boolean => {
                // Prevent infinite recursion
                if (visited.has(descendantId)) {
                    return false;
                }

                // Add to visited set
                visited.add(descendantId);

                // Find component
                const component = widget.components.find(
                    (c) => c.id === descendantId
                );
                if (!component) return false;

                // If its parent is the ancestor, we have a circular reference
                if (component.parentId === ancestorId) {
                    return true;
                }

                // If no parent, not an ancestor
                if (!component.parentId) {
                    return false;
                }

                // Check parent recursively
                return isAncestor(component.parentId, ancestorId, visited);
            };

            // Check if target is an ancestor of source
            return isAncestor(sourceComponentId, targetComponentId);
        },
        [useWidgetStore]
    );

    /**
     * Enhanced tree move handler that properly validates drops
     */
    const handleTreeMove = useCallback(
        async (draggedIdOrItems: string | TreeItemData[]) => {
            // Prevent concurrent operations
            if (isProcessingDrag || operationInProgressRef.current) return;

            try {
                setIsProcessingDrag(true);
                operationInProgressRef.current = true;

                // Set operation status for feedback
                setLastOperation("Processing drag operation...");

                // Only process complete tree updates
                if (typeof draggedIdOrItems === "string") {
                    console.log(
                        "Direct TreeItem drag not supported, waiting for TreeView update"
                    );
                    return;
                }

                // Get the updated hierarchy from TreeView
                const updatedHierarchy = draggedIdOrItems;

                // Add validation before rebuilding
                const isValid = validateHierarchy(updatedHierarchy);
                if (!isValid) {
                    console.error(
                        "Invalid hierarchy detected - aborting update"
                    );
                    setLastOperation(
                        "Invalid operation - cannot create circular references"
                    );
                    forceRefresh(); // Refresh to revert UI to previous state
                    return;
                }

                // Mark the time we started the update
                const updateStartTime = Date.now();
                setLastOperation("Rebuilding component hierarchy...");

                // Use builderService to completely rebuild the widget hierarchy
                const result =
                    builderService.rebuildComponentHierarchyFromTree(
                        updatedHierarchy
                    );

                if (result.success) {
                    const updateDuration = Date.now() - updateStartTime;
                    setLastOperation(
                        `Updated successfully in ${updateDuration}ms`
                    );
                    console.log(
                        `Successfully updated ${result.data?.widgetsUpdated} widgets`
                    );
                } else {
                    setLastOperation(
                        `Error: ${result.error?.message || "Unknown error"}`
                    );
                    console.error(
                        "Failed to rebuild component hierarchy:",
                        result.error
                    );
                }

                // Force a refresh to update the UI after a brief delay
                await new Promise((resolve) => setTimeout(resolve, 50));
                forceRefresh();

                console.log("[Layout] Hierarchy sync completed successfully");
            } catch (error) {
                console.error("[Layout] Error synchronizing hierarchy:", error);
                setLastOperation(
                    `Error: ${
                        error instanceof Error ? error.message : "Unknown error"
                    }`
                );
            } finally {
                // Prevent rapid re-triggers with slight delay
                setTimeout(() => {
                    setIsProcessingDrag(false);
                    operationInProgressRef.current = false;
                }, 300);
            }
        },
        [isProcessingDrag, forceRefresh, setLastOperation]
    );

    /**
     * Validates a hierarchy structure to detect issues before applying
     */
    const validateHierarchy = useCallback(
        (treeData: TreeItemData[]): boolean => {
            // Track all seen IDs to detect circular references
            const seenIds = new Set<string>();

            // Helper to check if an item is valid
            const validateItem = (
                item: TreeItemData,
                parentChain: string[] = []
            ): boolean => {
                // Skip non-component nodes or widget nodes (they can't create circular refs)
                if (!item.id) return true;

                // Skip widget nodes
                if (!item.id.includes("/")) return true;

                // Check for circular reference - a node cannot be its own ancestor
                if (parentChain.includes(item.id)) {
                    console.error(
                        `Invalid hierarchy: Circular reference detected for ${item.id}`
                    );
                    return false;
                }

                // Track this ID
                if (seenIds.has(item.id)) {
                    console.error(
                        `Invalid hierarchy: Duplicate node ID ${item.id}`
                    );
                    return false;
                }
                seenIds.add(item.id);

                // Validate children
                if (item.children && item.children.length) {
                    // Widget nodes can always contain components
                    if (!item.id.includes("/")) {
                        // Simply validate all children (widgets can accept any components)
                        for (const child of item.children) {
                            if (
                                !validateItem(child, [...parentChain, item.id])
                            ) {
                                return false;
                            }
                        }
                    }
                    // Component nodes need to check if they can contain children
                    else {
                        // Check if this component can accept children
                        if (item.canDrop === false) {
                            console.error(
                                `Invalid hierarchy: Component ${item.id} cannot accept children`
                            );
                            return false;
                        }

                        // Validate each child with the updated parent chain
                        const newParentChain = [...parentChain, item.id];
                        for (const child of item.children) {
                            if (!validateItem(child, newParentChain)) {
                                return false;
                            }
                        }
                    }
                }

                return true;
            };

            // Validate each top-level node
            for (const node of treeData) {
                if (!validateItem(node)) {
                    return false;
                }
            }

            return true;
        },
        []
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

    /**
     * Build tree data with enhanced widget drop targets
     * Ensures widgets have the correct canDrop property and visual indicators
     */
    const treeData = useMemo(() => {
        // Use pre-fetched data if available
        if (hierarchyDataRef.current.length > 0) {
            // Enhance the data to ensure widgets are properly marked as drop targets
            return hierarchyDataRef.current.map((node) => {
                // Identify widget nodes by checking if they don't have a slash in the ID
                if (!node.id.includes("/")) {
                    return {
                        ...node,
                        canDrop: true, // Always allow drops onto widgets
                        data: {
                            ...node.data,
                            isWidget: true,
                            isEmpty:
                                !node.children || node.children.length === 0,
                        },
                        className: "widget-tree-node",
                        dropClassName: "widget-drop-target",
                    };
                }
                return node;
            });
        }

        // Fallback with enhanced widget nodes
        return widgets.map((widget) => ({
            id: widget.id,
            label: widget.label || "Widget",
            icon: SafeWidgetIcon,
            canDrop: true, // Widgets can always accept drops
            canDrag: false, // Widgets themselves shouldn't be draggable
            className: "widget-tree-node",
            dropClassName: "widget-drop-target",
            data: {
                isWidget: true,
                isEmpty: widget.components.length === 0,
                widgetId: widget.id,
            },
            children: [],
        }));
    }, [widgets, forceRender, SafeWidgetIcon]);

    // Add these style rules to your component or global CSS
    const treeStyles = `
.widget-tree-node {
    font-weight: 600;
    padding: 4px;
    border-radius: 4px;
    background-color: rgba(59, 130, 246, 0.05);
    border-left: 2px solid rgba(59, 130, 246, 0.5);
}

.widget-drop-target {
    background-color: rgba(59, 130, 246, 0.2) !important;
    border: 1px dashed #3b82f6 !important;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

/* Empty widgets appear more inviting for drops */
.tree-item[data-is-empty="true"] {
    background-color: rgba(59, 130, 246, 0.05);
    border: 1px dashed rgba(59, 130, 246, 0.3);
}

/* For component nodes that can accept drops */
.tree-item[data-can-drop="true"]::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: rgba(34, 197, 94, 0.5);
}
`;

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
                        className={"overflow-y-auto " + treeStyles}
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
