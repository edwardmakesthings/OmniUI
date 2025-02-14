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

// Color token with optional dark mode variant
export interface ColorToken {
    type: 'color';
    value: string;      // CSS variable reference (var(--color-primary-500))
    darkValue?: string; // Optional dark mode variant
}

// Size token for dimensions
export interface SizeToken {
    type: 'size';
    value: string;      // CSS variable reference (var(--size-md))
}

// Spacing token for margins, padding, etc.
export interface SpacingToken {
    type: 'spacing';
    value: string;      // CSS variable reference (var(--spacing-md))
}

// Font token for typography
export interface FontToken {
    type: 'font';
    family?: string;    // CSS variable reference (var(--font-sans))
    size?: string;      // CSS variable reference (var(--font-size-md))
    weight?: string;    // CSS variable reference (var(--font-weight-bold))
    lineHeight?: string;// CSS variable reference (var(--line-height-normal))
}

// Border token for borders
export interface BorderToken {
    type: 'border';
    width: string;      // CSS variable reference (var(--border-width-thin))
    style: string;      // CSS variable reference (var(--border-style-solid))
    color: string;      // CSS variable reference (var(--border-color-primary))
}

// Shadow token for box shadows
export interface ShadowToken {
    type: 'shadow';
    value: string;      // CSS variable reference (var(--shadow-md))
}

// Union of all possible token types
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

// Type for theme overrides
export type ThemeOverrides = Partial<{
    [K in keyof Theme['tokens']]: string;
}>;

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