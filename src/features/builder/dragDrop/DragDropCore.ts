
import { useCallback, useRef, useState, useEffect, useMemo, DragEvent } from 'react';
import { create } from 'zustand';
import { EntityId } from '@/core';
import { dropZoneManager, DropPosition } from './DropZone';

// Drag source information
export interface DragSource {
    id: EntityId;
    type: string;
    data: any;
    element?: HTMLElement;
}

// Drop target information
export interface DropTarget {
    id: EntityId;
    type: string;
    positions?: DropPosition[];
    accepts: string[];
    element?: HTMLElement;
}

// Drop indicator information
export interface DropIndicator {
    targetId: EntityId;
    position: DropPosition;
    element: HTMLElement | null;
}

// Drag and drop state
interface DragDropState {
    registeredTargets: Set<string>;

    // Current drag operation
    isDragging: boolean;
    dragSource: DragSource | null;
    dragData: any;

    // Drop targets
    dropTargets: DropTarget[];
    activeDropTarget: DropTarget | null;
    dropIndicators: DropIndicator[];

    // Methods
    startDrag: (source: DragSource) => void;
    endDrag: () => void;
    registerDropTarget: (target: DropTarget) => void;
    unregisterDropTarget: (id: EntityId) => void;
    setActiveDropTarget: (id: EntityId | null) => void;
    addDropIndicator: (indicator: DropIndicator) => void;
    clearDropIndicators: () => void;
    handleDrop: (e: DragEvent, targetId: EntityId) => boolean;
}

export type DragEventHandlers = {
    onDragStart?: (e: DragEvent<HTMLElement>) => void;
    onDragOver?: (e: DragEvent<HTMLElement>) => void;
    onDragLeave?: (e: DragEvent<HTMLElement>) => void;
    onDragEnd?: (e: DragEvent<HTMLElement>) => void;
    onDrop?: (e: DragEvent<HTMLElement>) => void;
};

// Create the drag-drop store
export const useDragDrop = create<DragDropState>((set, get) => {
    return {
        registeredTargets: new Set<string>(),
        isDragging: false,
        dragSource: null,
        dragData: null,
        dropTargets: [],
        activeDropTarget: null,
        dropIndicators: [],

        startDrag: (source) => {
            console.log(`Starting drag: ${source.type}/${source.id}`);
            set({
                isDragging: true,
                dragSource: source,
                dragData: source.data
            });
        },

        endDrag: () => {
            console.log('Ending drag');
            set({
                isDragging: false,
                dragSource: null,
                dragData: null,
                activeDropTarget: null
            });
            get().clearDropIndicators();
        },

        registerDropTarget: (target) => {
            const targetId = target.id;
            const state = get();

            // Skip registration if target is already registered
            if (state.registeredTargets.has(targetId)) {
                return;
            }

            // Mark as registered before state update
            state.registeredTargets.add(targetId);

            set(state => ({
                dropTargets: [...state.dropTargets.filter(t => t.id !== target.id), target]
            }));
        },

        unregisterDropTarget: (id) => {
            const state = get();

            // Skip unregistration if target is not registered
            if (!state.registeredTargets.has(id)) {
                return;
            }

            // Remove from registry before state update
            state.registeredTargets.delete(id);

            // Only update state if actually needed
            set(state => {
                // Check if target exists in state before updating
                const targetExists = state.dropTargets.some(t => t.id === id);
                if (!targetExists) return state; // No change needed

                return {
                    dropTargets: state.dropTargets.filter(t => t.id !== id)
                };
            });
        },

        setActiveDropTarget: (id) => {
            const target = id ? get().dropTargets.find(t => t.id === id) : null;
            set({ activeDropTarget: target || null });
        },

        addDropIndicator: (indicator) => {
            set(state => ({
                dropIndicators: [...state.dropIndicators, indicator]
            }));
        },

        clearDropIndicators: () => {
            // Remove DOM elements
            get().dropIndicators.forEach(indicator => {
                if (indicator.element) {
                    indicator.element.remove();
                }
            });

            set({ dropIndicators: [] });
        },

        handleDrop: (_e, targetId) => {
            const { dragSource, dropTargets } = get();
            if (!dragSource) return false;

            const target = dropTargets.find(t => t.id === targetId);
            if (!target) return false;

            // Check if target accepts this drag type
            if (!target.accepts.includes(dragSource.type)) {
                console.log(`Drop target ${targetId} does not accept ${dragSource.type}`);
                return false;
            }

            console.log(`Dropping ${dragSource.type}/${dragSource.id} onto ${target.type}/${target.id}`);

            // Handle drop based on custom handlers
            // This is where we'd integrate with the specific widget or component logic

            // End the drag operation
            get().endDrag();

            return true;
        }
    }
});

