/**
 * Custom hook for making components resizable via edge dragging
 * Supports different resize directions based on component requirements
 *
 * @path src/hooks/useResizable.ts
 */
import { useCallback, useEffect, useRef, useState } from 'react';

export enum ResizeDirection {
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top',
    BOTTOM = 'bottom',
}

export interface ResizeOptions {
    /** Minimum width in pixels */
    minWidth?: number;
    /** Maximum width in pixels */
    maxWidth?: number;
    /** Minimum height in pixels */
    minHeight?: number;
    /** Maximum height in pixels */
    maxHeight?: number;
    /** Allowed resize directions */
    directions?: ResizeDirection[];
    /** Whether resize is enabled */
    enabled?: boolean;
    /** Callback when size changes, receives new width, height and position offset */
    onResize?: (width: number, height: number, positionOffset?: { x: number, y: number }) => void;
}

export interface ResizeHandleProps {
    /** CSS class to apply to the handle */
    className: string;
    /** Inline styles for the handle */
    style: React.CSSProperties;
    /** Element reference */
    ref: React.RefObject<HTMLDivElement>;
    /** Event handlers for the handle */
    eventHandlers: {
        onMouseDown: (e: React.MouseEvent) => void;
    };
    /** Direction of the resize handle */
    direction: ResizeDirection;
    /** Whether resize is currently active */
    isActive: boolean;
}

export interface ResizableResult {
    /** Props to spread on the container element */
    containerProps: {
        ref: React.RefObject<HTMLDivElement>;
    };
    /** Resize handles for each enabled direction */
    handles: Record<ResizeDirection, ResizeHandleProps>;
    /** Whether any resize operation is in progress */
    isResizing: boolean;
}

/**
 * Hook to enable resize functionality on a component
 *
 * @param options Resize configuration options
 * @returns Resize handles and props for the container
 */
