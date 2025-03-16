// src/registry/index.ts
import {
    initializeComponentRegistry,
    useComponentRegistry,
    loadComponentRegistry,
    saveComponentRegistry,
    ComponentRenderProps,
    ComponentRenderer
} from './componentRegistry';
import { registerComponentRenderers, componentIconMap } from './componentRenderers';
import { useComponents, useWidgetComponents } from './registryHooks';

/**
 * Initialize the component system
 */
export function initializeComponentSystem() {
    // First initialize the registry
    const registry = initializeComponentRegistry();

    // Then load component definitions
    loadComponentRegistry().then(() => {
        console.log('Component definitions loaded');

        // Register component renderers
        registerComponentRenderers();
    }).catch(error => {
        console.error('Failed to initialize component system:', error);
    });

    return registry;
}

// Export registry methods
export {
    initializeComponentRegistry,
    useComponentRegistry,
    loadComponentRegistry,
    saveComponentRegistry,
    registerComponentRenderers,
    componentIconMap
};

// Export hooks
export {
    useComponents,
    useWidgetComponents
};

// Export types
export type { ComponentRenderProps, ComponentRenderer };