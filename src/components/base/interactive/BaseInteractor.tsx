import { useRef, useState } from "react";
import { useComponentStore } from "@/store/componentStore";
import { useUIStore } from "@/store/uiStore";
import { BaseInteractorProps, DropPosition } from "./types";
import { elementConfigurations } from "./elementConfigs";
import {
    useInteractiveState,
    useInteractiveHandlers,
    useInteractiveStyles,
    useInteractiveBindings,
} from "./hooks";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Base interactive component that provides state management, event handling,
 * and styling based on element type and current state.
 *
 * @template T - Element specific style elements
 */
export const BaseInteractor = <T extends string = string>({
    // Core props
    as,
    children,
    instanceId,

    // State configuration
    state: initialState = {},

    // Selection control
    selected: selectedProp, // Direct control of selection
    onSelectedChange,

    // Edit control
    editable = true, // Can be edited when in edit mode
    editing: editingProp, // Direct control of editing

    // Style configuration
    styleElements = ["base"] as T[],
    styleProps,
    stylePreset,
    theme,
    className,

    // Behavior configuration
    behavior,
    bindings,

    // Drag-drop configuration
    draggable,
    dragType,
    dragData,
    droppable,
    acceptTypes,
    dropPositions,
    onDragStart,
    onDragEnd,
    onDrop,

    // Custom rendering
    renderElement,

    // External reference
    elementRef: externalRef,

    // Remaining props
    ...props
}: BaseInteractorProps<T>) => {
    // Get theme from context
    const { currentTheme } = useTheme();

    // Create ref for the root element
    const internalRef = useRef<HTMLElement>(null);
    const elementRef = externalRef || internalRef;
    const [dropPosition, setDropPosition] = useState<DropPosition | null>(null);

    // UI Store integration for element selection
    const selectComponent = useUIStore((state) => state.selectComponent);

    // Component Store integration for binding execution
    const executeInstanceBinding = useComponentStore(
        (state) => state.executeInstanceBinding
    );

    // Get element configuration based on element type
    const elementConfig = elementConfigurations[as];

    // Use hooks for state, handlers, styles, and bindings
    const { elementState, handleStateChange } = useInteractiveState({
        instanceId,
        initialState,
        selectedProp,
        editingProp,
        editable,
        behavior,
    });

    // Set up bindings for the component
    useInteractiveBindings({
        instanceId,
        bindings,
    });

    // Create handlers for interactive events
    const handlers = useInteractiveHandlers({
        props: {
            instanceId,
            bindings,
            onSelectedChange,
            draggable,
            dragType,
            dragData,
            droppable,
            acceptTypes,
            dropPositions,
            onDragStart,
            onDragEnd,
            onDrop,
            ...props,
        },
        elementState,
        handleStateChange,
        executeInstanceBinding,
        selectComponent,
        elementRef,
        setDropPosition,
    });

    // Compute styles based on state and configuration
    const { combinedStyles } = useInteractiveStyles({
        elementConfig,
        stylePreset,
        styleProps,
        styleElements,
        elementState,
        className,
    });

    // Get element props
    const elementProps = {
        ...elementConfig.getProps(
            {
                ...props,
                instanceId,
                bindings,
                draggable: elementState.isEditing ? true : draggable,
            },
            handlers,
            elementState
        ),
        ref: elementRef,
        style: elementState.isVisible ? undefined : { display: "none" },
        "aria-hidden": !elementState.isVisible,
        "data-drop-position": dropPosition,
        ...(dropPosition && { [`data-drop-${dropPosition}`]: "" }),
    };

    // Use custom renderer if provided
    if (renderElement) {
        return renderElement({
            elementProps,
            state: elementState,
            children,
            computedStyle: combinedStyles,
        });
    }

    // Use the configuration's render method with computed styles
    return elementConfig.render(elementProps, combinedStyles, children);
};

export default BaseInteractor;
