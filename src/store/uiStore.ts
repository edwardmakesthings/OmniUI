import { create } from 'zustand';
import { UIState } from './types';

interface UIStore extends UIState {
    selectComponent: (id: string | null) => void;
    togglePanel: (panelId: string) => void;
    updateGridSettings: (settings: Partial<UIState['gridSettings']>) => void;
}

export const useUIStore = create<UIStore>((set) => ({
    selectedComponent: null,
    panelStates: {},
    gridSettings: {
        showGrid: true,
        snapToGrid: true,
        gridSize: 10
    },

    /**
     * Set the currently selected component. Pass null to clear selection.
     * @param {string|null} id
     */
    selectComponent: (id) =>
        set(() => ({
            selectedComponent: id
        })),

    /**
     * Toggle the visibility of a panel. If the panel is already visible, hide it.
     * If it is hidden, show it.
     * @param {string} panelId
     */
    togglePanel: (panelId) =>
        set((state) => ({
            panelStates: {
                ...state.panelStates,
                [panelId]: !state.panelStates[panelId]
            }
        })),

    /**
     * Update the grid settings. The provided object will be merged onto the
     * existing grid settings.
     * @param {{showGrid?: boolean, snapToGrid?: boolean, gridSize?: number}} settings
     */
    updateGridSettings: (settings) =>
        set((state) => ({
            gridSettings: {
                ...state.gridSettings,
                ...settings
            }
        }))
}));