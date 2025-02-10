// Basic token types that can translate across platforms
export type TokenType =
    | 'color'
    | 'size'
    | 'spacing'
    | 'font'
    | 'border'
    | 'shadow'
    | 'opacity'
    | 'transition';

// Specific value types for different token categories
export interface ColorToken {
    type: 'color';
    value: string; // Could be HEX, RGB, HSL
    darkValue?: string; // Optional dark mode variant
}

export interface SizeToken {
    type: 'size';
    value: number;
    unit: 'px' | 'rem' | '%';
}

export interface SpacingToken {
    type: 'spacing';
    value: number;
    unit: 'px' | 'rem' | '%';
}

export interface FontToken {
    type: 'font';
    family?: string;
    size?: number;
    weight?: number | string;
    lineHeight?: number;
    unit?: 'px' | 'rem';
}

export interface BorderToken {
    type: 'border';
    width: number;
    style: 'solid' | 'dashed' | 'dotted';
    color: string;
    unit: 'px';
}

export interface ShadowToken {
    type: 'shadow';
    value: string; // CSS box-shadow value
}

export type ThemeToken =
    | ColorToken
    | SizeToken
    | SpacingToken
    | FontToken
    | BorderToken
    | ShadowToken;

// Theme structure
export interface Theme {
    id: string;
    name: string;
    tokens: Record<string, ThemeToken>;
    // Platform-specific overrides
    platforms?: {
        qt?: Record<string, unknown>;
        web?: Record<string, string>;
    };
}

// Theme to CSS variable mapping
export interface TokenToCSSMap {
    [tokenPath: string]: {
        cssVar: string;
        transform?: (token: ThemeToken) => string;
    };
}

// Theme to Qt stylesheet mapping
export interface TokenToQtMap {
    [tokenPath: string]: {
        property: string;
        transform?: (token: ThemeToken) => string;
    };
}