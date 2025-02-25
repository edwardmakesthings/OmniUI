import { ElementConfig } from "./types";

/**
 * Configuration for div elements
 * Defines default props, rendering, styling, and behavior
 */
export const divConfig: ElementConfig<HTMLDivElement> = {
    getProps: (baseProps, handlers, state) => ({
        onClick: handlers.handleClick,
        onMouseEnter: handlers.handleMouseEnter,
        onMouseLeave: handlers.handleMouseLeave,
        onFocus: handlers.handleFocus,
        onBlur: handlers.handleBlur,
        onDragStart: handlers.handleDragStart,
        onDragEnd: handlers.handleDragEnd,
        onDragOver: handlers.handleDragOver,
        onDragLeave: handlers.handleDragLeave,
        onDrop: handlers.handleDrop,
        draggable: baseProps.draggable,
        "data-component-id": baseProps.instanceId ?? "",
        "data-editing": state.isEditing,
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
};

export default divConfig;
