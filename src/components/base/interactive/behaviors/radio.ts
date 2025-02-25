import { BaseState } from "../types";
import { BehaviorDefinition } from "./types";

interface RadioState extends BaseState {
    isSelected: boolean;
    groupValue?: string | number;
}

export const radioBehavior: BehaviorDefinition<RadioState> = {
    name: 'radio',
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
    handleStateChange: (currentState: RadioState, event: string, data?: any) => {
        switch (event) {
            case 'click':
                if (data?.groupValue !== undefined) {
                    return {
                        isSelected: data.groupValue === data.value,
                        groupValue: data.groupValue
                    };
                }
                return { isSelected: !currentState.isSelected };
            default:
                return {};
        }
    }
};