import { useEffect, useState } from "react";
import { useComponentStore } from "@/store/componentStore";
import { useUIStore } from "@/store/uiStore";
import { AbstractInteractiveBaseProps, BaseState, defaultState } from "./types";
import { createElementHandlers } from "./elementHandlers";
import { elementConfigurations } from "./elementConfigs";
import { combineComputedStyles, computeStyles } from "../style/utils";

/**
 * Abstract base for all element components, supporting both UI and widget use cases.
 * Integrates with componentStore for widget state and uiStore for UI state.
 */
export const AbstractInteractiveBase = <T extends string = string>({
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

    // Custom rendering
    renderElement,

    // Remaining props
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

    // Initialize local state with defaults, behavior's initial state, and provided initial state
    const [localState, setLocalState] = useState<BaseState>({
        ...defaultState,
        ...behavior?.initialState,
        ...initialState,
        isEditable: editable,
        isSelected: selectedProp ?? false,
        isEditing: editingProp ?? false,
    });

    // Primary state management effect for instances
    useEffect(() => {
        if (!instanceId) return;

        const currentState = getInstanceState(instanceId);
        const newState = {
            ...currentState,
            // Selection state: prop control or UI store
            isSelected: selectedProp ?? selectedComponent === instanceId,
            // Editing state: prop control or global edit mode
            isEditing: editingProp ?? (isEditMode && editable),
            // Core state flags
            isEditable: editable,
        };

        // Only update if there are actual changes
        if (JSON.stringify(currentState) !== JSON.stringify(newState)) {
            updateInstanceState(instanceId, newState);
        }
    }, [
        instanceId,
        isEditMode,
        selectedComponent,
        selectedProp,
        editingProp,
        editable,
        getInstanceState,
        updateInstanceState,
    ]);

    // // Effect for disabled state
    // useEffect(() => {
    //     if (isDisabled !== undefined) {
    //         handleStateChange({ isDisabled: isDisabled });
    //     }
    // }, [isDisabled]);

    // Effect for registering bindings
    useEffect(() => {
        if (!instanceId || !bindings) return;

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
    }, [instanceId, bindings, registerInstanceBinding]);

    // Get current state from store if instance exists, otherwise use local state
    const elementState = instanceId
        ? {
              ...getInstanceState(instanceId),
              ...initialState,
              // Always use most current selection state
              isSelected:
                  initialState.isSelected ??
                  selectedProp ??
                  selectedComponent === instanceId,
              // Always use most current editing state
              isEditing: editingProp ?? (isEditMode && editable),
          }
        : {
              ...localState,
              ...initialState,
              // For non-instances, use props or defaults
              isSelected:
                  initialState.isSelected ??
                  selectedProp ??
                  localState.isSelected,
              isEditing: editingProp ?? localState.isEditing,
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
    const elementConfig = elementConfigurations[as];
    const handlers = createElementHandlers(
        {
            ...props,
            as,
            instanceId,
            bindings,
            onSelectedChange,
            // Only allow dragging in edit mode for editable components
            draggable: elementState.isEditing ? editable : draggable,
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

    // Compute all styles
    const computedStyles = computeStyles(
        defaultStyles,
        styleProps || { variant: "default" }
    );

    // Create combined styles for each element
    const elementNames = Object.keys(
        computedStyles
    ) as (keyof typeof computedStyles)[];

    // Create combinedStyles by processing each element
    const combinedStyles = elementNames.reduce((acc, elementName) => {
        return {
            ...acc,
            [elementName]: combineComputedStyles(
                computedStyles[elementName],
                elementState,
                // Only apply className to root element
                elementName === "root" ? className : undefined
            ),
        };
    }, {} as Record<string, string>);

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
