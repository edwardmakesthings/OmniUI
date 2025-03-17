/**
 * @file src/store/uiStore.ts
 * UI state management store that handles UI configuration, panels, and selection state
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PanelPositionValues, UIState } from '@/core/types/UI';
import { createEntityId, EntityId } from '@/core/types/EntityTypes';
import { StoreError, StoreErrorCodes } from '@/core/base/StoreError';
import { MeasurementUtils } from '@/core/types/Measurement';
import { ComponentsIcon, ConnectionsIcon, LayoutIcon, PropertyEditorIcon, ThemeIcon, WidgetsIcon } from '@/components/ui/icons';
import eventBus from '@/core/eventBus/eventBus';

// Default grid settings
const DEFAULT_GRID_SETTINGS = {
    showGrid: true,
    snapToGrid: true,
    gridSize: 10
};

// Standard panel IDs
export const PANEL_IDS = {
    PROPERTY_EDITOR: createEntityId('property-editor'),
    COMPONENT_PALETTE: createEntityId('component-palette'),
    LAYOUT_HIERARCHY: createEntityId('layout-hierarchy'),
    WIDGET_DEFINITIONS: createEntityId('widget-definitions'),
    CONNECTIONS: createEntityId('connections'),
    THEME_MANAGER: createEntityId('theme-manager'),
} as const;

export type PanelName = keyof typeof PANEL_IDS;

// Icon mapping
export const PANEL_ICONS: Record<PanelName, React.ComponentType> = {
    PROPERTY_EDITOR: PropertyEditorIcon,
    COMPONENT_PALETTE: ComponentsIcon,
    LAYOUT_HIERARCHY: LayoutIcon,
    WIDGET_DEFINITIONS: WidgetsIcon,
    CONNECTIONS: ConnectionsIcon,
    THEME_MANAGER: ThemeIcon,
};

export type PanelIconName = keyof typeof PANEL_ICONS;

// Tooltip mapping
export const PANEL_TOOLTIPS: Record<PanelName, string> = {
    PROPERTY_EDITOR: 'Property Editor',
    COMPONENT_PALETTE: 'Add Components',
    LAYOUT_HIERARCHY: 'Layout Hierarchy',
    WIDGET_DEFINITIONS: 'Widget Definitions',
    CONNECTIONS: 'Connections',
    THEME_MANAGER: 'Theme Manager',
};

export type PanelTooltipName = keyof typeof PANEL_TOOLTIPS;

// Selection state interface
export interface SelectionState {
    // Currently selected component and widget IDs
    selectedComponentId: EntityId | null;
    selectedWidgetId: EntityId | null;

    // Previous selection state for managing focus history
    previousComponentId: EntityId | null;
    previousWidgetId: EntityId | null;

    // Timestamp of last selection for debouncing
    lastSelectionTime: number;

    // Selection counts for analytics (useful for future features)
    selectionCount: number;
}

// Default panel configurations
const DEFAULT_PANEL_CONFIGS = {
    [PANEL_IDS.COMPONENT_PALETTE]: {
        position: PanelPositionValues.Left,
        isFloating: false,
        size: MeasurementUtils.create(320, 'px'),
        isVisible: true
    },
    [PANEL_IDS.PROPERTY_EDITOR]: {
        position: PanelPositionValues.Right,
        isFloating: false,
        size: MeasurementUtils.create(320, 'px'),
        isVisible: true
    },
    [PANEL_IDS.LAYOUT_HIERARCHY]: {
        position: PanelPositionValues.Left,
        isFloating: false,
        size: MeasurementUtils.create(320, 'px'),
        isVisible: false
    },
    [PANEL_IDS.THEME_MANAGER]: {
        position: PanelPositionValues.Bottom,
        isFloating: false,
        size: MeasurementUtils.create(320, 'px'),
        isVisible: false
    }
};

// Initial selection state
const DEFAULT_SELECTION_STATE: SelectionState = {
    selectedComponentId: null,
    selectedWidgetId: null,
    previousComponentId: null,
    previousWidgetId: null,
    lastSelectionTime: 0,
    selectionCount: 0
};

/**
 * Extended UI store interface that includes selection state and methods
 */
