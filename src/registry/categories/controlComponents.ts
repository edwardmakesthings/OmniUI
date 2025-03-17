import { nanoid } from 'nanoid';
import { createEntityId } from '@/core/types/EntityTypes';
import { ComponentTypeValues } from '@/core/types/ComponentTypes';
import { useComponentStore } from '@/store/componentStore';
import { buttonPreset } from '@/components/base/style/presets/button';

export function registerControlComponents() {
    const store = useComponentStore.getState();
    const existingControls = Object.values(store.definitions)
        .filter(def => def.type === ComponentTypeValues.PushButton);

    // Skip if controls already exist
    if (existingControls.length > 0) {
        console.log('Control components already registered, skipping');
        return;
    }

    // Register PushButton component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'pushButton',
        label: 'Push Button',
        type: ComponentTypeValues.PushButton,
        category: "control",
        isLayout: false,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'text',
                        label: 'Button Text',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: 'Button',
                        value: 'Button',
                        description: 'The text shown on the button'
                    },
                    {
                        name: 'disabled',
                        label: 'Disabled',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether the button is disabled'
                    },
                    {
                        name: 'type',
                        label: 'Button Type',
                        inputType: 'select',
                        defaultValue: 'button',
                        value: 'button',
                        options: [
                            { label: 'Button', value: 'button' },
                            { label: 'Submit', value: 'submit' },
                            { label: 'Reset', value: 'reset' }
                        ],
                        description: 'The HTML button type'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default',
                stylePreset: buttonPreset
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

    // Text Input component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'textInput',
        label: 'Text Input',
        type: ComponentTypeValues.Input,
        category: "control",
        isLayout: false,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'placeholder',
                        label: 'Placeholder',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: 'Enter text...',
                        value: 'Enter text...',
                        description: 'The placeholder text'
                    },
                    {
                        name: 'disabled',
                        label: 'Disabled',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether the input is disabled'
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