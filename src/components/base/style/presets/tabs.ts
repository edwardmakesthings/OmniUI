import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    borderStyles,
    textStyles,
    transitionStyles,
    stateStyles,
    editingStyles
} from '../compositions';
import { composeStyles } from '../utils';

// List styles for tab headers
const listStyles = composeStyles(
    layoutStyles.flex.row.start,
    borderStyles.accent.bottom,
    'relative'
);

// Individual tab styles
const tabStyles = composeStyles(
    layoutStyles.flex.row.center,
    layoutStyles.spacing.pad.md,
    transitionStyles.colors,
    stateStyles.interactive.base,
    textStyles.indicatorDark,
    'relative min-w-[100px] h-10',
    // Selection indicator
    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5'
);

// Panel styles
const panelStyles = composeStyles(
    'flex-1',
    layoutStyles.spacing.pad.md
);

export const tabsPreset: StylePreset<'list' | 'tab' | 'panel'> = {
    name: 'tabs',
    elements: ['list', 'tab', 'panel'],
    variants: {
        default: {
            root: composeStyles(
                layoutStyles.flex.col.base,
                backgroundStyles.solid.dark,
                'relative',
                editingStyles.default
            ),
            list: listStyles,
            tab: composeStyles(
                tabStyles,
                stateStyles.interactive.selectedBright,
                'after:bg-accent-dark-bright after:h-[1px]'
            ),
            panel: panelStyles
        },
        ghost: {
            root: composeStyles(
                layoutStyles.flex.col.base,
                backgroundStyles.solid.transparent,
                'relative',
                editingStyles.default
            ),
            list: listStyles,
            tab: composeStyles(
                tabStyles,
                stateStyles.interactive.selectedBright,
                'after:bg-accent-dark-bright after:h-[1px]'
            ),
            panel: panelStyles
        },
        inset: {
            root: composeStyles(
                layoutStyles.flex.col.base,
                backgroundStyles.solid.darker,
                borderStyles.accent.all,
                'relative',
                editingStyles.default
            ),
            list: listStyles,
            tab: composeStyles(
                tabStyles,
                stateStyles.interactive.selectedNeutral,
                'after:bg-accent-dark-neutral after:h-[1px]'
            ),
            panel: panelStyles
        }
    }
};

export type TabsVariant = keyof typeof tabsPreset.variants;

export default tabsPreset;