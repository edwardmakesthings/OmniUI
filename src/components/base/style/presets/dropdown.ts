import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    borderStyles,
    transitionStyles,
    stateStyles,
    componentStyles,
    sizeStyles,
    focusStyles
} from '../compositions';
import { composeStyles } from '../utils';

const dropdownPreset: StylePreset<'trigger' | 'content' | 'item'> = {
    name: 'dropdown',
    elements: ['trigger', 'content', 'item'],
    variants: {
        default: {
            root: composeStyles(
                layoutStyles.flex.col.base,
                sizeStyles.width.full,
                sizeStyles.height.input.lg,
                'relative'
            ),
            trigger: composeStyles(
                layoutStyles.flex.row.between,
                sizeStyles.height.input.md,
                layoutStyles.spacing.pad.sm,
                borderStyles.accent.all.base,
                focusStyles.ring.accent.base,
                transitionStyles.colors
            ),
            content: composeStyles(
                layoutStyles.flex.col.base,
                backgroundStyles.solid.dark.base,
                borderStyles.accent.all.base,
                sizeStyles.width.full,
                'mt-1'
            ),
            item: composeStyles(
                layoutStyles.flex.row.start,
                layoutStyles.spacing.pad.sm,
                sizeStyles.height.input.md,
                sizeStyles.width.full,
                transitionStyles.colors,
                stateStyles.interactive.base,
                {
                    hover: backgroundStyles.solid.accent.hover,
                    selected: stateStyles.interactive.selected.base
                }
            )
        }
    }
};

export type DropdownVariant = keyof typeof dropdownPreset.variants;

export default dropdownPreset;