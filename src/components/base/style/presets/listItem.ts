import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    textStyles,
    transitionStyles,
    stateStyles,
    editingStyles
} from '../compositions';
import { composeStyles } from '../utils';

// Base list item styles
const baseStyles = composeStyles(
    layoutStyles.flex.row.center,
    transitionStyles.colors,
    stateStyles.interactive.base,
    'relative w-full'
);

// Content wrapper styles
const contentStyles = composeStyles(
    layoutStyles.flex.row.start,
    'flex-1 min-w-0', // Allow content to shrink
    layoutStyles.spacing.pad.sm
);

// Icon container styles for start/end icons
const iconContainerStyles = composeStyles(
    layoutStyles.flex.row.center,
    'flex-shrink-0',
    layoutStyles.spacing.pad.sm
);

export const listItemPreset: StylePreset<'content' | 'startIcon' | 'endIcon'> = {
    name: 'listItem',
    elements: ['content', 'startIcon', 'endIcon'],
    variants: {
        default: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.dark,
                textStyles.indicatorDark,
                stateStyles.interactive.selectedNeutral,
                editingStyles.default,
                'min-h-[40px]'
            ),
            content: contentStyles,
            startIcon: iconContainerStyles,
            endIcon: iconContainerStyles
        },
        inset: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.darker,
                textStyles.indicatorDark,
                stateStyles.interactive.selectedBright,
                editingStyles.default,
                'min-h-[40px]',
            ),
            content: contentStyles,
            startIcon: iconContainerStyles,
            endIcon: iconContainerStyles
        },
        ghost: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent,
                textStyles.indicatorDark,
                stateStyles.interactive.selectedBright,
                editingStyles.default,
                'min-h-[40px]',
            ),
            content: contentStyles,
            startIcon: iconContainerStyles,
            endIcon: iconContainerStyles
        }
    }
};

export type ListItemVariant = keyof typeof listItemPreset.variants;

export default listItemPreset;