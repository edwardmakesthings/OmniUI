/**
 * @file components/ui/organisms/panels/LayoutPanel/LayoutPanel.tsx
 * Component for displaying and manipulating the layout hierarchy.
 */

import { BasePanel } from "../BasePanel";
import { usePanelConfig } from "@/store/uiStore";
import { TreeItemData, TreeView } from "@/components/ui/atoms/TreeView";
import { useWidgetStore } from "@/features/builder/stores/widgetStore";
import {
    ComponentType,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { EntityId } from "@/core/types/EntityTypes";
import { WidgetIcon } from "@/components/ui/icons";
import { componentIconMap } from "@/registry/componentRenderers";
import { PushButton } from "@/components/ui/atoms";
import { useEventSubscription } from "@/hooks/useEventBus";
import eventBus from "@/core/eventBus/eventBus";
import { builderService } from "@/store";
import { IconProps } from "@/lib/icons/types";
import { useComponentSelection } from "@/hooks/useComponentSelection";

const LayoutPanel = () => {
    const layoutHierarchyConfig = usePanelConfig("LAYOUT_HIERARCHY");
    const widgetStore = useWidgetStore();

    // Use centralized selection hook
    const selection = useComponentSelection({
        syncWithLayoutPanel: false, // Prevent infinite syncing loops
    });

    const widgets = widgetStore.getVisibleWidgets();

    // State for tracking expanded items in tree view
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [forceRender, setForceRender] = useState(0);
    const [isProcessingDrag, setIsProcessingDrag] = useState(false);

    // Track initial expansion
    const initialExpansionRef = useRef(false);
    const hierarchyDataRef = useRef<any[]>([]);
    const lastWidgetUpdateRef = useRef<number>(0);

    // This will capture the drag data to detect cross-widget operations
    const dragDataRef = useRef<{
        sourceId?: string;
        targetId?: string;
        dragInProgress: boolean;
    }>({
        dragInProgress: false,
    });

    // Get selected component info from selection hook
    const selectedTreeItem = useMemo(() => {
        const { selectedComponentId, selectedWidgetId } = selection;
        if (!selectedComponentId || !selectedWidgetId) return null;

        // Format: widgetId/componentId
        return `${selectedWidgetId}/${selectedComponentId}`;
    }, [selection.selectedComponentId, selection.selectedWidgetId]);

    // Make the layout hierarchy store globally available for cross-component access
    useEffect(() => {
        // Create a global reference to this component's functionality
        window._layoutHierarchyStore = {
            selectItem: (id: EntityId | null) => {
                // Handle widget-only selection
                if (id && !id.includes("/")) {
                    // Use selection hook to select widget
                    selection.selectWidget(id as EntityId);
                    return;
                }

                // Handle component selection (format: widgetId/componentId)
                if (id) {
                    const [widgetId, componentId] = id.split("/") as [
                        EntityId,
                        EntityId
                    ];
                    selection.select(componentId, widgetId);
                } else {
                    // Handle deselection
                    selection.deselect();
                }
            },
            getSelectedItems: () => {
                const { selectedComponentId, selectedWidgetId } = selection;
                if (!selectedComponentId || !selectedWidgetId) return [];
                return [`${selectedWidgetId}/${selectedComponentId}`];
            },
            refreshView: (force = false) => {
                if (force) {
                    // Use force refresh for critical updates
                    forceRefresh();
                } else {
                    // Use debounced refresh for regular updates
                    debouncedRefresh();
                }
            },
        };

        return () => {
            delete window._layoutHierarchyStore;
        };
    }, [selection]);

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

    // Add effect to listen for tree view drag events
    useEffect(() => {
        const handleTreeDragStart = (e: CustomEvent) => {
            if (e.detail && e.detail.sourceId) {
                // Store drag source information
                dragDataRef.current = {
                    sourceId: e.detail.sourceId,
                    dragInProgress: true,
                };
                console.log("Tree drag started:", e.detail.sourceId);
            }
        };

        const handleTreeDragOver = (e: CustomEvent) => {
            if (
                e.detail &&
                e.detail.targetId &&
                dragDataRef.current.dragInProgress
            ) {
                // Update target information
                dragDataRef.current.targetId = e.detail.targetId;
            }
        };

        const handleTreeDragEnd = () => {
            // Reset drag data after processing
            setTimeout(() => {
                dragDataRef.current = { dragInProgress: false };
            }, 300); // Short delay to ensure handleTreeMove has access to the data
        };

        // Add event listeners - assumes TreeView dispatches these custom events
        document.addEventListener(
            "treeview-drag-start",
            handleTreeDragStart as EventListener
        );
        document.addEventListener(
            "treeview-drag-over",
            handleTreeDragOver as EventListener
        );
        document.addEventListener(
            "treeview-drag-end",
            handleTreeDragEnd as EventListener
        );

        return () => {
            document.removeEventListener(
                "treeview-drag-start",
                handleTreeDragStart as EventListener
            );
            document.removeEventListener(
                "treeview-drag-over",
                handleTreeDragOver as EventListener
            );
            document.removeEventListener(
                "treeview-drag-end",
                handleTreeDragEnd as EventListener
            );
        };
    }, []);

    // Debounced refresh function to prevent excessive re-renders
    const debouncedRefresh = useCallback(() => {
        const now = Date.now();
        if (now - lastWidgetUpdateRef.current > 200) {
            lastWidgetUpdateRef.current = now;
            setForceRender((prev) => prev + 1);
        }
    }, []);

    // Force refresh that bypasses debouncing for critical updates
    const forceRefresh = useCallback(() => {
        lastWidgetUpdateRef.current = Date.now();
        // Clear hierarchy data to force a complete refresh
        hierarchyDataRef.current = [];
        setForceRender((prev) => prev + 1);
    }, []);

    // Handle widget updates
    useEventSubscription(
        "widget:updated",
        (event) => {
            console.log("Layout panel received widget update:", event.data);

            // Use force refresh for hierarchy updates
            if (event.data?.action === "hierarchy-updated") {
                forceRefresh();
            } else {
                debouncedRefresh();
            }

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
        [debouncedRefresh, forceRefresh]
    );

    // Handle component addition
    useEventSubscription(
        "component:added",
        (event) => {
            // Component additions should trigger a more aggressive refresh
            forceRefresh();

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
        [forceRefresh]
    );

    // Handle component deletion
    useEventSubscription(
        "component:deleted",
        () => {
            console.log("Layout panel received component delete event");
            // Component deletions should also trigger a full refresh
            forceRefresh();
        },
        [forceRefresh]
    );

    // Handle component updates
    useEventSubscription(
        "component:updated",
        () => {
            console.log("Layout panel received component update event");
            debouncedRefresh();
        },
        [debouncedRefresh]
    );

    // Handle hierarchy changes
    useEventSubscription(
        "hierarchy:changed",
        () => {
            console.log("Layout panel received hierarchy change event");
            // Hierarchy changes are critical and need a full refresh
            forceRefresh();
        },
        [forceRefresh]
    );

    // Handle component reordering
    useEventSubscription(
        "component:reordered",
        () => {
            console.log("Layout panel received component reorder event");
            // Component reordering needs a full refresh
            forceRefresh();
        },
        [forceRefresh]
    );

    // Fetch all widget hierarchies asynchronously
    useEffect(() => {
        // Skip if there are no widgets
        if (widgets.length === 0) {
            // Clear hierarchy data when there are no widgets
            hierarchyDataRef.current = [];
            return;
        }

        // Skip repeated fetches too close together, unless hierarchy data is empty
        const now = Date.now();
        if (
            now - lastWidgetUpdateRef.current < 100 &&
            hierarchyDataRef.current.length > 0 &&
            hierarchyDataRef.current.length === widgets.length
        ) {
            return;
        }

        lastWidgetUpdateRef.current = now;
        console.log(
            "Fetching hierarchies for widgets:",
            widgets.map((w) => w.id).join(", ")
        );

        const fetchAllHierarchies = async () => {
            try {
                const hierarchies = await Promise.all(
                    widgets.map(async (widget) => {
                        try {
                            const hierarchy =
                                await widgetStore.getComponentHierarchy(
                                    widget.id
                                );
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

                // Only update if we have data or if we previously had data that needs clearing
                if (
                    validHierarchies.length > 0 ||
                    hierarchyDataRef.current.length > 0
                ) {
                    console.log(
                        `Updating hierarchy data: ${validHierarchies.length} hierarchies found`
                    );
                    hierarchyDataRef.current = validHierarchies;

                    // Safely trigger re-render without causing infinite loops
                    setForceRender((prev) => prev + 1);
                }
            } catch (error) {
                console.error("Error fetching hierarchies:", error);
            }
        };

        fetchAllHierarchies();
    }, [widgets, widgetStore, forceRefresh]);

    // Create a safe fallback icon component
    const SafeWidgetIcon = useMemo(() => {
        // Try to get icon from component map first
        const IconFromMap = componentIconMap?.Widget as
            | ComponentType<IconProps>
            | undefined;

        // If we have a valid component in the map, use it
        if (IconFromMap && typeof IconFromMap === "function") {
            return IconFromMap;
        }

        // If WidgetIcon is a valid component, use it
        if (WidgetIcon && typeof WidgetIcon === "function") {
            return WidgetIcon;
        }

        // Last resort fallback - create a simple box icon component
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

    // Build tree data for widgets and their components
    const treeData = useMemo(() => {
        // Use the pre-fetched hierarchy data if available
        if (hierarchyDataRef.current.length > 0) {
            return hierarchyDataRef.current;
        }

        console.log(widgets);

        // Default fallback if hierarchy data isn't available yet
        return widgets.map((widget) => ({
            id: widget.id,
            label: widget.label || "Widget",
            icon: SafeWidgetIcon,
            children: [],
            canDrop: true,
            canDrag: false,
        }));
    }, [widgets, forceRender, SafeWidgetIcon]);

    // Handle tree item movement - completely rewritten to use array-based ordering
    const handleTreeMove = useCallback(
        async (items: TreeItemData[]) => {
            if (isProcessingDrag || !items.length || !items[0].id) return;

            setIsProcessingDrag(true);

            try {
                // Find the modified widget (first level items are widgets)
                const widgetId = items[0].id.split("/")[0] as EntityId;
                const widget = widgetStore.getWidget(widgetId);
                if (!widget) {
                    console.error("Widget not found:", widgetId);
                    setIsProcessingDrag(false);
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
                    treeItems: TreeItemData[],
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

                console.log("Tree move processing complete");

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
                selection.deselect();
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

                // Use centralized selection hook
                selection.select(componentId, widgetId);
            } else {
                // Just a widget selected, no component
                selection.selectWidget(selectedId as EntityId);
            }
        },
        [selection]
    );

    // Delete selected component
    const handleDeleteComponent = useCallback(() => {
        selection.deleteSelected();
    }, [selection]);

    // Manual refresh button handler
    const handleManualRefresh = useCallback(() => {
        // Clear the current hierarchy data to force refetch
        hierarchyDataRef.current = [];

        // Reset update timestamp to force refresh
        lastWidgetUpdateRef.current = 0;

        // Trigger re-render
        setForceRender((prev) => prev + 1);

        // Also dispatch an event to notify other parts of the app
        eventBus.publish("layout:refreshed", { timestamp: Date.now() });
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
