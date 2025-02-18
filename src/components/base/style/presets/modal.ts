import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    borderStyles,
    transitionStyles,
    shapeStyles,
    editingStyles
} from '../compositions';
import { composeStyles } from '../utils';

// Base modal container styles
const baseStyles = composeStyles(
    layoutStyles.flex.col.base,
    backgroundStyles.solid.dark,
    borderStyles.accent.all,
    shapeStyles.rounded.md,
    transitionStyles.transform,
    'fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'
);

// Header styles
const headerStyles = composeStyles(
    layoutStyles.flex.row.between,
    layoutStyles.spacing.pad.md,
    borderStyles.accent.bottom,
    'h-10'
);

// Content styles
const contentStyles = composeStyles(
    'flex-1 overflow-auto',
    layoutStyles.spacing.pad.md
);

// Footer styles
const footerStyles = composeStyles(
    layoutStyles.flex.row.between,
    layoutStyles.spacing.pad.md,
    borderStyles.accent.top,
    'h-14'
);

// Backdrop styles
const backdropStyles = composeStyles(
    'fixed inset-0 bg-black/50',
    'transition-opacity duration-300',
    'z-40'
);

export const modalPreset: StylePreset<'backdrop' | 'header' | 'content' | 'footer'> = {
    name: 'modal',
    elements: ['backdrop', 'header', 'content', 'footer'],
    variants: {
        default: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.dark,
                editingStyles.default
            ),
            backdrop: backdropStyles,
            header: headerStyles,
            content: contentStyles,
            footer: footerStyles
        },
        elevated: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.darker,
                'shadow-lg',
                editingStyles.default
            ),
            backdrop: backdropStyles,
            header: headerStyles,
            content: contentStyles,
            footer: footerStyles
        }
    }
};

export type ModalVariant = keyof typeof modalPreset.variants;

export default modalPreset;