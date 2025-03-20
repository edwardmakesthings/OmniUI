/**
 * @file src/store/componentStore.ts
 * Core component store that manages component definitions and instances
 * in a centralized, type-safe way.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComponentState } from './types';
import { ComponentDefinition } from '@/core/base/ComponentDefinition';
import { BindingConfig, ComponentInstance, ExternalBindingConfig } from '@/core/base/ComponentInstance';
import { createEntityId, EntityId } from '@/core/types/EntityTypes';
import { StoreError, StoreErrorCodes } from '@/core/base/StoreError';
import { ComponentType } from '@/core/types/ComponentTypes';
import { nanoid } from 'nanoid';
import { ComponentConfig } from '@/core/base/ComponentConfig';
import { BaseState, defaultState } from '@/components/base/interactive';
import { useMemo } from 'react';
import eventBus from '@/core/eventBus/eventBus';

/**
 * Interface for the component store operations
 */
export interface ComponentStore extends ComponentState {
    // Definition management
    addDefinition: (definition: ComponentDefinition) => void;
    getDefinition: (id: EntityId) => ComponentDefinition;

    // Instance management
    addInstance: (instance: ComponentInstance) => void;
    updateInstance: (id: EntityId, updates: Partial<ComponentInstance>) => void;
    deleteInstance: (id: EntityId) => void;
    createFromDefinition: (definitionId: EntityId, overrides: Partial<ComponentConfig>) => ComponentInstance;
    getInstance: (id: EntityId) => ComponentInstance;

    // Instance state
    getInstanceState: (id: EntityId) => BaseState;
    updateInstanceState: (id: EntityId, updates: Partial<BaseState>) => void;

    // Binding system
    registerInstanceBinding: (
        id: EntityId,
        propertyPath: string,
        bindingConfig: BindingConfig | ExternalBindingConfig
    ) => void;
    executeInstanceBinding: (
        id: EntityId,
        bindingPath: string
    ) => Promise<void>;

    // Store operations
    purgeStore: (options?: {
        keepSystemComponents?: boolean;
        resetToDefaults?: boolean;
    }) => {
        definitionCount: number;
        instanceCount: number;
    };
    // To be added:
    // validateInstanceBindings: (id: EntityId) => BindingValidationResult;
}

/**
 * Implementation of the component store that manages component definitions
 * and instances with proper persistence.
 */
