import {
    DragEvent,
    useCallback,
    useRef,
    useState,
    CSSProperties,
    FC,
    useEffect,
} from "react";
import { EntityId } from "@/core/types/EntityTypes";
import {
    widgetOverlayManager,
    DropTargetInfo,
} from "../dragDrop/WidgetOverlayManager";
import { useDragDrop } from "../dragDrop/DragDropCore";
import { cn } from "@/lib/utils";
import { Position } from "@/core/types/Geometry";

interface WidgetDropOverlayProps {
    widgetId: EntityId;
    isEditMode: boolean;
    onDropComplete?: () => void;
}

/**
 * An invisible overlay that covers the entire widget and handles all drag-drop operations
 * This provides a unified approach to drop detection and handling.
 *
 * @path src/features/builder/components/WidgetDropOverlay.tsx
 */
export const WidgetDropOverlay: FC<WidgetDropOverlayProps> = ({
    widgetId,
    isEditMode,
    onDropComplete,
}) => {
    // Track the current drop target
    const [currentTarget, setCurrentTarget] = useState<DropTargetInfo | null>(
        null
    );
    const [isOver, setIsOver] = useState(false);

    // Track the global drag state
    const isDragging = useDragDrop((state) => state.isDragging);
    const dragSource = useDragDrop((state) => state.dragSource);

    // Use a ref for the overlay element
    const overlayRef = useRef<HTMLDivElement>(null);

    // Track mouse position for more accurate handling
    const [_mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Debug information
    const [debugInfo, setDebugInfo] = useState<string>("");

    // Handle drag over the overlay
    const handleDragOver = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            if (!isEditMode) return;

            e.preventDefault();
            e.stopPropagation();

            // Set the drop effect
            e.dataTransfer.dropEffect = "move";

            // Update mouse position
            setMousePosition({ x: e.clientX, y: e.clientY });

            // Find the best drop target at this position
            const target = widgetOverlayManager.findDropTargetAtPosition(
                widgetId,
                e.clientX,
                e.clientY
            );

            // Only update if target changed (to reduce unnecessary rerenders)
            if (
                !currentTarget ||
                currentTarget.componentId !== target.componentId ||
                currentTarget.position !== target.position
            ) {
                // Update the manager and local state
                widgetOverlayManager.updateDropTarget(target);
                setCurrentTarget(target);
                setIsOver(true);

                // Debug info
                setDebugInfo(
                    JSON.stringify(
                        {
                            targetId: target.componentId || "widget",
                            position: target.position,
                            container: target.isContainer,
                        },
                        null,
                        2
                    )
                );
            }
        },
        [widgetId, isEditMode, currentTarget]
    );

    // Handle drag leave events
    const handleDragLeave = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            // Check if actually leaving the widget area
            if (overlayRef.current) {
                const rect = overlayRef.current.getBoundingClientRect();

                // Only count as a leave if actually exiting the widget bounds
                if (
                    e.clientX < rect.left ||
                    e.clientX > rect.right ||
                    e.clientY < rect.top ||
                    e.clientY > rect.bottom
                ) {
                    // Clear current state
                    widgetOverlayManager.clearCurrentIndicators();
                    setCurrentTarget(null);
                    setIsOver(false);
                    setDebugInfo("");
                    // Ensure there are no lingering drop indicators
                    const allElements = document.querySelectorAll(
                        `[data-widget-id="${widgetId}"] [data-component-id]`
                    );
                    allElements.forEach((element) => {
                        if (element instanceof HTMLElement) {
                            element.setAttribute("data-drop-before", "false");
                            element.setAttribute("data-drop-after", "false");
                            element.setAttribute("data-drop-inside", "false");
                            element.classList.remove("drop-highlight");
                        }
                    });
                }
            }
        },
        [widgetId]
    );

    // Handle drop events
    const handleDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            if (!isEditMode) return;

            e.preventDefault();
            e.stopPropagation();

            try {
                // Get the drag data
                const dragDataStr = e.dataTransfer.getData("application/json");
                if (!dragDataStr) return;

                const dragData = JSON.parse(dragDataStr);

                // Calculate exact position for the drop
                const dropPosition: Position = {
                    x: {
                        value:
                            e.clientX -
                            (overlayRef.current?.getBoundingClientRect().left ||
                                0),
                        unit: "px",
                    },
                    y: {
                        value:
                            e.clientY -
                            (overlayRef.current?.getBoundingClientRect().top ||
                                0),
                        unit: "px",
                    },
                };

                // Handle the drop through the manager
                const success = widgetOverlayManager.handleDrop(
                    dragData.data || dragData,
                    dragData.type,
                    dropPosition
                );

                if (success) {
                    console.log("Drop successful");

                    // Notify about completion
                    if (onDropComplete) {
                        onDropComplete();
                    }
                }
            } catch (error) {
                console.error("Error handling drop:", error);
            } finally {
                // Always clear state
                widgetOverlayManager.clearCurrentIndicators();
                setCurrentTarget(null);
                setIsOver(false);
                setDebugInfo("");
            }
        },
        [widgetId, isEditMode, onDropComplete]
    );

    // Clean up when component unmounts
    useEffect(() => {
        return () => {
            widgetOverlayManager.clearCurrentIndicators();
        };
    }, []);

    // Only show overlay during drag operations in edit mode
    if (!isDragging || !isEditMode) {
        return null;
    }

    // Check if this drag can be dropped
    const canDrop =
        dragSource?.type === "component-definition" ||
        (dragSource?.type === "component" &&
            dragSource.data?.widgetId === widgetId);

    // Styles for the overlay - invisible but captures events
    const overlayStyle: CSSProperties = {
        position: "absolute",
        inset: 0,
        backgroundColor: isOver ? "rgba(59, 130, 246, 0.05)" : "transparent",
        pointerEvents: "auto", // Capture events during drag
        zIndex: 1000, // Make sure it's above everything else
        cursor: canDrop ? (isOver ? "copy" : "grab") : "no-drop",
        transition: "background-color 0.2s ease",
    };

    // Render the overlay
    return (
        <div
            ref={overlayRef}
            className={cn(
                "widget-drop-overlay",
                isOver && "widget-drop-overlay-active"
            )}
            style={overlayStyle}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-widget-id={widgetId}
            data-is-overlay="true"
            data-drop-active={isOver ? "true" : "false"}
            data-can-drop={canDrop ? "true" : "false"}
            data-debug-info={debugInfo}
        >
            {/* Optional debugging overlay */}
            {process.env.NODE_ENV === "development" && isOver && (
                <div className="absolute top-2 right-2 bg-bg-dark bg-opacity-70 text-white text-xs p-1 rounded">
                    {currentTarget?.componentId
                        ? `Target: ${currentTarget.componentId}`
                        : "Target: Widget"}
                    <br />
                    Position: {currentTarget?.position}
                </div>
            )}
        </div>
    );
};

export default WidgetDropOverlay;
