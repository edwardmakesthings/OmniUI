/**
 * Custom border-style node resizer component using ReactFlow's built-in resize functionality
 *
 * @path src/features/builder/components/BorderNodeResizer.tsx
 */
import { useCallback, useRef, useEffect } from "react";
import {
    NodeResizeControl,
    type NodeResizerProps,
    useReactFlow,
} from "@xyflow/react";
import { cn } from "@/lib/utils";

// Only use these positions for a left/right border-style resize
const BORDER_RESIZE_POSITIONS = ["left", "right"] as const;

interface BorderNodeResizerProps
    extends Omit<NodeResizerProps, "lineClassName" | "handleClassName"> {
    /** Additional class name for resize handles */
    className?: string;
    /** Only update width, keep the original height */
    preserveHeight?: boolean;
    /** Callback when resize is in progress */
    onResizeChange?: (width: number, height: number) => void;
    /** Callback when resize is complete */
    onResizeComplete?: (
        width: number,
        height: number,
        positionX?: number,
        positionY?: number
    ) => void;
}

/**
 * Border-style node resizer that uses ReactFlow's built-in resize functionality
 * Provides left and right border resize handles instead of corner handles
 */
export function BorderNodeResizer({
    nodeId,
    isVisible = true,
    color = "var(--accent-dark-bright, #4a90e2)",
    minWidth = 300,
    minHeight = 100,
    maxWidth = 1280,
    maxHeight = 1280,
    keepAspectRatio = false,
    className,
    preserveHeight = true,
    onResizeChange,
    onResizeComplete,
    onResizeStart,
    onResize,
    onResizeEnd,
    ...rest
}: BorderNodeResizerProps) {
    // Get the ReactFlow instance
    const reactFlow = useReactFlow();

    // Reference to store resize info during the operation
    const resizeInfoRef = useRef<{
        position: string | null;
        initialWidth: number | null;
        initialPositionX: number | null;
        initialPositionY: number | null;
        isResizing: boolean;
    }>({
        position: null,
        initialWidth: null,
        initialPositionX: null,
        initialPositionY: null,
        isResizing: false,
    });

    // Handle resize start
    const handleResizeStart = useCallback(
        (event: any, params: any) => {
            // Get current node data from ReactFlow
            if (!nodeId) return;
            const node = reactFlow.getNode(nodeId);

            if (node) {
                // Store initial position and dimensions
                resizeInfoRef.current = {
                    position: params.position,
                    initialWidth: node.width ?? null,
                    initialPositionX: node.position.x,
                    initialPositionY: node.position.y,
                    isResizing: true,
                };
            }

            // Call the original onResizeStart if provided
            if (onResizeStart) {
                onResizeStart(event, params);
            }
        },
        [onResizeStart, nodeId, reactFlow]
    );

    // Handle resize while dragging to provide live updates
    const handleResize = useCallback(
        (event: any, params: any) => {
            // If not actively resizing, ignore
            if (!resizeInfoRef.current.isResizing) return;

            // Preserve the original height if requested
            if (preserveHeight) {
                params = {
                    ...params,
                    height: params.nodeHeight,
                };
            }

            // Call the onResizeChange callback to update the UI during resize
            if (onResizeChange) {
                onResizeChange(params.width, params.height);
            }

            // Call the original onResize if provided
            if (onResize) {
                onResize(event, params);
            }
        },
        [onResize, onResizeChange, preserveHeight]
    );

    const handleResizeEnd = useCallback(
        (event: any, params: any) => {
            // If not actively resizing or no nodeId, ignore
            if (!resizeInfoRef.current.isResizing || !nodeId) return;

            // Get the current node data from ReactFlow
            const node = reactFlow.getNode(nodeId);

            if (node) {
                // Get the final dimensions and position from the node
                const finalWidth = node.width || params.width;
                const finalHeight = preserveHeight
                    ? node.height || params.nodeHeight
                    : params.height;
                const finalPositionX = node.position.x;
                const finalPositionY = node.position.y;

                // Call onResizeComplete with the current dimensions and position
                if (onResizeComplete) {
                    onResizeComplete(
                        finalWidth,
                        finalHeight,
                        finalPositionX,
                        finalPositionY
                    );
                }

                // Call the original onResizeEnd if provided
                if (onResizeEnd) {
                    // Include the position information
                    onResizeEnd(event, {
                        ...params,
                        width: finalWidth,
                        height: finalHeight,
                        position: resizeInfoRef.current.position,
                        x: finalPositionX,
                        y: finalPositionY,
                    });
                }
            } else {
                // Fallback if node not found
                if (onResizeComplete) {
                    onResizeComplete(params.width, params.height);
                }

                if (onResizeEnd) {
                    onResizeEnd(event, params);
                }
            }

            // Reset the resize info
            resizeInfoRef.current = {
                position: null,
                initialWidth: null,
                initialPositionX: null,
                initialPositionY: null,
                isResizing: false,
            };
        },
        [onResizeEnd, onResizeComplete, preserveHeight, nodeId, reactFlow]
    );

    // Clean up on unmount
    useEffect(() => {
        return () => {
            resizeInfoRef.current = {
                position: null,
                initialWidth: null,
                initialPositionX: null,
                initialPositionY: null,
                isResizing: false,
            };
        };
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <>
            {BORDER_RESIZE_POSITIONS.map((position) => (
                <NodeResizeControl
                    key={position}
                    nodeId={nodeId}
                    position={position}
                    className={cn(
                        "border-node-resize-control",
                        position,
                        className
                    )}
                    color="transparent" // Use transparent color for the built-in control
                    minWidth={minWidth}
                    minHeight={minHeight}
                    maxWidth={maxWidth}
                    maxHeight={maxHeight}
                    keepAspectRatio={keepAspectRatio}
                    onResizeStart={handleResizeStart}
                    onResize={handleResize}
                    onResizeEnd={handleResizeEnd}
                    {...rest}
                />
            ))}
        </>
    );
}

export default BorderNodeResizer;
