/**
 * Enumeration of available component types in a way that allows for type-safe value lookup
 * and consistent string values
 */
export const ComponentTypeValues = {
    Drawer: 'Drawer',
    Dropdown: 'Dropdown',
    DropdownPanel: 'DropdownPanel',
    IconButton: 'IconButton',
    Input: 'Input',
    Label: 'Label',
    ListView: 'ListView',
    Modal: 'Modal',
    Panel: 'Panel',
    PushButton: 'PushButton',
    ScrollBox: 'ScrollBox',
    Tabs: 'Tabs',
    Tooltip: 'Tooltip',
    TreeView: 'TreeView',
} as const;

export type ComponentType = typeof ComponentTypeValues[keyof typeof ComponentTypeValues];

/**
 * Check if a given string is a valid component type
 * @param value - the value to check
 * @returns true if the value is a valid component type, false otherwise
 */
export function isComponentType(value: string): value is ComponentType {
    return Object.values(ComponentTypeValues).includes(value as ComponentType);
}