import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ComponentState } from './types';
import { ComponentDefinition } from '../core/base/ComponentDefinition';
import { ComponentInstance } from '../core/base/ComponentInstance';

interface ComponentStore extends ComponentState {
    addDefinition: (definition: ComponentDefinition) => void;
    addInstance: (instance: ComponentInstance) => void;
    updateInstance: (id: string, updates: Partial<ComponentInstance>) => void;
}

export const useComponentStore = create<ComponentStore>()(
    persist(
        (set) => ({
            definitions: {},
            instances: {},

            /**
             * Adds a new component definition to the store.
             *
             * @param definition - The component definition to be added, which
             *  includes its type, configuration, and other metadata.
             */
            addDefinition: (definition) =>
                set((state) => ({
                    definitions: {
                        ...state.definitions,
                        [definition.id]: definition
                    }
                })),

            /**
             * Adds a new component instance to the store.
             *
             * @param instance - The component instance to be added, which
             *  includes its id, definition id, and any overrides or customizations.
             */
            addInstance: (instance) =>
                set((state) => ({
                    instances: {
                        ...state.instances,
                        [instance.id]: instance
                    }
                })),

            /**
             * Updates an existing component instance in the store.
             *
             * @param id - The id of the component instance to update.
             * @param updates - The updates to apply to the existing instance.
             * The updates will be merged with the existing properties and
             * the updated instance will have its metadata updated.
             */
            updateInstance: (id, updates) =>
                set((state) => ({
                    instances: {
                        ...state.instances,
                        [id]: {
                            ...state.instances[id],
                            ...updates,
                            metadata: {
                                ...state.instances[id].metadata,
                                updatedAt: new Date(),
                                version: state.instances[id].metadata.version + 1
                            }
                        }
                    }
                }))
        }),
        {
            name: 'omni-ui-components'
        }
    )
);