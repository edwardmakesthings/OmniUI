import { nanoid } from 'nanoid';
import { createEntityId } from '@/core/types/EntityTypes';
import { ComponentTypeValues } from '@/core/types/ComponentTypes';
import { useComponentStore } from '@/store/componentStore';
import { panelPreset } from '@/components/base/style/presets/panel';
import { scrollboxPreset } from '@/components/base/style/presets/scrollbox';
import { drawerPreset } from '@/components/base/style/presets/drawer';
import { modalPreset } from '@/components/base/style/presets/modal';
import { dropdownPanelPreset } from '@/components/base/style/presets/dropdownPanel';
import { tabsPreset } from '@/components/base/style/presets/tabs';

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

    // Register Drawer component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'drawer',
        label: 'Drawer',
        type: ComponentTypeValues.Drawer,
        category: "layout",
        isLayout: true,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'open',
                        label: 'Open',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether the drawer is open'
                    },
                    {
                        name: 'width',
                        label: 'Width',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: '320px',
                        value: '320px',
                        description: 'The width of the drawer'
                    },
                    {
                        name: 'height',
                        label: 'Height',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: '320px',
                        value: '320px',
                        description: 'The height of the drawer (when using top/bottom variants)'
                    },
                    {
                        name: 'closeOnOverlayClick',
                        label: 'Close on Overlay Click',
                        inputType: 'boolean',
                        defaultValue: true,
                        value: true,
                        description: 'Whether clicking the overlay closes the drawer'
                    },
                    {
                        name: 'closeOnEscape',
                        label: 'Close on Escape',
                        inputType: 'boolean',
                        defaultValue: true,
                        value: true,
                        description: 'Whether pressing Escape closes the drawer'
                    },
                    {
                        name: 'showOverlay',
                        label: 'Show Overlay',
                        inputType: 'boolean',
                        defaultValue: true,
                        value: true,
                        description: 'Whether to show the overlay'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'left',
                stylePreset: drawerPreset
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

    // Register Modal component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'modal',
        label: 'Modal',
        type: ComponentTypeValues.Modal,
        category: "layout",
        isLayout: true,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'open',
                        label: 'Open',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether the modal is open'
                    },
                    {
                        name: 'title',
                        label: 'Title',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: 'Modal Title',
                        value: 'Modal Title',
                        description: 'The title of the modal'
                    },
                    {
                        name: 'width',
                        label: 'Width',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: '500px',
                        value: '500px',
                        description: 'The width of the modal'
                    },
                    {
                        name: 'maxHeight',
                        label: 'Max Height',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: '85vh',
                        value: '85vh',
                        description: 'The maximum height of the modal'
                    },
                    {
                        name: 'closeOnBackdropClick',
                        label: 'Close on Backdrop Click',
                        inputType: 'boolean',
                        defaultValue: true,
                        value: true,
                        description: 'Whether clicking the backdrop closes the modal'
                    },
                    {
                        name: 'closeOnEscape',
                        label: 'Close on Escape',
                        inputType: 'boolean',
                        defaultValue: true,
                        value: true,
                        description: 'Whether pressing Escape closes the modal'
                    },
                    {
                        name: 'showBackdrop',
                        label: 'Show Backdrop',
                        inputType: 'boolean',
                        defaultValue: true,
                        value: true,
                        description: 'Whether to show the backdrop'
                    },
                    {
                        name: 'footer',
                        label: 'Footer Content',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: '',
                        value: '',
                        description: 'The footer content of the modal'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default',
                stylePreset: modalPreset
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

    // Register DropdownPanel component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'dropdownPanel',
        label: 'Dropdown Panel',
        type: ComponentTypeValues.DropdownPanel,
        category: "layout",
        isLayout: true,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'title',
                        label: 'Title',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: 'Dropdown Panel',
                        value: 'Dropdown Panel',
                        description: 'The title of the dropdown panel'
                    },
                    {
                        name: 'searchable',
                        label: 'Searchable',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether the panel content is searchable'
                    },
                    {
                        name: 'contentLayout',
                        label: 'Content Layout',
                        inputType: 'select',
                        defaultValue: 'list',
                        value: 'list',
                        options: [
                            { label: 'List', value: 'list' },
                            { label: 'Grid', value: 'grid' }
                        ],
                        description: 'The layout of the panel content'
                    },
                    {
                        name: 'maxHeight',
                        label: 'Max Height',
                        inputType: 'text',
                        format: 'string',
                        defaultValue: '300px',
                        value: '300px',
                        description: 'The maximum height of the panel content'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default',
                stylePreset: dropdownPanelPreset
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

    // Register Tabs component
    store.addDefinition({
        id: createEntityId(nanoid()),
        name: 'tabs',
        label: 'Tabs',
        type: ComponentTypeValues.Tabs,
        category: "layout",
        isLayout: true,
        visible: true,
        enabled: true,
        config: {
            content: {
                properties: [
                    {
                        name: 'tabs',
                        label: 'Tabs',
                        inputType: 'tabs',
                        format: 'array',
                        defaultValue: [
                            { id: 'tab1', label: 'Tab 1', content: 'Tab 1 content', disabled: false },
                            { id: 'tab2', label: 'Tab 2', content: 'Tab 2 content', disabled: false }
                        ],
                        value: [
                            { id: 'tab1', label: 'Tab 1', content: 'Tab 1 content', disabled: false },
                            { id: 'tab2', label: 'Tab 2', content: 'Tab 2 content', disabled: false }
                        ],
                        description: 'The tabs configuration'
                    },
                    {
                        name: 'disabled',
                        label: 'Disabled',
                        inputType: 'boolean',
                        defaultValue: false,
                        value: false,
                        description: 'Whether the tabs component is disabled'
                    }
                ]
            },
            style: {
                classes: [],
                variant: 'default',
                stylePreset: tabsPreset
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