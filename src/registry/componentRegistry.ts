import { useComponentStore } from '@/store/componentStore';
import { registerLayoutComponents } from './categories/layoutComponents';
import { registerControlComponents } from './categories/controlComponents';
import { registerDisplayComponents } from './categories/displayComponents';
// import { APP_VERSION } from '@/config/appConfig';

// Registry state tracking
let registryInitialized = false;

/**
 * Load the complete component registry
 * @param userId Optional user ID for loading user components (future)
 */
export async function loadComponentRegistry(userId?: string) {
    if (registryInitialized) return;

    try {
        // Step 1: Load system components
        await loadSystemComponents();

        // Step 2: Load user components if user is logged in (placeholder for future)
        if (userId) {
            // Left as a placeholder for future implementation
            console.log(`User components for ${userId} will be loaded in a future version`);
        }

        registryInitialized = true;
        console.log('Component registry initialized');
    } catch (error) {
        console.error('Failed to load component registry:', error);
        throw error;
    }
}

/**
 * Load system component definitions
 */
async function loadSystemComponents() {
    const store = useComponentStore.getState();

    try {
        // For development, use localStorage
        const savedRegistry = localStorage.getItem('system-components');

        if (savedRegistry) {
            const components = JSON.parse(savedRegistry);

            // TODO: Add version checking and migration in the future
            // For now, just load components directly

            // Register components in store
            components.forEach((component: any) => {
                store.addDefinition(component);
            });

            console.log(`Loaded ${components.length} system components`);
            return;
        }

        // No saved registry, initialize default components
        console.log('No saved registry found, initializing defaults');
        await initializeDefaultComponents();
    } catch (error) {
        console.error('Failed to load system components:', error);
        throw error;
    }
}

/**
 * Placeholder for future migration capability
 * Will migrate component definitions between versions
 */
// function prepareForMigration(component: any, targetVersion: string): any {
//     // Currently just passes through the component unchanged
//     // In the future, this will handle migrations between versions

//     // Add a version property to component.metadata if it doesn't exist
//     if (!component.metadata.definitionVersion) {
//         component.metadata.definitionVersion = APP_VERSION;
//     }

//     return component;
// }

/**
 * Placeholder for future user component loading
 */
async function loadUserComponentsForUser(userId: string): Promise<any[]> {
    // This is a placeholder that will be implemented in the future
    console.log(`Loading user components for ${userId} will be implemented in a future version`);
    return [];
}

/**
 * Initialize registry with default components
 */
async function initializeDefaultComponents() {
    const store = useComponentStore.getState();
    const existingDefinitions = Object.keys(store.definitions).length;

    if (existingDefinitions > 0) {
        console.log(`Skipping initialization, ${existingDefinitions} components already exist`);
        return;
    }

    // Register default components from categories
    registerLayoutComponents();
    registerControlComponents();
    registerDisplayComponents();

    // Save to localStorage for future loads
    const components = Object.values(store.definitions);

    if (components.length > 0) {
        localStorage.setItem('system-components', JSON.stringify(components));
        console.log(`Initialized ${components.length} default components`);
    }
}

/**
 * Save current registry to persistence
 */
export async function saveComponentRegistry() {
    const store = useComponentStore.getState();
    const components = Object.values(store.definitions);

    try {
        // For development with localStorage:
        localStorage.setItem('system-components', JSON.stringify(components));

        // Future: Database implementation with axios
        // await axios.post('/api/components', components);

        console.log(`Saved ${components.length} components to storage`);
    } catch (error) {
        console.error('Failed to save component registry:', error);
        throw error;
    }
}

/**
 * Hook for components to access registry functionality
 */
export function useComponentRegistry() {
    // Memoize these functions to prevent recreation on every render
    const loadRegistry = loadComponentRegistry;
    const saveRegistry = saveComponentRegistry;
    const initializeDefaults = initializeDefaultComponents;
    const loadUserComponents = loadUserComponentsForUser;

    return {
        isInitialized: registryInitialized,
        loadRegistry,
        saveRegistry,
        initializeDefaults,
        // Doesn't currently do anything, placeholder for future
        loadUserComponents,
    };
}