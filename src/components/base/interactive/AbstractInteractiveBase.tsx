import { useEffect, useState } from "react";
import { useComponentStore } from "@/store/componentStore";
import { useUIStore } from "@/store/uiStore";
import { AbstractInteractiveBaseProps, BaseState } from "./types";
import { createElementHandlers } from "./elementHandlers";
import { elementConfigurations } from "./elementConfigs";
import {
    combineComputedStyles,
    composeStyles,
    computeElementStyle,
    computeStyles,
    deepMerge,
} from "../style/utils";
import { editingStyles } from "../style/compositions";
import {
    ComputedElementStyle,
    StyleProps,
    StyleVariants,
} from "../style/types";

/**
 * Abstract base for all element components, supporting both UI and widget use cases.
 * Integrates with componentStore for widget state and uiStore for UI state.
 */
export const AbstractInteractiveBase = <T extends string = string>({
    children,
    // Style configuration
    styleElements = ["base"] as T[], // Default to single base element
    styleProps,
    stylePreset,
    theme,
    // Behavior configuration
    behavior,
    bindings,
    // Component identification and state
    instanceId,
    isEditing: isEditingProp,
    // Rendering configuration
    renderElement,
    disabled,
    className,
    // Drag-drop configuration
    draggable,
    // Base props
    ...props
}: AbstractInteractiveBaseProps<T>) => {
    // UI Store integration
    const isEditMode = useUIStore((state) => state.isEditMode);
    const selectComponent = useUIStore((state) => state.selectComponent);
    const selectedComponent = useUIStore((state) => state.selectedComponent);
    const isEditing = isEditingProp ?? isEditMode;

    // Component Store integration
    const getInstanceState = useComponentStore(
        (state) => state.getInstanceState
    );
    const updateInstanceState = useComponentStore(
        (state) => state.updateInstanceState
    );
    const registerInstanceBinding = useComponentStore(
        (state) => state.registerInstanceBinding
    );
    const executeInstanceBinding = useComponentStore(
        (state) => state.executeInstanceBinding
    );

    // Initialize state with behavior's initial state if provided
    const [localState, setLocalState] = useState<BaseState>({
        isHovered: false,
        isFocused: false,
        isPressed: false,
        isActive: false,
        isDisabled: !!disabled,
        isSelected: false,
        isEditing: false,
        ...(behavior?.initialState || {}),
    });

    // Get state from store if instance exists, otherwise use local state
    const elementState = instanceId
        ? {
              ...((getInstanceState(instanceId) as BaseState) || localState),
              isSelected: selectedComponent === instanceId,
          }
        : localState;

    // Effect hooks for bindings and disabled state
    useEffect(() => {
        if (instanceId && bindings) {
            // Register internal bindings
            Object.entries(bindings.internalBindings || {}).forEach(
                ([path, config]) => {
                    registerInstanceBinding(instanceId, path, config);
                }
            );
            // Register external bindings
            Object.entries(bindings.externalBindings || {}).forEach(
                ([path, config]) => {
                    registerInstanceBinding(instanceId, path, config);
                }
            );
        }
    }, [instanceId, bindings, registerInstanceBinding]);

    useEffect(() => {
        if (disabled !== undefined) {
            handleStateChange({ isDisabled: disabled });
        }
    }, [disabled]);

    // State management with behavior support
    const handleStateChange = (updates: Partial<BaseState>, event?: string) => {
        const behaviorUpdates =
            event && behavior
                ? behavior.handleStateChange(elementState, event)
                : {};

        const combinedUpdates = {
            ...updates,
            ...behaviorUpdates,
        };

        if (instanceId) {
            updateInstanceState(instanceId, combinedUpdates);
        } else {
            setLocalState((prev) => ({ ...prev, ...combinedUpdates }));
        }
    };

    // Get element configuration and create handlers
    const elementConfig = elementConfigurations[props.as];
    const handlers = createElementHandlers(
        {
            ...props,
            isEditing,
            instanceId,
            bindings,
            draggable: isEditing ? true : draggable,
        },
        elementState,
        handleStateChange,
        executeInstanceBinding,
        selectComponent
    );

    // Get props and compute styles
    const elementProps = elementConfig.getProps(
        {
            ...props,
            isEditing,
            instanceId,
            bindings,
            draggable: isEditing ? true : draggable,
        },
        handlers,
        elementState
    );

    // Get base styles from preset or config
    const defaultStyles =
        stylePreset?.variants ||
        elementConfig.getDefaultStyles?.(styleElements) ||
        {};

    // Add editing styles if in edit mode
    const stylesWithEditing = isEditing
        ? Object.entries(defaultStyles).reduce(
              (acc, [variantName, variantStyles]) => ({
                  ...acc,
                  [variantName]: Object.entries(variantStyles).reduce(
                      (elemAcc, [elemName, elemStyle]) => ({
                          ...elemAcc,
                          [elemName]: composeStyles(
                              computeElementStyle(elemStyle, theme),
                              editingStyles.default
                          ),
                      }),
                      {}
                  ),
              }),
              {}
          )
        : defaultStyles;

    // Compute all styles normally
    const computedStyles = computeStyles(
        stylesWithEditing,
        styleProps || { variant: "default" }
    );

    // Create state object for style computation
    const elementStyleState: BaseState = {
        isHovered: elementState.isHovered,
        isFocused: elementState.isFocused,
        isPressed: elementState.isPressed,
        isActive: elementState.isActive,
        isDisabled: elementState.isDisabled,
        isSelected: elementState.isSelected,
        isEditing: elementState.isEditing,
    };

    // Only use the root styles for the base component
    const combinedStyles = {
        root: combineComputedStyles(
            computedStyles.root,
            elementStyleState,
            className
        ),
    };

    // Use custom renderer if provided
    if (renderElement) {
        return renderElement({
            elementProps: { ...elementProps },
            state: elementState,
            children,
            computedStyle: combinedStyles,
        });
    }

    // Use the configuration's render method with computed styles
    return elementConfig.render({ ...elementProps }, combinedStyles, children);
};

export default AbstractInteractiveBase;
