import { BaseDefinition } from './BaseDefinition';
import { ComponentConfig } from './ComponentConfig';
import { EntityId } from '../types/EntityTypes';

/**
 * Instance of a component in a layout
 */
export interface ComponentInstance extends BaseDefinition {
    definitionId: EntityId;
    overrides: Partial<ComponentConfig>;
}