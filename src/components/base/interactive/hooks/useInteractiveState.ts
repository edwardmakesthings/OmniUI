import { useState, useEffect } from 'react';
import { useComponentStore } from '@/store/componentStore';
import { useUIStore } from '@/store/uiStore';
import { BaseState, defaultState } from '@/components/base/interactive/types';
import { BehaviorDefinition } from '@/components/base/interactive/behaviors/types';
import { EntityId } from '@/core/types/EntityTypes';

/**
 * Hook to manage component state for interactive elements
 * Handles both instance-based state (from store) and local state
 */
export function useInteractiveState({
    instanceId,
    initialState = {},
    selectedProp,
    editingProp,
    editable = true,
    behavior
}: {
    instanceId?: EntityId;
    initialState?: Partial<BaseState>;
    selectedProp?: boolean;
    editingProp?: boolean;
    editable?: boolean;
    behavior?: BehaviorDefinition<BaseState>;
}) {
    // Access UI store for edit mode and selection state
    const isEditMode = useUIStore((state) => state.isEditMode);
    const selectedComponent = useUIStore((state) => state.selectedComponent);

    // Access component store for instance state
    const getInstanceState = useComponentStore((state) => state.getInstanceState);
    const updateInstanceState = useComponentStore((state) => state.updateInstanceState);

    // Local state for non-instance components
    const [localState, setLocalState] = useState<BaseState>({
        ...defaultState,
        ...behavior?.initialState,
        ...initialState,
        isEditable: editable,
        isSelected: selectedProp ?? false,
        isEditing: editingProp ?? false,
    });

    // Sync instance state with store when relevant props change
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

    // State change handler with behavior support
    const handleStateChange = (updates: Partial<BaseState>, event?: string) => {
        // Get current element state
        const elementState = instanceId
            ? getInstanceState(instanceId)
            : localState;

        // Apply behavior updates if an event is provided
        const behaviorUpdates = event && behavior
            ? behavior.handleStateChange(elementState, event)
            : {};

        // Combine direct updates with behavior-derived updates
        const combinedUpdates = {
            ...updates,
            ...behaviorUpdates,
        };

        if (instanceId) {
            // Update store for instances
            updateInstanceState(instanceId, combinedUpdates);
        } else {
            // Update local state for non-instances
            setLocalState((prev) => ({ ...prev, ...combinedUpdates }));
        }
    };

    // Get current state based on source (store or local)
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
            isEditing:
                initialState.isEditing ??
                editingProp ??
                (isEditMode && editable),
        }
        : {
            ...localState,
            ...initialState,
            // For non-instances, use props or defaults
            isSelected:
                initialState.isSelected ??
                selectedProp ??
                localState.isSelected,
            isEditing:
                initialState.isEditing ?? editingProp ?? localState.isEditing,
        };

    return {
        elementState,
        handleStateChange
    };
}

export default useInteractiveState;