import { ComponentInstance } from "@/core/base/ComponentInstance";
import { EntityId } from "@/core/types/EntityTypes";
import { ReactElement, ReactNode } from "react";
import { ComponentType } from "@/core/types/ComponentTypes";
import { create } from "zustand";
import { useComponentStore, useWidgetStore } from "@/store";
import { cn } from "@/lib/utils";
import { ComponentWithDragDrop } from "@/features/builder/components/ComponentWithDragDrop";
// import { APP_VERSION } from '@/config/appConfig';

/**
 * Basic component render properties common to all rendering scenarios
 */
export interface BaseRenderProps {
    widgetId?: EntityId;
    isEditMode?: boolean;
    isSelected?: boolean;
    actionHandler?: (action: string, targetId?: EntityId) => void;
}

/**
 * Props for rendering a single component
 */
export interface ComponentRenderProps extends BaseRenderProps {
    instance: ComponentInstance;
    children?: ReactNode;
    onSelect?: (id: EntityId) => void;
    onDelete?: (id: EntityId) => void;
}

/**
 * Props for rendering a component hierarchy
 * Extends the base props with additional options for hierarchy handling
 */
export interface HierarchyRenderOptions extends BaseRenderProps {
    onSelect?: (id: EntityId, e?: MouseEvent) => void;
    onDelete?: (id: EntityId, e?: MouseEvent) => void;
    dragDropEnabled?: boolean;
}

/**
 * Component renderer function type
 */
export type ComponentRenderer = (
    props: ComponentRenderProps
) => ReactElement | null;

/**
 * Default renderer for fallback when no specific renderer is found
 */
export const defaultRenderer: ComponentRenderer = ({ instance }) => (
    <div className="p-2 border border-accent-dark-neutral rounded">
        <div className="text-xs mb-1 text-font-dark-muted">{instance.type}</div>
        <div>{instance.label || "Unknown Component"}</div>
    </div>
);

/**
 * Registry state interface
 */
interface ComponentRegistryState {
    /** Component renderers mapped by type */
    renderers: Record<string, ComponentRenderer>;

    /** Registry initialization state */
    isInitialized: boolean;

    /** Initialize the registry */
    initialize: () => void;

    /** Register a renderer for a component type */
    registerRenderer: (
        type: ComponentType | string,
        renderer: ComponentRenderer
    ) => void;

    /** Get a renderer for a component type */
    getRenderer: (type: ComponentType | string) => ComponentRenderer;

    /** Check if a renderer exists for a component type */
    hasRenderer: (type: ComponentType | string) => boolean;

    /** Render a single component */
    renderComponent: (
        instance: ComponentInstance,
        props: Omit<ComponentRenderProps, "instance">
    ) => ReactElement | null;

    /** Render a component and its children */
    renderComponentHierarchy: (
        instanceId: EntityId,
        widgetId: EntityId,
        options: HierarchyRenderOptions,
        selectedComponentId?: EntityId
    ) => ReactElement | null;
}

/**
 * Component registry store
 */
export const useComponentRegistry = create<ComponentRegistryState>(
    (set, get) => ({
        renderers: {},
        isInitialized: false,

        initialize: () => {
            if (get().isInitialized) return;
            set({ isInitialized: true });
        },

        registerRenderer: (type, renderer) => {
            set((state) => ({
                renderers: {
                    ...state.renderers,
                    [type]: renderer,
                },
            }));
        },

        getRenderer: (type) => {
            const renderer = get().renderers[type];
            if (!renderer) {
                return defaultRenderer;
            }
            return renderer;
        },

        hasRenderer: (type) => {
            return !!get().renderers[type];
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
            const renderer = get().getRenderer(instance.type);

            return renderer({
                instance,
                ...props,
            });
        },

        renderComponentHierarchy: (
            instanceId: EntityId,
            widgetId: EntityId,
            options: HierarchyRenderOptions,
            selectedComponentId?: EntityId
        ): ReactElement | null => {
            return renderHierarchy(
                instanceId,
                widgetId,
                options,
                selectedComponentId,
                get
            );
        },
    })
);

/**
 * Helper function to render a component hierarchy
 * This is separated for better code organization
 */
