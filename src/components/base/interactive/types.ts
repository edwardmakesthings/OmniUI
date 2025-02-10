import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { BindingConfig, ExternalBindingConfig } from '@/core/base/ComponentInstance';
import { EntityId } from '@/core/types/EntityTypes';
import { StyleProps } from '../style/styleTypes';
import { Theme } from '../style/themeTypes';
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

export interface InteractiveBaseState {
    isHovered: boolean;
    isFocused: boolean;
    isPressed: boolean;
    isActive: boolean;
    isDisabled: boolean;
}

export interface Bindings {
    internalBindings?: Record<string, BindingConfig>;
    externalBindings?: Record<string, ExternalBindingConfig>;
}

export interface RenderElementProps {
    elementProps: HTMLAttributes<HTMLElement>;
    state: InteractiveBaseState;
    children?: ReactNode;
    computedStyle: Record<string, string>;
}

export interface BaseInteractiveProps {
    /** Element HTML type */
    as: ElementType;
    /** Element's content */
    children?: ReactNode;
    /** Styled elements configuration */
    styleElements?: string[];
    /** Style props for customization */
    styleProps?: StyleProps<string>;
    /** Preset style configuration */
    stylePreset?: StylePreset;
    /** Optional theme for token-based styling */
    theme?: Theme;
    /** Optional component ID for widget mode */
    instanceId?: EntityId;
    /** Element behavior configuration */
    behavior?: BehaviorDefinition<InteractiveBaseState>;
    /** Element state bindings for widget mode */
    bindings?: Bindings;
    /** Whether the element is in widget edit mode */
    isEditing?: boolean;
    /** Custom renderer for the element */
    renderElement?: (props: RenderElementProps) => ReactNode;
    /** Disable element if it is supported */
    disabled?: boolean;
}

// Element-specific props
interface ButtonProps extends BaseInteractiveProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
    as: 'button';
}

interface InputProps extends BaseInteractiveProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'style'> {
    as: 'input';
}

interface DivProps extends BaseInteractiveProps, Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
    as: 'div';
}

interface SpanProps extends BaseInteractiveProps, Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
    as: 'span';
}

// Discriminated union for all element types
export type AbstractInteractiveBaseProps =
    | ButtonProps
    | InputProps
    | DivProps
    | SpanProps;