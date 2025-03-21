import { nanoid } from 'nanoid';
import { createEntityId } from '@/core/types/EntityTypes';
import { ComponentTypeValues } from '@/core/types/ComponentTypes';
import { useComponentStore } from '@/store/componentStore';
import { buttonPreset } from '@/components/base/style/presets/button';
import { listViewPreset } from '@/components/base/style/presets/listView';
import { treeViewPreset } from '@/components/base/style/presets/treeView';
import { EditIcon } from '@/components/ui';
import dropdownPreset from '@/components/base/style/presets/dropdown';

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

    // Register IconButton component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'iconButton',
        label: 'Icon Button',
        type: ComponentTypeValues.IconButton,
        category: "control",
        isLayout: false,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'icon',
                        label: 'Button Icon',
                        inputType: 'icon',
                        format: 'icon',
                        defaultValue: EditIcon,
                        value: EditIcon,
                        description: 'The icon shown on the button'
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

    // Register DropdownButton component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'dropdownButton',
        label: 'Dropdown Button',
        type: ComponentTypeValues.DropdownButton,
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
                        defaultValue: 'Dropdown',
                        value: 'Dropdown',
                        description: 'The text shown on the button'
                    },
                    {
                        name: 'options',
                        label: 'Options',
                        inputType: 'options',
                        format: 'array',
                        defaultValue: [
                            { label: 'Option 1', value: '1' },
                            { label: 'Option 2', value: '2' },
                            { label: 'Option 3', value: '3' }
                        ],
                        value: [
                            { label: 'Option 1', value: '1' },
                            { label: 'Option 2', value: '2' },
                            { label: 'Option 3', value: '3' }
                        ],
                        description: 'The dropdown options'
                    },
                    {
                        name: 'disabled',
                        label: 'Disabled',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether the dropdown is disabled'
                    },
                    {
                        name: 'showCaret',
                        label: 'Show Caret',
                        inputType: 'boolean',
                        defaultValue: true,
                        value: true,
                        description: 'Whether to show the dropdown caret indicator'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default',
                stylePreset: dropdownPreset
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

    // Register DropdownSelect component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'dropdownSelect',
        label: 'Dropdown Select',
        type: ComponentTypeValues.DropdownSelect,
        category: "control",
        isLayout: false,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'text',
                        label: 'Label',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: 'Select',
                        value: 'Select',
                        description: 'The label for the select'
                    },
                    {
                        name: 'placeholder',
                        label: 'Placeholder',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: 'Select an option',
                        value: 'Select an option',
                        description: 'The placeholder text when no option is selected'
                    },
                    {
                        name: 'options',
                        label: 'Options',
                        inputType: 'options',
                        format: 'array',
                        defaultValue: [
                            { label: 'Option 1', value: '1' },
                            { label: 'Option 2', value: '2' },
                            { label: 'Option 3', value: '3' }
                        ],
                        value: [
                            { label: 'Option 1', value: '1' },
                            { label: 'Option 2', value: '2' },
                            { label: 'Option 3', value: '3' }
                        ],
                        description: 'The select options'
                    },
                    {
                        name: 'multiSelect',
                        label: 'Multi Select',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether multiple options can be selected'
                    },
                    {
                        name: 'disabled',
                        label: 'Disabled',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether the select is disabled'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default',
                stylePreset: dropdownPreset
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

    // Register ListView component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'listView',
        label: 'List View',
        type: ComponentTypeValues.ListView,
        category: "control",
        isLayout: false,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'items',
                        label: 'Items',
                        inputType: 'items',
                        format: 'array',
                        defaultValue: [
                            { id: 'item1', label: 'Item 1' },
                            { id: 'item2', label: 'Item 2' },
                            { id: 'item3', label: 'Item 3' }
                        ],
                        value: [
                            { id: 'item1', label: 'Item 1' },
                            { id: 'item2', label: 'Item 2' },
                            { id: 'item3', label: 'Item 3' }
                        ],
                        description: 'The list items'
                    },
                    {
                        name: 'multiSelect',
                        label: 'Multi Select',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether multiple items can be selected'
                    },
                    {
                        name: 'maxHeight',
                        label: 'Max Height',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: '300px',
                        value: '300px',
                        description: 'The maximum height of the list'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default',
                stylePreset: listViewPreset
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

    // Register TreeView component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'treeView',
        label: 'Tree View',
        type: ComponentTypeValues.TreeView,
        category: "control",
        isLayout: false,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'items',
                        label: 'Items',
                        inputType: 'treeItems',
                        format: 'array',
                        defaultValue: [
                            {
                                id: 'item1',
                                label: 'Item 1',
                                children: [
                                    { id: 'item1-1', label: 'Item 1.1' },
                                    { id: 'item1-2', label: 'Item 1.2' }
                                ]
                            },
                            { id: 'item2', label: 'Item 2' },
                            { id: 'item3', label: 'Item 3' }
                        ],
                        value: [
                            {
                                id: 'item1',
                                label: 'Item 1',
                                children: [
                                    { id: 'item1-1', label: 'Item 1.1' },
                                    { id: 'item1-2', label: 'Item 1.2' }
                                ]
                            },
                            { id: 'item2', label: 'Item 2' },
                            { id: 'item3', label: 'Item 3' }
                        ],
                        description: 'The tree items'
                    },
                    {
                        name: 'multiSelect',
                        label: 'Multi Select',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether multiple items can be selected'
                    },
                    {
                        name: 'maxHeight',
                        label: 'Max Height',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: '300px',
                        value: '300px',
                        description: 'The maximum height of the tree'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default',
                stylePreset: treeViewPreset
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