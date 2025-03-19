import { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, RefObject } from 'react';
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
    isDragging: boolean;
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
    isDragging: false
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
    isEditing: false,
    isDragging: false
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
    isEditing: false,
    isDragging: false
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
    isEditing: false,
    isDragging: false
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
    isEditing: false,
    isDragging: false
}

export interface Bindings {
    internalBindings?: Record<string, BindingConfig>;
    externalBindings?: Record<string, ExternalBindingConfig>;
}

/**
 * Element handler types for different HTML elements
 */
export interface ElementHandlers<T extends HTMLElement> {
    // Basic interactions
    handleClick: (e: React.MouseEvent<T>) => Promise<void>;
    handleMouseEnter: (e: React.MouseEvent<T>) => void;
    handleMouseLeave: (e: React.MouseEvent<T>) => void;
    handleFocus: (e: React.FocusEvent<T>) => void;
    handleBlur: (e: React.FocusEvent<T>) => void;

    // Drag and drop for component creation/manipulation
    handleDragStart?: (e: React.DragEvent<T>) => void;
    handleDragEnd?: (e: React.DragEvent<T>) => void;
    handleDragOver?: (e: React.DragEvent<T>) => void;
    handleDrop?: (e: React.DragEvent<T>) => void;
    handleDragLeave?: (e: React.DragEvent<T>) => void;
}

export interface RenderElementProps {
    elementProps: HTMLAttributes<HTMLElement>;
    state: BaseState;
    children?: ReactNode;
    computedStyle: Record<string, string>;
}

// Drag and Drop types

export interface DragData {
    id: string;
    type: string;
    data?: Record<string, any>;
}

export type DropPosition = 'before' | 'after' | 'inside';

export interface DropTarget {
    id: string;
    position: DropPosition;
    data?: Record<string, any>;
}

export interface DragDropProps {
    // Drag configuration
    draggable?: boolean;
    dragData?: DragData;
    dragPreview?: ReactNode;
    onDragStart?: (e: React.DragEvent, data: DragData) => void;
    onDragEnd?: (e: React.DragEvent) => void;

    // Drop configuration
    droppable?: boolean;
    acceptTypes?: string[];
    dropPositions?: DropPosition[];
    onDrop?: (e: React.DragEvent, data: DragData, target: DropTarget) => void;

    // Hover feedback
    dragOverClassName?: string;
    dropPositionClassNames?: Partial<Record<DropPosition, string>>;
}

// Main component types

export interface BaseInteractiveProps<T extends string = string> {
    /** Element HTML type */
    as: ElementType;

    /** Element's content */
    children?: ReactNode;

    /** Component identification and state */
    instanceId?: EntityId;

    /** Direct state control flags */
    state?: Partial<BaseState>;
    /** Direct selection control */
    selected?: boolean;
    /** Direct editing control */
    editing?: boolean;
    /** Can be edited when in edit mode */
    editable?: boolean;

    // Event handlers
    /** Selection state change callback */
    onSelectedChange?: (selected: boolean) => void;
    /** Click event handler */
    onClick?: (event: React.MouseEvent) => void;
    /** Mouse enter event handler */
    onMouseEnter?: (event: React.MouseEvent) => void;
    /** Mouse leave event handler */
    onMouseLeave?: (event: React.MouseEvent) => void;
    /** Focus event handler */
    onFocus?: (event: React.FocusEvent) => void;
    /** Blur event handler */
    onBlur?: (event: React.FocusEvent) => void;

    /** Element behavior configuration */
    behavior?: BehaviorDefinition<BaseState>;

    /** Element state bindings for widget mode */
    bindings?: Bindings;

    // Style configuration
    /** Styled elements configuration */
    styleElements?: T[];
    /** Style props for customization */
    styleProps?: StyleProps<T>;
    /** Preset style configuration */
    stylePreset?: StylePreset<T>;
    /** Optional theme for token-based styling */
    theme?: Theme;
    /** Base class name for styling */
    className?: string;

    // Rendering configuration
    /** Custom render function */
    renderElement?: (props: RenderElementProps) => JSX.Element;

    // Drag and drop configuration
    draggable?: boolean;
    dragType?: string;
    dragData?: Record<string, any>;
    onDragStart?: (e: React.DragEvent) => void;
    onDragEnd?: (e: React.DragEvent) => void;

    // Drop configuration
    droppable?: boolean;
    acceptTypes?: string[];
    dropPositions?: DropPosition[];
    onDrop?: (e: React.DragEvent, dragData: DragData, target: DropTarget) => void;

    elementRef?: RefObject<HTMLElement>;
}

export type BaseInteractorProps<T extends string = string> = BaseInteractiveProps<T> &
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