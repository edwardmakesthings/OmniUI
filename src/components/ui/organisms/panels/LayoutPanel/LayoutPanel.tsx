import { BasePanel } from "../BasePanel";
import { usePanelConfig } from "@/store/uiStore";
import { TreeView, TreeItem } from "@/components/ui/atoms/TreeView";
import { useWidgetStore } from "@/store/widgetStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EntityId } from "@/core/types/EntityTypes";
import { WidgetIcon } from "@/components/ui/icons";
import { componentIconMap } from "@/registry/componentRenderers";
import { PushButton } from "@/components/ui/atoms";
import { notifyWidgetChange } from "@/core/eventBus/widgetEvents";

// Default icon for types not in the map

const LayoutPanel = () => {
    const layoutHierarchyConfig = usePanelConfig("LAYOUT_HIERARCHY");
    const widgetStore = useWidgetStore();
    const widgets = widgetStore.getVisibleWidgets();

    // State for tracking selected items
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);
    const [forceRender, setForceRender] = useState(0);

    // Track initial expansion
    const initialExpansionRef = useRef(false);

    // Make the layout hierarchy store globally available for cross-component access
    useEffect(() => {
        // Create a global reference to this component's functionality
        window._layoutHierarchyStore = {
            selectItem: (id: string) => {
                setSelectedIds([id]);
            },
            getSelectedItems: () => selectedIds,
            refreshView: () => setForceRender((prev) => prev + 1),
        };

        return () => {
            delete window._layoutHierarchyStore;
        };
    }, [selectedIds]);

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
    }, []);

    // Create an event listener for widget updates
    useEffect(() => {
        const handleWidgetUpdate = (e: Event) => {
            // Safely cast to CustomEvent
            const customEvent = e as CustomEvent;
            console.log("Layout panel received event:", customEvent.detail);

            // Trigger a re-render
            setForceRender((prev) => prev + 1);

            // If there's a specific widget ID, we might want to auto-expand it
            if (customEvent.detail?.widgetId) {
                const { widgetId } = customEvent.detail;
                // Add to expanded IDs if not already expanded
                setExpandedIds((prev) => {
                    if (!prev.includes(widgetId)) {
                        return [...prev, widgetId];
                    }
                    return prev;
                });
            }
        };

        // Register this panel for events
        import("@/core/eventBus/widgetEvents").then((module) => {
            module.registerLayoutPanelForEvents();
        });

        // Add event listeners to multiple event types
        document.addEventListener("widget-updated", handleWidgetUpdate);
        document.addEventListener(
            "component-hierarchy-changed",
            handleWidgetUpdate
        );

        // Add directly to panel element too
        const panel = document.querySelector(
            '[data-panel-id="layout-hierarchy"]'
        );
        if (panel) {
            panel.addEventListener("widget-updated", handleWidgetUpdate);
            panel.addEventListener(
                "component-hierarchy-changed",
                handleWidgetUpdate
            );
        }

        return () => {
            document.removeEventListener("widget-updated", handleWidgetUpdate);
            document.removeEventListener(
                "component-hierarchy-changed",
                handleWidgetUpdate
            );
            if (panel) {
                panel.removeEventListener("widget-updated", handleWidgetUpdate);
                panel.removeEventListener(
                    "component-hierarchy-changed",
                    handleWidgetUpdate
                );
            }
        };
    }, []);

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
            notifyWidgetChange(widgetId, "hierarchyChanged");
        },
        [widgetStore]
    );

    // Handle selection
    const handleSelectionChange = useCallback(
        (ids: string[]) => {
            setSelectedIds(ids);

            // If a component is selected (format: widget-123/component-456)
            if (ids.length === 1 && ids[0].includes("/")) {
                // Extract widget and component IDs (format: widget-123/component-456)
                const [widgetId, componentId] = ids[0].split("/") as [
                    EntityId,
                    EntityId
                ];

                // Find the component instance and select it
                const widget = widgetStore.getWidget(widgetId);
                if (widget) {
                    const component = widget.components.find(
                        (c) => c.id === componentId
                    );
                    if (component) {
                        // Focus the widget and select the component in UI
                        widgetStore.setActiveWidget(widgetId);

                        // Find the component in DOM and trigger selection
                        const componentEl = document.querySelector(
                            `[data-widget-id="${widgetId}"] [data-component-id="${componentId}"]`
                        );
                        if (componentEl) {
                            (componentEl as HTMLElement).click();
                        }
                    }
                }
            }
        },
        [widgetStore]
    );

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
                    <div className="p-2 flex justify-end">
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
                        selectedIds={selectedIds}
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

// Add global type definition for layout hierarchy store
declare global {
    interface Window {
        _layoutHierarchyStore?: {
            selectItem: (id: string) => void;
            getSelectedItems: () => string[];
            refreshView: () => void;
        };
    }
}

export default LayoutPanel;
