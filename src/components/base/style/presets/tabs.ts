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

// Base styles
const baseStyles = composeStyles(
    layoutStyles.flex.col.base,
    backgroundStyles.solid.dark,
    'relative'
);

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
    // Selected state styling
    'selected:text-font-dark',
    'selected:after:absolute selected:after:bottom-0',
    'selected:after:left-0 selected:after:right-0',
    'selected:after:h-0.5 selected:after:bg-accent-dark-bright'
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
                baseStyles,
                editingStyles.default
            ),
            list: listStyles,
            tab: composeStyles(
                tabStyles,
                stateStyles.interactive.selectedBright
            ),
            panel: panelStyles
        },
        ghost: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.transparent,
                editingStyles.default
            ),
            list: listStyles,
            tab: composeStyles(
                tabStyles,
                stateStyles.interactive.selectedBright
            ),
            panel: panelStyles
        },
        inset: {
            root: composeStyles(
                baseStyles,
                backgroundStyles.solid.darker,
                borderStyles.accent.all,
                editingStyles.default
            ),
            list: listStyles,
            tab: composeStyles(
                tabStyles,
                stateStyles.interactive.selectedNeutral
            ),
            panel: panelStyles
        }
    }
};

export type TabsVariant = keyof typeof tabsPreset.variants;

export default tabsPreset;