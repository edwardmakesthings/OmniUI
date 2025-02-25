import { useCallback, RefObject } from 'react';
import { EntityId } from '@/core/types/EntityTypes';
import { BaseState, DragData, DropPosition, DropTarget } from '@/components/base/interactive/types';
import { BaseInteractorProps } from '@/components/base/interactive/types';
import { ElementHandlers } from '../types';

/**
 * Hook to create interaction handlers for interactive elements
 * Handles click, mouse events, keyboard interactions, and drag-drop operations
 */
export function useInteractiveHandlers<T extends HTMLElement>({
    props,
    elementState,
    handleStateChange,
    executeInstanceBinding,
    selectComponent,
    elementRef,
    setDropPosition
}: {
    props: Omit<BaseInteractorProps, 'as'>;
    elementState: BaseState;
    handleStateChange: (updates: Partial<BaseState>, event?: string) => void;
    executeInstanceBinding?: (instanceId: EntityId, bindingName: string) => Promise<void>;
    selectComponent?: (id: EntityId) => void;
    elementRef?: RefObject<HTMLElement>;
    setDropPosition?: (position: DropPosition | null) => void;
}) {
    // Helper for executing bindings with error handling
    const executeBinding = useCallback(async (bindingName: string) => {
        if (!props.instanceId || !executeInstanceBinding) return;

        try {
            await executeInstanceBinding(props.instanceId, bindingName);
        } catch (error) {
            console.error(`Failed to execute binding ${bindingName}:`, error);
        }
    }, [props.instanceId, executeInstanceBinding]);

    // Standard click handler with binding support and selection
    const handleClick = useCallback(async (e: React.MouseEvent<HTMLElement>) => {
        // Handle selection in edit mode
        if (elementState.isEditing && props.instanceId && selectComponent) {
            e.stopPropagation(); // Prevent canvas/parent selection

            // Toggle selection state
            const newSelected = !elementState.isSelected;
            handleStateChange({ isSelected: newSelected }, 'click');

            // Notify selection change if callback provided
            props.onSelectedChange?.(newSelected);

            // Update UI store selection
            selectComponent(props.instanceId);
            return;
        }

        // Handle normal click behavior
        if (props.instanceId && props.bindings?.internalBindings?.onClick) {
            await executeBinding('onClick');
        } else if (props.instanceId && props.bindings?.externalBindings?.onClick) {
            await executeBinding('onClick');
        } else if (props.onClick) {
            props.onClick(e);
        }

        handleStateChange({}, 'click');
    }, [
        elementState.isEditing,
        elementState.isSelected,
        props.instanceId,
        props.bindings,
        props.onClick,
        props.onSelectedChange,
        selectComponent,
        handleStateChange,
        executeBinding
    ]);

    // Create drag-drop handlers when in edit mode
    const createDragDropHandlers = useCallback(() => {
        if (!elementState.isEditing) {
            return {};
        }

        return {
            handleDragStart: (e: React.DragEvent<HTMLElement>) => {
                if (!props.draggable) {
                    return;
                }

                // Create drag data
                const dragData: DragData = {
                    id: props.dragData?.id || '',
                    type: props.dragType || 'default',
                    data: props.dragData
                };

                e.dataTransfer.setData('application/json', JSON.stringify(dragData));
                e.dataTransfer.effectAllowed = 'move';

                // Important: Set a drag image to show the element being dragged
                if (elementRef?.current) {
                    // Optional: Create a clone for better visual feedback
                    const rect = elementRef.current.getBoundingClientRect();
                    const ghostEl = elementRef.current.cloneNode(true) as HTMLElement;
                    ghostEl.style.width = `${rect.width}px`;
                    ghostEl.style.opacity = '0.7';
                    document.body.appendChild(ghostEl);
                    e.dataTransfer.setDragImage(ghostEl, 0, 0);

                    // Remove the ghost element after it's no longer needed
                    setTimeout(() => {
                        document.body.removeChild(ghostEl);
                    }, 0);
                }

                // Apply dragging state
                handleStateChange({ isPressed: true, isDragging: true }, 'dragStart');
                props.onDragStart?.(e);
            },

            handleDragEnd: (e: React.DragEvent<HTMLElement>) => {
                e.preventDefault();
                console.log('Drag end handler called', props.dragData);
                handleStateChange({ isPressed: false, isDragging: false }, 'dragEnd');
                props.onDragEnd?.(e);
            },

            handleDragOver: (e: React.DragEvent<HTMLElement>) => {
                if (!props.droppable || !elementRef?.current) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                // Clear any existing data-drop-* attributes
                const element = elementRef.current;
                element.removeAttribute('data-drop-position');
                element.removeAttribute('data-drop-before');
                element.removeAttribute('data-drop-after');
                element.removeAttribute('data-drop-inside');

                // Determine drop position if supported
                if (props.dropPositions?.length) {
                    const rect = element.getBoundingClientRect();
                    const relativeY = e.clientY - rect.top;
                    const relativePercentY = relativeY / rect.height;

                    let newPosition: DropPosition = 'inside';

                    // Use percentage-based detection for more intuitive zones
                    if (props.dropPositions.includes('before') && relativePercentY < 0.30) {
                        newPosition = 'before';
                    } else if (props.dropPositions.includes('after') && relativePercentY > 0.70) {
                        newPosition = 'after';
                    } else if (props.dropPositions.includes('inside')) {
                        newPosition = 'inside';
                    } else if (props.dropPositions.includes('before')) {
                        newPosition = 'before';
                    } else if (props.dropPositions.includes('after')) {
                        newPosition = 'after';
                    }

                    // Set the general position attribute
                    element.setAttribute('data-drop-position', newPosition);

                    // Also set a specific attribute for the position
                    // This makes styling with CSS easier
                    element.setAttribute(`data-drop-${newPosition}`, '');

                    setDropPosition?.(newPosition);
                }

                e.dataTransfer.dropEffect = 'move';
            },

            handleDragLeave: () => {
                if (elementRef?.current) {
                    // Clear drop position attributes
                    elementRef.current.removeAttribute('data-drop-position');
                    elementRef.current.removeAttribute('data-drop-before');
                    elementRef.current.removeAttribute('data-drop-after');
                    elementRef.current.removeAttribute('data-drop-inside');
                }
                setDropPosition?.(null);
            },

            handleDrop: (e: React.DragEvent<HTMLElement>) => {
                if (!props.droppable) {
                    return;
                }

                e.preventDefault();
                e.stopPropagation();

                try {
                    const dragData = JSON.parse(
                        e.dataTransfer.getData('application/json')
                    ) as DragData;

                    if (props.acceptTypes &&
                        !props.acceptTypes.includes(dragData.type)) {
                        return;
                    }

                    const dropPosition = elementRef?.current?.getAttribute('data-drop-position') as DropPosition | null;

                    const dropTarget: DropTarget = {
                        id: props.dragData?.id || '',
                        position: dropPosition || 'inside'
                    };

                    props.onDrop?.(e, dragData, dropTarget);
                } catch (error) {
                    console.error('Error handling drop:', error);
                }

                setDropPosition?.(null);
            },
        };
    }, [
        elementState.isEditing,
        props.draggable,
        props.dragData,
        props.dragType,
        props.droppable,
        props.dropPositions,
        props.acceptTypes,
        props.onDragStart,
        props.onDragEnd,
        props.onDrop,
        elementRef,
        setDropPosition,
        handleStateChange
    ]);

    // Combine all handlers
    return {
        handleClick,
        handleMouseEnter: useCallback((e: React.MouseEvent<T>) => {
            if (elementState.isDisabled) return;
            handleStateChange({ isHovered: true }, 'mouseEnter');
            props.onMouseEnter?.(e);
        }, [elementState.isDisabled, handleStateChange, props.onMouseEnter]),

        handleMouseLeave: useCallback((e: React.MouseEvent<T>) => {
            handleStateChange({ isHovered: false }, 'mouseLeave');
            props.onMouseLeave?.(e);
        }, [handleStateChange, props.onMouseLeave]),

        handleFocus: useCallback((e: React.FocusEvent<T>) => {
            if (elementState.isDisabled) return;
            handleStateChange({ isFocused: true }, 'focus');
            props.onFocus?.(e);
        }, [handleStateChange, props.onFocus]),

        handleBlur: useCallback((e: React.FocusEvent<T>) => {
            handleStateChange({ isFocused: false }, 'blur');
            props.onBlur?.(e);
        }, [handleStateChange, props.onBlur]),
        ...(elementState.isEditing ? createDragDropHandlers() : {})
    } as ElementHandlers<T>;
}

export default useInteractiveHandlers;