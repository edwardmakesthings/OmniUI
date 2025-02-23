import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    borderStyles,
    editingStyles
} from '../compositions';
import { composeStyles } from '../utils';

// Base styles for panels
const baseStyles = composeStyles(
    layoutStyles.flex.col.base,
    backgroundStyles.solid.dark,
    'relative'
);

// Header styles
const headerStyles = composeStyles(
    layoutStyles.flex.row.between,
    layoutStyles.spacing.pad.sm,
    borderStyles.accent.bottom
);

// Content styles
const contentStyles = composeStyles(
    layoutStyles.spacing.pad.sm,
    'flex-1',
    'overflow-auto'
);

export const panelPreset: StylePreset<'header' | 'content'> = {
    name: 'panel',
    elements: ['header', 'content'],
    variants: {
        default: {
            root: composeStyles(
                baseStyles,
                editingStyles.default
            ),
            header: headerStyles,
            content: contentStyles
        },
        elevated: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.darker,
                borderStyles.accent.all,
                editingStyles.default
            ),
            header: headerStyles,
            content: contentStyles
        },
        ghost: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent,
                editingStyles.default
            ),
            header: composeStyles(
                headerStyles,
                backgroundStyles.solid.transparent
            ),
            content: contentStyles
        }
    }
};

export type PanelVariant = keyof typeof panelPreset.variants;

export default panelPreset;