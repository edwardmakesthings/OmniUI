/**
 * Metadata for tracking changes to definitions and instances
 * Uses Date objects internally for better type safety and manipulation
 * while supporting serialization to ISO strings for storage
 */
export interface TrackingMetadata {
    createdAt: Date;                // Data related to undo system
    updatedAt: Date;                // Data related to undo system
    version: number;                // Version number related to undo system
    definitionVersion: string;      // Component definition version (e.g., "1.0.0")
    compatibilityVersion: string;   // Minimum app version required
    createdBy?: string;             // User ID for user-created components
    isUserComponent?: boolean;      // Flag for user vs. system components
}

/**
 * Serialized form of TrackingMetadata for storage
 */
export interface SerializedTrackingMetadata {
    createdAt: string;
    updatedAt: string;
    version: number;
    definitionVersion: string;
    compatibilityVersion: string;
    createdBy?: string;
    isUserComponent?: boolean;
}

/**
* Functions for converting between TrackingMetadata and its serialized form
*/
export const TrackingMetadataUtils = {
    serialize(metadata: TrackingMetadata): SerializedTrackingMetadata {
        return {
            createdAt: metadata.createdAt.toISOString(),
            updatedAt: metadata.updatedAt.toISOString(),
            version: metadata.version,
            definitionVersion: metadata.definitionVersion,
            compatibilityVersion: metadata.compatibilityVersion,
            createdBy: metadata.createdBy,
            isUserComponent: metadata.isUserComponent
        };
    },

    deserialize(serialized: SerializedTrackingMetadata): TrackingMetadata {
        return {
            createdAt: new Date(serialized.createdAt),
            updatedAt: new Date(serialized.updatedAt),
            version: serialized.version,
            definitionVersion: serialized.definitionVersion,
            compatibilityVersion: serialized.compatibilityVersion,
            createdBy: serialized.createdBy,
            isUserComponent: serialized.isUserComponent
        };
    }
};