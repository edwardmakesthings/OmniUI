import { StylePreset } from "./types";

export const containerPresets: StylePreset<'wrapper' | 'header' | 'content' | 'footer'> = {
    name: 'container',
    elements: ['wrapper', 'header', 'content', 'footer'],
    variants: {
        card: {
            wrapper: {
                base: 'bg-white shadow rounded-lg overflow-hidden'
            },
            header: {
                base: 'px-4 py-5 sm:px-6 border-b border-gray-200'
            },
            content: {
                base: 'px-4 py-5 sm:p-6'
            },
            footer: {
                base: 'px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200'
            }
        },
        panel: {
            wrapper: {
                base: 'bg-white border border-gray-200 rounded-lg'
            },
            header: {
                base: 'px-4 py-3 border-b border-gray-200'
            },
            content: {
                base: 'p-4'
            },
            footer: {
                base: 'px-4 py-3 bg-gray-50 border-t border-gray-200'
            }
        },
        section: {
            wrapper: {
                base: 'space-y-4'
            },
            header: {
                base: 'space-y-1'
            },
            content: {
                base: ''
            },
            footer: {
                base: 'mt-6'
            }
        }
    },
    // Optional overrides for specific states
    getHoverStyle: (element) => {
        if (element === 'wrapper') {
            return {
                hover: 'hover:shadow-md'
            };
        }
        return {};
    },
    getFocusStyle: (element) => {
        if (element === 'wrapper') {
            return {
                focus: 'focus-within:ring-2 focus-within:ring-primary-500'
            };
        }
        return {};
    }
};