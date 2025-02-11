import { cn } from '@/lib/utils';
import {
    StyleState,
    ElementStyle,
    StyledElements,
    StyleVariants,
    StyleValue,
    StyleProps,
    ComputedStyles,
    WithRequired,
    ComputedElementStyle
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
 * Computes the resolved style values for a given element style,
 * resolving any token references against the given theme.
 *
 * @param {ElementStyle | undefined} element The element style to compute.
 * @param {Theme} [theme] The theme against which to resolve tokens.
 * @return {ComputedElementStyle} The computed element style.
 */
export function computeElementStyle(
    element: ElementStyle | undefined,
    theme?: Theme
): ComputedElementStyle {
    if (!element) {
        return {};
    }

    return {
        base: resolveStyleValue(element.base, theme),
        hover: resolveStyleValue(element.hover, theme),
        focus: resolveStyleValue(element.focus, theme),
        active: resolveStyleValue(element.active, theme),
        pressed: resolveStyleValue(element.pressed, theme),
        disabled: resolveStyleValue(element.disabled, theme),
        editing: resolveStyleValue(element.editing, theme)
    };
}

/**
 * Combines a computed element style with the current state of the component
 * and an optional className to generate a class name string.
 *
 * @param {ComputedElementStyle} styles The computed element style
 * @param {StyleState} state The current state of the component
 * @param {string} [className] Optional className to be combined with the computed style
 * @return {string} The combined class name
 */
export function combineComputedStyles(
    styles: ComputedElementStyle,
    state: StyleState,
    className?: string
): string {
    return cn(
        styles.base,
        state.isHovered && styles.hover,
        state.isFocused && styles.focus,
        state.isActive && styles.active,
        state.isPressed && styles.pressed,
        state.isDisabled && styles.disabled,
        state.isEditing && styles.editing,
        className
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
    props: StyleProps<T>
): ComputedStyles<T> {
    const variant = props.variant || 'default';
    const baseStyles = defaultStyles[variant] || {} as StyledElements<T>;
    const themeStyles = props.themeOverrides?.variants?.[variant] || {} as StyledElements<T>;
    const elementOverrides = props.elements || {} as StyledElements<T>;

    const result = {} as ComputedStyles<T>;

    // Get all possible element keys
    const allElements = new Set<WithRequired<T, 'root'>>([
        'root' as WithRequired<T, 'root'>,
        ...Object.keys(baseStyles) as WithRequired<T, 'root'>[],
        ...Object.keys(themeStyles) as WithRequired<T, 'root'>[],
        ...Object.keys(elementOverrides) as WithRequired<T, 'root'>[]
    ]);

    // Compute styles for each element
    allElements.forEach(elementKey => {
        const mergedStyle: ElementStyle = {
            ...baseStyles[elementKey],
            ...themeStyles[elementKey],
            ...elementOverrides[elementKey]
        };

        result[elementKey] = computeElementStyle(mergedStyle, props.theme);
    });

    return result;
}

export const defaultEditingStyles: ElementStyle = {
    base: 'relative',
    hover: 'outline-dashed outline-2 outline-gray-600',
    pressed: 'cursor-grabbing',
    editing: 'cursor-grab'
};