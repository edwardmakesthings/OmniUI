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
import "@/styles/borderResize.css";
import BorderNodeResizer from "./BorderNodeResizer";

/**
 * Represents a widget node on the canvas with resize functionality
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

    // State for tracking drop completion
    const [_dropRefresh, setDropRefresh] = useState(0);

    // Track temporary size during resize
    const [tempSize, setTempSize] = useState<{
        width: number;
        height: number;
    } | null>(null);

    // Track which handle is being used
    const [activeHandle, setActiveHandle] = useState<string | null>(null);

    // Track initial width for calculating position changes
    const initialWidthRef = useRef<number>(0);

    // Handle resize start to capture which handle is being used
    const handleResizeStart = useCallback(
        (_event: any, params: any) => {
            // Store which handle is being used
            setActiveHandle(params.position);

            // Store initial width for reference
            initialWidthRef.current = data.size.width.value;
        },
        [data.size.width.value]
    );

    // Handle live resize updates
    const handleResizeChange = useCallback(
        (width: number, _height: number) => {
            // Store temporary size for immediate visual feedback
            setTempSize({ width, height: data.size.height.value });
        },
        [data.size.height.value]
    );

    // Handle widget resize completion with ReactFlow's built-in resize system
    const handleResizeComplete = useCallback(
        (
            width: number,
            _height: number,
            positionX?: number,
            positionY?: number
        ) => {
            // Clear temporary size
            setTempSize(null);

            // Prepare update data for our widget store
            const updateData: any = {
                size: {
                    width: { value: width, unit: "px" },
                    height: data.size.height,
                },
            };

            // If we received a position from the resizer component, use it
            if (positionX !== undefined && positionY !== undefined) {
                updateData.position = {
                    x: { value: positionX, unit: "px" },
                    y: { value: positionY, unit: "px" },
                };
            }
            // Fall back to our calculated position if ReactFlow data isn't available
            else if (activeHandle === "left") {
                // Calculate the position change based on width change
                const widthDelta = initialWidthRef.current - width;
                updateData.position = {
                    x: {
                        value: data.position.x.value + widthDelta,
                        unit: "px",
                    },
                    y: data.position.y,
                };
            }

            // Reset active handle
            setActiveHandle(null);

            // Update widget
            widgetStore.updateWidget(data.id, updateData);

            // Publish resize event
            eventBus.publish("widget:updated", {
                widgetId: data.id,
                action: "resized",
            });
        },
        [
            data.id,
            data.position.x.value,
            data.position.y,
            data.size.height,
            widgetStore,
            activeHandle,
        ]
    );

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
                    width: tempSize ? tempSize.width : data.size.width.value,
                    height: data.size.height.value,
                    minWidth: 300,
                    minHeight: 100,
                    position: "relative",
                }}
                data-widget-id={data.id}
                data-edit-mode={data.isEditMode ? "true" : "false"}
                data-selected={selected ? "true" : "false"}
            >
                {/* Border Node Resizer - only visible in edit mode */}
                {data.isEditMode && (
                    <BorderNodeResizer
                        nodeId={data.id}
                        minWidth={300}
                        minHeight={100}
                        preserveHeight={true}
                        onResizeStart={handleResizeStart}
                        onResizeChange={handleResizeChange}
                        onResizeComplete={handleResizeComplete}
                    />
                )}

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
