import { ElementStyle, StyleVariants, WithRequired } from '../styleTypes';

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
}