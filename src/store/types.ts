/**
 * @file src/store/types.ts
 * Core type definitions for the application stores.
 */

import { EntityId } from "@/core/types/EntityTypes";
import { ComponentDefinition } from "@/core/base/ComponentDefinition";
import { ComponentInstance } from "@/core/base/ComponentInstance";
import { PanelConfig } from "@/core/types/UI";

/**
 * Base component state for the store
 */
export interface ComponentState {
    definitions: Record<EntityId, ComponentDefinition>;
    instances: Record<EntityId, ComponentInstance>;
}

/**
 * UI component configuration
 */
export interface PanelState {
    panelStates: Record<EntityId, PanelConfig>;
}

/**
 * Grid settings for the UI
 */
export interface GridSettings {
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
}