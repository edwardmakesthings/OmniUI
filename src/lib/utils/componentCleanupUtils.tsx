import { EntityId } from "@/core";
import eventBus from "@/core/eventBus/eventBus";
import { useComponentStore, useWidgetStore } from "@/store";
import { useCallback, useState } from "react";

/**
 * Utility for cleaning up orphaned component instances
 * that are not referenced by any widget.
 */
export const componentCleanupUtils = {
    /**
     * Find all orphaned component instances that aren't referenced by any widget
     * @returns Array of orphaned instance IDs
     */
    findOrphanedInstances(): EntityId[] {
        try {
            const componentStore = useComponentStore.getState();
            const widgetStore = useWidgetStore.getState();

            // Get all instances from component store
            const allInstanceIds = Object.keys(componentStore.instances);

            // Check each instance to see if it's referenced by any widget component
            const orphanedInstanceIds: EntityId[] = [];

            allInstanceIds.forEach((instanceId) => {
                const result = widgetStore.findComponentByInstanceId(
                    instanceId as EntityId
                );

                // If not found in any widget, it's orphaned
                if (!result.component || !result.widgetId) {
                    orphanedInstanceIds.push(instanceId as EntityId);
                }
            });

            return orphanedInstanceIds;
        } catch (error) {
            console.error("Error finding orphaned instances:", error);
            return [];
        }
    },

    /**
     * Clean up orphaned component instances
     * @param options Options for cleanup
     * @returns The number of instances cleaned up
     */
    cleanupOrphanedInstances(
        options: {
            dryRun?: boolean; // If true, just report orphans without deleting
            maxAge?: number; // Only delete orphans older than this (in ms)
        } = {}
    ): number {
        const { dryRun = false, maxAge = 0 } = options;

        try {
            const orphanedIds = this.findOrphanedInstances();
            const componentStore = useComponentStore.getState();

            if (orphanedIds.length === 0) {
                return 0;
            }

            console.info(
                `Found ${orphanedIds.length} orphaned component instances`
            );

            if (dryRun) {
                console.info("Dry run - not deleting orphaned instances");
                return orphanedIds.length;
            }

            // Delete orphaned instances
            let deleteCount = 0;

            orphanedIds.forEach((id) => {
                try {
                    const instance = componentStore.instances[id];

                    // Skip if maxAge is specified and the instance is newer than maxAge
                    if (maxAge > 0 && instance?.metadata?.createdAt) {
                        const age =
                            Date.now() -
                            new Date(instance.metadata.createdAt).getTime();
                        if (age < maxAge) {
                            return;
                        }
                    }

                    // Delete the instance
                    componentStore.deleteInstance(id);
                    deleteCount++;

                    // Log deletion
                    console.info(`Deleted orphaned instance ${id}`);
                } catch (error) {
                    console.warn(
                        `Error deleting orphaned instance ${id}:`,
                        error
                    );
                }
            });

            console.info(`Deleted ${deleteCount} orphaned component instances`);

            // Publish cleanup event
            eventBus.publish("component:orphanedCleanup", {
                count: deleteCount,
                timestamp: Date.now(),
            });

            return deleteCount;
        } catch (error) {
            console.error("Error cleaning up orphaned instances:", error);
            return 0;
        }
    },

    /**
     * Schedule regular cleanup of orphaned instances
     * @param intervalMs Interval between cleanups in milliseconds
     * @returns Function to cancel the scheduled cleanup
     */
    scheduleRegularCleanup(intervalMs: number = 30 * 60 * 1000): () => void {
        // Default to run every 30 minutes
        console.info(
            `Scheduling regular orphaned instance cleanup every ${
                intervalMs / 1000
            } seconds`
        );

        // Run initial cleanup with longer grace period
        setTimeout(() => {
            this.cleanupOrphanedInstances({ maxAge: 5 * 60 * 1000 }); // 5 minute grace period
        }, 10000);

        // Set up regular interval
        const intervalId = setInterval(() => {
            this.cleanupOrphanedInstances({ maxAge: 10 * 60 * 1000 }); // 10 minute grace period
        }, intervalMs);

        // Return function to cancel the scheduled cleanup
        return () => {
            clearInterval(intervalId);
        };
    },
};

/**
 * Hook to use the component cleanup utility in React components
 * @returns Cleanup utility functions
 */
export function useComponentCleanup() {
    const [orphanCount, setOrphanCount] = useState(0);

    // Check for orphans
    const checkForOrphans = useCallback(() => {
        const count = componentCleanupUtils.findOrphanedInstances().length;
        setOrphanCount(count);
        return count;
    }, []);

    // Clean up orphans
    const cleanupOrphans = useCallback(
        (options: { dryRun?: boolean; maxAge?: number } = {}) => {
            const count =
                componentCleanupUtils.cleanupOrphanedInstances(options);
            setOrphanCount((prev) => prev - count);
            return count;
        },
        []
    );

    // Return the utility functions and state
    return {
        orphanCount,
        checkForOrphans,
        cleanupOrphans,
        findOrphanedInstances: componentCleanupUtils.findOrphanedInstances,
    };
}

// Initialize cleanup on app startup
export function initializeOrphanCleanup() {
    // Only run in browser environment
    if (typeof window !== "undefined") {
        // Schedule cleanup to run every hour
        const cancelCleanup = componentCleanupUtils.scheduleRegularCleanup(
            60 * 60 * 1000
        );

        // Make utility available for debugging
        if (process.env.NODE_ENV !== "production") {
            (window as any).__componentCleanup = componentCleanupUtils;
        }

        // Return cleanup function for use with useEffect
        return cancelCleanup;
    }

    // No-op for SSR
    return () => {};
}