/**
 * Hook to make an element draggable
 */
export function useDraggable<T = any>(
    type: string,
    id: EntityId,
    data: T,
    options?: {
        dragPreview?: {
            element: HTMLElement;
            offsetX?: number;
            offsetY?: number;
        } | HTMLElement;
        dragHandle?: string;
        disabled?: boolean;
    }
) {
    const { startDrag, endDrag, isDragging, dragSource } = useDragDrop();
    const elementRef = useRef<HTMLElement>(null);
    const [dragging, setDragging] = useState(false);

    // Check if this element is being dragged
    const isBeingDragged = dragging || (isDragging && dragSource?.id === id);

    // Handle drag start
    const handleDragStart = useCallback((e: DragEvent<HTMLElement>) => {
        if (options?.disabled) return;

        console.log(`Drag start: ${type}/${id}`);
        e.stopPropagation();

        // Set drag data
        const dragData = JSON.stringify({
            type,
            id,
            data
        });

        e.dataTransfer.setData('application/json', dragData);
        e.dataTransfer.effectAllowed = 'move';

        // Set custom drag image if provided
        if (options?.dragPreview) {
            // If it's just an element
            if (options.dragPreview instanceof HTMLElement) {
                e.dataTransfer.setDragImage(options.dragPreview, 0, 0);
            }
            // If it's a configuration object
            else {
                const { element, offsetX = 0, offsetY = 0 } = options.dragPreview;
                e.dataTransfer.setDragImage(element, offsetX, offsetY);
            }
        }

        // Start drag in the manager
        startDrag({
            id,
            type,
            data,
            element: elementRef.current || undefined
        });

        // Update local state
        setDragging(true);

        // Set cursor
        document.body.style.cursor = 'grabbing';
    }, [id, type, data, options, startDrag]);

    // Handle drag end
    const handleDragEnd = useCallback((e: DragEvent<HTMLElement>) => {
        console.log(`Drag end: ${type}/${id}`);
        e.stopPropagation();

        // End drag in the manager
        endDrag();

        // Update local state
        setDragging(false);

        // Reset cursor
        document.body.style.cursor = 'default';
    }, [id, type, endDrag]);

    // Prepare props for the draggable element
    const dragProps = {
        ref: elementRef,
        draggable: !options?.disabled,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        'data-drag-id': id,
        'data-drag-type': type,
        className: `${isBeingDragged ? 'dragging' : ''}`
    };

    return {
        dragProps,
        isDragging: isBeingDragged,
        elementRef
    };
}

/**
 * Hook to make an element a drop target
 *
 * @param type Type identifier for this drop target
 * @param id Unique identifier for this drop target
 * @param acceptTypes Array of drag types this target accepts
 * @param onDrop Callback function when a drop occurs
 * @param options Additional configuration options
 */
