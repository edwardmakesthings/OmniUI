import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComponentState } from './types';
import { ComponentDefinition } from '../core/base/ComponentDefinition';
import { ComponentInstance } from '../core/base/ComponentInstance';
import { createEntityId, EntityId } from '../core/types/EntityTypes';
import { StoreError, StoreErrorCode, StoreErrorCodes } from '../core/base/StoreError';
import { ComponentType } from '../core/types/ComponentTypes';
import { nanoid } from 'nanoid';
import { ComponentConfig } from '../core/base/ComponentConfig';

interface SelectionState {
    selectedIds: Set<EntityId>;
    lastSelected: EntityId | null;
}

interface ComponentStore extends ComponentState {
    addDefinition: (definition: ComponentDefinition) => void;
    addInstance: (instance: ComponentInstance) => void;
    updateInstance: (id: EntityId, updates: Partial<ComponentInstance>) => void;
    createFromDefinition: (definitionId: EntityId, overrides: Partial<ComponentConfig>) => ComponentInstance;
    getDefinition: (id: EntityId) => ComponentDefinition;
    getInstance: (id: EntityId) => ComponentInstance;
    // To be added:
    // selection: SelectionState;
    // select: (id: EntityId, mode?: 'single' | 'toggle' | 'range') => void;
    // deselect: (id: EntityId) => void;
    // clearSelection: () => void;
}

export const useComponentStore = create<ComponentStore>()(
    persist(
        (set, get) => ({
            definitions: {},
            instances: {},

            /**
             * Adds a new component definition to the store.
             *
             * @param definition - The component definition to be added. Must have a unique ID.
             * @throws {StoreError} If the definition does not have an ID, a StoreError is thrown with the code 'INVALID_DEFINITION'.
             */
            addDefinition: (definition) => {
                if (!definition.id) {
                    throw new StoreError('Definition must have an ID', 'INVALID_DEFINITION');
                }

                set((state) => ({
                    definitions: {
                        ...state.definitions,
                        [definition.id]: definition
                    }
                }));
            },

            /**
             * Adds a new component instance to the store.
             *
             * @param instance - The component instance to be added, which includes
             *  its unique identifier and definition reference.
             * @throws {StoreError} If the instance does not have an ID, a StoreError
             *  is thrown with the code 'INVALID_INSTANCE'. If the definition for the
             *  instance's definitionId is not found, a StoreError is thrown with the
             *  code 'DEFINITION_NOT_FOUND'.
             */
            addInstance: (instance) => {
                const state = get();

                if (!instance.id) {
                    throw new StoreError('Instance must have an ID', 'INVALID_INSTANCE');
                }

                if (!state.definitions[instance.definitionId]) {
                    throw new StoreError(
                        `No definition found for ID: ${instance.definitionId}`,
                        'DEFINITION_NOT_FOUND'
                    );
                }

                set((state) => ({
                    instances: {
                        ...state.instances,
                        [instance.id]: instance
                    }
                }));
            },

            /**
             * Updates an existing component instance in the store.
             *
             * @param id - The ID of the component instance to be updated.
             * @param updates - The partial updates to the component instance, which
             *  can include new positions, sizes, overrides, or other customizations.
             * @throws {StoreError} If the instance is not found, a StoreError is thrown with the code 'INSTANCE_NOT_FOUND'.
             */
            updateInstance: (id, updates) => {
                const state = get();
                const instance = state.instances[id];

                if (!instance) {
                    throw new StoreError(
                        `No instance found for ID: ${id}`,
                        'INSTANCE_NOT_FOUND'
                    );
                }

                set((state) => ({
                    instances: {
                        ...state.instances,
                        [id]: {
                            ...instance,
                            ...updates,
                            metadata: {
                                ...instance.metadata,
                                updatedAt: new Date(),
                                version: instance.metadata.version + 1
                            }
                        }
                    }
                }))
            },

            /**
             * Creates a new component instance from a given definition ID and optional overrides.
             *
             * @param definitionId - The ID of the component definition to create an instance from.
             * @param overrides - Partial component config data to override the default values from the definition.
             * @returns The newly created component instance.
             * @throws {StoreError} If no definition is found for the provided definition ID, an error is thrown with the code 'DEFINITION_NOT_FOUND'.
             */
            createFromDefinition: (definitionId, overrides) => {
                const state = get();
                const definition = state.definitions[definitionId];

                if (!definition) {
                    throw new StoreError(
                        `No definition found for ID: ${definitionId}`,
                        StoreErrorCodes.DEFINITION_NOT_FOUND
                    );
                }

                const instance: ComponentInstance = {
                    ...definition,
                    id: createEntityId(nanoid()),
                    definitionId: definitionId,
                    overrides: overrides,
                    metadata: {
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        version: 1
                    }
                };

                get().addInstance(instance);
                return instance;
            },

            /**
             * Retrieves a component definition from the store by its ID.
             *
             * @param id - The ID of the component definition to retrieve.
             * @returns The component definition associated with the given ID.
             * @throws {StoreError} If no definition is found for the given ID, a StoreError is thrown with the code 'DEFINITION_NOT_FOUND'.
             */
            getDefinition: (id) => {
                const state = get();
                const definition = state.definitions[id];

                if (!definition) {
                    throw new StoreError(
                        `No definition found for ID: ${id}`,
                        'DEFINITION_NOT_FOUND'
                    );
                }

                return definition;
            },

            /**
             * Retrieves a component instance from the store by its ID.
             *
             * @param id - The ID of the component instance to retrieve.
             * @returns The component instance associated with the given ID.
             * @throws {StoreError} If no instance is found for the given ID, a StoreError is thrown with the code 'INSTANCE_NOT_FOUND'.
             */
            getInstance: (id) => {
                const state = get();
                const instance = state.instances[id];

                if (!instance) {
                    throw new StoreError(
                        `No instance found for ID: ${id}`,
                        'INSTANCE_NOT_FOUND'
                    );
                }

                return instance;
            }
        }),
        {
            name: 'omni-ui-components'
        }
    )
);

