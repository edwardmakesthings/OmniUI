import { useMemo } from 'react';
import { BaseState } from '../types';
import { StylePreset } from '@/components/base/style/presets/types';
import { StyleProps } from '@/components/base/style/types';
import { combineComputedStyles, computeStyles } from '@/components/base/style/utils';
import { ElementConfig } from '@/components/base/interactive/elementConfigs/types';

/**
 * Hook to compute styles for interactive elements
 * Handles style preset resolution, variant selection, and state-based styling
 */
export function useInteractiveStyles<T extends string = string>({
    elementConfig,
    stylePreset,
    styleProps,
    styleElements = ['root'] as T[],
    elementState,
    className,
}: {
    elementConfig?: ElementConfig<any>;
    stylePreset?: StylePreset<T>;
    styleProps?: StyleProps<T>;
    styleElements?: T[];
    elementState: BaseState;
    className?: string;
}) {
    // Determine which styles to use (preset or element config defaults)
    const defaultStyles = useMemo(() => {
        return stylePreset?.variants
            || elementConfig?.getDefaultStyles?.(styleElements)
            || {};
    }, [stylePreset, elementConfig, styleElements]);

    // Compute base styles from variants and props
    const computedStyles = useMemo(() => {
        return computeStyles(
            defaultStyles,
            styleProps || { variant: 'default' }
        );
    }, [defaultStyles, styleProps]);

    // Create combined styles for each element, incorporating state
    const combinedStyles = useMemo(() => {
        // Get element names from computed styles
        const elementNames = Object.keys(
            computedStyles
        ) as (keyof typeof computedStyles)[];

        // Process each element
        return elementNames.reduce((acc, elementName) => {
            return {
                ...acc,
                [elementName]: combineComputedStyles(
                    computedStyles[elementName],
                    elementState,
                    // Only apply className to root element
                    elementName === 'root' ? className : undefined
                ),
            };
        }, {} as Record<string, string>);
    }, [computedStyles, elementState, className]);

    return { combinedStyles };
}

export default useInteractiveStyles;