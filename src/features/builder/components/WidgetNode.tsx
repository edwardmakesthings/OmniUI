import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import {
    useWidgetStore,
    Widget,
    WidgetComponent,
} from "@/features/builder/stores/widgetStore";
import { EntityId } from "@/core/types/EntityTypes";
import { Handle, Position as NodePosition } from "@xyflow/react";
import { ScrollBox } from "@/components/ui/atoms";
import { useComponentRegistry } from "@/registry";
import { useWidgetComponentChanges } from "@/features/builder/components/ComponentWithDragDrop";
import { useDragDropStyles } from "@/hooks/useDragDropStyles";
import { useWidgetDropTarget } from "../dragDrop/hooks/useWidgetDrop";
import eventBus from "@/core/eventBus/eventBus";
import { useEventSubscription } from "@/hooks/useEventBus";
import { cn } from "@/lib/utils";
import DropZoneIndicator from "./DropZoneIndicator";
import { DropPosition } from "../dragDrop";
import WidgetDropOverlay from "./WidgetDropOverlay";
import { useComponentSelection } from "@/hooks/useComponentSelection";

/**
 * Represents a widget node on the canvas
 * Handles widget-level operations and rendering of contained components
 *
 * @path src/features/builder/components/WidgetNode.tsx
 */
export const WidgetNode = memo(function WidgetNode({
    data,
    selected = false,
}: {
    data: Widget;
    selected?: boolean;
}) {
    // Access to stores
    const widgetStore = useWidgetStore();
    const registry = useComponentRegistry.getState();

    // Use the centralized selection hook instead of direct store access
    const selection = useComponentSelection({
        syncWithLayoutPanel: true,
        openPropertyPanel: true,
    });

    // Refs and state
    const [forceRender, setForceRender] = useState(0);
    const widgetRef = useRef<HTMLDivElement>(null);
    const prevDimensionsRef = useRef({
        width: data.size.width.value,
        height: data.size.height.value,
    });
    const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const autoResizeEnabledRef = useRef(true);

    // State for tracking drop completion
    const [_dropRefresh, setDropRefresh] = useState(0);

    // Get selected component from selection state
    const selectedComponentId = useMemo(
        () =>
            data.id === selection.selectedWidgetId
                ? selection.selectedComponentId
                : null,
        [data.id, selection.selectedComponentId, selection.selectedWidgetId]
    );

    /**
     * Triggers a re-render of the widget
     * Useful for component modifications that require UI updates
     */
    const refreshWidget = useCallback(() => {
        setForceRender((prev) => prev + 1);
    }, []);

    /**
     * Handle component addition to the widget
     */
    const handleComponentAdded = useCallback(
        (newComponentId: EntityId) => {
            // Use the centralized selection hook to select the new component
            selection.select(newComponentId, data.id);

            // Force re-render
            refreshWidget();
        },
        [data.id, selection, refreshWidget]
    );

    /**
     * Handle widget background click to deselect components
     * Using the centralized selection hook
     */
    const handleWidgetBackgroundClick = useCallback(
        (e: React.MouseEvent) => {
            // Use the centralized background click handler
            selection.handleWidgetBackgroundClick(data.id, e);
        },
        [data.id, selection]
    );

    /**
     * Handle component deletion using the centralized hook
     */
    const handleDeleteComponent = useCallback(
        (componentId: EntityId, e?: React.MouseEvent) => {
            // Use the centralized delete handler
            selection.deleteComponent(componentId, data.id, e);

            // Refresh the widget display
            refreshWidget();
        },
        [data.id, selection, refreshWidget]
    );

    // Set up drop target for widget background
    const { dropProps, isOver } = useWidgetDropTarget(
        data.id,
        data.isEditMode,
        handleComponentAdded
    );

    /**
     * Handle widget action button clicks (show, hide, toggle)
     */
    const handleAction = useCallback(
        (action: string, targetId?: EntityId) => {
            if (!targetId) return;

            switch (action) {
                case "show":
                    widgetStore.showWidget(targetId);
                    break;
                case "hide":
                    widgetStore.hideWidget(targetId);
                    break;
                case "toggle":
                    widgetStore.toggleWidget(targetId);
                    break;
            }

            // Publish event
            eventBus.publish("widget:updated", {
                widgetId: targetId,
                action,
            });
        },
        [widgetStore]
    );

    // Handle drop complete event
    const handleDropComplete = useCallback(() => {
        // Increment the counter to force a refresh
        setDropRefresh((prev) => prev + 1);

        // Refresh widget display
        refreshWidget();
    }, [refreshWidget]);

    /**
     * Toggle edit mode for the widget
     */
    const toggleEditMode = useCallback(() => {
        const newEditMode = !data.isEditMode;
        widgetStore.updateWidget(data.id, {
            isEditMode: newEditMode,
        });

        // If entering edit mode, enable autoresize; if exiting, disable it
        autoResizeEnabledRef.current = newEditMode;

        // Publish widget update event
        eventBus.publish("widget:updated", {
            widgetId: data.id,
            action: newEditMode ? "editModeEnabled" : "editModeDisabled",
        });
    }, [data.id, data.isEditMode, widgetStore]);

    // Subscribe to widget component changes and events
    useWidgetComponentChanges(data.id, refreshWidget);

    // Subscribe to relevant eventBus events
    useEventSubscription(
        "component:added",
        (event) => {
            if (event.data.widgetId === data.id) {
                refreshWidget();
            }
        },
        [data.id, refreshWidget]
    );

    useEventSubscription(
        "component:deleted",
        (event) => {
            if (event.data.widgetId === data.id) {
                refreshWidget();
            }
        },
        [data.id, refreshWidget]
    );

    useEventSubscription(
        "component:updated",
        (event) => {
            if (event.data.widgetId === data.id) {
                refreshWidget();
            }
        },
        [data.id, refreshWidget]
    );

    // Handle component moved events
    useEventSubscription(
        "component:moved",
        (event) => {
            if (event.data.widgetId === data.id) {
                refreshWidget();
            }
        },
        [data.id, refreshWidget]
    );

    // Ensure we're properly handling hierarchy changed events
    useEventSubscription(
        "hierarchy:changed",
        (event) => {
            if (event.data.widgetId === data.id) {
                refreshWidget();
            }
        },
        [data.id, refreshWidget]
    );

    // Get root components to render - using array order for siblings rather than z-index
    const rootComponents = useMemo(
        () => {
            // Get all root-level components (no parent)
            const roots = data.components.filter(
                (comp: WidgetComponent) => !comp.parentId
            );

            // Return in array order - no sorting by z-index
            // This preserves the order components were added to the widget
            return roots;
        },
        [data.components, forceRender] // Include forceRender to trigger recalculation
    );

    // Check if a component is selected
    const isComponentSelected = useCallback(
        (componentId: EntityId) => selection.isSelected(componentId),
        [selection]
    );

    /**
     * Render the widget content with its components
     * This uses the component registry to recursively render the component hierarchy
     */
    const { className, ...restDropProps } = dropProps || {};
    const renderWidgetContent = useCallback(
        () => (
            <div
                className="h-full widget-content-container rounded overflow-hidden"
                {...restDropProps}
                onClick={handleWidgetBackgroundClick}
            >
                <ScrollBox className="h-full widget-scroll-container">
                    <div className="flex flex-col gap-2 p-2 widget-components-container">
                        {rootComponents.length > 0 ? (
                            rootComponents.map((comp: WidgetComponent) =>
                                registry.renderComponentHierarchy(
                                    comp.instanceId,
                                    data.id,
                                    {
                                        isEditMode: data.isEditMode,
                                        isSelected: isComponentSelected(
                                            comp.id
                                        ),
                                        onSelect: (
                                            id: EntityId,
                                            e?: React.MouseEvent
                                        ) => selection.select(id, data.id, e),
                                        onDelete: handleDeleteComponent,
                                        actionHandler: handleAction,
                                        dragDropEnabled: data.isEditMode,
                                    },
                                    selectedComponentId
                                )
                            )
                        ) : (
                            <div className="text-font-dark-muted text-center p-4 italic">
                                {data.isEditMode
                                    ? "Drag components here to add them to the widget"
                                    : "This widget is empty"}
                            </div>
                        )}
                    </div>
                </ScrollBox>
            </div>
        ),
        [
            rootComponents,
            data.id,
            data.isEditMode,
            handleWidgetBackgroundClick,
            selection.select,
            handleDeleteComponent,
            handleAction,
            isComponentSelected,
            selectedComponentId,
            registry,
            dropProps,
        ]
    );

    // Load drag-drop styles
    useDragDropStyles();

    // Auto-sizing for widgets in edit mode
    useEffect(() => {
        // Only apply in edit mode and when auto-resize is enabled
        if (!data.isEditMode || !autoResizeEnabledRef.current) return;

        // Get widget element
        const widgetElement = widgetRef.current;
        if (!widgetElement) return;

        // Clear any existing timeout
        if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
        }

        // Set a timeout to prevent excessive updates
        resizeTimeoutRef.current = setTimeout(() => {
            const now = Date.now();
            const lastResizeTime = widgetElement.getAttribute(
                "data-last-resize-time"
            );

            // Skip if resized recently
            if (lastResizeTime && now - parseInt(lastResizeTime) < 500) {
                return;
            }

            // Find all components
            const allComponents = widgetElement.querySelectorAll(
                "[data-component-id]"
            );
            if (allComponents.length === 0) return;

            // Calculate bounds
            let maxRight = 0;
            let maxBottom = 0;
            const widgetRect = widgetElement.getBoundingClientRect();

            allComponents.forEach((comp) => {
                const rect = comp.getBoundingClientRect();
                const relBottom = rect.bottom - widgetRect.top;
                const relRight = rect.right - widgetRect.left;

                maxBottom = Math.max(maxBottom, relBottom);
                maxRight = Math.max(maxRight, relRight);
            });

            // Add padding
            const padding = 50;

            // Get current dimensions
            const currentWidth = data.size.width.value;
            const currentHeight = data.size.height.value;

            // Calculate new dimensions
            const newWidth = Math.min(
                Math.max(currentWidth, maxRight + padding),
                1280
            );
            const newHeight = Math.min(
                Math.max(currentHeight, maxBottom + padding),
                1280
            );

            // Minimum threshold for updates to avoid micro adjustments
            const widthDiff = Math.abs(
                newWidth - prevDimensionsRef.current.width
            );
            const heightDiff = Math.abs(
                newHeight - prevDimensionsRef.current.height
            );

            if (widthDiff > 10 || heightDiff > 10) {
                // Update ref
                prevDimensionsRef.current = {
                    width: newWidth,
                    height: newHeight,
                };

                // Update widget size
                widgetStore.updateWidget(data.id, {
                    size: {
                        width: { value: newWidth, unit: "px" },
                        height: { value: newHeight, unit: "px" },
                    },
                });

                // Store timestamp
                widgetElement.setAttribute(
                    "data-last-resize-time",
                    now.toString()
                );

                // Publish event
                eventBus.publish("widget:updated", {
                    widgetId: data.id,
                    action: "resized",
                });
            }
        }, 300);

        // Cleanup
        return () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, [
        data.isEditMode,
        data.id,
        data.size.width.value,
        data.size.height.value,
        forceRender,
        rootComponents.length,
        widgetStore,
    ]);

    // Set active widget when selected
    useEffect(() => {
        if (selected && data.id && selection.selectedWidgetId !== data.id) {
            // Use selection.selectWidget instead of direct store interaction
            selection.selectWidget(data.id);
        }
    }, [selected, data.id, selection]);

    // Add a special handler for cross-widget dragging states
    useEffect(() => {
        const handleDragStart = (e: Event) => {
            const dragEvent = e as DragEvent;

            try {
                // Try to get drag data to check if it's a component
                const dataString =
                    dragEvent.dataTransfer?.getData("application/json");
                if (!dataString) return;

                const dragData = JSON.parse(dataString);

                // Check if this is a component being dragged
                if (dragData.type === "component") {
                    // Get source widget ID
                    const sourceWidgetId =
                        dragData.widgetId || dragData.data?.widgetId;

                    // If source widget is different from this widget, mark as cross-widget drag
                    if (
                        sourceWidgetId &&
                        sourceWidgetId !== data.id &&
                        sourceWidgetId !== "palette"
                    ) {
                        // Add special class to enable drop highlighting
                        if (widgetRef.current) {
                            widgetRef.current.setAttribute(
                                "data-cross-widget-target",
                                "true"
                            );
                        }

                        // Enable edit mode temporarily if needed
                        if (!data.isEditMode) {
                            widgetRef.current?.setAttribute(
                                "data-temp-edit-mode",
                                "true"
                            );
                        }
                    }
                }
            } catch (error) {
                // Silently fail on parse errors
            }
        };

        const handleDragEnd = () => {
            // Clean up attributes
            if (widgetRef.current) {
                widgetRef.current.removeAttribute("data-cross-widget-target");

                // Restore original edit mode if needed
                if (widgetRef.current.hasAttribute("data-temp-edit-mode")) {
                    widgetRef.current.removeAttribute("data-temp-edit-mode");
                }
            }
        };

        // Add event listeners to detect the start and end of drags
        document.addEventListener("dragstart", handleDragStart);
        document.addEventListener("dragend", handleDragEnd);

        return () => {
            document.removeEventListener("dragstart", handleDragStart);
            document.removeEventListener("dragend", handleDragEnd);
        };
    }, [data.id, data.isEditMode]);

    const widgetClassNames = cn(
        "rounded shadow-lg widget-node",
        selected ? "outline outline-accent-dark-bright" : "",
        isOver ? "bg-accent-dark-neutral/20" : "",
        data.isEditMode ? "widget-edit-mode" : "widget-view-mode",
        // Add cross-widget drop target styling
        widgetRef.current?.hasAttribute("data-cross-widget-target")
            ? "cross-widget-drop-target"
            : "",
        widgetRef.current?.hasAttribute("data-temp-edit-mode")
            ? "temp-edit-mode"
            : ""
    );

    return (
        <>
            {/* ReactFlow connection handles (hidden) */}
            <Handle
                type="target"
                position={NodePosition.Top}
                style={{ visibility: "hidden" }}
            />

            {/* Widget container */}
            <div
                ref={widgetRef}
                className={widgetClassNames}
                style={{
                    width: data.size.width.value,
                    height: data.size.height.value,
                    minWidth: 300,
                    minHeight: 100,
                }}
                data-widget-id={data.id}
                data-edit-mode={data.isEditMode ? "true" : "false"}
                data-selected={selected ? "true" : "false"}
            >
                {/* Widget header */}
                <div className="flex justify-between items-center mb-0.25 drag-handle__widget">
                    <div className="text-xs text-font-dark-muted truncate max-w-[70%]">
                        {data.label}
                    </div>
                    <div className="flex gap-1">
                        <button
                            className={cn(
                                "text-xxs px-1 py-0.25 transition rounded",
                                "bg-accent-dark-neutral hover:bg-accent-dark-bright",
                                data.isEditMode ? "bg-accent-dark-bright" : ""
                            )}
                            onClick={toggleEditMode}
                            title={
                                data.isEditMode
                                    ? "Switch to view mode"
                                    : "Switch to edit mode"
                            }
                        >
                            {data.isEditMode ? "View" : "Edit"}
                        </button>
                    </div>
                </div>

                {/* Widget content - contains all components */}
                <div className="widget-content relative h-full">
                    {renderWidgetContent()}
                </div>

                {/* Drop indicator for when dragging over widget */}
                {isOver && data.isEditMode && (
                    <DropZoneIndicator
                        position={DropPosition.INSIDE}
                        isActive={true}
                        isContainer={true}
                        className="z-10"
                    />
                )}

                {/* Widget Drop Overlay - the key new component */}
                <WidgetDropOverlay
                    widgetId={data.id}
                    isEditMode={data.isEditMode}
                    onDropComplete={handleDropComplete}
                />
            </div>

            {/* ReactFlow connection handles (hidden) */}
            <Handle
                type="source"
                position={NodePosition.Bottom}
                style={{ visibility: "hidden" }}
            />
        </>
    );
});

export default WidgetNode;
