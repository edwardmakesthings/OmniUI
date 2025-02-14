import { StylePreset } from './types';
import {
    backgroundStyles,
    layoutStyles,
    focusStyles,
    shapeStyles,
    transitionStyles,
    stateStyles,
    textStyles,
    borderStyles
} from '../compositions';
import { composeStyles } from '../utils';

export const iconButtonPreset: StylePreset<'icon'> = {
    name: 'iconButton',
    elements: ['icon'],
    variants: {
        default: {
            root: composeStyles(
                layoutStyles.flex.row.center,
                backgroundStyles.solid.dark.base,
                textStyles.default.base,
                shapeStyles.rounded.md,
                focusStyles.ring.accent.base,
                transitionStyles.colors,
                stateStyles.interactive.base
            ),
            icon: composeStyles(
                'flex-shrink-0',
                textStyles.default.base
            )
        },
        ghost: {
            root: composeStyles(
                layoutStyles.flex.row.center,
                backgroundStyles.solid.transparent.base,
                textStyles.default.muted,
                shapeStyles.rounded.md,
                focusStyles.ring.accent.base,
                transitionStyles.colors,
                stateStyles.interactive.base
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
                layoutStyles.flex.row.center,
                'bg-accent-dark-bright',
                textStyles.default.base,
                shapeStyles.rounded.md,
                focusStyles.ring.accent.base,
                transitionStyles.colors,
                stateStyles.interactive.base,
                {
                    hover: 'hover:bg-accent-dark-bright-hover'
                }
            ),
            icon: composeStyles(
                'flex-shrink-0',
                textStyles.default.base
            )
        },
        outline: {
            root: composeStyles(
                layoutStyles.flex.row.center,
                backgroundStyles.solid.transparent.base,
                borderStyles.accent.all.base,
                textStyles.default.muted,
                shapeStyles.rounded.md,
                focusStyles.ring.accent.base,
                transitionStyles.colors,
                stateStyles.interactive.base
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