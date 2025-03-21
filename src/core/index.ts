// src/core/index.ts
import { initializeComponentRegistry, loadComponentRegistry } from '@/registry/componentRegistry';
import { registerComponentRenderers } from '@/registry/componentRenderers';
import { useWidgetStore } from '@/features/builder/stores/widgetStore';
import { useComponentStore } from '@/store/componentStore';
import { useUIStore } from '@/store/uiStore';
import eventBus from './eventBus/eventBus';
import { useCallback } from 'react';
import { useEventSubscription } from '@/hooks/useEventBus';

// Current version for system components - increment when adding new components
export const SYSTEM_COMPONENTS_VERSION = 2;

// LocalStorage key for components version
const COMPONENTS_VERSION_KEY = 'system-components-version';
const COMPONENTS_STORAGE_KEY = 'system-components';

interface InitOptions {
    resetStores?: boolean;
    registerComponents?: boolean;
    checkVersion?: boolean;
    forceSystemComponentRefresh?: boolean;
}

/**
 * Initialize the core system components
 * This should be called during application startup
 */
export async function initializeCoreSystem(options: InitOptions = {}) {
    const {
        resetStores = false,
        registerComponents = true,
        checkVersion = true,
        forceSystemComponentRefresh = false
    } = options;

    // Check component version first if enabled
    if (checkVersion) {
        const needsUpdate = await checkSystemComponentsVersion(forceSystemComponentRefresh);

        // If components are outdated or forced refresh is requested, do a full reset
        if (needsUpdate) {
            // Clear component registry in localStorage to force regeneration
            localStorage.removeItem(COMPONENTS_STORAGE_KEY);

            // Force a component store reset that clears ALL components
            useComponentStore.getState().purgeStore({
                keepSystemComponents: false, // Remove all existing system components
                resetToDefaults: false // Don't auto-register here, we'll do it manually
            });

            console.log("System components registry reset due to version update");
        }
    }

    // Reset stores if requested
    if (resetStores) {
        useWidgetStore.getState().purgeStore();
        useComponentStore.getState().purgeStore({
            resetToDefaults: true
        });
        useUIStore.getState(); // Initialize UI store
    }

    // Initialize component registry
    const registry = initializeComponentRegistry();

    // Register component renderers
    if (registerComponents) {
        registerComponentRenderers();
    }

    // Load component registry
    await loadComponentRegistry();

    // Update the stored version after successful initialization
    if (checkVersion) {
        localStorage.setItem(COMPONENTS_VERSION_KEY, SYSTEM_COMPONENTS_VERSION.toString());

        // Log component count after initialization
        const componentCount = Object.keys(useComponentStore.getState().definitions).length;
        console.log(`Component system initialized with ${componentCount} components (version ${SYSTEM_COMPONENTS_VERSION})`);
    }

    return { registry };
}

/**
 * Check if system components need updating based on version number
 * @param forceUpdate Force an update regardless of version
 * @returns true if update is needed
 */
async function checkSystemComponentsVersion(forceUpdate: boolean = false): Promise<boolean> {
    if (forceUpdate) {
        console.log("Forced system components update requested");
        return true;
    }

    try {
        // Get stored version
        const storedVersionStr = localStorage.getItem(COMPONENTS_VERSION_KEY);
        const storedVersion = storedVersionStr ? parseInt(storedVersionStr, 10) : 0;

        // Check if update needed
        const needsUpdate = storedVersion < SYSTEM_COMPONENTS_VERSION;

        if (needsUpdate) {
            console.log(`System components need update: stored v${storedVersion}, current v${SYSTEM_COMPONENTS_VERSION}`);
        }

        return needsUpdate;
    } catch (error) {
        console.error("Error checking component version:", error);
        // Return true to trigger refresh on error
        return true;
    }
}

/**
 * Hook to create essential event listeners for cross-component communication
 */
export function useGlobalEventListeners() {
    // Define the handler for widget update events
    const handleWidgetUpdate = useCallback((event: any) => {
        const { widgetId } = event.data;

        if (widgetId) {
            // Publish a hierarchy changed event for this widget
            eventBus.publish('hierarchy:changed', { widgetId });
        }
    }, []);

    // Use the hook to handle subscription and cleanup
    useEventSubscription(
        'widget:updated',
        handleWidgetUpdate,
        [handleWidgetUpdate],
        'GlobalWidgetUpdateHandler'
    );
}

/**
 * Force regeneration of system components
 * This can be called from development console with window.__refreshSystemComponents()
 */
export async function forceRefreshSystemComponents(): Promise<boolean> {
    try {
        console.log("Forcing system components refresh...");

        // Clear localStorage entries
        localStorage.removeItem(COMPONENTS_STORAGE_KEY);
        localStorage.removeItem(COMPONENTS_VERSION_KEY);

        // Purge component store completely
        const componentStore = useComponentStore.getState();
        componentStore.purgeStore({
            keepSystemComponents: false,
            resetToDefaults: false
        });

        // Reinitialize system
        await initializeCoreSystem({
            registerComponents: true,
            checkVersion: true,
            forceSystemComponentRefresh: true
        });

        console.log("System components refresh completed successfully");

        // Publish event about refresh
        eventBus.publish('component:systemRefreshed', {
            timestamp: Date.now(),
            version: SYSTEM_COMPONENTS_VERSION
        });

        return true;
    } catch (error) {
        console.error("System components refresh failed:", error);
        return false;
    }
}

/**
 * Export all core types and utilities
 */
export * from './types/ComponentTypes';
export * from './types/EntityTypes';
export * from './types/Geometry';
export * from './types/Measurement';
export * from './types/UI';
export * from './base';
export * from '../features/builder/dragDrop/ComponentDragDrop';