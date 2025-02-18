import { StylePreset } from './types';
import {
    backgroundStyles,
    layoutStyles,
    focusStyles,
    shapeStyles,
    transitionStyles,
    stateStyles,
    textStyles,
    editingStyles
} from '../compositions';
import { composeStyles } from '../utils';

// Base styles shared across variants
const baseStyles = composeStyles(
    layoutStyles.flex.row.center,
    layoutStyles.spacing.pad.sm,
    focusStyles.ring.accent,
    shapeStyles.rounded.md,
    transitionStyles.base,
    stateStyles.interactive.base,
    editingStyles.default
);

// Icon container styles
const iconContainerStyles = composeStyles(
    layoutStyles.flex.row.center,
    'flex-shrink-0'
);

export const buttonPreset: StylePreset<'content' | 'startIcon' | 'endIcon'> = {
    name: 'button',
    elements: ['content', 'startIcon', 'endIcon'],
    variants: {
        default: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.dark,
                textStyles.indicatorDark,
                stateStyles.interactive.selectedNeutral
            ),
            content: composeStyles(
                'text-current whitespace-nowrap',
                'px-1'
            ),
            startIcon: iconContainerStyles,
            endIcon: iconContainerStyles
        },
        ghost: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent,
                textStyles.indicatorDark,
                stateStyles.interactive.selectedBright
            ),
            content: composeStyles(
                'text-current whitespace-nowrap',
                'px-1'
            ),
            startIcon: iconContainerStyles,
            endIcon: iconContainerStyles
        },
        bright: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.accentBright,
                textStyles.default.base,
                stateStyles.interactive.selectedNeutral
            ),
            content: composeStyles(
                'text-current whitespace-nowrap',
                'px-1'
            ),
            startIcon: iconContainerStyles,
            endIcon: iconContainerStyles
        },
        outline: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent,
                textStyles.indicatorDark,
                'border border-accent-dark-neutral',
                stateStyles.interactive.selectedNeutral
            ),
            content: composeStyles(
                'text-current whitespace-nowrap',
                'px-1'
            ),
            startIcon: iconContainerStyles,
            endIcon: iconContainerStyles
        }
    }
};

export type ButtonVariant = keyof typeof buttonPreset.variants;

export default buttonPreset;