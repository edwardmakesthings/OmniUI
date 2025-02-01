import { create } from 'zustand';
import { PanelPositionValues, UIState } from '../core/types/UI';
import { createEntityId, EntityId } from '../core/types/EntityTypes';
import { StoreError, StoreErrorCodes } from '../core/base/StoreError';
import { MeasurementUtils } from '../core/types/Measurement';
import { persist } from 'zustand/middleware';


const DEFAULT_GRID_SETTINGS = {
    showGrid: true,
    snapToGrid: true,
    gridSize: 10
};

// Standard panel IDs
export const PANEL_IDS = {
    COMPONENT_PALETTE: createEntityId('component-palette'),
    PROPERTY_EDITOR: createEntityId('property-editor'),
    LAYOUT_HIERARCHY: createEntityId('layout-hierarchy')
} as const;

export type PanelName = keyof typeof PANEL_IDS;

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
        position: PanelPositionValues.Bottom,
        isFloating: false,
        size: MeasurementUtils.create(240, 'px'),
        isVisible: false
    }
};

interface UIStore extends UIState {
    selectComponent: (id: EntityId | null) => void;
    togglePanel: (panelId: EntityId) => void;
    updateGridSettings: (settings: Partial<UIState['gridSettings']>) => void;
    getPanelConfig: (panelId: EntityId) => UIState['panelStates'][EntityId];
}

export const useUIStore = create<UIStore>()(
    persist(
        (set, get) => ({
            selectedComponent: null,
            gridSettings: DEFAULT_GRID_SETTINGS,
            // Creates a default state object for each panel using reduce with the panel ID as the key
            panelStates: Object.keys(DEFAULT_PANEL_CONFIGS).reduce((acc, id) => ({
                ...acc,
                [id]: DEFAULT_PANEL_CONFIGS[id as keyof typeof DEFAULT_PANEL_CONFIGS]
            }), {}),

            /**
             * Select a component with the given ID. If the ID is null or an invalid value,
             * an error is thrown.
             *
             * @param {string | null} id ID of the component to select
             * @throws {StoreError} If the ID is not a string or null
             */
            selectComponent: (id) => {
                if (id !== null && typeof id !== 'string') {
                    throw new StoreError(
                        'Invalid component ID provided',
                        StoreErrorCodes.INVALID_COMPONENT_SELECTION
                    );
                }

                set(() => ({
                    selectedComponent: id
                }));
            },

            /**
             * Toggle the visibility of a panel. If the panel is already visible, hide it.
             * If it is hidden, show it.
             * @param {EntityId} panelId
             * @throws {StoreError} If the panel ID is not provided
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
             * @param {{showGrid?: boolean, snapToGrid?: boolean, gridSize?: number}} settings
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
             * @throws {StoreError} If the panel ID is not provided or is invalid
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
            }
        }),
        {
            name: 'omni-ui-interface'
        }
    ));

// Helper hooks for safer state access

/**
 * Hook to get the configuration for a panel by its name vs its ID.
 * @param {PanelName} panelName The name of the panel to get the configuration for
 * @returns {PanelConfig & {id: EntityId}} The panel configuration, with the panel ID also included
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
        id: panelId
    };
}

/**
 * Hook to get the visibility state of a panel and a function to toggle it
 * @param {PanelName} panelName The name of the panel to get the visibility state for
 * @returns {{isVisible: boolean, toggle: () => void}} An object containing the current visibility state and a function to toggle it
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
 * Hook to get the currently selected component.
 *
 * @returns {EntityId | null} The ID of the selected component, or null if no component is selected.
 */
export function useSelectedComponent() {
    return useUIStore((state) => state.selectedComponent);
}

/**
 * Hook to get the current grid settings.
 *
 * @returns {GridSettings} The current grid settings.
 */
export function useGridSettings() {
    return useUIStore((state) => state.gridSettings);
}