export const useResizable = (options: ResizeOptions): ResizableResult => {
    // Default options
    const {
        minWidth = 100,
        maxWidth = Number.MAX_SAFE_INTEGER, // No practical limit by default
        minHeight = 50,
        maxHeight = Number.MAX_SAFE_INTEGER, // No practical limit by default
        directions = [ResizeDirection.RIGHT],
        enabled = true,
        onResize,
    } = options;

    // Refs for elements
    const containerRef = useRef<HTMLDivElement>(null);
    const leftHandleRef = useRef<HTMLDivElement>(null);
    const rightHandleRef = useRef<HTMLDivElement>(null);
    const topHandleRef = useRef<HTMLDivElement>(null);
    const bottomHandleRef = useRef<HTMLDivElement>(null);

    // State tracking
    const [activeDirection, setActiveDirection] = useState<ResizeDirection | null>(null);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 });

    // Store information about initial drag
    const dragInfoRef = useRef({
        initialRect: null as DOMRect | null,
        cursorOffsetRight: 0, // Distance from cursor to right edge when starting drag
        cursorOffsetLeft: 0,  // Distance from cursor to left edge when starting drag
    });

    // Handle start of resize operation
    const handleResizeStart = useCallback((e: React.MouseEvent, direction: ResizeDirection) => {
        if (!enabled || !containerRef.current) return;

        // Prevent text selection during resize
        e.preventDefault();

        // Set active direction
        setActiveDirection(direction);

        // Store initial mouse position
        setStartPosition({ x: e.clientX, y: e.clientY });

        // Store initial element dimensions and get exact cursor offsets
        const rect = containerRef.current.getBoundingClientRect();
        setStartDimensions({ width: rect.width, height: rect.height });

        // Store the initial rectangle and cursor offsets for more precise calculations
        dragInfoRef.current = {
            initialRect: rect,
            cursorOffsetRight: rect.right - e.clientX, // How far cursor is from right edge
            cursorOffsetLeft: e.clientX - rect.left,   // How far cursor is from left edge
        };
    }, [enabled]);

    // Add a ref for the animation frame
    const animationFrameRef = useRef<number | null>(null);

    // Add refs for the last resize values to prevent unnecessary updates
    const lastResizeValuesRef = useRef<{ width: number, height: number, offsetX: number, offsetY: number }>({
        width: 0,
        height: 0,
        offsetX: 0,
        offsetY: 0
    });

    // Handle resize movement with throttling
    const handleResizeMove = useCallback((e: MouseEvent) => {
        if (!activeDirection || !containerRef.current) return;

        // Cancel any existing animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Use requestAnimationFrame for smoother, more efficient resizing
        animationFrameRef.current = requestAnimationFrame(() => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const initialRect = dragInfoRef.current.initialRect;
            if (!initialRect) return;

            // Calculate new dimensions based on resize direction
            let newWidth = startDimensions.width;
            let newHeight = startDimensions.height;
            let positionOffset = { x: 0, y: 0 };

            switch (activeDirection) {
                case ResizeDirection.LEFT: {
                    // Calculate new width based on delta from initial position
                    const deltaX = e.clientX - startPosition.x;
                    newWidth = Math.max(minWidth, Math.min(maxWidth, startDimensions.width - deltaX));

                    // Calculate position offset - move right when dragging right, left when dragging left
                    positionOffset.x = deltaX;
                    break;
                }
                case ResizeDirection.RIGHT: {
                    // Use the stored right edge offset for consistent cursor tracking
                    newWidth = Math.max(minWidth, Math.min(maxWidth,
                        (e.clientX + dragInfoRef.current.cursorOffsetRight) - rect.left));
                    break;
                }
                case ResizeDirection.TOP: {
                    // Calculate new height based on delta
                    const deltaY = e.clientY - startPosition.y;
                    newHeight = Math.max(minHeight, Math.min(maxHeight, startDimensions.height - deltaY));

                    // Position offset - move down when dragging down, up when dragging up
                    positionOffset.y = deltaY;
                    break;
                }
                case ResizeDirection.BOTTOM: {
                    // Calculate new height based on mouse position
                    newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - rect.top));
                    break;
                }
            }

            // Round values to integers for better performance
            newWidth = Math.round(newWidth);
            newHeight = Math.round(newHeight);
            positionOffset.x = Math.round(positionOffset.x);
            positionOffset.y = Math.round(positionOffset.y);

            // Only update if values have changed significantly (prevent micro-adjustments)
            const lastValues = lastResizeValuesRef.current;
            const widthChanged = Math.abs(lastValues.width - newWidth) >= 1;
            const heightChanged = Math.abs(lastValues.height - newHeight) >= 1;
            const offsetXChanged = Math.abs(lastValues.offsetX - positionOffset.x) >= 1;
            const offsetYChanged = Math.abs(lastValues.offsetY - positionOffset.y) >= 1;

            if (widthChanged || heightChanged || offsetXChanged || offsetYChanged) {
                // Update the last values
                lastResizeValuesRef.current = {
                    width: newWidth,
                    height: newHeight,
                    offsetX: positionOffset.x,
                    offsetY: positionOffset.y
                };

                // Call resize callback with new dimensions and position offset
                onResize?.(newWidth, newHeight, positionOffset);
            }
        });
    }, [activeDirection, startDimensions, startPosition, minWidth, maxWidth, minHeight, maxHeight, onResize]);

    // Handle resize end
    const handleResizeEnd = useCallback(() => {
        setActiveDirection(null);

        // Cancel any pending animation frame
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    }, []);

    // Set up event listeners
    useEffect(() => {
        if (activeDirection) {
            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeEnd);

            // Add resize class to body
            document.body.classList.add('resizing');
        } else {
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeEnd);

            // Remove resize class from body
            document.body.classList.remove('resizing');
        }

        return () => {
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeEnd);
            document.body.classList.remove('resizing');

            // Clean up any animation frame on unmount
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [activeDirection, handleResizeMove, handleResizeEnd]);

    // Create handle props
    const createHandleProps = (direction: ResizeDirection): ResizeHandleProps => {
        const isDirectionEnabled = directions.includes(direction);
        const isActive = activeDirection === direction;
        let handleRef;

        switch (direction) {
            case ResizeDirection.LEFT:
                handleRef = leftHandleRef;
                break;
            case ResizeDirection.RIGHT:
                handleRef = rightHandleRef;
                break;
            case ResizeDirection.TOP:
                handleRef = topHandleRef;
                break;
            case ResizeDirection.BOTTOM:
                handleRef = bottomHandleRef;
                break;
        }

        // Base styles for resize handles
        const baseStyle: React.CSSProperties = {
            position: 'absolute',
            display: isDirectionEnabled && enabled ? 'block' : 'none',
            zIndex: 10,
            opacity: isActive ? 1 : 0.5,
        };

        // Direction-specific styles
        let directionStyle: React.CSSProperties = {};
        let cursorStyle = '';

        switch (direction) {
            case ResizeDirection.LEFT:
                directionStyle = {
                    left: 0,
                    top: 0,
                    width: '4px',
                    height: '100%',
                    cursor: 'ew-resize',
                    transform: 'translateX(-2px)',
                };
                cursorStyle = 'ew-resize';
                break;
            case ResizeDirection.RIGHT:
                directionStyle = {
                    right: 0,
                    top: 0,
                    width: '4px',
                    height: '100%',
                    cursor: 'ew-resize',
                    transform: 'translateX(2px)',
                };
                cursorStyle = 'ew-resize';
                break;
            case ResizeDirection.TOP:
                directionStyle = {
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '4px',
                    cursor: 'ns-resize',
                    transform: 'translateY(-2px)',
                };
                cursorStyle = 'ns-resize';
                break;
            case ResizeDirection.BOTTOM:
                directionStyle = {
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    height: '4px',
                    cursor: 'ns-resize',
                    transform: 'translateY(2px)',
                };
                cursorStyle = 'ns-resize';
                break;
        }

        return {
            className: `resize-handle resize-handle-${direction} ${isActive ? 'active' : ''}`,
            style: { ...baseStyle, ...directionStyle, cursor: cursorStyle },
            ref: handleRef,
            eventHandlers: {
                onMouseDown: (e) => handleResizeStart(e, direction),
            },
            direction,
            isActive,
        };
    };

    // Create handle props for each direction
    const handles: Record<ResizeDirection, ResizeHandleProps> = {
        [ResizeDirection.LEFT]: createHandleProps(ResizeDirection.LEFT),
        [ResizeDirection.RIGHT]: createHandleProps(ResizeDirection.RIGHT),
        [ResizeDirection.TOP]: createHandleProps(ResizeDirection.TOP),
        [ResizeDirection.BOTTOM]: createHandleProps(ResizeDirection.BOTTOM),
    };

    return {
        containerProps: {
            ref: containerRef,
        },
        handles,
        isResizing: activeDirection !== null,
    };
};