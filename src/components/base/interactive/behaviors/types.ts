import { InteractiveBaseState } from '../types';

export interface BehaviorDefinition<TState extends InteractiveBaseState = InteractiveBaseState> {
    name: string;
    // How behavior modifies state
    handleStateChange: (
        currentState: TState,
        event: string,
        data?: any
    ) => Partial<TState>;
    // Initial state modifications
    initialState?: Partial<TState>;
    // Validate if behavior can be applied
    validate?: (props: any) => boolean;
}

export type BehaviorEvent =
    | 'click'
    | 'focus'
    | 'blur'
    | 'mouseEnter'
    | 'mouseLeave'
    | 'change';

export interface ToggleState extends InteractiveBaseState {
    isSelected: boolean;
    isIndeterminate?: boolean;
}

export interface InputState extends InteractiveBaseState {
    isTouched: boolean;
    isDirty: boolean;
    isValid: boolean;
}