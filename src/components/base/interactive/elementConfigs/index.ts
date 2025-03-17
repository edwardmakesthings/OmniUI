
import { buttonConfig } from './button';
import { inputConfig } from './input';
import { divConfig } from './div';
import { spanConfig } from './span';
import { ElementConfigurations } from './types';

/**
 * Collection of all element configurations
 * Used by BaseInteractor to determine how to render different element types
 */
export const elementConfigurations: ElementConfigurations = {
    button: buttonConfig,
    input: inputConfig,
    div: divConfig,
    span: spanConfig,
};

export type { ElementConfig, ElementConfigurations } from './types';
export { default as buttonConfig } from "./button";
export { default as divConfig } from "./div";
export { default as inputConfig } from "./input";
export { default as spanConfig } from "./span";