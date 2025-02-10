import { BehaviorDefinition, InputState } from './types';

export const inputBehavior: BehaviorDefinition<InputState> = {
    name: 'input',
    initialState: {
        isHovered: false,
        isFocused: false,
        isPressed: false,
        isActive: false,
        isDisabled: false,
        isTouched: false,
        isDirty: false,
        isValid: true
    },
    handleStateChange: (currentState: InputState, event: string, data?: any) => {
        switch (event) {
            case 'focus':
                return { isFocused: true };
            case 'blur':
                return {
                    isFocused: false,
                    isTouched: true
                };
            case 'change':
                return {
                    isDirty: true,
                    isValid: data?.isValid ?? true
                };
            default:
                return {};
        }
    },
    validate: (props: any) => {
        // Add validation logic if needed
        return true;
    }
};