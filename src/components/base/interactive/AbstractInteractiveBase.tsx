import { useEffect, useState } from "react";
import { useComponentStore } from "@/store/componentStore";
import { useUIStore } from "@/store/uiStore";
import { AbstractInteractiveBaseProps, BaseState } from "./types";
import { createElementHandlers } from "./elementHandlers";
import { elementConfigurations } from "./elementConfigs";
import { combineComputedStyles, computeStyles } from "../style/utils";

/**
 * Abstract base for all element components, supporting both UI and widget use cases.
 * Integrates with componentStore for widget state and uiStore for UI state.
 */
export const AbstractInteractiveBase = <T extends string = string>({
    children,
    // Style configuration
    styleElements = ["base"] as T[],
    styleProps,
    stylePreset,
    theme,
    // Behavior configuration
    behavior,
    bindings,
    // Component identification and state
    instanceId,
    isDisabled,
    isVisible = true,
    isSelected: isSelectedProp,
    onSelectedChange,
    isEditing: isEditingProp,
    isEditable = true,
    // Rendering configuration
    renderElement,
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

    // Initialize local state with behavior's initial state if provided
    const [localState, setLocalState] = useState<BaseState>({
        isHovered: false,
        isFocused: false,
        isPressed: false,
        isActive: false,
        isDisabled: !!isDisabled,
        isSelected: !!isSelectedProp,
        isEditable,
        isEditing: false,
        isVisible,
        ...(behavior?.initialState || {}),
    });

    // Primary state management effect
    useEffect(() => {
        if (!instanceId) return; // Only manage state for instances

        // Get current instance state
        const currentState = getInstanceState(instanceId);

        // Determine new editing state based on props and global state
        const newEditingState = isEditingProp ?? (isEditMode && isEditable);

        // Check if selection state has changed
        const newSelectionState =
            isSelectedProp ?? selectedComponent === instanceId;

        // Only update if there are actual changes
        if (
            currentState.isEditing !== newEditingState ||
            currentState.isSelected !== newSelectionState ||
            currentState.isEditable !== isEditable ||
            currentState.isVisible !== isVisible
        ) {
            updateInstanceState(instanceId, {
                isEditable,
                isEditing: newEditingState,
                isSelected: newSelectionState,
                isVisible,
            });
        }
    }, [
        instanceId,
        isEditMode,
        isEditable,
        isEditingProp,
        isSelectedProp,
        selectedComponent,
        isVisible,
        getInstanceState,
        updateInstanceState,
    ]);

    // Selection change handler
    const handleSelectionChange = (selected: boolean) => {
        handleStateChange({ isSelected: selected });
        onSelectedChange?.(selected);
    };

    // Effect for disabled state
    useEffect(() => {
        if (isDisabled !== undefined) {
            handleStateChange({ isDisabled: isDisabled });
        }
    }, [isDisabled]);

    // Effect for registering bindings
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

    // Get state from store if instance exists, otherwise use local state
    const elementState = instanceId
        ? {
              ...((getInstanceState(instanceId) as BaseState) || localState),
              isSelected: isSelectedProp ?? selectedComponent === instanceId,
              isVisible,
              // Editing state comes from store for instances
          }
        : {
              ...localState,
              // For non-instances, use prop or default to false
              isEditing: isEditingProp ?? false,
              isSelected: isSelectedProp ?? false,
              isVisible,
          };

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
            isEditing: elementState.isEditing,
            instanceId,
            bindings,
            // Only allow dragging in edit mode for editable components
            draggable: elementState.isEditing ? isEditable : draggable,
        },
        elementState,
        handleStateChange,
        executeInstanceBinding,
        selectComponent
    );

    // Get element props
    const elementProps = {
        ...elementConfig.getProps(
            {
                ...props,
                isEditing: elementState.isEditing,
                instanceId,
                bindings,
                draggable: elementState.isEditing ? true : draggable,
            },
            handlers,
            elementState
        ),
        style: elementState.isVisible ? undefined : { display: "none" },
        "aria-hidden": !elementState.isVisible,
    };

    // Get base styles from preset or config
    const defaultStyles =
        stylePreset?.variants ||
        elementConfig.getDefaultStyles?.(styleElements) ||
        {};

    // Compute all styles normally
    const computedStyles = computeStyles(
        defaultStyles,
        styleProps || { variant: "default" }
    );

    // Only use the root styles for the base component
    const combinedStyles = {
        root: combineComputedStyles(
            computedStyles.root,
            elementState,
            className
        ),
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

export default AbstractInteractiveBase;
