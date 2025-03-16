/**
 * @file src/store/index.ts
 * Central exports for the store system.
 * This file provides a single import point for all store-related functionality.
 */

// Core stores
export { useUIStore, usePanelConfig, usePanelVisibility, useGridSettings, useSelection } from './uiStore';
export { useComponentStore, useDefinition, useInstance, useInstanceManager } from './componentStore';
export { useWidgetStore, useWidgetChanges, useActiveWidget, useWidget } from '@/features/builder/stores/widgetStore';

// Types
export type { ComponentState, PanelState, GridSettings } from './types';

// Re-export service for direct access
export { builderService, useBuilderServiceEventHandlers } from '@/services/builderService';

// Selection hooks
export {
    useSelectionEffects,
    useSelectionKeyboardShortcuts,
    useSelectionManager
} from '@/hooks/useSelectionEffects';