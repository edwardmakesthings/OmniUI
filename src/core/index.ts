// src/core/index.ts
import { initializeComponentRegistry, loadComponentRegistry } from '@/registry/componentRegistry';
import { registerComponentRenderers } from '@/registry/componentRenderers';
import { useWidgetStore } from '@/features/builder/stores/widgetStore';
import { useComponentStore } from '@/store/componentStore';
import { useUIStore } from '@/store/uiStore';
import eventBus from './eventBus/eventBus';
import { useCallback } from 'react';
import { useEventSubscription } from '@/hooks/useEventBus';

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

    return { registry };
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
 * Export all core types and utilities
 */
export * from './types/ComponentTypes';
export * from './types/EntityTypes';
export * from './types/Geometry';
export * from './types/Measurement';
export * from './types/UI';
export * from './base';
export * from '../features/builder/dragDrop/ComponentDragDrop';