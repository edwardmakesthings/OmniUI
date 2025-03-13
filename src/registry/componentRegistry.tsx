import { useComponentStore } from "@/store/componentStore";
import { registerLayoutComponents } from "./categories/layoutComponents";
import { registerControlComponents } from "./categories/controlComponents";
import { registerDisplayComponents } from "./categories/displayComponents";
import { ComponentInstance } from "@/core/base/ComponentInstance";
import { EntityId } from "@/core/types/EntityTypes";
import { ReactElement, ReactNode } from "react";
import {
    ComponentType,
    ComponentTypeValues,
} from "@/core/types/ComponentTypes";
import { create } from "zustand";
import { useWidgetStore } from "@/store/widgetStore";
import { cn } from "@/lib/utils";
import { ComponentWithDragDrop } from "./ComponentWithDragDrop";
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
    onDelete?: (id: EntityId) => void;
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

// Render options for the component hierarchy
export interface ComponentRenderOptions {
    isEditMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: EntityId, e?: MouseEvent) => void;
    onDelete?: (id: EntityId, e?: MouseEvent) => void;
    actionHandler?: (action: string, targetId?: EntityId) => void;
    dragDropEnabled?: boolean;
}

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

    // Enhanced method to render a component hierarchy with drag-drop support
    renderComponentHierarchy: (
        instanceId: EntityId,
        widgetId: EntityId,
        options: ComponentRenderOptions,
        selectedComponentId?: EntityId
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

// /**
//  * Placeholder for future user component loading
//  */
// async function loadUserComponentsForUser(userId: string): Promise<any[]> {
//     // This is a placeholder that will be implemented in the future
//     console.log(
//         `Loading user components for ${userId} will be implemented in a future version`
//     );
//     return [];
// }

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
                    <div className="text-red-500">Error: Missing component</div>
                );
            }

            // Get the correct renderer for this component type
            const { renderers } = get();

            // Use the specific renderer or fall back to default
            const renderer = renderers[instance.type] || defaultRenderer;

            // Log renderer selection for debugging
            // console.log(`Using renderer for type: ${componentType}, found: ${Boolean(renderers[componentType])}`);

            return renderer({
                instance,
                ...props,
            });
        },

        renderComponentHierarchy: (
            instanceId: EntityId,
            widgetId: EntityId,
            options: ComponentRenderOptions,
            selectedComponentId?: EntityId
        ) => {
            const {
                isEditMode = false,
                isSelected = false,
                onSelect,
                onDelete,
                actionHandler,
                dragDropEnabled = true,
            } = options;

            const widgetStore = useWidgetStore.getState();
            const componentStore = useComponentStore.getState();

            try {
                // Get the widget
                const widget = widgetStore.getWidget(widgetId);
                if (!widget) {
                    console.warn(`Widget ${widgetId} not found`);
                    return null;
                }

                // Get the component instance
                let instance;
                try {
                    instance = componentStore.getInstance(instanceId);
                } catch (error) {
                    console.warn(`Component instance ${instanceId} not found`);
                    return null;
                }

                // Find the widget component reference
                const widgetComponent = widget.components.find(
                    (c) => c.instanceId === instanceId
                );
                if (!widgetComponent) {
                    console.warn(
                        `Widget component reference for ${instanceId} not found`
                    );
                    return null;
                }

                // Determine if this component should be selected
                // First check if this component matches the selected ID directly
                const componentId = widgetComponent.id;
                const thisComponentSelected = selectedComponentId
                    ? componentId === selectedComponentId
                    : isSelected;

                // Log selection state for debugging
                if (thisComponentSelected) {
                    console.log(`Component ${componentId} is selected!`);
                }

                // Determine if this is a container component
                const isContainer =
                    instance.type === ComponentTypeValues.Panel ||
                    instance.type === ComponentTypeValues.ScrollBox;

                // Get child components
                const childComponents = widget.components
                    .filter((c) => c.parentId === widgetComponent.id)
                    .sort((a, b) => a.zIndex - b.zIndex);

                // Recursively render child components
                const renderedChildren = childComponents
                    .map((childComp) => {
                        try {
                            return get().renderComponentHierarchy(
                                childComp.instanceId,
                                widgetId,
                                {
                                    ...options,
                                    isSelected: false, // Always default to false; selection is determined inside
                                },
                                selectedComponentId
                            );
                        } catch (error) {
                            console.error(
                                `Error rendering child component ${childComp.id}:`,
                                error
                            );
                            return null;
                        }
                    })
                    .filter(Boolean);

                // Child container class based on component type
                const childContainerClass = isContainer
                    ? instance.type === ComponentTypeValues.Panel
                        ? "panel-children-container"
                        : "scrollbox-children-container"
                    : "";

                // Use ComponentWithDragDrop as a wrapper
                return (
                    <ComponentWithDragDrop
                        key={widgetComponent.id}
                        instance={instance}
                        widgetComponent={widgetComponent}
                        widgetId={widgetId}
                        isContainer={isContainer}
                        isSelected={thisComponentSelected}
                        isEditMode={isEditMode}
                        onSelect={onSelect}
                        onDelete={onDelete}
                        actionHandler={actionHandler}
                        dragDropEnabled={dragDropEnabled && isEditMode}
                        parentId={widgetComponent.parentId}
                        renderComponent={get().renderComponent}
                    >
                        {renderedChildren.length > 0 && isContainer && (
                            <div
                                className={cn(
                                    "relative",
                                    childContainerClass,
                                    "flex flex-col gap-2 p-2 min-h-[50px] w-full"
                                )}
                                data-children-container="true"
                                data-parent-id={widgetComponent.id}
                                data-component-type={instance.type}
                            >
                                {renderedChildren}
                            </div>
                        )}
                    </ComponentWithDragDrop>
                );
            } catch (error) {
                console.error(
                    `Error rendering component hierarchy for ${instanceId}:`,
                    error
                );
                return null;
            }
        },

        initialize: () => {
            if (get().isInitialized) return;

            // Set global reference for cross-store access
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
