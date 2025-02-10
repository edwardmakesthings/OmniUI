import { InteractiveBaseState } from '../types';
import { BehaviorDefinition } from './types';

export const buttonBehavior: BehaviorDefinition<InteractiveBaseState> = {
    name: 'button',
    initialState: {
        isHovered: false,
        isFocused: false,
        isPressed: false,
        isActive: false,
        isDisabled: false
    },
    handleStateChange: (currentState: InteractiveBaseState, event: string) => {
        switch (event) {
            case 'mousedown':
                return { isPressed: true };
            case 'mouseup':
                return { isPressed: false };
            case 'click':
                return { isActive: true, isPressed: false };
            default:
                return {};
        }
    }
};