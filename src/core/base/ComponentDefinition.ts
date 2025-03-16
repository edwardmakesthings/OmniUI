import { BaseDefinition } from './BaseDefinition';
import { ComponentType } from '../types/ComponentTypes';
import { ComponentConfig } from './ComponentConfig';

/**
 * Definition of a component template
 */
export interface ComponentDefinition extends BaseDefinition {
    type: ComponentType;
    category: "layout" | "control" | "display";
    isLayout: boolean;
    config: ComponentConfig;
}