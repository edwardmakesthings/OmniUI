import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    textStyles,
    transitionStyles,
    stateStyles,
} from '../compositions';
import { composeStyles } from '../utils';

// Tree Item styles
const baseItemStyles = composeStyles(
    layoutStyles.flex.row.center,
    textStyles.indicatorDark,
    transitionStyles.colors,
    stateStyles.interactive.base,
    'gap-2 px-2 py-1 min-h-[32px] [&draggable]:cursor-grab'
);

export const treeItemPreset: StylePreset<'content' | 'icon' | 'caret'> = {
    name: 'treeItem',
    elements: ['content', 'icon', 'caret'],
    variants: {
        default: {
            root: composeStyles(
                baseItemStyles,
                stateStyles.interactive.selectedNeutral,
                'hover:bg-accent-dark-neutral/20',
                'relative before:absolute before:inset-0 before:pointer-events-none',
                'data-drop-before:before:border-t-2 data-drop-before:before:border-accent-dark-bright',
                'data-drop-after:before:border-b-2 data-drop-after:before:border-accent-dark-bright',
                'data-drop-inside:before:bg-accent-dark-bright/20'
            ),
            content: composeStyles(
                'flex-grow',
                textStyles.default.base
            ),
            icon: composeStyles(
                'flex-shrink-0',
                textStyles.indicatorDark
            ),
            caret: composeStyles(
                'flex-shrink-0',
                textStyles.indicatorDark
            )
        }
    }
};

// Tree View styles
export const treeViewPreset: StylePreset<'tree'> = {
    name: 'treeView',
    elements: ['tree'],
    variants: {
        default: {
            root: composeStyles(
                layoutStyles.flex.col.base,
                backgroundStyles.solid.dark,
                'h-full'
            ),
            tree: composeStyles(
                'flex-1'
            )
        }
    }
};

export type TreeViewVariant = keyof typeof treeViewPreset.variants;
export type TreeItemVariant = keyof typeof treeItemPreset.variants;