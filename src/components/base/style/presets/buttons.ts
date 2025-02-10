import { StylePreset } from "./types";

export const buttonPresets: StylePreset<'container' | 'icon' | 'label'> = {
    name: 'button',
    elements: ['container', 'icon', 'label'],
    variants: {
        solid: {
            container: {
                base: 'inline-flex items-center justify-center bg-primary-600 text-white rounded-md',
                hover: 'hover:bg-primary-700',
                focus: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                active: 'active:bg-primary-800',
                disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
            },
            icon: {
                base: 'flex-shrink-0',
                hover: 'group-hover:text-white'
            },
            label: {
                base: 'ml-2 text-sm font-medium'
            }
        },
        outline: {
            container: {
                base: 'inline-flex items-center justify-center border border-gray-300 text-gray-700 rounded-md',
                hover: 'hover:bg-gray-50',
                focus: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                active: 'active:bg-gray-100',
                disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
            },
            icon: {
                base: 'flex-shrink-0',
                hover: 'group-hover:text-primary-500'
            },
            label: {
                base: 'ml-2 text-sm font-medium'
            }
        }
    }
};