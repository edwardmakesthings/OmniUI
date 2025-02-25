import { ElementConfig } from "./types";

/**
 * Configuration for input elements
 * Defines default props, rendering, styling, and behavior
 */
export const inputConfig: ElementConfig<HTMLInputElement> = {
    getProps: (baseProps, handlers, state) => ({
        type: "text",
        disabled: state.isDisabled,
        onClick: handlers.handleClick,
        onMouseEnter: handlers.handleMouseEnter,
        onMouseLeave: handlers.handleMouseLeave,
        onFocus: handlers.handleFocus,
        onBlur: handlers.handleBlur,
        "data-component-id": baseProps.instanceId ?? "",
        "data-editing": baseProps.editing ?? false,
        "data-selected": state.isSelected,
    }),

    render: (props, styles) => (
        <input {...props} {...(styles.root && { className: styles.root })} />
    ),

    getDefaultStyles: (elements) => ({
        default: elements.reduce(
            (acc, element) => ({
                ...acc,
                [element]: {
                    base: "block w-full border border-gray-300 rounded-md",
                    hover: "hover:border-gray-400",
                    focus: "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    disabled: "disabled:opacity-50 disabled:cursor-not-allowed",
                },
            }),
            {}
        ),
    }),

    defaultBehavior: {
        name: "input",
        handleStateChange: (state, event) => {
            if (event === "focus") {
                return { isFocused: true };
            }
            if (event === "blur") {
                return { isFocused: false };
            }
            return {};
        },
    },
};

export default inputConfig;
