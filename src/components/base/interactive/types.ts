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

// Simple state declarations for generic instances where a state object is required, but not defined
export const defaultState: BaseState = {
    isHovered: false,
    isFocused: false,
    isPressed: false,
    isActive: false,
    isDisabled: false,
    isVisible: true,
    isSelected: false,
    isEditable: false,
    isEditing: false,
}

export const selectedState: BaseState = {
    isHovered: false,
    isFocused: false,
    isPressed: false,
    isActive: false,
    isDisabled: false,
    isVisible: true,
    isSelected: true,
    isEditable: false,
    isEditing: false
}

export const disabledState: BaseState = {
    isHovered: false,
    isFocused: false,
    isPressed: false,
    isActive: false,
    isDisabled: true,
    isVisible: true,
    isSelected: false,
    isEditable: false,
    isEditing: false
}

export const hiddenState: BaseState = {
    isHovered: false,
    isFocused: false,
    isPressed: false,
    isActive: false,
    isDisabled: false,
    isVisible: false,
    isSelected: false,
    isEditable: false,
    isEditing: false
}

export const editingState: BaseState = {
    isHovered: false,
    isFocused: false,
    isPressed: false,
    isActive: false,
    isDisabled: false,
    isVisible: true,
    isSelected: false,
    isEditable: true,
    isEditing: true
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
    /** Element behavior configuration */
    behavior?: BehaviorDefinition<BaseState>;
    /** Element state bindings for widget mode */
    bindings?: Bindings;
    /** Component identification and state */
    instanceId?: EntityId;
    isActive?: boolean;
    isDisabled?: boolean;
    isVisible?: boolean;
    isSelected?: boolean;
    onSelectedChange?: (selected: boolean) => void;  // Selection callback
    isEditing?: boolean;
    isEditable?: boolean;

    // Rendering configuration
    renderElement?: (props: RenderElementProps) => JSX.Element;
    className?: string;

    // Drag-drop configuration
    draggable?: boolean;
}

export type AbstractInteractiveBaseProps<T extends string = string> = BaseInteractiveProps<T> &
    Omit<HTMLAttributes<HTMLElement>, keyof BaseInteractiveProps<T>>;

export type ButtonProps<T extends string = string> = BaseInteractiveProps<T> &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseInteractiveProps<T>>;

export type InputProps<T extends string = string> = BaseInteractiveProps<T> &
    Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseInteractiveProps<T>>;

export type DivProps<T extends string = string> = BaseInteractiveProps<T> &
    Omit<HTMLAttributes<HTMLDivElement>, keyof BaseInteractiveProps<T>>;

export type SpanProps<T extends string = string> = BaseInteractiveProps<T> &
    Omit<HTMLAttributes<HTMLSpanElement>, keyof BaseInteractiveProps<T>>;

// Helper type to get the correct props type based on element type
export type ElementProps<E extends ElementType, T extends string = string> =
    E extends 'button' ? ButtonProps<T> :
    E extends 'input' ? InputProps<T> :
    E extends 'div' ? DivProps<T> :
    E extends 'span' ? SpanProps<T> :
    never;