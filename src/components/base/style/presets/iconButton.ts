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
    layoutStyles.flex.row.centerFull,
    shapeStyles.rounded.md,
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
                textStyles.default
            ),
            icon: composeStyles(
                'flex-shrink-0',
                textStyles.default
            )
        },
        ghost: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent,
                textStyles.default.muted
            ),
            icon: composeStyles(
                'flex-shrink-0',
                {
                    base: textStyles.default.muted,
                    hover: 'group-hover:text-font-dark'
                }
            )
        },
        bright: {
            root: composeStyles(
                baseStyles,
                'bg-accent-dark-bright',
                textStyles.default,
                {
                    hover: 'hover:bg-accent-dark-bright-hover'
                }
            ),
            icon: composeStyles(
                'flex-shrink-0',
                textStyles.default
            )
        },
        outline: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent,
                textStyles.default.muted,
                'border border-accent-dark-neutral'
            ),
            icon: composeStyles(
                'flex-shrink-0',
                {
                    base: textStyles.default.muted,
                    hover: 'group-hover:text-font-dark'
                }
            )
        }
    }
};

export type IconButtonVariant = keyof typeof iconButtonPreset.variants;

export default iconButtonPreset;