import { nanoid } from 'nanoid';
import { createEntityId } from '@/core/types/EntityTypes';
import { ComponentTypeValues } from '@/core/types/ComponentTypes';
import { useComponentStore } from '@/store/componentStore';

export function registerDisplayComponents() {
    const store = useComponentStore.getState();
    const existingDisplays = Object.values(store.definitions)
        .filter(def => def.type === ComponentTypeValues.Label);

    // Skip if displays already exist
    if (existingDisplays.length > 0) {
        console.log('Display components already registered, skipping');
        return;
    }

    // Register Label component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'label',
        label: 'Label',
        type: ComponentTypeValues.Label,
        isLayout: false,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'text',
                        label: 'Label Text',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: 'Label',
                        value: 'Label',
                        description: 'The text to display'
                    },
                    {
                        name: 'htmlFor',
                        label: 'For Input ID',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: '',
                        value: '',
                        description: 'The ID of the input to associate with'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default'
            }
        },
        metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            definitionVersion: '1.0.0',
            compatibilityVersion: '1.0.0'
        }
    });
}