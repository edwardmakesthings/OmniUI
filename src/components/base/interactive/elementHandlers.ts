import { MouseEventHandler, FocusEventHandler } from 'react';
import { EntityId } from '@/core/types/EntityTypes';
import { AbstractInteractiveBaseProps, BaseState } from './types';

export interface ElementHandlers<T extends HTMLElement> {
    // Basic interactions
    handleClick: (e: React.MouseEvent<T>) => Promise<void>;
    handleMouseEnter: (e: React.MouseEvent<T>) => void;
    handleMouseLeave: (e: React.MouseEvent<T>) => void;
    handleFocus: (e: React.FocusEvent<T>) => void;
    handleBlur: (e: React.FocusEvent<T>) => void;

    // Drag and drop for component creation/manipulation
    handleDragStart?: (e: React.DragEvent<T>) => void;
    handleDragEnd?: (e: React.DragEvent<T>) => void;
    handleDragOver?: (e: React.DragEvent<T>) => void;
    handleDrop?: (e: React.DragEvent<T>) => void;
}

/**
 * Creates an object of event handlers for an interactive element.
 *
 * The returned object contains the following properties:
 * - `handleClick`: A function that handles the element's `onClick` event.
 *   If the element has an instance ID and an internal or external binding
 *   named `onClick`, it will be executed. Otherwise, the element's `onClick`
 *   property will be called.
 * - `handleMouseEnter`, `handleMouseLeave`, `handleFocus`, `handleBlur`:
 *   Functions that handle the element's `onMouseEnter`, `onMouseLeave`,
 *   `onFocus`, and `onBlur` events, respectively. These functions will call
 *   the element's corresponding property if it is defined, and also update
 *   the element's local state accordingly.
 *
 * @param props The properties of the interactive element.
 * @param state The current state of the interactive element.
 * @param handleStateChange A function that updates the element's local state.
 * @param executeInstanceBinding An optional function that executes an
 *   instance binding.
 */
export const createElementHandlers = <T extends HTMLElement>(
    props: AbstractInteractiveBaseProps,
    state: BaseState,
    handleStateChange: (updates: Partial<BaseState>, event?: string) => void,
    executeInstanceBinding?: (instanceId: EntityId, bindingName: string) => Promise<void>,
    selectComponent?: (id: EntityId) => void
): ElementHandlers<T> => {
    // Helper for executing bindings with error handling
    const executeBinding = async (bindingName: string) => {
        if (!props.instanceId || !executeInstanceBinding) return;

        try {
            await executeInstanceBinding(props.instanceId, bindingName);
        } catch (error) {
            console.error(`Failed to execute binding ${bindingName}:`, error);
        }
    };

    // Standard click handler with binding support and selection
    const handleClick = async (e: React.MouseEvent<T>) => {
        // Handle selection in edit mode
        if (props.isEditing && props.instanceId && selectComponent) {
            e.stopPropagation(); // Prevent canvas/parent selection
            selectComponent(props.instanceId);
            return;
        }

        // Handle normal click behavior
        if (props.instanceId && props.bindings?.internalBindings?.onClick) {
            await executeBinding('onClick');
        } else if (props.instanceId && props.bindings?.externalBindings?.onClick) {
            await executeBinding('onClick');
        } else if (props.onClick) {
            (props.onClick as MouseEventHandler<T>)(e);
        }

        if (props.behavior) {
            handleStateChange({}, 'click');
        }
    };

    // Helper for state-updating handlers
    const createStateHandler = <E extends React.SyntheticEvent<T>>(
        handler: ((e: E) => void) | undefined,
        stateUpdate?: Partial<BaseState>
    ) => {
        return (e: E) => {
            if (stateUpdate) {
                handleStateChange(stateUpdate);
            }
            handler?.(e);
        };
    };

    // Drag and drop handlers for component editing
    const createDragHandlers = (): Pick<ElementHandlers<T>, 'handleDragStart' | 'handleDragEnd'> => {
        if (!props.isEditing) return {};

        return {
            handleDragStart: (e: React.DragEvent<T>) => {
                if (!props.instanceId) return;

                e.dataTransfer.setData('text/plain', props.instanceId);
                e.dataTransfer.effectAllowed = 'move';

                handleStateChange({ isPressed: true }, 'dragStart');
            },
            handleDragEnd: (e: React.DragEvent<T>) => {
                handleStateChange({ isPressed: false }, 'dragEnd');
            }
        };
    };

    return {
        handleClick,
        handleMouseEnter: createStateHandler<React.MouseEvent<T>>(
            props.onMouseEnter as MouseEventHandler<T>,
            { isHovered: true }
        ),
        handleMouseLeave: createStateHandler<React.MouseEvent<T>>(
            props.onMouseLeave as MouseEventHandler<T>,
            { isHovered: false }
        ),
        handleFocus: createStateHandler<React.FocusEvent<T>>(
            props.onFocus as FocusEventHandler<T>,
            { isFocused: true }
        ),
        handleBlur: createStateHandler<React.FocusEvent<T>>(
            props.onBlur as FocusEventHandler<T>,
            { isFocused: false }
        ),
        ...(props.isEditing && createDragHandlers())
    };
};