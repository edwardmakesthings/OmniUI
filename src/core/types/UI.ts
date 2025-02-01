import { EntityId } from "./EntityTypes";
import { Position, Size } from "./Geometry";
import { Measurement } from "./Measurement";

/**
 * Defines possible panel positions in the application layout
 */
export const PanelPositionValues = {
    Left: "left",
    Right: "right",
    Bottom: "bottom"
}

export type PanelPosition = typeof PanelPositionValues[keyof typeof PanelPositionValues];

/**
 * Defines the panel configuration in the UI store
 * The component uses PanelProps which extends this interface
 */
export interface PanelConfig {
    /** Position of the panel in the layout */
    position: PanelPosition;
    /** Panel's position in the layout if floating */
    floatPosition?: Position;
    /** Whether the panel is floating vs fixed */
    isFloating: boolean;
    /** Panel's width in the layout */
    size: Measurement;
    /** Panel's size if floating */
    floatSize?: Size;
    /** Whether the panel is currently visible */
    isVisible: boolean;
}

/**
 * Grid visualization and snapping settings
 */
export interface GridSettings {
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
}

/**
 * Maps panel IDs to their configurations
 */
export type PanelStateMap = Record<EntityId, PanelConfig>;

/**
 * Complete UI state interface
 */
export interface UIState {
    selectedComponent: EntityId | null;
    panelStates: PanelStateMap;
    gridSettings: GridSettings;
}