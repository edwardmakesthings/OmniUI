import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { BindingConfig, ExternalBindingConfig } from '@/core/base/ComponentInstance';
import { EntityId } from '@/core/types/EntityTypes';
import { StyleProps } from '../style/types';
import { Theme } from '../style/theme/types';
import { BehaviorDefinition } from './behaviors/types';
import { StylePreset } from '../style/presets/types';

export type ElementBehavior = 'button' | 'input';
export type ElementType = 'button' | 'input' | 'div' | 'span';

export interface ButtonBehaviorConfig {
    type: 'default' | 'toggle' | 'radio' | 'submit';
}

export interface InputBehaviorConfig {
    type: 'text' | 'number' | 'password';
}

export interface BehaviorConfig {
    behavior: ElementBehavior;
    config?: ButtonBehaviorConfig | InputBehaviorConfig;
}

export interface BaseState {
    isHovered: boolean;
    isFocused: boolean;
    isPressed: boolean;
    isActive: boolean;
    isDisabled: boolean;
    isVisible: boolean;
    isSelected: boolean;
    isEditable: boolean;
    isEditing: boolean;
}

export interface Bindings {
    internalBindings?: Record<string, BindingConfig>;
    externalBindings?: Record<string, ExternalBindingConfig>;
}

export interface RenderElementProps {
    elementProps: HTMLAttributes<HTMLElement>;
    state: BaseState;
    children?: ReactNode;
    computedStyle: Record<string, string>;
}

export interface BaseInteractiveProps<T extends string = string> {
    /** Element HTML type */
    as: ElementType;
    /** Element's content */
    children?: ReactNode;
    /** Styled elements configuration */
    styleElements?: T[];
    /** Style props for customization */
    styleProps?: StyleProps<T>;
    /** Preset style configuration */
    stylePreset?: StylePreset<T>;
    /** Optional theme for token-based styling */
    theme?: Theme;
    /** Optional component ID for widget mode */
    instanceId?: EntityId;
    /** Element behavior configuration */
    behavior?: BehaviorDefinition<BaseState>;
    /** Element state bindings for widget mode */
    bindings?: Bindings;
    /** Disable or hide element if it is supported */
    isDisabled?: boolean;
    isVisible?: boolean;
    /** Whether the element is selected */
    isSelected?: boolean;
    onSelectedChange?: (selected: boolean) => void;  // Selection callback
    /** Whether the element is in widget edit mode */
    isEditing?: boolean;
    isEditable?: boolean;

    /** Custom renderer for the element */
    renderElement?: (props: RenderElementProps) => JSX.Element;
    /** Optional class name */
    className?: string;

}

export type AbstractInteractiveBaseProps<T extends string = string> =
    BaseInteractiveProps<T> &
    Omit<HTMLAttributes<HTMLElement>, keyof BaseInteractiveProps<T>>;

export type ButtonProps<T extends string = string> =
    BaseInteractiveProps<T> &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseInteractiveProps<T>>;

export type InputProps<T extends string = string> =
    BaseInteractiveProps<T> &
    Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseInteractiveProps<T>>;