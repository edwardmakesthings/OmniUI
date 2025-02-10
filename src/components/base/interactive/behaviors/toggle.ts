import { BehaviorDefinition, ToggleState } from './types';

export const toggleBehavior: BehaviorDefinition<ToggleState> = {
    name: 'toggle',
    initialState: {
        isSelected: false,
        isIndeterminate: false,
        isHovered: false,
        isFocused: false,
        isPressed: false,
        isActive: false,
        isDisabled: false
    },
    /**
     * Handles state changes for a toggle behavior.
     *
     * @param {ToggleState} currentState The current state of the toggle.
     * @param {string} event The event that triggered the state change.
     * @returns {Partial<ToggleState>} The new state of the toggle.
     *
     * Handles the following state changes:
     *
     * - `click`: If the toggle is currently indeterminate, sets the toggle to be selected. Otherwise, toggles the `isSelected` property.
     */
    handleStateChange: (currentState: ToggleState, event: string) => {
        switch (event) {
            case 'click':
                // Handle three-state toggle if indeterminate is used
                if (currentState.isIndeterminate) {
                    return {
                        isSelected: true,
                        isIndeterminate: false
                    };
                }
                return { isSelected: !currentState.isSelected };
            default:
                return {};
        }
    }
};