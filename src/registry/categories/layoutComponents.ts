import { nanoid } from 'nanoid';
import { createEntityId } from '@/core/types/EntityTypes';
import { ComponentTypeValues } from '@/core/types/ComponentTypes';
import { useComponentStore } from '@/store/componentStore';
import { panelPreset } from '@/components/base/style/presets/panel';
import { scrollboxPreset } from '@/components/base/style/presets/scrollbox';

export function registerLayoutComponents() {
    const store = useComponentStore.getState();
    const existingLayouts = Object.values(store.definitions)
        .filter(def => def.type === ComponentTypeValues.Panel);

    // Skip if layouts already exist
    if (existingLayouts.length > 0) {
        console.log('Layout components already registered, skipping');
        return;
    }

    // Register Panel component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'panel',
        label: 'Panel',
        type: ComponentTypeValues.Panel,
        category: "layout",
        isLayout: true,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'header',
                        label: 'Header Text',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: 'Panel',
                        value: 'Panel',
                        description: 'The header text for the panel'
                    },
                    {
                        name: 'showHeader',
                        label: 'Show Header',
                        inputType: 'boolean',
                        defaultValue: true,
                        value: true,
                        description: 'Whether to show the header'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default',
                stylePreset: panelPreset
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

    // Register ScrollBox component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'scrollBox',
        label: 'Scroll Box',
        type: ComponentTypeValues.ScrollBox,
        category: "layout",
        isLayout: true,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'maxHeight',
                        label: 'Max Height',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: '300px',
                        value: '300px',
                        description: 'The maximum height of the scroll box'
                    },
                    {
                        name: 'scrollbarStyle',
                        label: 'Scrollbar Style',
                        inputType: 'select',
                        defaultValue: 'dark',
                        value: 'dark',
                        options: [
                            { label: 'Dark', value: 'dark' },
                            { label: 'Light', value: 'light' },
                            { label: 'Accent', value: 'accent' },
                            { label: 'Invisible', value: 'invisible' }
                        ],
                        description: 'The style of the scrollbar'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default',
                stylePreset: scrollboxPreset
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