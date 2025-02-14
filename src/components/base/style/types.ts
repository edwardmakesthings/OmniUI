import { BaseState } from '../interactive/types';
import { Theme } from './theme/types';

// Style value can be either a direct class string or a theme token reference
export type StyleValue = string | {
    token: string;      // Path to theme token
    fallback?: string;  // Fallback value if token not found
};

// Basic style definition for any element
export interface ElementStyle {
    base?: StyleValue;
    hover?: StyleValue;
    focus?: StyleValue;
    pressed?: StyleValue;
    active?: StyleValue;
    disabled?: StyleValue;
    selected?: StyleValue;
    editing?: StyleValue;
}

// Type helper to ensure 'root' is always included in element types
export type WithRequired<T extends string, K extends string> = T | K;

// Type for all styled elements in a component, requiring 'root'
export type StyledElements<T extends string> = {
    [K in WithRequired<T, 'root'>]: ElementStyle;
};

// Helper type for creating style variants, each variant must include all elements
export type StyleVariants<T extends string> = Record<string, StyledElements<T>>;

// Theme configuration for overriding styles
export interface ThemeConfig<T extends string> {
    variants?: Record<string, StyledElements<T>>;
    states?: Partial<Record<keyof BaseState, StyleValue>>; // May not be needed?
    elements?: Partial<Record<T, ElementStyle>>;
}

// Style props for any component using this system
export interface StyleProps<T extends string> {
    variant: string;
    elements?: Partial<StyledElements<T>>;
    themeOverrides?: ThemeConfig<T>;
    theme?: Theme;  // Optional theme to use for token resolution
}

// The computed result of applying styles
export interface ComputedElementStyle {
    base?: string;
    hover?: string;
    focus?: string;
    pressed?: string;
    active?: string;
    disabled?: string;
    selected?: string;
    editing?: string;
}

// The result of style computation includes all elements and their states
export type ComputedStyles<T extends string> = {
    [K in WithRequired<T, 'root'>]: ComputedElementStyle;
};

// Helper function type for computing styles
export type StyleComputer = (styles: ComputedElementStyle | string) => ComputedElementStyle;