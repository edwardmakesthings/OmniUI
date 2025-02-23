import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    borderStyles,
    editingStyles
} from '../compositions';
import { composeStyles } from '../utils';

// List container styles
const containerStyles = composeStyles(
    layoutStyles.flex.col.base,
    'relative h-full',
    'focus-within:outline-none'
);

// List wrapper styles
const listStyles = composeStyles(
    layoutStyles.flex.col.base,
    'w-full',
    'gap-0.5' // Small gap between items
);

export const listViewPreset: StylePreset<'list'> = {
    name: 'listView',
    elements: ['list'],
    variants: {
        default: {
            root: composeStyles(
                containerStyles,
                backgroundStyles.solid.dark,
                editingStyles.default
            ),
            list: listStyles
        },
        inset: {
            root: composeStyles(
                containerStyles,
                backgroundStyles.solid.darker,
                borderStyles.accent.all,
                editingStyles.default
            ),
            list: listStyles
        },
        ghost: {
            root: composeStyles(
                containerStyles,
                backgroundStyles.solid.transparent,
                editingStyles.default
            ),
            list: listStyles
        }
    }
};

export type ListViewVariant = keyof typeof listViewPreset.variants;

export default listViewPreset;