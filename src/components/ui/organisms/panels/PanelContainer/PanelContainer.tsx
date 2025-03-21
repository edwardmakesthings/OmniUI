/**
 * Resizable panel container component
 * Handles resizing for a group of panels in a specific position
 *
 * @path src/components/ui/organisms/panels/PanelContainer/PanelContainer.tsx
 */
import React, { useCallback, useState } from "react";
import { PanelPosition, PanelPositionValues } from "@/core/types/UI";
import { ResizeDirection, useResizable } from "@/hooks/useResizable";
import { cn } from "@/lib/utils";
import "@/styles/resizable.css";

export interface PanelContainerProps {
    /** Position of the panel container (left, right, bottom, top) */
    position: PanelPosition;
    /** Children components (panels) */
    children: React.ReactNode;
    /** Default width or height in pixels */
    defaultSize?: number;
    /** Minimum size in pixels */
    minSize?: number;
    /** Maximum size in pixels */
    maxSize?: number;
    /** Additional CSS classes */
    className?: string;
    /** Whether the container should take full height (for left/right) or full width (for top/bottom) */
    shouldStretch?: boolean;
}

/**
 * Container component that provides resizing functionality for panel groups
 */
const PanelContainer: React.FC<PanelContainerProps> = ({
    position,
    children,
    defaultSize = 320,
    minSize = 200,
    maxSize = 600,
    className = "",
    shouldStretch = true,
}) => {
    const [size, setSize] = useState(defaultSize);

    // Determine which resize directions to enable based on position
    const getResizeDirections = (): ResizeDirection[] => {
        switch (position) {
            case PanelPositionValues.Left:
                return [ResizeDirection.RIGHT];
            case PanelPositionValues.Right:
                return [ResizeDirection.LEFT];
            case PanelPositionValues.Bottom:
                return [ResizeDirection.TOP];
            case PanelPositionValues.Top:
                return [ResizeDirection.BOTTOM];
            default:
                return [];
        }
    };

    // Handle resize operations
    const handleResize = useCallback(
        (width: number, height: number) => {
            // Determine which dimension to update based on panel position
            if (
                position === PanelPositionValues.Bottom ||
                position === PanelPositionValues.Top
            ) {
                setSize(height);
            } else {
                setSize(width);
            }
        },
        [position]
    );

    // Set up resizable behavior
    const { containerProps, handles, isResizing } = useResizable({
        directions: getResizeDirections(),
        minWidth: minSize,
        maxWidth: maxSize,
        minHeight: minSize,
        maxHeight: maxSize,
        enabled: true,
        onResize: handleResize,
    });

    // Define positioning classes based on position
    const positionClasses = {
        [PanelPositionValues.Left]: "left-0 border-r-2",
        [PanelPositionValues.Right]: "right-0 border-l-2",
        [PanelPositionValues.Bottom]: "bottom-0 border-t-2",
        [PanelPositionValues.Top]: "top-0 border-b-2",
    };

    // Define stretch classes based on position and shouldStretch
    const stretchClass = shouldStretch
        ? position === PanelPositionValues.Bottom ||
          position === PanelPositionValues.Top
            ? "w-screen"
            : "h-screen"
        : "";

    // Define styles based on position
    const containerStyle: React.CSSProperties = {
        ...(position === PanelPositionValues.Bottom ||
        position === PanelPositionValues.Top
            ? { height: size }
            : { width: size }),
        position: "relative",
    };

    return (
        <div
            {...containerProps}
            className={cn(
                "bg-bg-dark text-font-dark border-accent-dark-neutral",
                positionClasses[position],
                stretchClass,
                className,
                isResizing ? "resizing-container" : ""
            )}
            style={containerStyle}
            data-panel-position={position}
        >
            {/* Panel content */}
            <div className="w-full h-full overflow-hidden">{children}</div>

            {/* Resize handles */}
            {Object.values(handles).map(
                (handleProps) =>
                    handleProps.style.display !== "none" && (
                        <div
                            key={handleProps.direction}
                            ref={handleProps.ref}
                            className={handleProps.className}
                            style={handleProps.style}
                            onMouseDown={handleProps.eventHandlers.onMouseDown}
                            data-resize-handle={handleProps.direction}
                        />
                    )
            )}
        </div>
    );
};

export default PanelContainer;
