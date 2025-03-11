import { useComponentStore } from "@/store/componentStore";
import { registerLayoutComponents } from "./categories/layoutComponents";
import { registerControlComponents } from "./categories/controlComponents";
import { registerDisplayComponents } from "./categories/displayComponents";
import { ComponentInstance } from "@/core/base/ComponentInstance";
import { EntityId } from "@/core/types/EntityTypes";
import { ReactElement, ReactNode } from "react";
import { ComponentType } from "@/core/types/ComponentTypes";
import { create } from "zustand";
import { WidgetComponent } from "@/store/widgetStore";
// import { APP_VERSION } from '@/config/appConfig';

// Registry state tracking
let registryInitialized = false;

// Props passed to component renderers
export interface ComponentRenderProps {
    instance: ComponentInstance;
    widgetId?: EntityId;
    actionHandler?: (action: string, targetId?: EntityId) => void;
    children?: ReactNode;
    isEditMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: EntityId) => void;
}

// Component renderer function type
export type ComponentRenderer = (
    props: ComponentRenderProps
) => ReactElement | null;

// Default renderer for fallback
export const defaultRenderer: ComponentRenderer = ({ instance }) => (
    <div className="p-2 border border-accent-dark-neutral rounded">
        <div className="text-xs mb-1 text-font-dark-muted">{instance.type}</div>
        <div>{instance.label || "Unknown Component"}</div>
    </div>
);

// Registry state interface
interface ComponentRegistryState {
    // Component renderers mapped by type
    renderers: Record<string, ComponentRenderer>;

    // Registry initialization state
    isInitialized: boolean;

    // Methods
    registerRenderer: (
        type: ComponentType | string,
        renderer: ComponentRenderer
    ) => void;
    renderComponent: (
        instance: ComponentInstance,
        props: Omit<ComponentRenderProps, "instance">
    ) => ReactElement | null;

    // Method to render a component hierarchy with parent-child relationships
    renderComponentHierarchy: (
        instance: ComponentInstance,
        widgetId: EntityId,
        props: Omit<ComponentRenderProps, "instance" | "widgetId">
    ) => ReactElement | null;

    // Initialization
    initialize: () => void;
}

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
            console.log(
                `User components for ${userId} will be loaded in a future version`
            );
        }

        registryInitialized = true;
        console.log("Component registry initialized");
    } catch (error) {
        console.error("Failed to load component registry:", error);
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
        const savedRegistry = localStorage.getItem("system-components");

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
        console.log("No saved registry found, initializing defaults");
        await initializeDefaultComponents();
    } catch (error) {
        console.error("Failed to load system components:", error);
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
    console.log(
        `Loading user components for ${userId} will be implemented in a future version`
    );
    return [];
}

/**
 * Initialize registry with default components
 */
async function initializeDefaultComponents() {
    const store = useComponentStore.getState();
    const existingDefinitions = Object.keys(store.definitions).length;

    if (existingDefinitions > 0) {
        console.log(
            `Skipping initialization, ${existingDefinitions} components already exist`
        );
        return;
    }

    // Register default components from categories
    registerLayoutComponents();
    registerControlComponents();
    registerDisplayComponents();

    // Save to localStorage for future loads
    const components = Object.values(store.definitions);

    if (components.length > 0) {
        localStorage.setItem("system-components", JSON.stringify(components));
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
        localStorage.setItem("system-components", JSON.stringify(components));

        // Future: Database implementation with axios
        // await axios.post('/api/components', components);

        console.log(`Saved ${components.length} components to storage`);
    } catch (error) {
        console.error("Failed to save component registry:", error);
        throw error;
    }
}

/**
 * Hook for components to access registry functionality
 */
// export function useComponentRegistry() {
//     // Memoize these functions to prevent recreation on every render
//     const loadRegistry = loadComponentRegistry;
//     const saveRegistry = saveComponentRegistry;
//     const initializeDefaults = initializeDefaultComponents;
//     const loadUserComponents = loadUserComponentsForUser;

//     return {
//         isInitialized: registryInitialized,
//         loadRegistry,
//         saveRegistry,
//         initializeDefaults,
//         // Doesn't currently do anything, placeholder for future
//         loadUserComponents,
//     };
// }

