import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { backgroundStyles, borderStyles, textStyles } from '@/components/base/style/compositions';
import { ComputedElementStyle } from '@/components/base/style/types';

// Theme variable types
interface ThemeColors {
    primary: {
        50: string;
        // ... other shades
        600: string;
    };
    gray: {
        50: string;
        // ... other shades
        900: string;
    };
    // Other color types
}

interface ThemeVariables {
    colors: ThemeColors;
    borderRadius: Record<string, string>;
    spacing: Record<string, string>;
    // Other variable types
}

interface CompositionCategory {
    [key: string]: {
        [variant: string]: ComputedElementStyle;
    };
}

interface ThemeStore {
    // Theme Variables
    variables: ThemeVariables;
    customVariables: Partial<ThemeVariables>;
    updateVariable: (path: string[], value: string) => void;
    resetVariable: (path: string[]) => void;

    // Style Compositions
    compositions: {
        background: typeof backgroundStyles;
        border: typeof borderStyles;
        text: typeof textStyles;
        // other composition types
    };
    customCompositions: Partial<{
        background: Partial<typeof backgroundStyles>;
        border: Partial<typeof borderStyles>;
        text: Partial<typeof textStyles>;
    }>;
    updateComposition: (
        category: string,
        variant: string,
        styles: Partial<ComputedElementStyle>
    ) => void;
    resetComposition: (category: string, variant?: string) => void;
}

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            // Base theme variables
            variables: {
                colors: {
                    primary: {
                        50: 'rgb(var(--color-primary-50))',
                        // ... other shades
                        600: 'rgb(var(--color-primary-600))'
                    },
                    // ... other colors
                },
                // ... other variables
            },

            // Custom overrides
            customVariables: {},

            // Update a theme variable
            updateVariable: (path, value) => {
                set(state => {
                    const newCustomVariables = { ...state.customVariables };
                    let current = newCustomVariables;

                    // Navigate to the correct nesting level
                    for (let i = 0; i < path.length - 1; i++) {
                        current[path[i]] = current[path[i]] || {};
                        current = current[path[i]];
                    }

                    // Set the value
                    current[path[path.length - 1]] = value;

                    // Update CSS variable
                    const cssVarName = `--${path.join('-')}`;
                    document.documentElement.style.setProperty(cssVarName, value);

                    return { customVariables: newCustomVariables };
                });
            },

            // Reset a theme variable to default
            resetVariable: (path) => {
                set(state => {
                    const newCustomVariables = { ...state.customVariables };
                    let current = newCustomVariables;

                    // Remove custom value
                    for (let i = 0; i < path.length - 1; i++) {
                        if (!current[path[i]]) return { customVariables: newCustomVariables };
                        current = current[path[i]];
                    }
                    delete current[path[path.length - 1]];

                    // Reset CSS variable to default
                    const cssVarName = `--${path.join('-')}`;
                    document.documentElement.style.removeProperty(cssVarName);

                    return { customVariables: newCustomVariables };
                });
            },

            // Base style compositions
            compositions: {
                background: backgroundStyles,
                border: borderStyles,
                text: textStyles,
            },

            // Custom composition overrides
            customCompositions: {},

            // Update a style composition
            updateComposition: (category, variant, styles) => {
                set(state => {
                    const newCustomCompositions = {
                        ...state.customCompositions,
                        [category]: {
                            ...state.customCompositions[category],
                            [variant]: {
                                ...state.customCompositions[category]?.[variant],
                                ...styles
                            }
                        }
                    };

                    return { customCompositions: newCustomCompositions };
                });
            },

            // Reset a style composition
            resetComposition: (category, variant) => {
                set(state => {
                    const newCustomCompositions = { ...state.customCompositions };

                    if (variant) {
                        // Reset specific variant
                        if (newCustomCompositions[category]) {
                            delete newCustomCompositions[category][variant];
                        }
                    } else {
                        // Reset entire category
                        delete newCustomCompositions[category];
                    }

                    return { customCompositions: newCustomCompositions };
                });
            }
        }),
        {
            name: 'omni-ui-theme'
        }
    )
);