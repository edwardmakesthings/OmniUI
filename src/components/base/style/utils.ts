import { cn } from '@/lib/utils';
import {
    ElementStyle,
    StyledElements,
    StyleVariants,
    StyleValue,
    StyleProps,
    ComputedStyles,
    WithRequired,
    ComputedElementStyle
} from './types';
import { Theme } from './theme/types';
import { tokenTransformers } from './theme/utils';
import { BaseState } from '../interactive/types';

/**
 * Core style merging functionality
 */
export const styleUtils = {
    /**
     * Merges multiple style objects or strings using the cn utility
     */
    merge(...styles: (string | undefined)[]): string {
        return cn(...styles.filter(Boolean));
    },

    /**
     * Merges two style objects where each property is a class string
     */
    mergeStyleObjects(target: Record<string, string>, source: Record<string, string>): Record<string, string> {
        const result: Record<string, string> = { ...target };
        Object.keys(source).forEach(key => {
            result[key] = this.merge(target[key], source[key]);
        });
        return result;
    },

    /**
     * Deep merges objects with special handling for style objects
     */
    deepMerge<T>(target: T, source: T): T {
        if (!source) return target;
        if (!target) return source;

        // Handle style objects
        if (this.isStyleObject(target) && this.isStyleObject(source)) {
            return this.mergeStyleObjects(
                target as Record<string, string>,
                source as Record<string, string>
            ) as T;
        }

        const result = { ...target } as any;
        Object.keys(source as object).forEach(key => {
            const sourceValue = (source as any)[key];
            const targetValue = (target as any)[key];

            result[key] = this.shouldDeepMerge(sourceValue, targetValue)
                ? this.deepMerge(targetValue, sourceValue)
                : sourceValue;
        });

        return result;
    },

    /**
     * Checks if an object is a style object (has string values and a base property)
     */
    isStyleObject(obj: unknown): obj is Record<string, string> {
        return typeof obj === 'object'
            && obj !== null
            && 'base' in obj
            && typeof (obj as any).base === 'string';
    },

    /**
     * Determines if two values should be deep merged
     */
    shouldDeepMerge(a: unknown, b: unknown): boolean {
        return typeof a === 'object'
            && typeof b === 'object'
            && a !== null
            && b !== null
            && !Array.isArray(a)
            && !Array.isArray(b);
    }
};

/**
 * Style computation and resolution functionality
 */
export const styleComputation = {
    /**
     * Resolves a StyleValue to a string using the provided theme
     */
    resolveValue(value: StyleValue | undefined, theme?: Theme): string {
        if (!value) return '';
        if (typeof value === 'string') return value;

        if (theme?.tokens[value.token]) {
            const token = theme.tokens[value.token];
            const transformer = tokenTransformers[token.type];
            return transformer ? transformer(token) : value.fallback || '';
        }

        return value.fallback || '';
    },

    /**
     * Computes a ComputedElementStyle from an ElementStyle
     */
    computeElement(element: ElementStyle | undefined, theme?: Theme): ComputedElementStyle {
        if (!element) return {};

        return {
            base: this.resolveValue(element.base, theme),
            hover: this.resolveValue(element.hover, theme),
            focus: this.resolveValue(element.focus, theme),
            pressed: this.resolveValue(element.pressed, theme),
            active: this.resolveValue(element.active, theme),
            disabled: this.resolveValue(element.disabled, theme),
            selected: this.resolveValue(element.selected, theme),
            editing: this.resolveValue(element.editing, theme)
        };
    },

    /**
     * Computes final styles for all elements
     */
    computeAll<T extends string>(
        defaultStyles: StyleVariants<T> | Record<string, Record<string, ComputedElementStyle>>,
        props: StyleProps<T>
    ): ComputedStyles<T> {
        const variant = props.variant || 'default';
        const baseStyles = defaultStyles[variant] || {} as StyledElements<T>;
        const themeStyles = props.themeOverrides?.variants?.[variant] || {} as StyledElements<T>;
        const elementOverrides = props.elements || {} as StyledElements<T>;

        // Get all element keys
        const allElements = new Set<WithRequired<T, 'root'>>([
            'root' as WithRequired<T, 'root'>,
            ...Object.keys(baseStyles) as WithRequired<T, 'root'>[],
            ...Object.keys(themeStyles) as WithRequired<T, 'root'>[],
            ...Object.keys(elementOverrides) as WithRequired<T, 'root'>[]
        ]);

        const result = {} as ComputedStyles<T>;

        allElements.forEach(elementKey => {
            const baseStyle = baseStyles[elementKey];
            const themeStyle = themeStyles[elementKey];
            const overrideStyle = elementOverrides[elementKey];

            const isComputed = baseStyle && this.isComputedStyle(baseStyle);
            const computedBase = isComputed
                ? baseStyle as ComputedElementStyle
                : this.computeElement(baseStyle as ElementStyle, props.theme);

            result[elementKey] = styleUtils.deepMerge(
                styleUtils.deepMerge(
                    computedBase,
                    themeStyle ? this.computeElement(themeStyle, props.theme) : {}
                ),
                overrideStyle ? this.computeElement(overrideStyle, props.theme) : {}
            );
        });

        return result;
    },

    /**
     * Checks if an object is a ComputedElementStyle
     */
    isComputedStyle(obj: unknown): obj is ComputedElementStyle {
        return styleUtils.isStyleObject(obj);
    }
};

/**
 * Style composition functionality
 */
export const styleComposition = {
    /**
     * Combines styles with component state
     */
    withState(styles: ComputedElementStyle, state: BaseState, className?: string): string {
        return styleUtils.merge(
            styles.base,
            state.isHovered ? styles.hover : undefined,
            state.isFocused ? styles.focus : undefined,
            state.isPressed ? styles.pressed : undefined,
            state.isActive ? styles.active : undefined,
            state.isDisabled ? styles.disabled : undefined,
            state.isSelected ? styles.selected : undefined,
            state.isEditing ? styles.editing : undefined,
            className
        );
    },

    /**
     * Combines multiple styles into one
     */
    compose(...styles: (ComputedElementStyle | string)[]): ComputedElementStyle {
        const result: ComputedElementStyle = {};

        styles.forEach(style => {
            if (typeof style === 'string') {
                result.base = styleUtils.merge(result.base, style);
            } else {
                Object.entries(style).forEach(([key, value]) => {
                    if (value) {
                        result[key as keyof ComputedElementStyle] = styleUtils.merge(
                            result[key as keyof ComputedElementStyle],
                            value
                        );
                    }
                });
            }
        });

        return result;
    },

    /**
     * Combines multiple style sets
     */
    composeAll(...styles: ComputedStyles<string>[]): ComputedStyles<string> {
        const result: ComputedStyles<string> = {};

        styles.forEach(style => {
            Object.entries(style).forEach(([elementKey, elementStyle]) => {
                result[elementKey] = result[elementKey] || {};
                result[elementKey] = styleUtils.deepMerge(result[elementKey], elementStyle);
            });
        });

        return result;
    }
};

export const computeStyles = styleComputation.computeAll.bind(styleComputation);
export const computeElementStyle = styleComputation.computeElement.bind(styleComputation);

export const combineComputedStyles = styleComposition.withState.bind(styleComposition);
export const composeStyles = styleComposition.compose.bind(styleComposition);
export const composeStyleSets = styleComposition.composeAll.bind(styleComposition);

export const deepMerge = styleUtils.deepMerge.bind(styleUtils);