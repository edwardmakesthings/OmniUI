// src/core/index.ts
import { initializeComponentRegistry, loadComponentRegistry } from '@/registry/componentRegistry';
import { registerComponentRenderers } from '@/registry/componentRenderers';
import { useWidgetStore } from '@/features/builder/stores/widgetStore';
import { useComponentStore } from '@/store/componentStore';
import { useUIStore } from '@/store/uiStore';

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
 * Create essential event listeners for cross-component communication
 */
export function setupGlobalEventListeners() {
    // Widget update event listener
    window.addEventListener('widget-updated', (e: any) => {
        // Notify any interested components about the widget update
        const { widgetId } = e.detail;

        // Find all panels that might need to know about this update
        const panels = document.querySelectorAll('[data-panel-id]');
        panels.forEach(panel => {
            // Create a new event specific to each panel
            const panelEvent = new CustomEvent('widget-hierarchy-changed', {
                detail: { widgetId }
            });
            panel.dispatchEvent(panelEvent);
        });
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