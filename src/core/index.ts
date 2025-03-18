// src/core/index.ts
import { initializeComponentRegistry, loadComponentRegistry } from '@/registry/componentRegistry';
import { registerComponentRenderers } from '@/registry/componentRenderers';
import { useWidgetStore } from '@/features/builder/stores/widgetStore';
import { useComponentStore } from '@/store/componentStore';
import { useUIStore } from '@/store/uiStore';
import eventBus from './eventBus/eventBus';

interface InitOptions {
    resetStores?: boolean;
    registerComponents?: boolean;
}

/**
 * Initialize the core system components
 * This should be called during application startup
 */
export async function initializeCoreSystem(options: InitOptions = {}) {
    const { resetStores = false, registerComponents = true } = options;

    console.log("Initializing core system...");

    // Reset stores if requested
    if (resetStores) {
        console.log("Resetting stores...");
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

    console.log("Core system initialized");

    return { registry };
}

/**
 * Create essential event listeners for cross-component communication using eventBus
 */
export function setupGlobalEventListeners() {
    // Subscribe to widget update events and propagate to hierarchy changed events
    eventBus.subscribe('widget:updated', (event) => {
        const { widgetId } = event.data;

        if (widgetId) {
            // Publish a hierarchy changed event for this widget
            eventBus.publish('hierarchy:changed', { widgetId });
        }
    });
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