export function useDroppable<T extends string = string>(
    type: string,
    id: EntityId,
    acceptTypes: T[],
    onDrop?: (source: DragSource, position?: DropPosition) => void,
    options?: {
        disabled?: boolean;
        positions?: DropPosition[];
        highlightClass?: string;
    }
) {
    const {
        registerDropTarget,
        unregisterDropTarget,
        isDragging,
        dragSource,
        activeDropTarget,
        setActiveDropTarget,
        addDropIndicator,
        clearDropIndicators,
        handleDrop
    } = useDragDrop();

    const elementRef = useRef<HTMLElement>(null);
    const [isOver, setIsOver] = useState(false);
    const [currentPosition, setCurrentPosition] = useState<DropPosition | null>(null);

    // Store callback in ref to prevent unnecessary effect triggers
    const onDropRef = useRef(onDrop);
    useEffect(() => {
        onDropRef.current = onDrop;
    }, [onDrop]);

    // Register this element as a drop target
    useEffect(() => {
        if (options?.disabled) return;

        registerDropTarget({
            id,
            type,
            accepts: acceptTypes,
            element: elementRef.current || undefined,
            positions: options?.positions || [DropPosition.INSIDE]
        });

        return () => {
            unregisterDropTarget(id);
        };
    }, [id, type, JSON.stringify(acceptTypes), options?.disabled, JSON.stringify(options?.positions), registerDropTarget, unregisterDropTarget]);

    // Debounced version of setIsOver to prevent flickering
    const debouncedSetIsOver = useCallback(
        debounce((value: boolean) => {
            setIsOver(value);
        }, 50),
        []
    );

    // Handle drag over
    const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
        if (options?.disabled) return;

        e.preventDefault();
        e.stopPropagation();

        // Check if we can accept this drag
        if (!isDragging || !dragSource) return;

        if (!acceptTypes.includes(dragSource.type as T)) {
            // We don't accept this type
            e.dataTransfer.dropEffect = 'none';
            return;
        }

        // We accept this drag
        e.dataTransfer.dropEffect = 'move';

        // Calculate the drop position based on mouse coordinates
        const element = elementRef.current;
        if (!element) return;

        // Get available positions
        const availablePositions = options?.positions || [DropPosition.INSIDE];
        const isContainer = availablePositions.includes(DropPosition.INSIDE);

        // Calculate the position based on cursor location
        const position = dropZoneManager.calculateDropPosition(
            element,
            e.clientX,
            e.clientY,
            isContainer,
            availablePositions
        );

        // Update drop state
        if (!isOver || position !== currentPosition) {
            debouncedSetIsOver(true);
            setCurrentPosition(position);
            setActiveDropTarget(id);

            // Clear existing indicators and create new ones
            clearDropIndicators();

            // Create indicator for the current position
            const indicator = dropZoneManager.createDropIndicator(element, position, options?.highlightClass);

            if (indicator) {
                addDropIndicator({
                    targetId: id,
                    position,
                    element: indicator
                });
            }
        }
    }, [
        id, options?.disabled, isDragging, dragSource,
        acceptTypes, isOver, currentPosition, setActiveDropTarget,
        clearDropIndicators, addDropIndicator, options?.positions,
        options?.highlightClass, debouncedSetIsOver
    ]);

    // Handle drag leave
    const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if we're actually leaving the element or just entering a child
        const element = elementRef.current;
        if (element) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;

            // If still within the element bounds, it's just moving to a child
            if (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            ) {
                return;
            }
        }

        // Actually leaving the element
        debouncedSetIsOver(false);
        setCurrentPosition(null);

        // Only clear if this is the active target
        if (activeDropTarget?.id === id) {
            setActiveDropTarget(null);
            clearDropIndicators();
        }
    }, [id, activeDropTarget, setActiveDropTarget, clearDropIndicators, debouncedSetIsOver]);

    // Handle drop
    const handleDropEvent = useCallback((e: DragEvent<HTMLElement>) => {
        if (options?.disabled) return;

        e.preventDefault();
        e.stopPropagation();

        // Reset state
        setIsOver(false);
        setCurrentPosition(null);

        try {
            // Get drag data
            const dragDataStr = e.dataTransfer.getData('application/json');
            if (!dragDataStr) return;

            // Parse the data
            const dragData = JSON.parse(dragDataStr);

            // Handle the drop through the store
            const success = handleDrop(e, id);

            // Call custom handler if provided and successful
            if (success && onDropRef.current && dragSource) {
                onDropRef.current({ ...dragSource, data: dragData }, currentPosition || undefined);
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    }, [id, options?.disabled, handleDrop, dragSource, currentPosition]);

    // Prepare props for the droppable element
    const dropProps = useMemo(() => ({
        ref: elementRef,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDropEvent,
        'data-drop-id': id,
        'data-drop-type': type,
        'data-drop-active': activeDropTarget?.id === id ? 'true' : 'false',
        'data-drop-position': currentPosition || '',
        className: `${isOver ? (options?.highlightClass || 'drop-active') : ''}`
    }), [
        handleDragOver,
        handleDragLeave,
        handleDropEvent,
        id,
        type,
        activeDropTarget?.id,
        currentPosition,
        isOver,
        options?.highlightClass
    ]);

    return {
        dropProps,
        isOver,
        position: currentPosition,
        canDrop: isDragging && dragSource && acceptTypes.includes(dragSource.type as T),
        elementRef
    };
}

/**
  * Hook that combines draggable and droppable functionality for elements
  * that can both be dragged and receive drops
  */
export function useDragAndDrop<T = any, A extends string = string>(
    type: string,
    id: EntityId,
    dragData: T,
    acceptTypes: A[],
    onDrop?: (source: DragSource, position?: DropPosition) => void,
    options?: {
        dragDisabled?: boolean;
        dropDisabled?: boolean;
        dragPreview?: {
            element: HTMLElement;
            offsetX?: number;
            offsetY?: number;
        } | HTMLElement;
        dragHandle?: string;
        positions?: DropPosition[];
        highlightClass?: string;
    }
) {
    // Create a local ref we'll use for both hooks
    const combinedElementRef = useRef<HTMLElement | null>(null);

    // Use both hooks with appropriate options
    const {
        dragProps,
        isDragging: isDraggingElement
    } = useDraggable<T>(type, id, dragData, {
        dragPreview: options?.dragPreview,
        dragHandle: options?.dragHandle,
        disabled: options?.dragDisabled
    });

    const {
        dropProps,
        isOver,
        position: dropPosition,
        canDrop
    } = useDroppable<A>(type, id, acceptTypes, onDrop, {
        disabled: options?.dropDisabled,
        positions: options?.positions,
        highlightClass: options?.highlightClass
    });

    // Create a ref callback that will be used for the element
    const refCallback = useCallback((element: HTMLElement | null) => {
        // Update our local ref
        combinedElementRef.current = element;
    }, []);

    // Combine all props, ensuring event handlers are properly merged
    const elementProps = useMemo(() => {
        // Omit refs from both prop sets, we'll add our combined ref
        const { ref: _, ...otherDragProps } = dragProps;
        const { ref: __, ...otherDropProps } = dropProps;

        // Combine data attributes
        const dataAttributes = {
            'data-drag-id': id,
            'data-drag-type': type,
            'data-drop-id': id,
            'data-drop-type': type,
            'data-draggable': options?.dragDisabled ? 'false' : 'true',
            'data-droppable': options?.dropDisabled ? 'false' : 'true',
            'data-drop-active': isOver ? 'true' : 'false',
            'data-drop-position': dropPosition || '',
            'data-is-dragging': isDraggingElement ? 'true' : 'false'
        };

        // Combine class names
        const className = `${isDraggingElement ? 'dragging ' : ''}${isOver ? (options?.highlightClass || 'drop-active') : ''}`;

        return {
            ...otherDragProps,
            ...otherDropProps,
            ...dataAttributes,
            className,
            ref: refCallback
        };
    }, [
        dragProps,
        dropProps,
        id,
        type,
        isOver,
        dropPosition,
        isDraggingElement,
        options?.dragDisabled,
        options?.dropDisabled,
        options?.highlightClass,
        refCallback
    ]);

    return {
        elementProps,
        isDragging: isDraggingElement,
        isOver,
        dropPosition,
        canDrop,
        elementRef: combinedElementRef // Just use one of the refs since they're synchronized
    };
}

/**
   * Helper function to create a debounced function
   */
function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (...args: Parameters<T>) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, delay);
    };
}

// Export the store and hooks
export default useDragDrop;