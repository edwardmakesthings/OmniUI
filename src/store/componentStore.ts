import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComponentState } from './types';
import { ComponentDefinition } from '../core/base/ComponentDefinition';
import { BindingConfig, ComponentInstance, ComponentInstanceState, ExternalBindingConfig } from '../core/base/ComponentInstance';
import { createEntityId, EntityId } from '../core/types/EntityTypes';
import { StoreError, StoreErrorCodes } from '../core/base/StoreError';
import { ComponentType } from '../core/types/ComponentTypes';
import { nanoid } from 'nanoid';
import { ComponentConfig } from '../core/base/ComponentConfig';

interface SelectionState {
    selectedIds: Set<EntityId>;
    lastSelected: EntityId | null;
}

export interface ComponentStore extends ComponentState {
    addDefinition: (definition: ComponentDefinition) => void;
    addInstance: (instance: ComponentInstance) => void;
    updateInstance: (id: EntityId, updates: Partial<ComponentInstance>) => void;
    createFromDefinition: (definitionId: EntityId, overrides: Partial<ComponentConfig>) => ComponentInstance;
    getDefinition: (id: EntityId) => ComponentDefinition;
    getInstance: (id: EntityId) => ComponentInstance;
    getInstanceState: (id: EntityId) => ComponentInstanceState;
    updateInstanceState: (id: EntityId, updates: Partial<ComponentInstanceState>) => void;
    registerInstanceBinding: (
        id: EntityId,
        propertyPath: string,
        bindingConfig: BindingConfig | ExternalBindingConfig
    ) => void;
    executeInstanceBinding: (
        id: EntityId,
        bindingPath: string
    ) => Promise<void>;
    // To be added:
    // validateInstanceBindings: (id: EntityId) => BindingValidationResult;
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
                    state: {
                        isHovered: false,
                        isFocused: false,
                        isPressed: false,
                        isActive: false,
                        isDisabled: false
                    },
                    internalBindings: {},
                    externalBindings: {},
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
            },

            /**
             * Retrieves the state of a component instance by its ID or creates
             * a default state if none is found.
             *
             * @param id - The ID of the component instance whose state is to be retrieved.
             * @returns The state of the component instance associated with the given ID.
             * @throws {StoreError} If no instance is found for the given ID, a StoreError is thrown with the code 'INSTANCE_NOT_FOUND'.
             */
            getInstanceState(id) {
                const instance = this.getInstance(id);

                // Return existing state or create default
                return instance.state ?? {
                    isHovered: false,
                    isFocused: false,
                    isPressed: false,
                    isActive: false,
                    isDisabled: false
                };
            },

            /**
             * Updates the state of a component instance by merging the given updates with the existing state.
             *
             * @param id - The ID of the component instance whose state is to be updated.
             * @param updates - Partial state data to merge with the existing state.
             */
            updateInstanceState(id, updates) {
                const currentState = this.getInstanceState(id);

                this.updateInstance(id, {
                    state: {
                        ...currentState,
                        ...updates
                    }
                });
            },

            /**
             * Registers a binding for a property of a component instance. The
             * binding can be either internal (binding to another component
             * instance property) or external (binding to a global variable or
             * a value from a datasource).
             *
             * // Simple example of internal binding
             *  registerInstanceBinding('button-1', 'isDisabled', {
             *      conditions: [{
             *          sourceInstanceId: 'input-1',
             *          sourceProperty: 'value',
             *          transform: (value) => value.length < 3  // Simple transform
             *      }],
             *      combineMode: 'all'
             *  });
             *
             *  // More complex transform in binding example
             *  registerInstanceBinding('price-display', 'text', {
             *      conditions: [{
             *          sourceInstanceId: 'price-input',
             *          sourceProperty: 'value',
             *          transform: (value) => `$${(value * 1.2).toFixed(2)}`  // Add 20% and format
             *      }],
             *      combineMode: 'all'
             *  });
             *
             * @param id - The ID of the component instance whose property is to be bound.
             * @param propertyPath - The path of the property to be bound. This can be a simple property
             *     name or a nested property path, e.g. 'foo.bar'.
             * @param bindingConfig - The configuration of the binding. If the binding is external, this
             *     must contain a 'type' property that describes the type of the binding.
             */
            registerInstanceBinding(id, propertyPath, bindingConfig) {
                const instance = this.getInstance(id);

                // Determine if binding is external
                const isExternal = 'type' in bindingConfig;
                const bindingTarget = isExternal ? 'externalBindings' : 'internalBindings';

                this.updateInstance(id, {
                    [bindingTarget]: {
                        ...(instance[bindingTarget] || {}),
                        [propertyPath]: bindingConfig
                    }
                })
            },

            /**
             * Executes a binding for a property of a component instance. This
             * will check for both internal bindings (bindings to other component
             * instance properties) and external bindings (bindings to global
             * variables or values from a datasource). For internal bindings, it
             * will evaluate all conditions based on the combineMode and update
             * the target property if the conditions are met. For external bindings,
             * it will need to call the target with the given parameters and update the
             * target property with the result.
             *
             * @param id - The ID of the component instance whose property is to be bound.
             * @param bindingPath - The path of the property to be bound. This can be a simple property
             *     name or a nested property path, e.g. 'foo.bar'.
             * @throws {StoreError} If no binding is found for the given path, a StoreError is thrown with the code 'BINDING_NOT_FOUND'.
             */
            async executeInstanceBinding(id, bindingPath) {
                const instance = this.getInstance(id);

                // First check for internal bindings
                const internalBinding = instance.internalBindings?.[bindingPath];
                if (internalBinding) {
                    // Evaluate all conditions based on combineMode. Supports
                    // async for future use where useful. Gets condition results
                    // and their transformed values
                    const conditionEvaluations = await Promise.all(
                        internalBinding.conditions.map(async condition => {
                            const sourceInstance = this.getInstance(condition.sourceInstanceId);
                            const sourceValue = sourceInstance.internalBindings[condition.sourceProperty];

                            // Apply transform if it exists
                            const transformedValue = condition.transform
                                ? condition.transform(sourceValue)
                                : sourceValue;

                            // Check against expectedValue if it exists and return
                            return {
                                passes: condition.expectedValue !== undefined
                                    ? transformedValue === condition.expectedValue
                                    : !!transformedValue, // Convert to boolean
                                value: transformedValue
                            };
                        })
                    );

                    // Determine if conditions pass based on combineMode
                    let conditionsPassed = false;
                    switch (internalBinding.combineMode) {
                        case 'all':
                            conditionsPassed = conditionEvaluations.every(e => e.passes);
                            break;
                        case 'any':
                            conditionsPassed = conditionEvaluations.some(e => e.passes);
                            break;
                        case 'none':
                            conditionsPassed = !conditionEvaluations.some(e => e.passes);
                            break;
                    }

                    // Update the target property if conditions are met
                    if (conditionsPassed) {
                        // Use the value from the first passing condition
                        const passingEvaluation = conditionEvaluations.find(e => e.passes);
                        if (passingEvaluation) {
                            this.updateInstance(id, {
                                [bindingPath]: passingEvaluation.value
                            });
                        }
                    }
                    return;
                }
                // Check for external binding
                const externalBinding = instance.externalBindings?.[bindingPath];
                if (externalBinding) {
                    // Will be implemented when shell integration is added
                    // Should handle:
                    // - transformBefore
                    // - target execution with parameters
                    // - transformAfter
                    // - fallbackValue
                    // - errorHandler
                    console.warn('External bindings not yet implemented');
                    return;
                }

                throw new StoreError(
                    `No binding found for path: ${bindingPath}`,
                    StoreErrorCodes.BINDING_NOT_FOUND
                );
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