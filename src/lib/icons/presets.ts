// Reusable preset CSS variables
export const ICON_CSS_VARS = {
    // Standard presets
    containerXs: '(--icon-container-xs)',
    containerSm: '(--icon-container-sm)',
    containerMd: '(--icon-container-md)',
    containerLg: '(--icon-container-lg)',
    containerXl: '(--icon-container-xl)',
    containerXxl: '(--icon-container-xxl)',

    iconXs: '(--icon-size-xs)',
    iconSm: '(--icon-size-sm)',
    iconMd: '(--icon-size-md)',
    iconLg: '(--icon-size-lg)',
    iconXl: '(--icon-size-xl)',
    iconXxl: '(--icon-size-xxl)',

    // UI-specific sizes
    iconColumnContainer: '(--icon-column-container-size)',
    iconColumnIcon: '(--icon-column-icon-size)',
    propertyEditorContainer: '(--property-editor-icon-container)',
    propertyEditorIcon: '(--property-editor-icon-size)',
} as const;

// Tailwind classes for the standard presets
export const ICON_SIZE_CLASSES = {
    xs: {
        container: `w-(--icon-container-xs) h-(--icon-container-xs)`,
        icon: ICON_CSS_VARS.iconXs
    },
    sm: {
        container: `w-(--icon-container-sm) h-(--icon-container-sm)`,
        icon: ICON_CSS_VARS.iconSm
    },
    md: {
        container: `w-(--icon-container-md) h-(--icon-container-md)`,
        icon: ICON_CSS_VARS.iconMd
    },
    lg: {
        container: `w-(--icon-container-lg) h-(--icon-container-lg)`,
        icon: ICON_CSS_VARS.iconLg
    },
    xl: {
        container: `w-(--icon-container-xl) h-(--icon-container-xl)`,
        icon: ICON_CSS_VARS.iconXl
    },
    xxl: {
        container: `w-(--icon-container-xxl) h-(--icon-container-xxl)`,
        icon: ICON_CSS_VARS.iconXxl
    }
} as const;

// UI-specific size classes
export const UI_ICON_CLASSES = {
    iconColumn: {
        container: `w-(--icon-column-container-size) h-(--icon-column-container-size)`,
        icon: ICON_CSS_VARS.iconColumnIcon
    },
    propertyEditor: {
        container: `w-(--property-editor-icon-container) h-(--property-editor-icon-container)`,
        icon: ICON_CSS_VARS.propertyEditorIcon
    }
} as const;

// Default numeric values (for non-CSS usage)
export const DEFAULT_ICON_PRESETS = {
    xs: { icon: 12, container: 24 },
    sm: { icon: 16, container: 32 },
    md: { icon: 20, container: 40 },
    lg: { icon: 24, container: 48 },
    xl: { icon: 28, container: 56 },
    xxl: { icon: 32, container: 64 }
} as const;

export type IconPresetSize = keyof typeof DEFAULT_ICON_PRESETS;
export type UIIconComponent = keyof typeof UI_ICON_CLASSES;