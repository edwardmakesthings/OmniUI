import { HTMLAttributes, ReactNode } from 'react';
import { ElementHandlers } from './elementHandlers';
import { AbstractInteractiveBaseProps, InteractiveBaseState } from './types';
import { StyleVariants } from '../style/styleTypes';
import { BehaviorDefinition } from './behaviors/types';

export interface ElementConfig<T extends HTMLElement> {
    getProps: (
        baseProps: Omit<AbstractInteractiveBaseProps, 'as'>,
        handlers: ElementHandlers<T>,
        state: InteractiveBaseState
    ) => HTMLAttributes<T>;
    render: (
        props: HTMLAttributes<T>,
        styles: Record<string, string>,
        children?: ReactNode
    ) => JSX.Element;
    getDefaultStyles?: (elements: string[]) => StyleVariants<string>;
    defaultBehavior?: BehaviorDefinition<InteractiveBaseState>;
    supportedBehaviors?: string[];
}

type ElementConfigurations = {
    button: ElementConfig<HTMLButtonElement>;
    input: ElementConfig<HTMLInputElement>;
    div: ElementConfig<HTMLDivElement>;
    span: ElementConfig<HTMLSpanElement>;
};

export const elementConfigurations: ElementConfigurations = {
    button: {
        getProps: (baseProps, handlers, state) => ({
            type: 'button',
            disabled: state.isDisabled,
            onClick: handlers.handleClick,
            onMouseEnter: handlers.handleMouseEnter,
            onMouseLeave: handlers.handleMouseLeave,
            onFocus: handlers.handleFocus,
            onBlur: handlers.handleBlur,
            'data-component-id': baseProps.instanceId ?? '',
            'data-editing': baseProps.isEditing ?? false,
        }),
        render: (props, styles, children) => (
            <button {...props} className={styles.base}>
                {children}
            </button>
        ),
        getDefaultStyles: (elements) => ({
            default: elements.reduce((acc, element) => ({
                ...acc,
                [element]: {
                    base: 'inline-flex items-center justify-center',
                    hover: 'hover:bg-gray-100',
                    focus: 'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
                    active: 'active:bg-gray-200',
                    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
                }
            }), {})
        }),
        supportedBehaviors: ['toggle', 'radio'],
        defaultBehavior: {
            name: 'button',
            handleStateChange: (state, event) => {
                if (event === 'click') {
                    return { isActive: !state.isActive };
                }
                return {};
            }
        }
    },
    input: {
        getProps: (baseProps, handlers, state) => ({
            type: 'text',
            disabled: state.isDisabled,
            onClick: handlers.handleClick,
            onMouseEnter: handlers.handleMouseEnter,
            onMouseLeave: handlers.handleMouseLeave,
            onFocus: handlers.handleFocus,
            onBlur: handlers.handleBlur,
            'data-component-id': baseProps.instanceId ?? '',
            'data-editing': baseProps.isEditing ?? false,
        }),
        render: (props, styles) => (
            <input {...props} className={styles.base} />
        ),
        getDefaultStyles: (elements) => ({
            default: elements.reduce((acc, element) => ({
                ...acc,
                [element]: {
                    base: 'block w-full border border-gray-300 rounded-md',
                    hover: 'hover:border-gray-400',
                    focus: 'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
                }
            }), {})
        })
    },
    div: {
        getProps: (baseProps, handlers, _state) => ({
            onClick: handlers.handleClick,
            onMouseEnter: handlers.handleMouseEnter,
            onMouseLeave: handlers.handleMouseLeave,
            onFocus: handlers.handleFocus,
            onBlur: handlers.handleBlur,
            'data-component-id': baseProps.instanceId ?? '',
            'data-editing': baseProps.isEditing ?? false,
        }),
        render: (props, styles, children) => (
            <div {...props} className={styles.base}>
                {children}
            </div>
        ),
        getDefaultStyles: (elements) => ({
            default: elements.reduce((acc, element) => ({
                ...acc,
                [element]: {
                    base: '',
                    hover: '',
                    focus: '',
                    disabled: 'disabled:opacity-50'
                }
            }), {})
        })
    },
    span: {
        getProps: (baseProps, handlers, _state) => ({
            onClick: handlers.handleClick,
            onMouseEnter: handlers.handleMouseEnter,
            onMouseLeave: handlers.handleMouseLeave,
            onFocus: handlers.handleFocus,
            onBlur: handlers.handleBlur,
            'data-component-id': baseProps.instanceId ?? '',
            'data-editing': baseProps.isEditing ?? false,
        }),
        render: (props, styles, children) => (
            <span {...props} className={styles.base}>
                {children}
            </span>
        ),
        getDefaultStyles: (elements) => ({
            default: elements.reduce((acc, element) => ({
                ...acc,
                [element]: {
                    base: '',
                    hover: '',
                    focus: '',
                    disabled: 'disabled:opacity-50'
                }
            }), {})
        })
    },
};