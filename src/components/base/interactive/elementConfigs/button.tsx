import { ElementConfig } from "./types";

/**
 * Configuration for button elements
 * Defines default props, rendering, styling, and behavior
 */
export const buttonConfig: ElementConfig<HTMLButtonElement> = {
    getProps: (baseProps, handlers, state) => ({
        type: "button",
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
};

export default buttonConfig;
