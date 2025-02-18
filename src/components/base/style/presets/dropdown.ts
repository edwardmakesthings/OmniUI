import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    borderStyles,
    transitionStyles,
    stateStyles,
    sizeStyles,
    focusStyles,
    textStyles
} from '../compositions';
import { composeStyles } from '../utils';

const dropdownPreset: StylePreset<'trigger' | 'content' | 'item'> = {
    name: 'dropdown',
    elements: ['trigger', 'content', 'item'],
    variants: {
        default: {
            root: composeStyles(
                layoutStyles.flex.col.centerVertical,
                sizeStyles.width.full,
                sizeStyles.height.input.lg,
                'relative gap-[5px]'
            ),
            trigger: composeStyles(
                layoutStyles.flex.row.between,
                sizeStyles.height.input.md,
                layoutStyles.spacing.pad.sm,
                borderStyles.accent.all,
                focusStyles.ring.accent,
                transitionStyles.base,
                textStyles.indicatorDark,
                "px-1 h-full w-full"
            ),
            content: composeStyles(
                layoutStyles.flex.col,
                layoutStyles.transform.below,
                borderStyles.accent.all,
                sizeStyles.width.full,
                transitionStyles.base,
                "absolute w-full z-10"
            ),
            item: composeStyles(
                layoutStyles.flex.row.start,
                backgroundStyles.solid.dark,
                sizeStyles.width.full,
                transitionStyles.colors,
                stateStyles.interactive.base,
                stateStyles.interactive.selectedNeutral,
                textStyles.indicatorDark,
            )
        },
        ghost: {
            root: composeStyles(
                layoutStyles.flex.col.base,
                'relative w-full'
            ),
            trigger: composeStyles(
                layoutStyles.flex.row.between,
                sizeStyles.height.input.md,
                layoutStyles.spacing.pad.md,
                backgroundStyles.solid.transparent,
                transitionStyles.colors,
                textStyles.indicatorDark,
                stateStyles.interactive.base,
                stateStyles.interactive.selectedBright,
                focusStyles.ring.accent
            ),
            content: composeStyles(
                layoutStyles.flex.col.base,
                backgroundStyles.solid.darker,
                borderStyles.accent.all,
                'absolute w-full z-10 mt-1',
                transitionStyles.base
            ),
            item: composeStyles(
                layoutStyles.flex.row.start,
                layoutStyles.spacing.pad.md,
                backgroundStyles.solid.transparent,
                textStyles.indicatorDark,
                transitionStyles.colors,
                stateStyles.interactive.base,
                stateStyles.interactive.selectedBright
            )
        }
    }
};

export type DropdownVariant = keyof typeof dropdownPreset.variants;

export default dropdownPreset;