export const useComponentStore = create<ComponentStore>()(
    persist(
        (set, get) => ({
            definitions: {},
            instances: {},

            /**
             * Adds a new component definition to the store.
             *
             * @param definition - The component definition to be added. Must have a unique ID.
             * @throws {StoreError} If the definition does not have a valid ID.
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
             * @param instance - The component instance to be added
             * @throws {StoreError} If the instance is invalid or its definition is not found
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
             * @param id - The ID of the component instance to be updated.
             * @param updates - The partial updates to apply to the instance
             * @throws {StoreError} If the instance is not found
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
             * Deletes a component instance from the store.
             * @param id - The ID of the instance to delete
             * @throws {StoreError} If the instance is not found
             */
            deleteInstance: (id) => {
                const state = get();
                const instance = state.instances[id];

                if (!instance) {
                    throw new StoreError(
                        `No instance found for ID: ${id}`,
                        'INSTANCE_NOT_FOUND'
                    );
                }

                // Create a copy of the instances without the deleted one
                const newInstances = { ...state.instances };
                delete newInstances[id];

                set({ instances: newInstances });
            },

            /**
             * Creates a new component instance from a definition.
             * @param definitionId - The ID of the definition to instantiate
             * @param overrides - Optional configuration overrides for the new instance
             * @returns The newly created component instance
             * @throws {StoreError} If the definition is not found
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
                    state: defaultState,
                    internalBindings: {},
                    externalBindings: {},
                    metadata: {
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        version: 1,
                        definitionVersion: definition.metadata.definitionVersion,
                        compatibilityVersion: definition.metadata.compatibilityVersion,
                        createdBy: definition.metadata.createdBy,
                        isUserComponent: definition.metadata.isUserComponent
                    }
                };

                get().addInstance(instance);
                return instance;
            },

            /**
             * Retrieves a component definition from the store by its ID.
             * @param id - The ID of the definition to retrieve
             * @returns The component definition
             * @throws {StoreError} If no definition is found with the given ID
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
             * @param id - The ID of the instance to retrieve
             * @returns The component instance
             * @throws {StoreError} If no instance is found with the given ID
             */
            getInstance: (id) => {
                const state = get();
                const instance = state.instances[id];

                if (!instance) {
                    // Publish an event about the missing instance
                    eventBus.publish("component:instanceNotFound", {
                        instanceId: id,
                        timestamp: Date.now()
                    });

                    throw new StoreError(
                        `No instance found for ID: ${id}`,
                        'INSTANCE_NOT_FOUND'
                    );
                }

                // Validate the instance to ensure it has all required properties
                const isValid = validateInstance(instance);

                if (!isValid) {
                    console.warn(`Instance ${id} is incomplete or corrupted, attempting repair`);

                    // Try to repair the instance by ensuring required fields
                    const repairedInstance = repairInstance(instance);

                    // Update the instance in the store
                    set(state => ({
                        instances: {
                            ...state.instances,
                            [id]: repairedInstance
                        }
                    }));

                    return repairedInstance;
                }

                return instance;
            },

            /**
             * Gets the state of a component instance.
             * @param id - The ID of the component instance
             * @returns The current state of the instance
             * @throws {StoreError} If the instance is not found
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
             * Updates the state of a component instance.
             * @param id - The ID of the component instance
             * @param updates - The state updates to apply
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
             * Registers a binding for a component instance property.
             * The binding can be either internal (binding to another component
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
             * @param id - The ID of the component instance
             * @param propertyPath - The property path to bind
             * @param bindingConfig - The binding configuration
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
             * Executes a binding for a component instance property. This
             * will check for both internal bindings (bindings to other component
             * instance properties) and external bindings (bindings to global
             * variables or values from a datasource). For internal bindings, it
             * will evaluate all conditions based on the combineMode and update
             * the target property if the conditions are met. For external bindings,
             * it will need to call the target with the given parameters and update the
             * target property with the result.
             *
             * @param id - The ID of the component instance
             * @param bindingPath - The binding path to execute
             */
            async executeInstanceBinding(id, bindingPath) {
                const instance = this.getInstance(id);

                // First check for internal bindings
                const internalBinding = instance.internalBindings?.[bindingPath];
                if (internalBinding) {
                    // Evaluate all conditions based on combineMode
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
            },

            /**
             * Purges the component store by clearing definitions and instances.
             * @param options - Options to control what gets purged
             * @returns The count of purged items
             */
            purgeStore: (options = {}) => {
                const state = get();
                const { keepSystemComponents = false, resetToDefaults = false } = options;

                // Count for return value
                const definitionCount = Object.keys(state.definitions).length;
                const instanceCount = Object.keys(state.instances).length;

                // Create an empty state to set
                const newState: Partial<ComponentState> = {
                    instances: {} // Always clear instances
                };

                // Handle definitions based on options
                if (keepSystemComponents) {
                    // Keep only system components (those not created by users)
                    const systemDefinitions = Object.entries(state.definitions)
                        .filter(([_, def]) => !def.metadata.isUserComponent)
                        .reduce((acc, [id, def]) => {
                            acc[id as EntityId] = def;
                            return acc;
                        }, {} as Record<EntityId, ComponentDefinition>);

                    newState.definitions = systemDefinitions;
                } else {
                    // Clear all definitions
                    newState.definitions = {};
                }

                // Set the new state first
                set(newState);

                // Initialize defaults if requested
                if (resetToDefaults) {
                    // Import and register default components
                    import('@/registry/categories/layoutComponents').then(module => {
                        module.registerLayoutComponents();
                    });
                    import('@/registry/categories/controlComponents').then(module => {
                        module.registerControlComponents();
                    });
                    import('@/registry/categories/displayComponents').then(module => {
                        module.registerDisplayComponents();
                    });
                }

                return {
                    definitionCount,
                    instanceCount
                };
            }
        }),
        {
            name: 'omni-ui-components'
        }
    )
);

// Helper to validate an instance has all required properties
const validateInstance = (instance: any): boolean => {
    // Check essential properties exist
    if (!instance.id || !instance.definitionId) {
        return false;
    }

    // Check metadata
    if (!instance.metadata || typeof instance.metadata !== 'object') {
        return false;
    }

    // Check state
    if (!instance.state) {
        return false;
    }

    return true;
};

// Helper to repair corrupted instances
const repairInstance = (instance: any): ComponentInstance => {
    // Create a new instance with default values for any missing fields
    const repairedInstance: ComponentInstance = {
        ...instance,
        id: instance.id,
        definitionId: instance.definitionId || 'unknown',
        state: instance.state || defaultState,
        internalBindings: instance.internalBindings || {},
        externalBindings: instance.externalBindings || {},
        metadata: {
            createdAt: instance.metadata?.createdAt || new Date(),
            updatedAt: new Date(), // Always update
            version: (instance.metadata?.version || 0) + 1,
            definitionVersion: instance.metadata?.definitionVersion || 1,
            compatibilityVersion: instance.metadata?.compatibilityVersion || 1,
            createdBy: instance.metadata?.createdBy || 'system',
            isUserComponent: instance.metadata?.isUserComponent || false,
            repaired: true // Mark as repaired for debugging
        }
    };

    // Log the repair
    console.info(`Repaired instance ${instance.id}`);

    // Notify about the repair
    eventBus.publish("component:instanceRepaired", {
        instanceId: instance.id,
        timestamp: Date.now()
    });

    return repairedInstance;
};

/**
 * Hook to get a component definition by ID
 * @param id - The ID of the definition or null
 * @returns The component definition or undefined
 */
export function useDefinition(id: EntityId | null) {
    const definitionsMap = useComponentStore(state => state.definitions);
    return useMemo(() => {
        if (!id) return undefined;
        return definitionsMap[id];
    }, [definitionsMap, id]);
}

/**
 * Hook to get a component instance by ID
 * @param id - The ID of the instance or null
 * @returns The component instance or undefined
 */
export function useInstance(id: EntityId | null) {
    const instancesMap = useComponentStore(state => state.instances);
    return useMemo(() => {
        if (!id) return undefined;
        return instancesMap[id];
    }, [instancesMap, id]);
}

/**
 * Hook to get all component definitions
 * @returns Array of all component definitions
 */
export function useAllDefinitions() {
    const definitionsMap = useComponentStore(state => state.definitions);
    return useMemo(() => Object.values(definitionsMap), [definitionsMap]);
}

/**
 * Hook to get all component instances
 * @returns Array of all component instances
 */
export function useAllInstances() {
    const instancesMap = useComponentStore(state => state.instances);
    return useMemo(() => Object.values(instancesMap), [instancesMap]);
}

/**
 * Hook to get component definitions by type
 * @param type - The component type to filter by
 * @returns Array of definitions of the specified type
 */
export function useDefinitionsByType(type: ComponentType) {
    const definitions = useAllDefinitions();
    return useMemo(() => {
        return definitions.filter(def => def.type === type);
    }, [definitions, type]);
}

/**
 * Hook to get instances by their definition ID
 * @param definitionId - The definition ID to filter by
 * @returns Array of instances using the specified definition
 */
export function useInstancesByDefinition(definitionId: EntityId) {
    const instances = useAllInstances();
    return useMemo(() => {
        return instances.filter(instance => instance.definitionId === definitionId);
    }, [instances, definitionId]);
}

/**
 * Hook for managing a component instance with update capability
 * @param id - The ID of the instance to manage
 * @returns Object with the instance and an update function
 */
export function useInstanceManager(id: EntityId) {
    const instance = useInstance(id);
    const updateInstance = useComponentStore(state => state.updateInstance);

    return useMemo(() => ({
        instance,
        update: (updates: Partial<any>) => {
            if (instance) {
                updateInstance(id, updates);
            }
        }
    }), [instance, updateInstance, id]);
}

/**
 * Hook for managing multiple component instances
 * @param ids - Array of instance IDs to manage
 * @returns Object with instances and a function to update all
 */
export function useMultiInstanceManager(ids: EntityId[]) {
    const instancesMap = useComponentStore(state => state.instances);
    const updateInstance = useComponentStore(state => state.updateInstance);

    return useMemo(() => {
        const filteredInstances = ids
            .map(id => instancesMap[id])
            .filter(Boolean);

        return {
            instances: filteredInstances,
            updateAll: (updates: Partial<any>) => {
                ids.forEach(id => {
                    if (instancesMap[id]) {
                        updateInstance(id, updates);
                    }
                });
            }
        };
    }, [instancesMap, updateInstance, ids]);
}

/**
 * Hook for component creation operations
 * @returns Object with functions for creating definitions and instances
 */
export function useComponentCreation() {
    const addDefinition = useComponentStore(state => state.addDefinition);
    const addInstance = useComponentStore(state => state.addInstance);
    const createFromDefinition = useComponentStore(state => state.createFromDefinition);

    return useMemo(() => ({
        createDefinition: addDefinition,
        createInstance: addInstance,
        createFromDefinition
    }), [addDefinition, addInstance, createFromDefinition]);
}