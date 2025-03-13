import { create } from 'zustand';
import { useCallback, useRef, useState, useEffect, useMemo } from 'react';

// Drag source information
export interface DragSource {
    id: string;
    type: string;
    data: any;
    element?: HTMLElement;
}

// Drop target information
export interface DropTarget {
    id: string;
    type: string;
    position?: 'before' | 'after' | 'inside';
    accepts: string[];
    element?: HTMLElement;
}

// Drop indicator information
export interface DropIndicator {
    targetId: string;
    position: 'before' | 'after' | 'inside';
    element: HTMLElement | null;
}

// Drag and drop state
interface DragDropState {
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
    unregisterDropTarget: (id: string) => void;
    setActiveDropTarget: (id: string | null) => void;
    addDropIndicator: (indicator: DropIndicator) => void;
    clearDropIndicators: () => void;
    handleDrop: (e: React.DragEvent, targetId: string) => boolean;
}

// Create the drag-drop store
export const useDragDrop = create<DragDropState>((set, get) => {
    const registeredTargets = new Set();

    return {
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

            // Skip registration if target is already registered
            if (registeredTargets.has(targetId)) {
                return;
            }

            // Mark as registered before state update
            registeredTargets.add(targetId);

            console.log(`Registering drop target: ${target.type}/${target.id}`);
            set(state => ({
                dropTargets: [...state.dropTargets.filter(t => t.id !== target.id), target]
            }));
        },

        unregisterDropTarget: (id) => {
            // Skip unregistration if target is not registered
            if (!registeredTargets.has(id)) {
                return;
            }

            // Remove from registry before state update
            registeredTargets.delete(id);

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

        handleDrop: (e, targetId) => {
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
export function useDraggable(
    type: string,
    id: string,
    data: any,
    options?: {
        dragPreview?: HTMLElement;
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
    const handleDragStart = useCallback((e: React.DragEvent<HTMLElement>) => {
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
            e.dataTransfer.setDragImage(options.dragPreview, 0, 0);
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
    const handleDragEnd = useCallback((e: React.DragEvent<HTMLElement>) => {
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
 */
export function useDroppable(
    type: string,
    id: string,
    acceptTypes: string[],
    onDrop?: (source: DragSource, position?: string) => void,
    options?: {
        disabled?: boolean;
        positions?: ('before' | 'after' | 'inside')[];
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

    // Register this element as a drop target
    useEffect(() => {
        if (options?.disabled) return;

        registerDropTarget({
            id,
            type,
            accepts: acceptTypes,
            element: elementRef.current || undefined,
            positions: options?.positions
        });

        return () => {
            unregisterDropTarget(id);
        };
    }, [id, type, acceptTypes, options?.disabled, options?.positions, registerDropTarget, unregisterDropTarget]);

    // Handle drag over
    const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
        if (options?.disabled) return;

        e.preventDefault();
        e.stopPropagation();

        // Check if we can accept this drag
        if (!isDragging || !dragSource) return;

        if (!acceptTypes.includes(dragSource.type)) {
            // We don't accept this type
            e.dataTransfer.dropEffect = 'none';
            return;
        }

        // We accept this drag
        e.dataTransfer.dropEffect = 'move';

        // Set as active drop target
        if (!isOver) {
            setIsOver(true);
            setActiveDropTarget(id);

            // Clear existing indicators
            clearDropIndicators();

            // Create indicator based on position
            const element = elementRef.current;
            if (element) {
                // Create an indicator element
                const indicator = document.createElement('div');
                indicator.className = 'drop-indicator drop-indicator-inside';

                // Position it
                indicator.style.position = 'absolute';
                indicator.style.inset = '0';
                indicator.style.pointerEvents = 'none';
                indicator.style.zIndex = '1000';
                indicator.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                indicator.style.border = '2px dashed #3b82f6';
                indicator.style.borderRadius = '4px';

                // Add it to the element
                element.appendChild(indicator);

                // Register the indicator
                addDropIndicator({
                    targetId: id,
                    position: 'inside',
                    element: indicator
                });
            }
        }
    }, [
        id, options?.disabled, isDragging, dragSource,
        acceptTypes, isOver, setActiveDropTarget,
        clearDropIndicators, addDropIndicator
    ]);

    // Handle drag leave
    const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if we're leaving to a child element
        const element = elementRef.current;
        if (element) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;

            if (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            ) {
                // Still within bounds, just moving to a child
                return;
            }
        }

        // Actually leaving the element
        setIsOver(false);

        // Only clear if this is the active target
        if (activeDropTarget?.id === id) {
            setActiveDropTarget(null);
            clearDropIndicators();
        }
    }, [id, activeDropTarget, setActiveDropTarget, clearDropIndicators]);

    // Handle drop
    const handleDropEvent = useCallback((e: React.DragEvent<HTMLElement>) => {
        if (options?.disabled) return;

        e.preventDefault();
        e.stopPropagation();

        // Reset state
        setIsOver(false);

        try {
            // Get drag data
            const dragDataStr = e.dataTransfer.getData('application/json');
            if (!dragDataStr) return;

            const dragData = JSON.parse(dragDataStr);

            // Handle the drop
            const success = handleDrop(e, id);

            // Call custom handler if provided
            if (success && onDrop && dragSource) {
                onDrop(dragSource, 'inside');
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    }, [id, options?.disabled, onDrop, dragSource, handleDrop]);

    // Prepare props for the droppable element
    const dropProps = {
        ref: elementRef,
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDropEvent,
        'data-drop-id': id,
        'data-drop-type': type,
        'data-drop-active': activeDropTarget?.id === id,
        className: `${isOver ? 'drop-active' : ''}`
    };

    return {
        dropProps,
        isOver,
        canDrop: isDragging && dragSource && acceptTypes.includes(dragSource.type),
        elementRef
    };
}

/**
 * Hook that combines draggable and droppable for elements that can do both
 */
export function useDragAndDrop(
    type: string,
    id: string,
    dragData: any,
    acceptTypes: string[],
    onDrop?: (source: DragSource, position?: string) => void,
    options?: {
        dragDisabled?: boolean;
        dropDisabled?: boolean;
        dragPreview?: HTMLElement;
        dragHandle?: string;
        positions?: ('before' | 'after' | 'inside')[];
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

    // Create a stable ID for this drop target
    const dropTargetId = useMemo(() => `${type}-${id}`, [type, id]);

    // Save options in a ref to prevent unnecessary effect reruns
    const optionsRef = useRef(options);
    optionsRef.current = options;

    // Save drop handler in a ref
    const onDropRef = useRef(onDrop);
    onDropRef.current = onDrop;

    // Register this element as a drop target
    useEffect(() => {
        if (options?.dropDisabled) return;

        // Only call register when necessary
        registerDropTarget({
            id: dropTargetId,
            type,
            accepts: acceptTypes,
            element: elementRef.current || undefined,
            positions: options?.positions
        });

        return () => {
            unregisterDropTarget(dropTargetId);
        };
    }, [
        dropTargetId,
        type,
        acceptTypes,
        options?.dropDisabled,
        options?.positions,
        registerDropTarget,
        unregisterDropTarget
    ]);

    // Handle drag over
    const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
        if (optionsRef.current?.dropDisabled) return;

        e.preventDefault();
        e.stopPropagation();

        // Check if we can accept this drag
        if (!isDragging || !dragSource) return;
        if (!acceptTypes.includes(dragSource.type)) {
            e.dataTransfer.dropEffect = 'none';
            return;
        }

        e.dataTransfer.dropEffect = 'move';

        // Set as active drop target
        if (!isOver) {
            setIsOver(true);
            setActiveDropTarget(dropTargetId);
            clearDropIndicators();
        }
    }, [
        isDragging,
        dragSource,
        acceptTypes,
        isOver,
        setActiveDropTarget,
        clearDropIndicators,
        dropTargetId
    ]);

    // Handle drag leave
    const handleDragLeave = useCallback((e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if we're leaving to a child element
        const element = elementRef.current;
        if (element) {
            const rect = element.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;

            if (
                x >= rect.left &&
                x <= rect.right &&
                y >= rect.top &&
                y <= rect.bottom
            ) {
                // Still within bounds, just moving to a child
                return;
            }
        }

        setIsOver(false);

        // Only clear if this is the active target
        if (activeDropTarget?.id === dropTargetId) {
            setActiveDropTarget(null);
            clearDropIndicators();
        }
    }, [dropTargetId, activeDropTarget, setActiveDropTarget, clearDropIndicators]);

    // Handle drop
    const handleDropEvent = useCallback((e: React.DragEvent<HTMLElement>) => {
        if (optionsRef.current?.dropDisabled) return;

        e.preventDefault();
        e.stopPropagation();

        // Reset state
        setIsOver(false);

        try {
            // Get drag data
            const dragDataStr = e.dataTransfer.getData('application/json');
            if (!dragDataStr) return;

            // Handle the drop
            const success = handleDrop(e, dropTargetId);

            // Call custom handler if provided
            if (success && onDropRef.current && dragSource) {
                onDropRef.current(dragSource, 'inside');
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    }, [dropTargetId, handleDrop, dragSource]);

    // Use dragRef and dragProps from useDraggable
    const { dragProps, isDragging: isDraggingElement } = useDraggable(type, id, dragData, {
        dragPreview: options?.dragPreview,
        dragHandle: options?.dragHandle,
        disabled: options?.dragDisabled
    });

    // Combine all props, but maintain stable reference
    const elementProps = useMemo(() => ({
        ...dragProps,
        ref: (element: HTMLElement | null) => {
            // Set refs for both drag and drop
            elementRef.current = element;
            if (typeof dragProps.ref === 'function') {
                dragProps.ref(element);
            }
        },
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDropEvent,
        'data-drop-id': dropTargetId,
        'data-drop-type': type,
        'data-drop-active': activeDropTarget?.id === dropTargetId,
        'data-draggable': !options?.dragDisabled,
        'data-droppable': !options?.dropDisabled
    }), [
        dragProps,
        dropTargetId,
        type,
        handleDragOver,
        handleDragLeave,
        handleDropEvent,
        activeDropTarget?.id,
        options?.dragDisabled,
        options?.dropDisabled
    ]);

    return {
        elementProps,
        isDragging: isDraggingElement,
        isOver,
        canDrop: isDragging && dragSource && acceptTypes.includes(dragSource.type),
        elementRef
    };
}

// Export the store and hooks
export default useDragDrop;