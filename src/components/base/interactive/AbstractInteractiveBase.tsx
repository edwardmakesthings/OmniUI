import { useEffect, useState } from 'react';
import { useComponentStore } from '@/store/componentStore';
import { useUIStore } from '@/store/uiStore';
import { AbstractInteractiveBaseProps, InteractiveBaseState } from './types';
import { createElementHandlers } from './elementHandlers';
import { elementConfigurations } from './elementConfigs';
import { computeStyles } from '../style/styleUtils';

/**
 * Abstract base for all element components, supporting both UI and widget use cases.
 * Integrates with componentStore for widget state and uiStore for UI state.
 */
export const AbstractInteractiveBase = ({
    children,
    styleElements = ['base'],  // Default to single base element
    styleProps,
    stylePreset,
    theme,
    behavior,
    bindings,
    instanceId,
    isEditing: isEditingProp,
    renderElement,
    disabled,
    className,
    ...props
}: AbstractInteractiveBaseProps) => {
    // UI Store integration
    const isEditMode = useUIStore(state => state.isEditMode);
    const isEditing = isEditingProp ?? isEditMode;

    // Component Store integration
    const getInstanceState = useComponentStore(state => state.getInstanceState);
    const updateInstanceState = useComponentStore(state => state.updateInstanceState);
    const registerInstanceBinding = useComponentStore(state => state.registerInstanceBinding);
    const executeInstanceBinding = useComponentStore(state => state.executeInstanceBinding);

    // Initialize state with behavior's initial state if provided
    const [localState, setLocalState] = useState<InteractiveBaseState>({
        isHovered: false,
        isFocused: false,
        isPressed: false,
        isActive: false,
        isDisabled: !!disabled,
        ...(behavior?.initialState || {})
    });

    const elementState = instanceId
        ? getInstanceState(instanceId) as InteractiveBaseState || localState
        : localState;

    // Effect hooks for bindings and disabled state
    useEffect(() => {
        if (instanceId && bindings) {
            Object.entries(bindings.internalBindings || {}).forEach(([path, config]) => {
                registerInstanceBinding(instanceId, path, config);
            });
            Object.entries(bindings.externalBindings || {}).forEach(([path, config]) => {
                registerInstanceBinding(instanceId, path, config);
            });
        }
    }, [instanceId, bindings, registerInstanceBinding]);

    useEffect(() => {
        if (disabled !== undefined) {
            handleStateChange({ isDisabled: disabled });
        }
    }, [disabled]);

    // State management that considers behavior
    const handleStateChange = (updates: Partial<InteractiveBaseState>, event?: string) => {
        const behaviorUpdates = event && behavior
            ? behavior.handleStateChange(elementState, event)
            : {};

        const combinedUpdates = {
            ...updates,
            ...behaviorUpdates
        };

        if (instanceId) {
            updateInstanceState(instanceId, combinedUpdates);
        } else {
            setLocalState(prev => ({ ...prev, ...updates }));
        }
    };

    // Get element configuration and create handlers
    const elementConfig = elementConfigurations[props.as];
    const handlers = createElementHandlers(
        { ...props, isEditing, instanceId, bindings },
        elementState,
        handleStateChange,
        executeInstanceBinding
    );

    // Get props and compute style
    const elementProps = elementConfig.getProps(
        { ...props, isEditing, instanceId, bindings },
        handlers,
        elementState
    );

    const defaultStyles = stylePreset?.variants || elementConfig.getDefaultStyles?.(styleElements) || {};
    const computedStyles = computeStyles(
        defaultStyles,
        styleProps || { variant: 'default' },
        elementState
    );

    // Use custom renderer if provided
    if (renderElement) {
        return renderElement({
            elementProps,
            state: elementState,
            children,
            computedStyle: computedStyles
        });
    }

    // Use the configuration's render method with computed styles
    return elementConfig.render(
        elementProps,
        {
            ...computedStyles,
            base: `${computedStyles.base} ${className || ''}`
        },
        children
    );
};

export default AbstractInteractiveBase;