// Helper hooks for common operations and safer state access

/////////////////////
// Basic selectors //
/////////////////////

/**
 * Hook to retrieve a component definition from the store by its ID.
 *
 * @param id - The ID of the component definition to retrieve, or null.
 * @returns The component definition associated with the given ID, or undefined if the ID is null.
 */
export function useDefinition(id: EntityId | null) {
    return useComponentStore((state) =>
        id ? state.definitions[id] : undefined
    );
}

/**
 * Hook to retrieve a component instance from the store by its ID.
 *
 * @param id - The ID of the component instance to retrieve, or null.
 * @returns The component instance associated with the given ID, or undefined if the ID is null.
 */
export function useInstance(id: EntityId | null) {
    return useComponentStore((state) =>
        id ? state.instances[id] : undefined
    );
}

//////////////////////////
// Collection Selectors //
//////////////////////////

/**
 * Hook to retrieve all component definitions from the store.
 *
 * @returns An array of all component definitions in the store.
 */
export function useAllDefinitions() {
    return useComponentStore((state) =>
        Object.values(state.definitions)
    );
}

/**
 * Hook to retrieve all component instances from the store.
 *
 * @returns An array of all component instances in the store.
 */
export function useAllInstances() {
    return useComponentStore((state) =>
        Object.values(state.instances)
    );
}

////////////////////////
// Filtered Selectors //
////////////////////////

/**
 * Hook to retrieve all component definitions from the store that match the given type.
 *
 * @param type - The type of component definitions to retrieve.
 * @returns An array of component definitions that match the given type.
 */
export function useDefinitionsByType(type: ComponentType) {
    return useComponentStore((state) =>
        Object.values(state.definitions).filter(def =>
            def.type === type
        )
    );
}

/**
 * Hook to retrieve all component instances from the store that have the given definition ID.
 *
 * @param definitionId - The ID of the component definition whose instances to retrieve.
 * @returns An array of component instances that have the given definition ID.
 */
export function useInstancesByDefinition(definitionId: EntityId) {
    return useComponentStore((state) =>
        Object.values(state.instances).filter(instance =>
            instance.definitionId === definitionId
        )
    );
}

/////////////////////
// Operation Hooks //
/////////////////////

/**
 * Hook to retrieve a component instance from the store and provide a function to update it.
 *
 * @param id - The ID of the component instance to retrieve.
 * @returns An object containing the retrieved instance and an update function that can be used to update the instance.
 * @throws {StoreError} If no instance is found for the given ID, a StoreError is thrown with the code 'INSTANCE_NOT_FOUND'.
 */
export function useInstanceManager(id: EntityId) {
    const instance = useInstance(id);
    const updateInstance = useComponentStore((state) => state.updateInstance);

    return {
        instance,
        update: (updates: Partial<ComponentInstance>) => {
            if (instance) {
                updateInstance(id, updates);
            }
        }
    };
}

/**
 * Hook to retrieve and manage multiple component instances by their IDs.
 *
 * @param ids - The IDs of the component instances to retrieve and manage.
 * @returns An object containing the retrieved instances and an update function that can be used to update all of them.
 */
export function useMultiInstanceManager(ids: EntityId[]) {
    const instances = useComponentStore((state) =>
        ids.map(id => state.instances[id]).filter(Boolean)
    );
    const updateInstance = useComponentStore((state) => state.updateInstance);
    const getState = useComponentStore.getState;

    return {
        instances,
        updateAll: (updates: Partial<ComponentInstance>) => {
            const currentState = getState()
            ids.forEach(id => {
                if (currentState.instances[id]) {
                    updateInstance(id, updates);
                }
            });
        }
    };
}


/**
 * Hook to get the functions for creating a new component definition and instance from scratch or from an existing definition.
 *
 * @returns An object containing the following functions:
 * - `createDefinition(definition: ComponentDefinition)`: Creates a new component definition in the store.
 * - `createInstance(instance: ComponentInstance)`: Creates a new component instance from scratch in the store.
 * - `createFromDefinition(definition: ComponentDefinition)`: Creates a new component instance from an existing definition in the store.
 */
export function useComponentCreation() {
    return {
        createDefinition: useComponentStore((state) => state.addDefinition),
        createInstance: useComponentStore((state) => state.addInstance),
        createFromDefinition: useComponentStore((state) => state.createFromDefinition)
    };
}