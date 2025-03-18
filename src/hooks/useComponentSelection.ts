/**
 * @file src/hooks/useComponentSelection.ts
 * Hook for working with component selection in UI components.
 * Provides centralized access to selection state and operations.
 */

import { EntityId } from "@/core/types/EntityTypes";
import { builderService } from "@/services/builderService";
import { useUIStore } from "@/store/uiStore";
import { useCallback, useEffect, useState, MouseEvent } from "react";
import eventBus from "@/core/eventBus/eventBus";
import { useWidgetStore } from "@/features/builder/stores/widgetStore";

/**
 * Selection info interface containing detailed component info
 */
export interface SelectionInfo {
    componentId: EntityId | null;
    widgetId: EntityId | null;
    instanceId: EntityId | null;
    type: string | null;
    instance: any | null;
    isSelected: boolean;
}

/**
 * Options for component selection hook
 */
interface ComponentSelectionOptions {
    listenToInfoEvents?: boolean;
    syncWithLayoutPanel?: boolean;
    openPropertyPanel?: boolean;
}

/**
 * Hook that provides centralized component selection state and operations
 *
 * @param options - Configuration options
 * @returns Selection state and operations
 */
export function useComponentSelection(options: ComponentSelectionOptions = {}) {
    const {
        listenToInfoEvents = true,
        syncWithLayoutPanel = true,
        openPropertyPanel = true
    } = options;

    // Get selection state from UI store
    const selectedComponentId = useUIStore(state => state.selectedComponentId);
    const selectedWidgetId = useUIStore(state => state.selectedWidgetId);
    const storeSelectComponent = useUIStore(state => state.selectComponent);
    const storeDeselectAll = useUIStore(state => state.deselectAll);
    const storeIsComponentSelected = useUIStore(state => state.isComponentSelected);

    // Get widget store for widget activation
    const widgetStore = useWidgetStore();

    // Local state for enhanced selection info
    const [selectionInfo, setSelectionInfo] = useState<SelectionInfo>({
        componentId: selectedComponentId,
        widgetId: selectedWidgetId,
        instanceId: null,
        type: null,
        instance: null,
        isSelected: false
    });

    // Update basic selection info when store changes
    useEffect(() => {
        // Start with basic update
        const updates = {
            componentId: selectedComponentId,
            widgetId: selectedWidgetId,
            isSelected: !!selectedComponentId
        };

        // Add additional info if available
        if (selectedComponentId && selectedWidgetId) {
            const info = builderService.getComponentInfo(selectedWidgetId, selectedComponentId);
            if (info) {
                Object.assign(updates, {
                    instanceId: info.instanceId,
                    type: info.type,
                    instance: info.instance
                });
            }
        }

        // One state update with all changes
        setSelectionInfo(prev => ({ ...prev, ...updates }));
    }, [selectedComponentId, selectedWidgetId]);

    // Listen for component info events if enabled
    useEffect(() => {
        if (!listenToInfoEvents) return;

        // Subscribe to component info events through eventBus
        const subscriptionId = eventBus.subscribe('component:info', (event) => {
            const info = event.data;

            if (info && info.componentId === selectedComponentId) {
                setSelectionInfo(prev => ({
                    ...prev,
                    instanceId: info.instanceId,
                    type: info.type,
                    instance: info.instance
                }));
            }
        });

        // Clean up subscription
        return () => {
            eventBus.unsubscribe(subscriptionId);
        };
    }, [listenToInfoEvents, selectedComponentId]);

    /**
     * Select a component within a widget
     * @param componentId Component ID to select
     * @param widgetId Widget ID containing the component
     * @param e Optional mouse event
     */
    const select = useCallback((
        componentId: EntityId,
        widgetId: EntityId,
        e?: MouseEvent
    ) => {
        // Stop event propagation if provided
        if (e) {
            e.stopPropagation();
        }

        // Skip if already selected to prevent unnecessary updates
        if (componentId === selectedComponentId && widgetId === selectedWidgetId) {
            return;
        }

        // Use the store's selection method
        storeSelectComponent(componentId, widgetId, {
            syncWithLayoutPanel,
            openPropertyPanel
        });

        // Set widget as active
        widgetStore.setActiveWidget(widgetId);

        // Publish selection event
        eventBus.publish("component:selected", {
            componentId,
            widgetId
        });
    }, [selectedComponentId, selectedWidgetId, storeSelectComponent, widgetStore, syncWithLayoutPanel, openPropertyPanel]);

    /**
     * Deselect all components
     */
    const deselect = useCallback(() => {
        const currentWidgetId = selectedWidgetId;

        // Use the store's deselection method
        storeDeselectAll();

        // Publish deselection event if there was a selected widget
        if (currentWidgetId) {
            eventBus.publish("component:deselected", {
                widgetId: currentWidgetId
            });
        }
    }, [selectedWidgetId, storeDeselectAll]);

    /**
     * Select a widget without selecting any component
     * @param widgetId Widget ID to select
     */
    const selectWidget = useCallback((widgetId: EntityId) => {
        // Set widget as active but don't select a component
        widgetStore.setActiveWidget(widgetId);

        // Clear component selection but set widget
        storeSelectComponent(null, widgetId, {
            syncWithLayoutPanel,
            openPropertyPanel: false
        });

        // Publish widget selection event
        eventBus.publish("widget:selected", {
            widgetId
        });
    }, [widgetStore, storeSelectComponent, syncWithLayoutPanel]);

    /**
     * Handle widget background click to deselect components
     * @param widgetId Widget ID that was clicked
     * @param e Mouse event
     */
    const handleWidgetBackgroundClick = useCallback((widgetId: EntityId, e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            // Deselect all components
            storeDeselectAll();

            // Set the widget as active, but with no selected component
            widgetStore.setActiveWidget(widgetId);

            // Publish deselection event
            eventBus.publish("component:deselected", {
                widgetId: widgetId
            });
        }
    }, [widgetStore, storeDeselectAll]);

    /**
     * Check if a specific component is selected
     * @param componentId Component ID to check
     */
    const isSelected = useCallback((componentId: EntityId) => {
        return storeIsComponentSelected(componentId);
    }, [storeIsComponentSelected]);

    /**
     * Delete the currently selected component
     */
    const deleteSelected = useCallback(() => {
        if (selectedComponentId && selectedWidgetId) {
            // Deselect the component first
            storeDeselectAll();

            // Delete the component
            const result = builderService.deleteComponent(selectedWidgetId, selectedComponentId);

            // Publish deletion event
            eventBus.publish("component:deleted", {
                componentId: selectedComponentId,
                widgetId: selectedWidgetId
            });

            return result;
        }
        return false;
    }, [selectedComponentId, selectedWidgetId, storeDeselectAll]);

    /**
     * Delete a specific component
     * @param componentId Component ID to delete
     * @param widgetId Widget ID containing the component
     * @param e Optional mouse event
     */
    const deleteComponent = useCallback((
        componentId: EntityId,
        widgetId: EntityId,
        e?: MouseEvent
    ) => {
        // Stop event propagation if provided
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        // Check if this component is currently selected
        if (componentId === selectedComponentId) {
            storeDeselectAll();
        }

        // Delete the component
        const result = builderService.deleteComponent(widgetId, componentId);

        // Publish deletion event
        eventBus.publish("component:deleted", {
            componentId,
            widgetId
        });

        return result;
    }, [selectedComponentId, storeDeselectAll]);

    /**
     * Select a component by its instance ID
     * @param instanceId Instance ID to select
     */
    const selectByInstanceId = useCallback((instanceId: EntityId) => {
        return builderService.selectComponentByInstanceId(instanceId);
    }, []);

    return {
        // Basic selection state
        selectedComponentId,
        selectedWidgetId,

        // Enhanced selection info
        selectionInfo,

        // Selection operations
        select,
        deselect,
        selectWidget,
        handleWidgetBackgroundClick,
        isSelected,
        deleteSelected,
        deleteComponent,
        selectByInstanceId
    };
}