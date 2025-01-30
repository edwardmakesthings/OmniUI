import { nanoid } from 'nanoid';
import { EntityId, createEntityId } from '../types/EntityTypes';
import { TrackingMetadata, TrackingMetadataUtils } from './TrackingMetadata';

/**
 * Base interface for all definitions in the system
 * Uses strongly-typed EntityId for better type safety
 */
export interface BaseDefinition {
    id: EntityId;
    name: string;
    label: string;
    visible: boolean;
    enabled: boolean;
    metadata: TrackingMetadata;
}

/**
 * Abstract class implementing BaseDefinition with proper typing
 */
export abstract class BaseDefinitionImpl implements BaseDefinition {
    id: EntityId;
    name: string;
    label: string;
    visible: boolean;
    enabled: boolean;
    metadata: TrackingMetadata;

    constructor(name: string, label: string) {
        this.id = createEntityId(nanoid());
        this.name = name;
        this.label = label;
        this.visible = true;
        this.enabled = true;
        this.metadata = {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1
        };
    }

    /**
     * Creates a serializable version of the definition
     * Useful for storage or transmission
     */
    serialize() {
        return {
            ...this,
            metadata: TrackingMetadataUtils.serialize(this.metadata)
        };
    }
}