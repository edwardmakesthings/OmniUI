import { MouseEventHandler, FocusEventHandler } from 'react';
import { EntityId } from '@/core/types/EntityTypes';
import { AbstractInteractiveBaseProps, InteractiveBaseState } from './types';

export interface ElementHandlers<T extends HTMLElement> {
    handleClick: (e: React.MouseEvent<T>) => Promise<void>;
    handleMouseEnter: (e: React.MouseEvent<T>) => void;
    handleMouseLeave: (e: React.MouseEvent<T>) => void;
    handleFocus: (e: React.FocusEvent<T>) => void;
    handleBlur: (e: React.FocusEvent<T>) => void;
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
    state: InteractiveBaseState,
    handleStateChange: (updates: Partial<InteractiveBaseState>, event?: string) => void,
    executeInstanceBinding?: (instanceId: EntityId, bindingName: string) => Promise<void>
): ElementHandlers<T> => {
    const handleClick = async (e: React.MouseEvent<T>) => {
        if (props.isEditing) return;

        if (props.instanceId && props.bindings?.internalBindings?.onClick) {
            await executeInstanceBinding?.(props.instanceId, 'onClick');
        } else if (props.instanceId && props.bindings?.externalBindings?.onClick) {
            await executeInstanceBinding?.(props.instanceId, 'onClick');
        } else if (props.onClick) {
            (props.onClick as MouseEventHandler<T>)(e);
        }

        if (props.behavior) {
            handleStateChange({}, 'click');
        }
    };

    const createStateHandler = <E extends React.SyntheticEvent<T>>(
        handler: ((e: E) => void) | undefined,
        stateUpdate?: Partial<InteractiveBaseState>
    ) => {
        return (e: E) => {
            if (stateUpdate) {
                handleStateChange(stateUpdate);
            }
            handler?.(e);
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
    };
};