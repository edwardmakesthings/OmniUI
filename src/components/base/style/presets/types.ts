import { ElementStyle, StyleVariants } from '../styleTypes';

export interface StylePreset<T extends string = string> {
    name: string;
    elements: T[];
    variants: StyleVariants<T>;
    // Optional overrides of default state handling
    getHoverStyle?: (element: T) => Partial<ElementStyle>;
    getFocusStyle?: (element: T) => Partial<ElementStyle>;
    getActiveStyle?: (element: T) => Partial<ElementStyle>;
    getDisabledStyle?: (element: T) => Partial<ElementStyle>;
}