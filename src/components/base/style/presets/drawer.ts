import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    transitionStyles,
    editingStyles
} from '../compositions';
import { composeStyles } from '../utils';

// Container and overlay base styles
const containerStyles = {
    base: composeStyles(
        'relative w-full h-full',
        'z-50'
    ),
    fullscreen: composeStyles(
        'fixed inset-0'
    ),
};

const overlayStyles = {
    base: composeStyles(
        'absolute inset-0 bg-black/50',
        'transition-opacity duration-300',
    ),
    fullscreen: composeStyles(
        'fixed inset-0',
    ),
};

// Base drawer styles
const baseStyles = composeStyles(
    layoutStyles.flex.col.base,
    backgroundStyles.solid.dark,
    transitionStyles.transform
);

// Content area styles
const contentStyles = composeStyles(
    'flex-1 overflow-auto'
);

export const drawerPreset: StylePreset<'container' | 'overlay' | 'content'> = {
    name: 'drawer',
    elements: ['container', 'overlay', 'content'],
    variants: {
        left: {
            root: composeStyles(
                baseStyles,
                'fixed top-0 left-0 bottom-0',
                'border-r border-accent-dark-neutral',
                editingStyles.default
            ),
            container: composeStyles(containerStyles.base, containerStyles.fullscreen),
            overlay: composeStyles(overlayStyles.base, overlayStyles.fullscreen),
            content: contentStyles
        },
        'left-contained': {
            root: composeStyles(
                baseStyles,
                'absolute top-0 left-0 bottom-0',
                'border-r border-accent-dark-neutral',
                editingStyles.default
            ),
            container: containerStyles.base,
            overlay: overlayStyles.base,
            content: contentStyles
        },
        right: {
            root: composeStyles(
                baseStyles,
                'fixed top-0 right-0 bottom-0',
                'border-l border-accent-dark-neutral',
                editingStyles.default
            ),
            container: composeStyles(containerStyles.base, containerStyles.fullscreen),
            overlay: composeStyles(overlayStyles.base, overlayStyles.fullscreen),
            content: contentStyles
        },
        'right-contained': {
            root: composeStyles(
                baseStyles,
                'absolute top-0 right-0 bottom-0',
                'border-l border-accent-dark-neutral',
                editingStyles.default
            ),
            container: containerStyles.base,
            overlay: overlayStyles.base,
            content: contentStyles
        },
        top: {
            root: composeStyles(
                baseStyles,
                'fixed top-0 left-0 right-0',
                'border-b border-accent-dark-neutral',
                editingStyles.default
            ),
            container: composeStyles(containerStyles.base, containerStyles.fullscreen),
            overlay: composeStyles(overlayStyles.base, overlayStyles.fullscreen),
            content: contentStyles
        },
        'top-contained': {
            root: composeStyles(
                baseStyles,
                'absolute top-0 left-0 right-0',
                'border-b border-accent-dark-neutral',
                editingStyles.default
            ),
            container: containerStyles.base,
            overlay: overlayStyles.base,
            content: contentStyles
        },
        bottom: {
            root: composeStyles(
                baseStyles,
                'bottom-0 left-0 right-0',
                'border-t border-accent-dark-neutral',
                editingStyles.default
            ),
            container: composeStyles(containerStyles.base, containerStyles.fullscreen),
            overlay: composeStyles(overlayStyles.base, overlayStyles.fullscreen),
            content: contentStyles
        },
        'bottom-contained': {
            root: composeStyles(
                baseStyles,
                'absolute bottom-0 left-0 right-0',
                'border-t border-accent-dark-neutral',
                editingStyles.default
            ),
            container: containerStyles.base,
            overlay: overlayStyles.base,
            content: contentStyles
        }
    }
};

export type DrawerVariant = keyof typeof drawerPreset.variants;

export default drawerPreset;