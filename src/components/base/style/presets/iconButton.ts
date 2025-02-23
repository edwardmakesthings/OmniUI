import { StylePreset } from './types';
import {
    backgroundStyles,
    layoutStyles,
    focusStyles,
    transitionStyles,
    stateStyles,
    textStyles,
    editingStyles
} from '../compositions';
import { composeStyles } from '../utils';

// Base styles shared across variants
const baseStyles = composeStyles(
    layoutStyles.flex.row.centerFull,
    focusStyles.ring.accent,
    transitionStyles.base,
    stateStyles.interactive.base,
    stateStyles.interactive.selectedNeutral,
    editingStyles.default
);

export const iconButtonPreset: StylePreset<'icon'> = {
    name: 'iconButton',
    elements: ['icon'],
    variants: {
        default: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.dark,
                textStyles.indicatorDark
            ),
            icon: composeStyles(
                'flex-shrink-0',
                textStyles.indicatorDark
            )
        },
        ghost: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent,
                textStyles.indicatorDark
            ),
            icon: composeStyles(
                'flex-shrink-0',
                textStyles.indicatorDark
            )
        },
        bright: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.accentBright,
                textStyles.default.base,
            ),
            icon: composeStyles(
                'flex-shrink-0',
                textStyles.default.base
            )
        },
        outline: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent,
                textStyles.indicatorDark,
                'border border-accent-dark-neutral'
            ),
            icon: composeStyles(
                'flex-shrink-0',
                textStyles.indicatorDark
            )
        }
    }
};

export type IconButtonVariant = keyof typeof iconButtonPreset.variants;

export default iconButtonPreset;