// Create the registry store
export const useComponentRegistry = create<ComponentRegistryState>(
    (set, get) => ({
        renderers: {},
        isInitialized: false,

        registerRenderer: (type, renderer) => {
            set((state) => ({
                renderers: {
                    ...state.renderers,
                    [type]: renderer,
                },
            }));
        },

        renderComponent: (instance, props) => {
            if (!instance) {
                console.warn(
                    "Attempted to render null/undefined component instance"
                );
                return (
                    <div className="text-red-500">
                        {" "}
                        Error: Missing component{" "}
                    </div>
                );
            }

            const { renderers } = get();
            const renderer = renderers[instance.type] || defaultRenderer;

            console.log(`Rendering component of type: ${instance.type}`);

            return renderer({
                instance,
                ...props,
            });
        },

        renderComponentHierarchy: (instance, widgetId, props) => {
            if (!instance) {
                console.warn(
                    "Attempted to render null/undefined component instance in hierarchy"
                );
                return (
                    <div className="text-red-500">
                        {" "}
                        Error: Missing component{" "}
                    </div>
                );
            }

            // Get the registry functions
            const { renderComponent } = get();

            // Get necessary stores
            const widgetStore = window.__WIDGET_STORE__?.getState();
            const componentStore = useComponentStore.getState();

            if (!widgetStore) {
                // If widget store is not available, render component without hierarchy
                return renderComponent(instance, { widgetId, ...props });
            }

            const widget = widgetStore.getWidget(widgetId);
            if (!widget) {
                // If widget not found, render component without hierarchy
                return renderComponent(instance, { widgetId, ...props });
            }

            // Find the widget component that corresponds to this instance
            const widgetComponent = widget.components.find(
                (comp: WidgetComponent) => comp.instanceId === instance.id
            );

            if (!widgetComponent) {
                // If component not in widget, render it alone
                return renderComponent(instance, { widgetId, ...props });
            }

            // Find direct children of this component in the widget
            const childComponents = widget.components.filter(
                (comp: WidgetComponent) => comp.parentId === widgetComponent.id
            );

            if (childComponents.length === 0) {
                // No children, render component by itself
                return renderComponent(instance, { widgetId, ...props });
            }

            // Process direct children
            const childElements = childComponents
                .sort(
                    (a: WidgetComponent, b: WidgetComponent) =>
                        a.zIndex - b.zIndex
                ) // Sort by z-index
                .map((childComp: WidgetComponent) => {
                    try {
                        // Get the instance for this child
                        const childInstance = componentStore.getInstance(
                            childComp.instanceId
                        );

                        if (!childInstance) {
                            console.warn(
                                `Could not find instance for component ${childComp.id}`
                            );
                            return null;
                        }

                        // Recursively render child (it will handle its own children)
                        return (
                            <div
                                key={childComp.id}
                                className="relative mb-2 panel-child-item w-full"
                                data-component-id={childComp.id}
                                data-component-type={childInstance.type}
                                data-instance-id={childInstance.id}
                            >
                                {get().renderComponentHierarchy(
                                    childInstance,
                                    widgetId,
                                    props
                                )}
                            </div>
                        );
                    } catch (error) {
                        console.error(
                            `Error rendering child component ${childComp.id}:`,
                            error
                        );
                        return null;
                    }
                })
                .filter(Boolean); // Remove any nulls from failed rendering

            // Finally, render this component with its processed children
            return renderComponent(instance, {
                widgetId,
                ...props,
                children: childElements.length > 0 ? childElements : undefined,
            });
        },

        initialize: () => {
            if (get().isInitialized) return;

            // Set global reference for cross-store access
            // This is a workaround for circular dependencies
            window.__COMPONENT_REGISTRY__ = get();

            set({ isInitialized: true });
        },
    })
);

// Ensure the registry is initialized
export function initializeComponentRegistry() {
    const registry = useComponentRegistry.getState();
    if (!registry.isInitialized) {
        registry.initialize();
    }
    return registry;
}

// Initialization type definition for global access
declare global {
    interface Window {
        __COMPONENT_REGISTRY__: ComponentRegistryState;
        __WIDGET_STORE__: any; // Define proper type when available
    }
}
