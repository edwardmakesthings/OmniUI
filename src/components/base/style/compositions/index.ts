import { composeStyles } from "../utils";

// Theme-based background styles
export const backgroundStyles = {
    solid: {
        dark: {
            base: 'bg-bg-dark',
            hover: 'hover:bg-bg-dark-lighter',
            active: 'active:bg-bg-dark-darker'
        },
        darker: {
            base: 'bg-bg-dark-darker',
            hover: 'hover:bg-bg-dark',
            active: 'active:bg-bg-dark-lighter'
        },
        accent: {
            base: 'bg-accent-dark-neutral',
            hover: 'hover:bg-accent-dark-neutral-hover',
            active: 'active:bg-accent-dark-neutral-hover'
        },
        transparent: {
            base: 'bg-transparent',
            hover: 'hover:bg-accent-dark-neutral/50',
            active: 'active:bg-accent-dark-neutral'
        }
    }
} as const;

// Theme-based border styles
export const borderStyles = {
    none: {
        base: 'border-0'
    },
    accent: {
        all: {
            base: 'border border-accent-dark-neutral'
        },
        top: {
            base: 'border-t border-accent-dark-neutral'
        },
        bottom: {
            base: 'border-b border-accent-dark-neutral'
        },
        left: {
            base: 'border-l border-accent-dark-neutral'
        },
        right: {
            base: 'border-r border-accent-dark-neutral'
        }
    }
} as const;

// Theme-based text styles
export const textStyles = {
    default: {
        base: 'text-font-dark',
        muted: 'text-font-dark-muted',
        dimmed: 'text-font-dark-dimmed'
    },
    size: {
        xs: 'text-xs',
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
        xl: 'text-xl'
    }
} as const;

// Focus styles aligned with theme
export const focusStyles = {
    ring: {
        accent: {
            focus: 'focus:ring-1 focus:ring-accent-dark-bright focus:ring-offset-0'
        }
    },
    outline: {
        accent: {
            focus: 'focus:outline-none focus:outline-accent-dark-bright'
        }
    }
} as const;

// Base shape styles
export const shapeStyles = {
    rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg'
    }
} as const;

// Layout compositions
export const layoutStyles = {
    flex: {
        row: {
            base: 'flex flex-row',
            center: 'flex flex-row items-center',
            centerFull: 'flex flex-row items-center justify-center',
            between: 'flex flex-row items-center justify-between',
            start: 'flex flex-row items-center justify-start',
            end: 'flex flex-row items-center justify-end'
        },
        col: {
            base: 'flex flex-col',
            center: 'flex flex-col items-center',
            between: 'flex flex-col justify-between',
            start: 'flex flex-col justify-start',
            end: 'flex flex-col justify-end'
        }
    },
    grid: {
        base: 'grid',
        center: 'place-items-center',
        cols2: 'grid-cols-2',
        cols3: 'grid-cols-3',
        cols4: 'grid-cols-4'
    },
    spacing: {
        pad: {
            none: 'p-0',
            sm: 'p-1',    // 10px
            md: 'p-2',    // 20px
            lg: 'p-3'     // 30px
        },
        gap: {
            none: 'gap-0',
            sm: 'gap-1',  // 10px
            md: 'gap-2',  // 20px
            lg: 'gap-3'   // 30px
        }
    }
} as const;

// Common sizing presets
export const sizeStyles = {
    height: {
        input: {
            sm: 'h-1',           // 10px
            md: 'h-5',           // 20px
            lg: 'h-10'           // 40px
        }
    },
    width: {
        full: 'w-full',
        screen: 'w-screen'
    }
} as const;

// State styles
export const stateStyles = {
    interactive: {
        base: {
            base: 'cursor-pointer',
            disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
            loading: 'opacity-50 cursor-wait',
        },
        selectedNeutral: {
            selectedBase: 'bg-accent-dark-neutral text-font-dark',
            selectedHover: "hover:bg-accent-dark-neutral",
            selectedActive: "active:bg-accent-dark-neutral-hover",
        },
        selectedBright: {
            selectedBase: 'bg-accent-dark-neutral text-font-dark',
            selectedHover: "hover:bg-accent-dark-bright",
            selectedActive: "active:bg-accent-dark-bright-hover",
        },
    }
} as const;

// Animation/transition styles
export const transitionStyles = {
    base: 'transition-all duration-200 ease-in-out',
    transform: 'transition-transform duration-200 ease-in-out',
    colors: 'transition-colors duration-200 ease-in-out',
    opacity: 'transition-opacity duration-200 ease-in-out'
} as const;

// Component-specific compositions
export const componentStyles = {
    panel: {
        container: composeStyles(
            layoutStyles.flex.col,
            backgroundStyles.solid.dark,
            'h-full'
        ),
        header: composeStyles(
            layoutStyles.flex.row.between,
            borderStyles.accent.bottom,
            layoutStyles.spacing.pad.md,
            sizeStyles.height.input.lg
        ),
        content: composeStyles(
            'flex-1',
            'overflow-auto'
        )
    }
} as const;

export const editingStyles = {
    default: {
        editingBase: 'relative outline-2 outline-gray-500',
        editingHover: 'hover:bg-accent-dark-bright/20 hover:outline-4 hover:cursor-grab',
        editingActive: 'active:cursor-grabbing'
    }
} as const;