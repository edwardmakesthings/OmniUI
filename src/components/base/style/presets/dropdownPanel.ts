import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    borderStyles,
    textStyles,
    transitionStyles,
} from '../compositions';
import { composeStyles } from '../utils';

const baseStyles = composeStyles(
    layoutStyles.flex.col.base,
    layoutStyles.spacing.gap.sm
);

const headerStyles = composeStyles(
    layoutStyles.flex.col.base,
    layoutStyles.spacing.pad.sm,
    transitionStyles.colors,
    textStyles.default.base
);

const contentStyles = composeStyles(
    layoutStyles.flex.col.base,
    layoutStyles.spacing.pad.sm,
    'overflow-hidden'
);

export const dropdownPanelPreset: StylePreset<'header' | 'content'> = {
    name: 'dropdownPanel',
    elements: ['header', 'content'],
    variants: {
        default: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.dark,
                borderStyles.accent.all
            ),
            header: composeStyles(
                headerStyles,
                backgroundStyles.solid.dark,
                borderStyles.accent.bottom,
                'hover:bg-accent-dark-neutral/20'
            ),
            content: contentStyles
        },
        ghost: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent
            ),
            header: composeStyles(
                headerStyles,
                backgroundStyles.solid.transparent,
                'hover:bg-accent-dark-neutral/20'
            ),
            content: contentStyles
        }
    }
};

export type DropdownPanelVariant = keyof typeof dropdownPanelPreset.variants;

export default dropdownPanelPreset;