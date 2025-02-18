import { StylePreset } from './types';
import {
    layoutStyles,
    backgroundStyles,
    borderStyles,
    transitionStyles,
    stateStyles,
    sizeStyles,
    focusStyles,
    textStyles
} from '../compositions';
import { composeStyles } from '../utils';

// Base input styles shared across variants
const baseStyles = composeStyles(
    layoutStyles.flex.row.center,
    transitionStyles.base,
    stateStyles.interactive.base,
    textStyles.default.base
);

// Addon group styles for prefix/suffix containers
const addonGroupStyles = composeStyles(
    layoutStyles.flex.row.center,
    'gap-1'
);

export const inputPreset: StylePreset<'input' | 'prefix' | 'suffix' | 'prefixGroup' | 'suffixGroup'> = {
    name: 'input',
    elements: ['input', 'prefix', 'suffix', 'prefixGroup', 'suffixGroup'],
    variants: {
        default: {
            root: composeStyles(
                layoutStyles.flex.row.between,
                backgroundStyles.solid.dark,
                sizeStyles.width.full,
                borderStyles.accent.all,
                'relative focus-within:border-accent-dark-bright border-1'
            ),
            input: composeStyles(
                baseStyles,
                'flex-1 px-1 py-1 border-0 outline-0 focus:border-0 focus:outline-0 focus-within:outline-0 focus-within:border-0'
            ),
            prefixGroup: addonGroupStyles,
            suffixGroup: addonGroupStyles,
            prefix: composeStyles(
                textStyles.default.dimmed,
                'pl-1 text-nowrap'
            ),
            suffix: composeStyles(
                textStyles.default.dimmed,
                'px-1 text-nowrap'
            )
        },
        ghost: {
            root: composeStyles(
                layoutStyles.flex.row.between,
                backgroundStyles.solid.transparent,
                sizeStyles.width.full,
                'relative'
            ),
            input: composeStyles(
                baseStyles,
                'flex-1 px-1 py-1 border-0 outline-0'
            ),
            prefixGroup: addonGroupStyles,
            suffixGroup: addonGroupStyles,
            prefix: composeStyles(
                textStyles.default.dimmed,
                'pl-1 text-nowrap'
            ),
            suffix: composeStyles(
                textStyles.default.dimmed,
                'px-1 text-nowrap'
            )
        },
        search: {
            root: composeStyles(
                layoutStyles.flex.row.between,
                backgroundStyles.solid.darker,
                sizeStyles.width.full,
                borderStyles.accent.all,
                'relative'
            ),
            input: composeStyles(
                baseStyles,
                'flex-1 px-1 py-1 border-0 outline-0'
            ),
            prefixGroup: addonGroupStyles,
            suffixGroup: addonGroupStyles,
            prefix: composeStyles(
                textStyles.default.dimmed,
                'pl-1 text-nowrap'
            ),
            suffix: composeStyles(
                textStyles.default.dimmed,
                'px-1 text-nowrap'
            )
        },
        minimal: {
            root: composeStyles(
                layoutStyles.flex.row.center,
                sizeStyles.width.full,
                sizeStyles.height.input.md,
                'relative'
            ),
            input: composeStyles(
                backgroundStyles.solid.transparent,
                sizeStyles.width.full,
                transitionStyles.base,
                stateStyles.interactive.base,
                textStyles.default.base,
                'px-2 py-1',
                'border-b border-accent-dark-neutral'
            ),
            prefixGroup: addonGroupStyles,
            suffixGroup: addonGroupStyles,
            prefix: composeStyles(
                'absolute left-2',
                textStyles.default.dimmed
            ),
            suffix: composeStyles(
                'absolute right-2',
                textStyles.default.dimmed
            )
        }
    }
};

export type InputVariant = keyof typeof inputPreset.variants;

export default inputPreset;