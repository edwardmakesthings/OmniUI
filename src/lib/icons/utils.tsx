import { ComponentType, ReactNode } from 'react';
import { IconProps } from './types';
import { Size, SizeUtils } from '@/core/types/Geometry';
import { DEFAULT_ICON_PRESETS, ICON_CSS_VARS, ICON_SIZE_CLASSES, IconPresetSize, UI_ICON_CLASSES, UIIconComponent } from './presets';
import { getCSSVariableValue } from '../utils';

export interface IconPresetDefinition {
    [key: string]: {
        icon: number;
        container: number;
    };
}

export const IconUtils = {
    /**
     * Renders an icon component or ReactNode with the specified size
     */
    render(
        icon: ComponentType<IconProps> | ReactNode,
        size: number,
        iconProps: Partial<IconProps> = {}
    ): ReactNode {
        if (typeof icon === 'function') {
            const Icon = icon;
            return <Icon size={size} {...iconProps} />;
        }
        return icon;
    },

    /**
     * Gets icon dimensions from container size
     */
    getIconDimensionsFromContainer(containerSize: Size): number {
        const pixels = SizeUtils.convert(containerSize, 'px');
        return Math.min(pixels.width.value, pixels.height.value) * 0.5;
    },

    /**
     * Determines if a given size string corresponds to a predefined icon preset size.
     *
     * @param {string} size - The size string to check.
     * @returns {boolean} - Returns true if the size is a valid IconPresetSize, otherwise false.
     */
    isPresetSize(size: string): size is IconPresetSize {
        return size in ICON_SIZE_CLASSES;
    },

    /**
     * Checks if a given string is a valid UI Icon Component key
     * @param {string} size - The string to check
     * @returns {size is UIIconComponent} - true if the string is a valid UI Icon Component key
     */
    isUIPresetSize(size: string): size is UIIconComponent {
        return size in UI_ICON_CLASSES;
    },

    /**
     * Given a size string (either a IconPresetSize, a UI icon preset size, a
     * Tailwind class string, or a CSS variable reference), returns the appropriate
     * container classes.
     *
     * @param {IconPresetSize | string} size - The size string to convert to container classes.
     * @returns {string} - The container classes for the given size string.
     */
    getContainerClasses(size: IconPresetSize | string): string {
        // If it's a preset size, use the preset classes
        if (this.isPresetSize(size)) {
            return ICON_SIZE_CLASSES[size].container;
        }

        // If it's a UI preset size, use the preset classes
        if (this.isUIPresetSize(size)) {
            return UI_ICON_CLASSES[size].container;
        }

        // Check if it's already a Tailwind class string
        if (size.includes('w-') || size.includes('h-')) {
            return size;
        }

        // If neither, assume it's a CSS variable reference
        return `w-[${size}] h-[${size}]`;
    },


    /**
     * Gets the numeric icon size in pixels by checking CSS variables first,
     * then falling back to preset values.
     */
    getIconSize(size: IconPresetSize | number | string): number {
        // If it's already a number, use it directly
        if (typeof size === 'number') {
            return size;
        }

        // If it's a preset size, try to get from CSS var first, then fallback
        if (this.isPresetSize(size)) {
            const cssVar = ICON_CSS_VARS[`icon${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof ICON_CSS_VARS];
            return getCSSVariableValue(
                cssVar,
                DEFAULT_ICON_PRESETS[size].icon
            );
        }

        // If it's a UI preset size, try to get from CSS var first, then fallback
        if (this.isUIPresetSize(size)) {
            const cssVar = ICON_CSS_VARS[`${size}Icon`];
            return getCSSVariableValue(
                cssVar,
                DEFAULT_ICON_PRESETS.md.icon // Default fallback
            );
        }

        // If it's a CSS variable reference, try to resolve it
        if (size.includes('var(')) {
            return getCSSVariableValue(size, DEFAULT_ICON_PRESETS.md.icon);
        }

        // Final fallback
        return DEFAULT_ICON_PRESETS.md.icon;
    },

    /**
     * Attempts to get a numeric value from the CSS variable being used
     * in the container classes
     */
    getContainerSize(size: IconPresetSize | string): number {
        // If it's a preset size
        if (this.isPresetSize(size)) {
            const cssVar = ICON_CSS_VARS[`container${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof ICON_CSS_VARS];
            return getCSSVariableValue(
                cssVar,
                DEFAULT_ICON_PRESETS[size].container
            );
        }

        // If it's a UI preset size
        if (this.isUIPresetSize(size)) {
            const cssVar = ICON_CSS_VARS[`${size}Container`];
            return getCSSVariableValue(
                cssVar,
                DEFAULT_ICON_PRESETS.md.container // Default fallback
            );
        }

        // If it's a direct CSS variable reference
        if (size.includes('var(')) {
            return getCSSVariableValue(size, DEFAULT_ICON_PRESETS.md.container);
        }

        // For Tailwind classes, we could potentially parse the value
        // but it's probably better to fallback to default
        return DEFAULT_ICON_PRESETS.md.container;
    }
};