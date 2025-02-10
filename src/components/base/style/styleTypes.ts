import { Theme } from './themeTypes';

// Base types for measurements and sizes
export type PresetSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DynamicSize = PresetSize | number;

// Common variant types
export type CommonVariant = 'solid' | 'ghost' | 'outline' | 'minimal';
export type CommonShape = 'square' | 'rounded' | 'circle';
export type CommonPadding = 'none' | 'tight' | 'normal' | 'loose';

// Style state interface for consistent state-based styling
export interface StyleState {
    isHovered: boolean;
    isFocused: boolean;
    isPressed: boolean;
    isActive: boolean;
    isDisabled: boolean;
}

// Style value can be either a direct class string or a theme token reference
export type StyleValue = string | {
    token: string;      // Path to theme token
    fallback?: string;  // Fallback value if token not found
}

// Basic style definition for any element
export interface ElementStyle {
    base?: StyleValue;
    hover?: StyleValue;
    focus?: StyleValue;
    active?: StyleValue;
    pressed?: StyleValue;
    disabled?: StyleValue;
}

// Type for defining which elements in a component can be styled
export type StyledElements<T extends string> = Record<T, ElementStyle>;

// Helper type for creating style variants
export type StyleVariants<T extends string> = Record<string, StyledElements<T>>;

// Theme configuration for overriding styles
export interface ThemeConfig<T extends string> {
    variants?: Record<string, StyledElements<T>>;
    states?: Partial<Record<keyof StyleState, StyleValue>>;
    elements?: Partial<Record<T, ElementStyle>>;
}

// Style props for any component using this system
export interface StyleProps<T extends string> {
    variant?: string;
    elements?: Partial<StyledElements<T>>;
    themeOverrides?: ThemeConfig<T>;
    theme?: Theme;  // Optional theme to use for token resolution
}