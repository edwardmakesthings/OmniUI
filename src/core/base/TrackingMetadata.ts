import { nanoid } from 'nanoid';

/**
 * Metadata for tracking changes to definitions and instances
 * Uses Date objects internally for better type safety and manipulation
 * while supporting serialization to ISO strings for storage
 */
export interface TrackingMetadata {
    createdAt: Date;
    updatedAt: Date;
    version: number;
}

/**
 * Serialized form of TrackingMetadata for storage
 */
export interface SerializedTrackingMetadata {
    createdAt: string;
    updatedAt: string;
    version: number;
}

/**
* Functions for converting between TrackingMetadata and its serialized form
*/
export const TrackingMetadataUtils = {
    serialize(metadata: TrackingMetadata): SerializedTrackingMetadata {
        return {
            createdAt: metadata.createdAt.toISOString(),
            updatedAt: metadata.updatedAt.toISOString(),
            version: metadata.version
        };
    },

    deserialize(serialized: SerializedTrackingMetadata): TrackingMetadata {
        return {
            createdAt: new Date(serialized.createdAt),
            updatedAt: new Date(serialized.updatedAt),
            version: serialized.version
        };
    }
};