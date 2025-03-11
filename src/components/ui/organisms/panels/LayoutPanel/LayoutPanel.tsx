import { BasePanel } from "../BasePanel";
import { usePanelConfig } from "@/store/uiStore";
import { TreeView, TreeItem } from "@/components/ui/atoms/TreeView";
import { useWidgetStore } from "@/store/widgetStore";
import { useCallback, useMemo, useState } from "react";
import { EntityId } from "@/core/types/EntityTypes";
import {
    PanelIcon,
    InputIcon,
    ButtonIcon,
    WidgetIcon,
} from "@/components/ui/icons";
import { IconProps } from "@/lib/icons/types";

// Map component types to icons
const componentIconMap: Record<string, React.FC<IconProps>> = {
    Widget: WidgetIcon,
    Panel: PanelIcon,
    ScrollBox: PanelIcon,
    PushButton: ButtonIcon,
    Input: InputIcon,
    Label: InputIcon,
    // Add more mappings as needed
};

// Default icon for types not in the map
const DefaultComponentIcon = PanelIcon;

const LayoutPanel = () => {
    const layoutHierarchyConfig = usePanelConfig("LAYOUT_HIERARCHY");
    const widgetStore = useWidgetStore();
    const widgets = widgetStore.getVisibleWidgets();

    // State for tracking selected items
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    // Build tree data for widgets and their components
    const treeData = useMemo(() => {
        return widgets.map((widget) => {
            // Get the component hierarchy for this widget
            const hierarchy = widgetStore.getComponentHierarchy(widget.id);

            // Convert to tree format
            return {
                id: widget.id,
                label: widget.label || "Widget",
                icon: PanelIcon,
                children: hierarchy,
                canDrop: false, // Widgets are top-level, can't be nested
            };
        });
    }, [widgets, widgetStore]);

    // Enhanced function to handle tree item move operations
    const handleTreeMove = useCallback(
        (items) => {
            // Extract widget ID from the first element to find which widget we're working with
            if (!items.length || !items[0].id) return;

            // The first-level items are widgets, so find which one contains our moved components
            const widgetId = items[0].id;
            const widget = widgetStore.getWidget(widgetId as EntityId);
            if (!widget) return;

            // Process the updated tree structure to update component hierarchy
            const processUpdatedHierarchy = (
                treeItems,
                parentId = undefined
            ) => {
                treeItems.forEach((item, index) => {
                    // Convert tree IDs to component IDs if needed
                    const itemParts = item.id.includes("/")
                        ? item.id.split("/")
                        : [widgetId, item.id];
                    const componentId = itemParts[1] as EntityId;

                    // Skip widget items
                    if (itemParts.length < 2) {
                        // This is a widget item, process its children
                        if (item.children) {
                            processUpdatedHierarchy(item.children);
                        }
                        return;
                    }

                    // Find the component in the widget
                    const component = widget.components.find(
                        (c) => c.id === componentId
                    );
                    if (!component) return;

                    // If parent changed, update the widget store
                    if (component.parentId !== parentId) {
                        console.log(
                            `Moving component ${componentId} to parent ${
                                parentId || "ROOT"
                            }`
                        );

                        // Use the moveComponent function from widget store
                        widgetStore.moveComponent(
                            widgetId,
                            componentId,
                            parentId
                        );

                        // Update zIndex to match the order in the tree
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

            // Start processing from the root
            processUpdatedHierarchy(items);
        },
        [widgetStore]
    );

    // Handle selection
    const handleSelectionChange = useCallback(
        (ids: string[]) => {
            setSelectedIds(ids);

            // If a component is selected, focus the widget and select the component
            if (ids.length === 1) {
                // Extract widget and component IDs (format: widget-123/component-456)
                const parts = ids[0].split("/");
                if (parts.length === 2) {
                    const widgetId = parts[0];
                    const componentId = parts[1];

                    // Focus the widget and select the component
                    widgetStore.setActiveWidget(widgetId as EntityId);
                    // If you have a selection mechanism in widgets:
                    // widgetStore.selectComponent(widgetId as EntityId, componentId as EntityId);
                }
            }
        },
        [widgetStore]
    );

    return (
        <BasePanel {...layoutHierarchyConfig}>
            <h2 className="text-lg font-bold p-3 border-b border-accent-dark-neutral">
                Layout Hierarchy
            </h2>

            {widgets.length === 0 ? (
                <div className="p-4 text-center text-font-dark-muted">
                    No widgets available
                </div>
            ) : (
                <TreeView
                    items={treeData}
                    selectedIds={selectedIds}
                    expandedIds={expandedIds}
                    onSelectionChange={handleSelectionChange}
                    onExpansionChange={setExpandedIds}
                    onMove={handleTreeMove}
                    maxHeight="calc(100vh - 60px)"
                />
            )}
        </BasePanel>
    );
};

export default LayoutPanel;