interface UIStoreState extends UIState, SelectionState {
    // Editor mode
    isEditMode: boolean;
    toggleEditMode: () => void;

    // Panel management
    togglePanel: (panelId: EntityId) => void;
    getPanelConfig: (panelId: EntityId) => UIState['panelStates'][EntityId];

    // Grid settings
    updateGridSettings: (settings: Partial<UIState['gridSettings']>) => void;

    // Component selection
    selectComponent: (
        componentId: EntityId | null,
        widgetId: EntityId | null,
        options?: { openPropertyPanel?: boolean, syncWithLayoutPanel?: boolean }
    ) => void;
    selectInstanceComponent: (instanceId: EntityId | null) => void;
    deselectAll: () => void;
    isComponentSelected: (componentId: EntityId) => boolean;
    deleteSelectedComponent: () => void;
    syncWithLayoutPanel: (componentId: EntityId | null, widgetId: EntityId | null) => void;
    getSelectedComponentInfo: () => {
        componentId: EntityId | null,
        widgetId: EntityId | null,
        instanceId: EntityId | null,
        type: string | null
    };

    // Store reset
    resetState: (options?: { keepEditorState?: boolean }) => void;
}

/**
 * UI Store that manages application UI state including panel configurations,
 * selection state, and editor preferences.
 *
 * This store combines UI configuration with selection state management.
 */
