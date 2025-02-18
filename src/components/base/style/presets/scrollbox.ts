import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    borderStyles,
    editingStyles
} from '../compositions';
import { composeStyles } from '../utils';

// Base styles for scrollbox
const baseStyles = composeStyles(
    layoutStyles.flex.col.base,
    'relative h-full'
);

// Content styles with custom scrollbar
const contentStyles = composeStyles(
    'flex-1 overflow-auto',
    // Scrollbar styling
    'scrollbar-thin scrollbar-track-transparent',
    'scrollbar-thumb-accent-dark-neutral hover:scrollbar-thumb-accent-dark-bright',
    // Scrollbar corner
    'scrollbar-corner-transparent'
);

export const scrollboxPreset: StylePreset<'content'> = {
    name: 'scrollbox',
    elements: ['content'],
    variants: {
        default: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.dark,
                editingStyles.default
            ),
            content: contentStyles
        },
        ghost: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent,
                editingStyles.default
            ),
            content: contentStyles
        },
        inset: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.darker,
                borderStyles.accent.all,
                editingStyles.default
            ),
            content: contentStyles
        }
    }
};

export type ScrollBoxVariant = keyof typeof scrollboxPreset.variants;

export default scrollboxPreset;