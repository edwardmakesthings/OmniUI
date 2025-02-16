import { ElementStyle, StyleVariants, WithRequired } from '../types';

export interface StylePreset<T extends string = string> {
    name: string;
    // 'root' is automatically included in elements
    elements: T[];
    variants: StyleVariants<T>;
    // Optional overrides of default state handling
    getHoverStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getFocusStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getActiveStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getDisabledStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getSelectedStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getSelectedHoverStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getSelectedFocusStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getSelectedActiveStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getEditingStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getEditingHoverStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getEditingFocusStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
    getEditingActiveStyle?: (element: WithRequired<T, 'root'>) => Partial<ElementStyle>;
}