function renderHierarchy(
    instanceId: EntityId,
    widgetId: EntityId,
    options: HierarchyRenderOptions,
    selectedComponentId?: EntityId,
    getState?: () => ComponentRegistryState
): ReactElement | null {
    const {
        isEditMode = false,
        isSelected = false,
        onSelect,
        onDelete,
        actionHandler,
        dragDropEnabled = true,
    } = options;

    // Get required stores
    const widgetStore = useWidgetStore.getState();
    const componentStore = useComponentStore.getState();
    const registry = getState ? getState() : useComponentRegistry.getState();

    try {
        // Get the widget
        const widget = widgetStore.getWidget(widgetId);
        if (!widget) {
            console.warn("Widget with widgetId not found: ", widgetId);
            return null;
        }

        // Get the component instance
        let instance;
        try {
            instance = componentStore.getInstance(instanceId);
        } catch (error) {
            console.warn(
                "Component instance with instanceId not found: ",
                instanceId
            );
            return null;
        }

        // Find the widget component reference
        const widgetComponent = widget.components.find(
            (c) => c.instanceId === instanceId
        );
        if (!widgetComponent) {
            console.warn(
                "Widget component reference for instanceId not found: ",
                instanceId
            );
            return null;
        }

        // Determine if this component should be selected
        const componentId = widgetComponent.id;
        const thisComponentSelected = selectedComponentId
            ? componentId === selectedComponentId
            : isSelected;

        // Determine if this is a container component
        const isContainer =
            instance.type === "Panel" || instance.type === "ScrollBox";

        // Get child components
        const childComponents = widget.components.filter(
            (c) => c.parentId === widgetComponent.id
        );

        // Recursively render child components
        const renderedChildren = childComponents
            .map((childComp) => {
                try {
                    return renderHierarchy(
                        childComp.instanceId,
                        widgetId,
                        {
                            ...options,
                            isSelected: false, // Default to false
                        },
                        selectedComponentId,
                        getState
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
                renderComponent={registry.renderComponent}
            >
                {renderedChildren.length > 0 && isContainer && (
                    <div
                        className={cn(
                            "relative",
                            isContainer
                                ? instance.type === "Panel"
                                    ? "panel-children-container"
                                    : "scrollbox-children-container"
                                : "",
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
}

/**
 * Registry initialization tracking
 */
let registryInitialized = false;

/**
 * Initialize the component registry
 * This is a safe function that only initializes once
 */
export function initializeComponentRegistry() {
    if (registryInitialized) return useComponentRegistry.getState();

    const registry = useComponentRegistry.getState();
    if (!registry.isInitialized) {
        registry.initialize();
    }

    registryInitialized = true;
    return registry;
}

/**
 * Load the component registry from storage or initialize defaults
 *
 * @param userId Optional user ID for loading user-specific components
 */
export async function loadComponentRegistry(userId?: string) {
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

        return true;
    } catch (error) {
        console.error("Failed to load component registry:", error);
        throw error;
    }
}

/**
 * Load system components from storage or initialize defaults
 */
async function loadSystemComponents() {
    try {
        const { useComponentStore } = await import("@/store/componentStore");
        const componentStore = useComponentStore.getState();

        // For development, use localStorage
        const savedRegistry = localStorage.getItem("system-components");

        if (savedRegistry) {
            const components = JSON.parse(savedRegistry);

            // TODO: Add version checking and migration in the future
            // For now, just load components directly

            // Register components in store
            components.forEach((component: any) => {
                componentStore.addDefinition(component);
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
    const { useComponentStore } = await import("@/store/componentStore");
    const componentStore = useComponentStore.getState();
    const existingDefinitions = Object.keys(componentStore.definitions).length;

    if (existingDefinitions > 0) {
        console.log(
            `Skipping initialization, ${existingDefinitions} components already exist`
        );
        return;
    }

    // Import and register default components from categories
    const { registerLayoutComponents } = await import(
        "./categories/layoutComponents"
    );
    const { registerControlComponents } = await import(
        "./categories/controlComponents"
    );
    const { registerDisplayComponents } = await import(
        "./categories/displayComponents"
    );

    registerLayoutComponents();
    registerControlComponents();
    registerDisplayComponents();

    // Save to localStorage for future loads
    const components = Object.values(componentStore.definitions);

    if (components.length > 0) {
        await saveComponentRegistry();
    }
}

/**
 * Save component registry to storage
 */
export async function saveComponentRegistry() {
    const { useComponentStore } = await import("@/store/componentStore");
    const componentStore = useComponentStore.getState();
    const components = Object.values(componentStore.definitions);

    try {
        // For development with localStorage:
        localStorage.setItem("system-components", JSON.stringify(components));

        // Future: Database implementation with axios
        // await axios.post('/api/components', components);

        console.log(`Saved ${components.length} components to storage`);
        return true;
    } catch (error) {
        console.error("Failed to save component registry:", error);
        throw error;
    }
}
