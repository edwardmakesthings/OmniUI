// src/registry/index.ts
import { initializeComponentRegistry, useComponentRegistry } from './componentRegistry';
import { registerComponentRenderers } from './componentRenderers';
import { loadComponentRegistry } from './componentRegistry';
import { useComponentStore } from '@/store/componentStore';
import { useWidgetStore } from '@/store/widgetStore';
import { useMemo, useCallback, useEffect, useState } from 'react';
import { EntityId } from '@/core/types/EntityTypes';
import { ComponentInstance } from '@/core/base/ComponentInstance';

/**
 * Initialize the full component system
 * This sets up both the definition registry and renderer registry
 */
export function initializeComponentSystem() {
    // Make widget store available globally for cross-store access
    // This is a temporary workaround for circular dependencies
    if (typeof window !== 'undefined') {
        window.__WIDGET_STORE__ = useWidgetStore;
    }

    // First initialize the registry
    const registry = initializeComponentRegistry();

    // Then load component definitions
    loadComponentRegistry().then(() => {
        console.log('Component definitions loaded');

        // Register component renderers
        registerComponentRenderers();

        console.log('Component system initialized');
    }).catch(error => {
        console.error('Failed to initialize component system:', error);
    });

    return registry;
}

/**
 * Hook to use the component registry in React components
 */
export function useComponents() {
    const registry = useComponentRegistry();
    const componentStore = useComponentStore();

    // Get all component definitions
    const definitions = useMemo(() =>
        Object.values(componentStore.definitions),
        [componentStore.definitions]
    );

    // Get definitions by category
    const getDefinitionsByCategory = useCallback((type: "layout" | "control" | "display") =>
        definitions.filter(def => def.category === type),
        [definitions]
    );

    // Render a component
    const render = useCallback((instance: ComponentInstance, props) =>
        registry.renderComponent(instance, props),
        []
    );

    // Render a component hierarchy
    const renderHierarchy = useCallback((instanceId: EntityId, widgetId: EntityId, options) =>
        registry.renderComponentHierarchy(instanceId, widgetId, options),
        []
    );

    // Create a component instance
    const createInstance = useCallback((definitionId: EntityId, overrides = {}) =>
        componentStore.createFromDefinition(definitionId, overrides),
        [componentStore]
    );

    return {
        definitions,
        getDefinitionsByCategory,
        render,
        renderHierarchy,
        createInstance,
        isInitialized: registry.isInitialized
    };
}

/**
 * Hook to use component selection in widget editor
 */
export function useComponentSelection(widgetId: EntityId) {
    const [selectedId, setSelectedId] = useState<EntityId | null>(null);
    const widgetStore = useWidgetStore();

    // Select a component
    const selectComponent = useCallback((id: EntityId | null) => {
        setSelectedId(id);

        // If there's a property editor open, update it
        // This would be implemented with your UI store
    }, []);

    // Check if a component is selected
    const isSelected = useCallback((id: EntityId) =>
        selectedId === id,
        [selectedId]
    );

    // Deselect any component
    const deselectAll = useCallback(() => {
        setSelectedId(null);
    }, []);

    // Delete the selected component
    const deleteSelected = useCallback(() => {
        if (selectedId) {
            widgetStore.removeComponent(widgetId, selectedId);
            setSelectedId(null);
        }
    }, [selectedId, widgetId, widgetStore]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Delete/Backspace to delete selected component
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
                // Only if target is not an input element
                if (
                    document.activeElement?.tagName !== 'INPUT' &&
                    document.activeElement?.tagName !== 'TEXTAREA'
                ) {
                    deleteSelected();
                }
            }

            // Escape to deselect
            if (e.key === 'Escape') {
                deselectAll();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedId, deleteSelected, deselectAll]);

    return {
        selectedId,
        selectComponent,
        isSelected,
        deselectAll,
        deleteSelected
    };
}

// Re-export
export { useComponentRegistry } from './componentRegistry';
export { loadComponentRegistry, saveComponentRegistry } from './componentRegistry';

// Export types
export type { ComponentRenderProps, ComponentRenderer } from './componentRegistry';