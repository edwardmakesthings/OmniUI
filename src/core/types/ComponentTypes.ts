/**
 * Defines the core component types supported by the application
 * These values are used throughout the application to identify component types
 */
export const ComponentTypeValues = {
    // Layout components
    Panel: 'Panel',
    ScrollBox: 'ScrollBox',
    Drawer: 'Drawer',
    Modal: 'Modal',
    DropdownPanel: 'DropdownPanel',
    Tabs: 'Tabs',

    // Control components
    PushButton: 'PushButton',
    IconButton: 'IconButton',
    Input: 'Input',
    DropdownButton: 'DropdownButton',
    DropdownSelect: 'DropdownSelect',
    ListView: 'ListView',
    TreeView: 'TreeView',

    // Display components
    Label: 'Label',

    // Container component
    Widget: 'Widget'
} as const;

/**
 * Type representing the possible component types
 */
export type ComponentType = typeof ComponentTypeValues[keyof typeof ComponentTypeValues];

/**
 * Check if a given string is a valid component type
 * @param value - the value to check
 * @returns true if the value is a valid component type, false otherwise
 */
export function isComponentType(value: string): value is ComponentType {
    return Object.values(ComponentTypeValues).includes(value as ComponentType);
}

/**
 * Type representing the possible component categories
 */
export type ComponentCategory = 'layout' | 'control' | 'display' | 'container';

/**
 * Mapping of component types to their categories
 */
export const ComponentCategoryMap: Record<ComponentType, ComponentCategory> = {
    // Layout components
    [ComponentTypeValues.Panel]: 'layout',
    [ComponentTypeValues.ScrollBox]: 'layout',
    [ComponentTypeValues.Drawer]: 'layout',
    [ComponentTypeValues.Modal]: 'layout',
    [ComponentTypeValues.DropdownPanel]: 'layout',
    [ComponentTypeValues.Tabs]: 'layout',

    // Control components
    [ComponentTypeValues.PushButton]: 'control',
    [ComponentTypeValues.IconButton]: 'control',
    [ComponentTypeValues.Input]: 'control',
    [ComponentTypeValues.DropdownButton]: 'control',
    [ComponentTypeValues.DropdownSelect]: 'control',
    [ComponentTypeValues.ListView]: 'control',
    [ComponentTypeValues.TreeView]: 'control',

    // Display components
    [ComponentTypeValues.Label]: 'display',

    // Container component
    [ComponentTypeValues.Widget]: 'container'
};

/**
 * Determines if a component type is a layout component
 */
export function isLayoutComponent(type: ComponentType): boolean {
    return ComponentCategoryMap[type] === 'layout';
}

/**
 * Determines if a component type is a control component
 */
export function isControlComponent(type: ComponentType): boolean {
    return ComponentCategoryMap[type] === 'control';
}

/**
 * Determines if a component type is a display component
 */
export function isDisplayComponent(type: ComponentType): boolean {
    return ComponentCategoryMap[type] === 'display';
}

/**
 * Determines if a component type is a container component
 */
export function isContainerComponent(type: ComponentType): boolean {
    return type === ComponentTypeValues.Widget ||
        type === ComponentTypeValues.Panel ||
        type === ComponentTypeValues.ScrollBox ||
        type === ComponentTypeValues.Modal ||
        type === ComponentTypeValues.Drawer ||
        type === ComponentTypeValues.DropdownPanel ||
        type === ComponentTypeValues.Tabs;
}