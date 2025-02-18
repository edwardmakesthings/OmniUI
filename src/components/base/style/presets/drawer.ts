import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    borderStyles,
    transitionStyles,
    editingStyles
} from '../compositions';
import { composeStyles } from '../utils';

// Base styles for the drawer container
const baseStyles = composeStyles(
    layoutStyles.flex.col.base,
    backgroundStyles.solid.dark,
    'fixed z-50',
    'transition-transform duration-300 ease-in-out'
);

// Content area styles
const contentStyles = composeStyles(
    'flex-1 overflow-auto'
);

// Overlay/backdrop styles
const overlayStyles = composeStyles(
    'fixed inset-0 bg-black/50',
    'transition-opacity duration-300',
    'z-40'
);

export const drawerPreset: StylePreset<'overlay' | 'content'> = {
    name: 'drawer',
    elements: ['overlay', 'content'],
    variants: {
        left: {
            root: composeStyles(
                baseStyles,
                'top-0 left-0 bottom-0',
                'border-r border-accent-dark-neutral',
                editingStyles.default
            ),
            content: contentStyles,
            overlay: overlayStyles
        },
        right: {
            root: composeStyles(
                baseStyles,
                'top-0 right-0 bottom-0',
                'border-l border-accent-dark-neutral',
                editingStyles.default
            ),
            content: contentStyles,
            overlay: overlayStyles
        },
        top: {
            root: composeStyles(
                baseStyles,
                'top-0 left-0 right-0',
                'border-b border-accent-dark-neutral',
                editingStyles.default
            ),
            content: contentStyles,
            overlay: overlayStyles
        },
        bottom: {
            root: composeStyles(
                baseStyles,
                'bottom-0 left-0 right-0',
                'border-t border-accent-dark-neutral',
                editingStyles.default
            ),
            content: contentStyles,
            overlay: overlayStyles
        }
    }
};

export type DrawerVariant = keyof typeof drawerPreset.variants;

export default drawerPreset;