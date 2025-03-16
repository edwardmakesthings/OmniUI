import React, { useCallback } from "react";
import { EntityId } from "@/core/types/EntityTypes";
import componentOps from "@/features/builder/services/ComponentOperations";

interface DeleteButtonProps {
    componentId: EntityId;
    widgetId: EntityId;
    className?: string;
    position?: "topRight" | "topLeft" | "bottomRight" | "bottomLeft";
    size?: "sm" | "md" | "lg";
}

/**
 * A standalone delete button component that can be used to delete components.
 * Handles all its own events to prevent propagation issues.
 *
 * @param componentId The ID of the component to delete
 * @param widgetId The ID of the widget containing the component
 * @param className Optional additional classes
 * @param position Position of the button (default: topRight)
 * @param size Size of the button (default: md)
 */
export const DeleteButton: React.FC<DeleteButtonProps> = ({
    componentId,
    widgetId,
    className = "",
    position = "topRight",
    size = "md",
}) => {
    // Determine position styles
    const positionStyles = {
        topRight: { top: "4px", right: "4px" },
        topLeft: { top: "4px", left: "4px" },
        bottomRight: { bottom: "4px", right: "4px" },
        bottomLeft: { bottom: "4px", left: "4px" },
    }[position];

    // Determine size styles
    const sizeMap = {
        sm: { width: "16px", height: "16px", fontSize: "10px" },
        md: { width: "20px", height: "20px", fontSize: "12px" },
        lg: { width: "24px", height: "24px", fontSize: "14px" },
    }[size];

    // Handle delete with explicit event stopping
    const handleDelete = useCallback(
        (e: React.MouseEvent) => {
            // IMPORTANT: Stop all event propagation
            e.stopPropagation();
            e.preventDefault();

            console.log(
                `DeleteButton: Deleting component ${componentId} from widget ${widgetId}`
            );

            // Use ComponentOperationsService for deletion
            componentOps.deleteComponent(widgetId, componentId);
        },
        [componentId, widgetId]
    );

    return (
        <button
            className={`delete-button absolute bg-bg-dark bg-opacity-70 hover:bg-red-500 text-white rounded-full flex items-center justify-center z-50 ${className}`}
            onClick={handleDelete}
            // Stop ALL mouse events
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onMouseEnter={(e) => e.stopPropagation()}
            onMouseLeave={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            title="Delete component"
            style={{
                ...positionStyles,
                ...sizeMap,
                pointerEvents: "auto", // Ensure clicks are captured
            }}
            data-testid="delete-button"
        >
            ✕
        </button>
    );
};

export default DeleteButton;
