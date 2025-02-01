import { ComponentDefinition } from '../core/base/ComponentDefinition';
import { ComponentInstance } from '../core/base/ComponentInstance';
import { EntityId } from '../core/types/EntityTypes';

/**
 * State interface for component management
 */
export interface ComponentState {
    definitions: Record<EntityId, ComponentDefinition>;
    instances: Record<EntityId, ComponentInstance>;
}