// src/registry/registryHooks.ts
import { useCallback, useMemo } from 'react';
import { EntityId } from '@/core/types/EntityTypes';
import { ComponentRenderProps, useComponentRegistry } from './componentRegistry';
import { useComponentStore } from '@/store/componentStore';
import { useWidgetStore } from '@/features/builder/stores/widgetStore';
import { ComponentInstance } from '@/core/base/ComponentInstance';

/**
 * Hook to access registry components and functions
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
    const render = useCallback((instance: ComponentInstance, props: Omit<ComponentRenderProps, "instance">) =>
        registry.renderComponent(instance, props),
        [registry]
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
        createInstance,
        isInitialized: registry.isInitialized
    };
}

/**
 * Hook to access component rendering capabilities for a widget
 */
export function useWidgetComponents(widgetId: EntityId) {
    const widgetStore = useWidgetStore();
    const componentStore = useComponentStore();
    const registry = useComponentRegistry();

    const widget = useMemo(() =>
        widgetId ? widgetStore.getWidget(widgetId) : null,
        [widgetId, widgetStore]
    );

    // Get component by ID
    const getComponent = useCallback((componentId: EntityId) => {
        if (!widget) return null;
        return widget.components.find(c => c.id === componentId) || null;
    }, [widget]);

    // Get instance by component ID
    const getInstance = useCallback((componentId: EntityId) => {
        const component = getComponent(componentId);
        if (!component) return null;

        try {
            return componentStore.getInstance(component.instanceId);
        } catch (e) {
            console.error(`Failed to get instance for component ${componentId}:`, e);
            return null;
        }
    }, [getComponent, componentStore]);

    // Render component by ID
    const renderComponent = useCallback((componentId: EntityId, props = {}) => {
        const instance = getInstance(componentId);
        if (!instance) return null;

        return registry.renderComponent(instance, {
            widgetId,
            ...props
        });
    }, [getInstance, registry, widgetId]);

    return {
        widget,
        getComponent,
        getInstance,
        renderComponent
    };
}