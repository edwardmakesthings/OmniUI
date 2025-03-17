import {
    Theme,
    ThemeToken,
    TokenToCSSMap,
    TokenToQtMap
} from './types';

// Default transformers for different token types
export const tokenTransformers = {
    color: (token: ThemeToken) => {
        if (token.type !== 'color') return '';
        return token.value;
    },
    size: (token: ThemeToken) => {
        if (token.type !== 'size') return '';
        return `${token.value}${token.unit}`;
    },
    spacing: (token: ThemeToken) => {
        if (token.type !== 'spacing') return '';
        return `${token.value}${token.unit}`;
    },
    font: (token: ThemeToken) => {
        if (token.type !== 'font') return '';
        const parts = [];
        if (token.size) parts.push(`${token.size}${token.unit || 'px'}`);
        if (token.family) parts.push(token.family);
        return parts.join(' ');
    },
    border: (token: ThemeToken) => {
        if (token.type !== 'border') return '';
        return `${token.width}${token.unit} ${token.style} ${token.color}`;
    },
    shadow: (token: ThemeToken) => {
        if (token.type !== 'shadow') return '';
        return token.value;
    }
};


/**
 * Generates an object of CSS variable declarations from a theme object
 * and a mapping of token paths to CSS variable names.
 *
 * @param theme - The theme object containing the tokens to generate
 *   CSS variables for.
 * @param tokenMap - An object mapping token paths to objects containing
 *   the CSS variable name and an optional custom transform function.
 * @returns An object with keys that are the CSS variable names and values
 *   that are the transformed token values.
 */
export function generateCSSVariables(
    theme: Theme,
    tokenMap: TokenToCSSMap
): Record<string, string> {
    const cssVars: Record<string, string> = {};

    Object.entries(theme.tokens).forEach(([tokenPath, token]) => {
        const mapping = tokenMap[tokenPath];
        if (!mapping) return;

        const value = mapping.transform
            ? mapping.transform(token)
            : tokenTransformers[token.type](token);

        cssVars[mapping.cssVar] = value;
    });

    return cssVars;
}


/**
 * Generates an object of Qt style sheet property declarations from a theme object
 * and a mapping of token paths to Qt style sheet property names.
 *
 * @param theme - The theme object containing the tokens to generate
 *   Qt style sheet properties for.
 * @param tokenMap - An object mapping token paths to objects containing
 *   the Qt style sheet property name and an optional custom transform function.
 * @returns An object with keys that are the Qt style sheet property names and values
 *   that are the transformed token values.
 */
export function generateQtStyles(
    theme: Theme,
    tokenMap: TokenToQtMap
): Record<string, string> {
    const qtStyles: Record<string, string> = {};

    Object.entries(theme.tokens).forEach(([tokenPath, token]) => {
        const mapping = tokenMap[tokenPath];
        if (!mapping) return;

        const value = mapping.transform
            ? mapping.transform(token)
            : tokenTransformers[token.type](token);

        qtStyles[mapping.property] = value;
    });

    return qtStyles;
}

// // Example of generating Tailwind classes from theme tokens
// export function generateTailwindClasses(
//     theme: Theme,
//     elementType: string
// ): Record<string, string> {
//     // This would map theme tokens to appropriate Tailwind classes
//     // Could be based on a configuration file or mapping
//     return {};
// }

// // Integration with the style system
// export function applyThemeToStyles<T extends string>(
//     theme: Theme,
//     styles: Record<T, string>,
//     elementType: string
// ): Record<T, string> {
//     // This would apply theme overrides to the computed styles
//     // Could use either direct CSS variables or Tailwind classes
//     return styles;
// }