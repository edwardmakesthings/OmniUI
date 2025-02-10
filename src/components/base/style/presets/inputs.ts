import { commonStyles } from "./common";
import { StylePreset } from "./types";

export const inputPresets: StylePreset<'container' | 'input' | 'label' | 'helper'> = {
    name: 'input',
    elements: ['container', 'input', 'label', 'helper'],
    variants: {
        default: {
            container: {
                base: 'relative',
            },
            label: {
                base: 'block text-sm font-medium text-gray-700 mb-1',
                disabled: 'text-gray-500'
            },
            input: {
                base: `block w-full rounded-md border-gray-300 ${commonStyles.shadow} ${commonStyles.interactive}`,
                hover: 'hover:border-gray-400',
                focus: commonStyles.focusRing,
                disabled: commonStyles.disabled
            },
            helper: {
                base: 'mt-1 text-sm text-gray-500'
            }
        },
        error: {
            container: {
                base: 'relative'
            },
            label: {
                base: 'block text-sm font-medium text-red-600 mb-1'
            },
            input: {
                base: 'block w-full rounded-md border-red-300 text-red-900 placeholder-red-300 shadow-sm',
                hover: 'hover:border-red-400',
                focus: 'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                disabled: commonStyles.disabled
            },
            helper: {
                base: 'mt-1 text-sm text-red-600'
            }
        }
    }
};