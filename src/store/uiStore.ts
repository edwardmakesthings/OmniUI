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

/**
 * Drag operation tracking state
 */
export interface DragState {
    // Active drag operation
    isDragging: boolean;
    sourceId?: string;
    sourceWidgetId?: EntityId;
    sourceComponentId?: EntityId;

    // Drop target tracking
    targetId?: string;
    targetWidgetId?: EntityId;
    targetComponentId?: EntityId;

    // Metadata
    timestamp?: number;
    dragType?: string;
}

// Default drag state
const DEFAULT_DRAG_STATE: DragState = {
    isDragging: false
};

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

// Initial selection state
const DEFAULT_SELECTION_STATE: SelectionState = {
    selectedComponentId: null,
    selectedWidgetId: null,
    previousComponentId: null,
    previousWidgetId: null,
    lastSelectionTime: 0,
    selectionCount: 0
};

export interface LayoutHierarchyOperations {
    // Select an item in the hierarchy (format: widgetId/componentId or just widgetId)
    selectItem: (id: EntityId | null) => void;

    // Get currently selected items in the hierarchy
    getSelectedItems: () => string[];

    // Refresh the hierarchy view
    refreshView: (force?: boolean) => void;
}

/**
 * Extended UI store interface that includes selection state and methods
 */
export interface UIStoreState extends UIState, SelectionState {
    // Editor mode
    isEditMode: boolean;
    toggleEditMode: () => void;

    // Panel management
    togglePanel: (panelId: EntityId) => void;
    getPanelConfig: (panelId: EntityId) => UIState['panelStates'][EntityId];

    // Grid settings
    updateGridSettings: (settings: Partial<UIState['gridSettings']>) => void;

    // Selection state management
    updateSelectionState: (state: Partial<SelectionState>) => void;

    // Component selection - basic state operations only
    selectComponent: (
        componentId: EntityId | null,
        widgetId: EntityId | null,
        options?: { openPropertyPanel?: boolean, syncWithLayoutPanel?: boolean }
    ) => void;

    deselectAll: () => void;
    isComponentSelected: (componentId: EntityId) => boolean;

    // Drag state
    dragState: DragState;

    // Drag operations
    startDrag: (data: {
        sourceId: string;
        sourceWidgetId?: EntityId;
        sourceComponentId?: EntityId;
        dragType?: string;
    }) => void;

    updateDragTarget: (data: {
        targetId?: string;
        targetWidgetId?: EntityId;
        targetComponentId?: EntityId;
    }) => void;

    endDrag: () => void;

    // Layout hierarchy operations
    layoutHierarchy: {
        // Function to call when the hierarchy should be refreshed
        refreshRequested: boolean;
        forceRefresh: boolean;
        requestRefresh: (force?: boolean) => void;

        // Function to track when refresh is completed
        refreshCompleted: () => void;
    };

    // Store reset
    resetState: (options?: { keepEditorState?: boolean }) => void;
}

/**
 * UI Store that manages application UI state including panel configurations,
 * selection state, and editor preferences.
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

            // Drag State
            dragState: DEFAULT_DRAG_STATE,
            layoutHierarchyStore: null,

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
             * Toggle the visibility of a panel
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
             * Update the grid settings
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
             * Get the configuration for a panel by its ID
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
             * Update selection state with partial data
             * @param state Partial selection state to update
             */
            updateSelectionState: (state: Partial<SelectionState>) => {
                set((current) => ({
                    ...current,
                    ...state
                }));
            },

            /**
             * Select a component within a widget - basic state update only
             * @param componentId The ID of the component to select, or null to deselect
             * @param widgetId The ID of the widget containing the component
             * @param options Additional options for selection behavior
             */
            selectComponent: (
                componentId: EntityId | null,
                widgetId: EntityId | null,
                options = { openPropertyPanel: true, syncWithLayoutPanel: true }
            ) => {
                const { openPropertyPanel = true } = options;
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
            },

            /**
             * Deselect all components - basic state update only
             */
            deselectAll: () => {
                set({
                    selectedComponentId: null,
                    selectedComponent: null,
                    previousComponentId: get().selectedComponentId,
                    lastSelectionTime: Date.now()
                });
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
             * Start tracking a drag operation
             */
            startDrag: (data) => {
                set((_state) => ({
                    dragState: {
                        isDragging: true,
                        sourceId: data.sourceId,
                        sourceWidgetId: data.sourceWidgetId,
                        sourceComponentId: data.sourceComponentId,
                        dragType: data.dragType || 'component',
                        timestamp: Date.now()
                    }
                }));

                // Add class to body for global styling during drag
                document.body.classList.add('drag-in-progress');
                if (data.sourceWidgetId) {
                    document.body.setAttribute('data-drag-widget', data.sourceWidgetId.toString());
                }
            },

            /**
             * Update the drag target information
             */
            updateDragTarget: (data) => {
                set((state) => ({
                    dragState: {
                        ...state.dragState,
                        targetId: data.targetId,
                        targetWidgetId: data.targetWidgetId,
                        targetComponentId: data.targetComponentId
                    }
                }));
            },

            /**
             * End drag tracking operation
             */
            endDrag: () => {
                set({
                    dragState: DEFAULT_DRAG_STATE
                });

                // Remove drag styling classes
                document.body.classList.remove('drag-in-progress');
                document.body.removeAttribute('data-drag-widget');
            },

            layoutHierarchy: {
                refreshRequested: false,
                forceRefresh: false,

                // Request a refresh of the layout hierarchy
                requestRefresh: (force = false) => {
                    set(state => ({
                        layoutHierarchy: {
                            ...state.layoutHierarchy,
                            refreshRequested: true,
                            forceRefresh: force
                        }
                    }));
                },

                // Mark refresh as completed
                refreshCompleted: () => {
                    set(state => ({
                        layoutHierarchy: {
                            ...state.layoutHierarchy,
                            refreshRequested: false,
                            forceRefresh: false
                        }
                    }));
                }
            },

            /**
             * Reset the UI state to defaults
             * @param options Options for controlling what state is preserved
             */
            resetState: (options = { keepEditorState: true }) => {
                const { keepEditorState = true } = options;

                const newState: Partial<UIStoreState> = {
                    ...DEFAULT_SELECTION_STATE,
                    selectedComponent: null,
                    dragState: DEFAULT_DRAG_STATE
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

                // Publish an event to notify subscribers about the reset
                // This ensures LayoutPanel and other subscribers can respond
                setTimeout(() => {
                    eventBus.publish("store:reset", { timestamp: Date.now() });
                }, 0);
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
 * Hook to access and manipulate drag state
 */
export function useDragTracking() {
    const dragState = useUIStore(state => state.dragState);
    const startDrag = useUIStore(state => state.startDrag);
    const updateDragTarget = useUIStore(state => state.updateDragTarget);
    const endDrag = useUIStore(state => state.endDrag);

    return {
        dragState,
        startDrag,
        updateDragTarget,
        endDrag
    };
}

/**
 * Hook to access layout hierarchy operations
 */
export function useLayoutHierarchy() {
    const { refreshRequested, forceRefresh, requestRefresh, refreshCompleted } =
        useUIStore(state => state.layoutHierarchy);

    return {
        refreshRequested,
        forceRefresh,
        requestRefresh,
        refreshCompleted
    };
}