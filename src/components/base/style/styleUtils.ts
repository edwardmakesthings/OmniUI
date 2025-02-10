import { cn } from '@/lib/utils';
import {
    StyleState,
    ElementStyle,
    StyledElements,
    StyleVariants,
    StyleValue,
    StyleProps
} from './styleTypes';
import { Theme } from './themeTypes';
import { tokenTransformers } from './themeUtils';


/**
 * Resolves a StyleValue into a string.
 *
 * If the value is a string, it is returned directly.
 *
 * If the value is a token reference, it is resolved against the
 * given theme. If the theme does not contain the token, the
 * fallback value is returned, or an empty string if none is
 * provided.
 *
 * @param {StyleValue | undefined} value The value to resolve.
 * @param {Theme} [theme] The theme to resolve against.
 * @return {string} The resolved value.
 */
function resolveStyleValue(
    value: StyleValue | undefined,
    theme?: Theme
): string {
    if (!value) return '';

    // If value is a string, return directly
    if (typeof value === 'string') return value;

    // If value is a token reference, try to resolve it
    if (theme && theme.tokens[value.token]) {
        const token = theme.tokens[value.token];
        const transformer = tokenTransformers[token.type];
        return transformer ? transformer(token) : value.fallback || '';
    }

    // Return fallback or empty string if token not found
    return value.fallback || '';
}

/**
 * Computes a class name for a single element based on its style definition and current state
 * @param element The element's style definition
 * @param state The current state of the component
 * @returns The computed class name
 */
export function computeElementStyle(
    element: ElementStyle | undefined,
    state: StyleState,
    theme?: Theme
): string {
    if (!element) return '';

    return cn(
        resolveStyleValue(element.base, theme),
        state.isHovered && resolveStyleValue(element.hover, theme),
        state.isFocused && resolveStyleValue(element.focus, theme),
        state.isActive && resolveStyleValue(element.active, theme),
        state.isPressed && resolveStyleValue(element.pressed, theme),
        state.isDisabled && resolveStyleValue(element.disabled, theme)
    );
}

/**
 * Computes the final styles for all elements of a component based on the component's
 * current state and the style configuration.
 *
 * The function takes in the default style configuration, the component's props, and the
 * current state. It returns an object with all possible elements as keys, and the
 * computed style for that element as the value.
 *
 * The computation works as follows:
 * 1. Determine the variant to use based on the component's props.
 * 2. Get the base styles for the determined variant.
 * 3. Get the theme overrides for the determined variant.
 * 4. Get the element overrides from the component's props.
 * 5. Initialize the result object with all possible elements.
 * 6. Compute the final style for each element by merging the base style, theme override,
 *    and element override, and compute the final class name based on the merged style
 *    and the component's state.
 * 7. Return the result object.
 */
export function computeStyles<T extends string>(
    defaultStyles: StyleVariants<T>,
    props: StyleProps<T>,
    state: StyleState
): Record<T, string> {
    const variant = props.variant || 'default';
    const baseStyles = defaultStyles[variant] || {} as StyledElements<T>;
    const themeStyles = props.themeOverrides?.variants?.[variant] || {} as StyledElements<T>;
    const elementOverrides = props.elements || {} as StyledElements<T>;

    // Initialize result
    const result = {} as Record<T, string>;

    // Get all possible element keys
    const elementKeys = new Set([
        ...Object.keys(baseStyles),
        ...Object.keys(themeStyles),
        ...Object.keys(elementOverrides)
    ]);

    // Compute styles for each element
    elementKeys.forEach(key => {
        const elementKey = key as T;
        const mergedStyle: ElementStyle = {
            ...baseStyles[elementKey],
            ...themeStyles[elementKey],
            ...elementOverrides[elementKey]
        };

        result[elementKey] = computeElementStyle(mergedStyle, state, props.theme);
    });

    return result;
}

// Example style definition for IconButton with theme tokens
export const defaultIconButtonStyles: StyleVariants<'container' | 'icon'> = {
    default: {
        container: {
            base: {
                token: 'components.iconButton.default.container',
                fallback: 'inline-flex items-center justify-center transition-colors bg-gray-600 text-white rounded-md p-2'
            },
            hover: {
                token: 'components.iconButton.default.containerHover',
                fallback: 'hover:bg-gray-700'
            },
            focus: 'focus:ring-2 focus:ring-gray-500',
            active: 'active:bg-gray-800',
            disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
        },
        icon: {
            base: {
                token: 'components.iconButton.default.icon',
                fallback: 'w-5 h-5'
            },
            hover: 'group-hover:text-white',
            disabled: 'group-disabled:text-gray-400'
        }
    },
    ghost: {
        container: {
            base: {
                token: 'components.iconButton.ghost.container',
                fallback: 'inline-flex items-center justify-center transition-colors bg-transparent text-gray-300 p-2'
            },
            hover: {
                token: 'components.iconButton.ghost.containerHover',
                fallback: 'hover:bg-gray-700/50 hover:text-white'
            },
            focus: 'focus:ring-2 focus:ring-gray-500',
            active: 'active:bg-gray-800/50',
            disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
        },
        icon: {
            base: 'w-5 h-5',
            hover: 'group-hover:text-white',
            disabled: 'group-disabled:text-gray-400'
        }
    }
};