export const useUIStore = create<UIStoreState>()(
    persist(
        (set, get) => ({
            // UI State
            isEditMode: true,
            selectedComponent: null,
            gridSettings: DEFAULT_GRID_SETTINGS,

            // Selection State
            ...DEFAULT_SELECTION_STATE,

            // Panel States
            panelStates: Object.keys(DEFAULT_PANEL_CONFIGS).reduce((acc, id) => ({
                ...acc,
                [id]: DEFAULT_PANEL_CONFIGS[id as keyof typeof DEFAULT_PANEL_CONFIGS]
            }), {}),

            /**
             * Toggle edit mode for the UI
             */
            toggleEditMode: () => set(state => ({ isEditMode: !state.isEditMode })),

            /**
             * Toggle the visibility of a panel. If the panel is already visible, hide it.
             * If it is hidden, show it.
             * @param {EntityId} panelId
             * @throws {StoreError} If the panel ID is not valid
             */
            togglePanel: (panelId) => {
                const state = get();
                const panelConfig = state.panelStates[panelId];

                if (!panelConfig) {
                    throw new StoreError(
                        'Invalid panel ID provided',
                        StoreErrorCodes.INVALID_PANEL_ID
                    );
                }

                set((state) => ({
                    panelStates: {
                        ...state.panelStates,
                        [panelId]: {
                            ...panelConfig,
                            isVisible: !panelConfig.isVisible
                        }
                    }
                }));
            },

            /**
             * Update the grid settings. The provided object will be merged onto the
             * existing grid settings.
             *
             * @param {object} settings - Partial grid settings to apply
             * @throws {StoreError} If the grid size is less than or equal to 0
             */
            updateGridSettings: (settings) => {
                if (settings.gridSize !== undefined && settings.gridSize <= 0) {
                    throw new StoreError(
                        'Grid size must be greater than 0',
                        StoreErrorCodes.INVALID_GRID_SETTINGS
                    );
                }

                set((state) => ({
                    gridSettings: {
                        ...state.gridSettings,
                        ...settings
                    }
                }));
            },

            /**
             * Get the configuration for a panel by its ID.
             * @param {EntityId} panelId ID of the panel to get the configuration for
             * @returns {PanelConfig} The panel configuration
             * @throws {StoreError} If the panel ID is not valid
             */
            getPanelConfig: (panelId) => {
                const state = get();
                const config = state.panelStates[panelId];

                if (!config) {
                    throw new StoreError(
                        'Invalid panel ID provided',
                        StoreErrorCodes.INVALID_PANEL_ID
                    );
                }

                return config;
            },

            /**
             * Select a component within a widget
             * @param componentId The ID of the component to select, or null to deselect
             * @param widgetId The ID of the widget containing the component
             * @param options Additional options for selection behavior
             */
            selectComponent: (
                componentId: EntityId | null,
                widgetId: EntityId | null,
                options = { openPropertyPanel: true, syncWithLayoutPanel: true }
            ) => {
                const { openPropertyPanel = true, syncWithLayoutPanel = true } = options;
                const currentTime = Date.now();
                const { selectedComponentId, selectedWidgetId, lastSelectionTime } = get();

                // Debounce rapid selection changes (prevents some infinite loops)
                if (currentTime - lastSelectionTime < 100) {
                    return;
                }

                // Check if selecting the same component (no change needed)
                if (componentId === selectedComponentId && widgetId === selectedWidgetId) {
                    return;
                }

                // Update selection state
                set(state => ({
                    selectedComponentId: componentId,
                    selectedWidgetId: widgetId,
                    previousComponentId: state.selectedComponentId,
                    previousWidgetId: state.selectedWidgetId,
                    lastSelectionTime: currentTime,
                    selectionCount: state.selectionCount + 1,
                    // Update legacy selection state for compatibility
                    selectedComponent: componentId
                }));

                // Open property editor if requested and component is selected
                if (openPropertyPanel && componentId) {
                    const propertyEditorConfig = get().panelStates[PANEL_IDS.PROPERTY_EDITOR];
                    if (!propertyEditorConfig?.isVisible) {
                        get().togglePanel(PANEL_IDS.PROPERTY_EDITOR);
                    }
                }

                // Sync with layout panel if requested
                if (syncWithLayoutPanel) {
                    get().syncWithLayoutPanel(componentId, widgetId);
                }

                // Notify widget change for any listeners
                if (widgetId) {
                    eventBus.publish('component:selected', { componentId, widgetId });
                }
            },

            /**
             * Select a component by its instance ID
             * @param instanceId The instance ID to select, or null to deselect
             */
            selectInstanceComponent: (instanceId: EntityId | null) => {
                set(() => ({
                    selectedComponent: instanceId
                }));
            },

            /**
             * Deselect all components
             */
            deselectAll: () => {
                const { selectedWidgetId } = get();

                // Update selection state
                set({
                    selectedComponentId: null,
                    selectedComponent: null,
                    previousComponentId: get().selectedComponentId,
                    lastSelectionTime: Date.now()
                });

                // // Clear layout panel selection - This may be causing an infinite loop
                // const layoutHierarchy = window._layoutHierarchyStore;
                // if (layoutHierarchy?.selectItem) {
                //     try {
                //         layoutHierarchy.selectItem(null);
                //     } catch (e) {
                //         console.error('Error clearing layout panel selection:', e);
                //     }
                // }

                // Notify widget change if a widget was selected
                if (selectedWidgetId) {
                    eventBus.publish('component:deselected', { widgetId: selectedWidgetId });
                }
            },

            /**
             * Check if a component is currently selected
             * @param componentId The component ID to check
             * @returns True if the component is selected
             */
            isComponentSelected: (componentId: EntityId) => {
                return get().selectedComponentId === componentId;
            },

            /**
             * Delete the currently selected component.
             * This method intentionally does not directly access other stores
             * and relies on the builder service to perform the actual deletion.
             */
            deleteSelectedComponent: () => {
                const { selectedComponentId, selectedWidgetId } = get();

                if (!selectedComponentId || !selectedWidgetId) {
                    console.warn('No component selected to delete');
                    return;
                }

                // We'll only handle the selection state update here
                // The actual deletion should be handled by the builder service
                set({
                    selectedComponentId: null,
                    selectedComponent: null,
                    previousComponentId: selectedComponentId,
                    lastSelectionTime: Date.now()
                });

                // Emit event for deletion - to be handled by listeners
                const event = new CustomEvent('component:delete', {
                    detail: {
                        componentId: selectedComponentId,
                        widgetId: selectedWidgetId
                    }
                });
                document.dispatchEvent(event);
            },

            /**
             * Sync selection with the layout panel
             * @param componentId The component ID to select
             * @param widgetId The widget ID containing the component
             */
            syncWithLayoutPanel: (componentId: EntityId | null, widgetId: EntityId | null) => {
                // Access the layout hierarchy store if available
                const layoutHierarchy = window._layoutHierarchyStore;
                if (!layoutHierarchy?.selectItem) {
                    return;
                }

                try {
                    if (componentId && widgetId) {
                        // Format: widgetId/componentId
                        layoutHierarchy.selectItem(`${widgetId}/${componentId}` as EntityId);
                    } else {
                        // Clear selection
                        layoutHierarchy.selectItem(null);
                    }
                } catch (e) {
                    console.error('Error syncing with layout panel:', e);
                }
            },

            /**
             * Get information about the currently selected component
             * @returns Object with component info
             */
            getSelectedComponentInfo: () => {
                const { selectedComponentId, selectedWidgetId } = get();

                // Default return when nothing is selected
                const defaultInfo = {
                    componentId: null,
                    widgetId: null,
                    instanceId: null,
                    type: null
                };

                if (!selectedComponentId || !selectedWidgetId) {
                    return defaultInfo;
                }

                // Emit event to request component info - to be handled by listeners
                const event = new CustomEvent('component:getInfo', {
                    detail: {
                        componentId: selectedComponentId,
                        widgetId: selectedWidgetId
                    }
                });
                document.dispatchEvent(event);

                // Return placeholder - actual implementation will be in a hook
                return {
                    componentId: selectedComponentId,
                    widgetId: selectedWidgetId,
                    instanceId: null,
                    type: null
                };
            },

            /**
             * Reset the UI state to defaults
             * @param options Options for controlling what state is preserved
             */
            resetState: (options = { keepEditorState: true }) => {
                const { keepEditorState = true } = options;

                const newState: Partial<UIStoreState> = {
                    ...DEFAULT_SELECTION_STATE,
                    selectedComponent: null
                };

                // Only reset editor state if explicitly requested
                if (!keepEditorState) {
                    newState.isEditMode = true;
                    newState.gridSettings = DEFAULT_GRID_SETTINGS;
                    newState.panelStates = Object.keys(DEFAULT_PANEL_CONFIGS).reduce((acc, id) => ({
                        ...acc,
                        [id]: DEFAULT_PANEL_CONFIGS[id as keyof typeof DEFAULT_PANEL_CONFIGS]
                    }), {});
                }

                set(newState);
            }
        }),
        {
            name: 'omni-ui-interface'
        }
    )
);

