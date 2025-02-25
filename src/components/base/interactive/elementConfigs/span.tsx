import { ElementConfig } from "./types";

/**
 * Configuration for span elements
 * Defines default props, rendering, styling, and behavior
 */
export const spanConfig: ElementConfig<HTMLSpanElement> = {
    getProps: (baseProps, handlers, state) => ({
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
};

export default spanConfig;
