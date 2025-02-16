import { HTMLAttributes, ReactNode } from "react";
import { ElementHandlers } from "./elementHandlers";
import { AbstractInteractiveBaseProps, BaseState } from "./types";
import { StyleVariants } from "../style/types";
import { BehaviorDefinition } from "./behaviors/types";

export interface ElementConfig<T extends HTMLElement> {
    getProps: (
        baseProps: Omit<AbstractInteractiveBaseProps, "as">,
        handlers: ElementHandlers<T>,
        state: BaseState
    ) => HTMLAttributes<T>;
    render: (
        props: HTMLAttributes<T>,
        styles: Record<string, string>,
        children?: ReactNode
    ) => JSX.Element;
    getDefaultStyles?: (elements: string[]) => StyleVariants<string>;
    defaultBehavior?: BehaviorDefinition<BaseState>;
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
            type: "button",
            disabled: state.isDisabled,
            onClick: handlers.handleClick,
            onMouseEnter: handlers.handleMouseEnter,
            onMouseLeave: handlers.handleMouseLeave,
            onFocus: handlers.handleFocus,
            onBlur: handlers.handleBlur,
            "data-component-id": baseProps.instanceId ?? "",
            "data-editing": baseProps.isEditing ?? false,
            "data-selected": state.isSelected,
        }),
        render: (props, styles, children) => (
            <button {...props} {...(styles.root && { className: styles.root })}>
                {children}
            </button>
        ),
        getDefaultStyles: (elements) => ({
            default: elements.reduce(
                (acc, element) => ({
                    ...acc,
                    [element]: {
                        base: "inline-flex items-center justify-center",
                        hover: "bg-gray-100",
                        focus: "ring-2 ring-offset-2 ring-blue-500",
                        active: "bg-gray-200",
                        disabled: "opacity-50 cursor-not-allowed",
                    },
                }),
                {}
            ),
        }),
        supportedBehaviors: ["toggle", "radio"],
        defaultBehavior: {
            name: "button",
            handleStateChange: (state, event) => {
                if (event === "click") {
                    return { isActive: !state.isActive };
                }
                return {};
            },
        },
    },
    input: {
        getProps: (baseProps, handlers, state) => ({
            type: "text",
            disabled: state.isDisabled,
            onClick: handlers.handleClick,
            onMouseEnter: handlers.handleMouseEnter,
            onMouseLeave: handlers.handleMouseLeave,
            onFocus: handlers.handleFocus,
            onBlur: handlers.handleBlur,
            "data-component-id": baseProps.instanceId ?? "",
            "data-editing": baseProps.isEditing ?? false,
            "data-selected": state.isSelected,
        }),
        render: (props, styles) => (
            <input
                {...props}
                {...(styles.root && { className: styles.root })}
            />
        ),
        getDefaultStyles: (elements) => ({
            default: elements.reduce(
                (acc, element) => ({
                    ...acc,
                    [element]: {
                        base: "block w-full border border-gray-300 rounded-md",
                        hover: "hover:border-gray-400",
                        focus: "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                        disabled:
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                    },
                }),
                {}
            ),
        }),
    },
    div: {
        getProps: (baseProps, handlers, state) => ({
            onClick: handlers.handleClick,
            onMouseEnter: handlers.handleMouseEnter,
            onMouseLeave: handlers.handleMouseLeave,
            onFocus: handlers.handleFocus,
            onBlur: handlers.handleBlur,
            "data-component-id": baseProps.instanceId ?? "",
            "data-editing": baseProps.isEditing ?? false,
            "data-selected": state.isSelected,
            role: "button", // For accessibility
            tabIndex: state.isDisabled ? -1 : 0, // For keyboard navigation
            "aria-disabled": state.isDisabled,
            "aria-expanded": state.isActive, // For dropdown-like components
        }),
        render: (props, styles, children) => (
            <div {...props} {...(styles.root && { className: styles.root })}>
                {children}
            </div>
        ),
        getDefaultStyles: (elements) => ({
            default: elements.reduce(
                (acc, element) => ({
                    ...acc,
                    [element]: {
                        base: "relative inline-block",
                        hover: "",
                        focus: "focus:outline-none",
                        active: "",
                        disabled: "opacity-50 cursor-not-allowed",
                    },
                }),
                {}
            ),
        }),
        supportedBehaviors: ["dropdown"],
        defaultBehavior: {
            name: "dropdown",
            handleStateChange: (state, event) => {
                if (event === "click") {
                    return { isActive: !state.isActive };
                }
                return {};
            },
        },
    },
    span: {
        getProps: (baseProps, handlers, state) => ({
            onClick: handlers.handleClick,
            onMouseEnter: handlers.handleMouseEnter,
            onMouseLeave: handlers.handleMouseLeave,
            onFocus: handlers.handleFocus,
            onBlur: handlers.handleBlur,
            "data-component-id": baseProps.instanceId ?? "",
            "data-editing": baseProps.isEditing ?? false,
            "data-selected": state.isSelected,
        }),
        render: (props, styles, children) => (
            <span {...props} {...(styles.root && { className: styles.root })}>
                {children}
            </span>
        ),
        getDefaultStyles: (elements) => ({
            default: elements.reduce(
                (acc, element) => ({
                    ...acc,
                    [element]: {
                        base: "inline-flex items-center",
                        hover: "",
                        focus: "",
                        disabled: "opacity-50",
                    },
                }),
                {}
            ),
        }),
    },
};

export type ElementType = keyof typeof elementConfigurations;