/**
 * Helper hook for accessing panel configs by name instead of ID
 * @param panelName The name of the panel to get config for
 * @returns Panel configuration with additional metadata
 */
export function usePanelConfig(panelName: PanelName) {
    const panelId = PANEL_IDS[panelName];
    const panelConfig = useUIStore((state) => state.panelStates[panelId]);

    if (!panelConfig) {
        throw new StoreError(
            `Invalid panel name provided: ${panelName}`,
            StoreErrorCodes.INVALID_PANEL_ID
        );
    }

    return {
        ...panelConfig,
        panelName: panelName,
        id: panelId
    };
}

/**
 * Helper hook for accessing and toggling panel visibility
 * @param panelName The name of the panel
 * @returns Object with visibility state and toggle function
 */
export function usePanelVisibility(panelName: PanelName) {
    const panelId = PANEL_IDS[panelName];
    const togglePanel = useUIStore((state) => state.togglePanel);
    const isVisible = useUIStore((state) => state.panelStates[panelId]?.isVisible ?? false);

    return {
        isVisible,
        toggle: () => togglePanel(panelId)
    };
}

/**
 * Hook to get the currently selected component ID
 * @returns The ID of the selected component or null
 */
export function useSelectedComponent() {
    return useUIStore((state) => state.selectedComponent);
}

/**
 * Hook to get current selection state
 * @returns Current selection state with component and widget IDs
 */
export function useSelection() {
    const selection = useUIStore(state => ({
        componentId: state.selectedComponentId,
        widgetId: state.selectedWidgetId
    }));

    return selection;
}

/**
 * Hook to get the current grid settings
 * @returns The current grid settings
 */
export function useGridSettings() {
    return useUIStore((state) => state.gridSettings);
}

/**
 * Type definition for layout hierarchy store
 */
declare global {
    interface Window {
        _layoutHierarchyStore?: {
            selectItem: (id: EntityId | null) => void;
            getSelectedItems: () => string[];
            refreshView: () => void;
        };
    }
}