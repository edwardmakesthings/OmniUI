import { BaseState } from '../types';
import { BehaviorDefinition } from './types';

export const buttonBehavior: BehaviorDefinition<BaseState> = {
    name: 'button',
    initialState: {
        isHovered: false,
        isFocused: false,
        isPressed: false,
        isActive: false,
        isDisabled: false,
        isSelected: false,
        isEditing: false,
        isDragging: false
    },
    handleStateChange: (currentState: BaseState, event: string) => {
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