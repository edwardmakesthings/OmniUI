/**
 * @file src/hooks/useComponentSelection.ts
 * Hook for working with component selection in UI components.
 * Provides centralized access to selection state and operations.
 */

import { EntityId } from "@/core/types/EntityTypes";
import { builderService } from "@/services/builderService";
import { useUIStore } from "@/store/uiStore";
import { useCallback, useEffect, useRef, useState, MouseEvent } from "react";
import eventBus from "@/core/eventBus/eventBus";
import { useWidgetStore } from "@/features/builder/stores/widgetStore";
import { useEventSubscription } from "./useEventBus";

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

    // Track last selection to prevent circular updates
    const lastSelectionRef = useRef<{
        componentId: EntityId | null,
        widgetId: EntityId | null,
        timestamp: number
    }>({
        componentId: null,
        widgetId: null,
        timestamp: 0
    });

    // Track if we're already in a selection operation
    const isProcessingSelectionRef = useRef(false);

    // Debounce timer reference
    const debounceTimerRef = useRef<any>(null);

    // Update basic selection info when store changes
    useEffect(() => {
        // Skip the update if we're in the middle of a selection operation
        if (isProcessingSelectionRef.current) return;

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
    const handleComponentInfo = useCallback((event: any) => {
        const info = event.data;

        if (info && info.componentId === selectedComponentId) {
            setSelectionInfo(prev => ({
                ...prev,
                instanceId: info.instanceId,
                type: info.type,
                instance: info.instance
            }));
        }
    }, [selectedComponentId]);

    // Only subscribe if enabled
    if (listenToInfoEvents) {
        useEventSubscription(
            'component:info',
            handleComponentInfo,
            [handleComponentInfo],
            'ComponentSelectionInfo'
        );
    }

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

        // Get current timestamp
        const now = Date.now();

        // Check for rapid repeated selection (debounce)
        const lastSelection = lastSelectionRef.current;
        if (
            componentId === lastSelection.componentId &&
            widgetId === lastSelection.widgetId &&
            now - lastSelection.timestamp < 200
        ) {
            return;
        }

        // Skip if already selected to prevent unnecessary updates
        if (componentId === selectedComponentId && widgetId === selectedWidgetId) {
            return;
        }

        // Clear any pending debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set processing flag to prevent circular updates
        isProcessingSelectionRef.current = true;

        // Update last selection reference
        lastSelectionRef.current = {
            componentId,
            widgetId,
            timestamp: now
        };

        // Use the store's selection method
        try {
            storeSelectComponent(componentId, widgetId, {
                syncWithLayoutPanel,
                openPropertyPanel
            });

            // Set widget as active
            widgetStore.setActiveWidget(widgetId);

            // Publish selection event - but with a small delay to prevent UI glitches
            setTimeout(() => {
                eventBus.publish("component:selected", {
                    componentId,
                    widgetId
                });
            }, 0);
        } finally {
            // Clear processing flag after a small delay to ensure all updates have been processed
            debounceTimerRef.current = setTimeout(() => {
                isProcessingSelectionRef.current = false;
            }, 100);
        }
    }, [
        selectedComponentId,
        selectedWidgetId,
        storeSelectComponent,
        widgetStore,
        syncWithLayoutPanel,
        openPropertyPanel
    ]);

    /**
     * Deselect all components with debouncing
     */
    const deselect = useCallback(() => {
        // Skip if already processing selection
        if (isProcessingSelectionRef.current) return;

        const currentWidgetId = selectedWidgetId;

        // Set processing flag
        isProcessingSelectionRef.current = true;

        // Update last selection reference
        lastSelectionRef.current = {
            componentId: null,
            widgetId: null,
            timestamp: Date.now()
        };

        try {
            // Use the store's deselection method
            storeDeselectAll();

            // Publish deselection event if there was a selected widget
            if (currentWidgetId) {
                setTimeout(() => {
                    eventBus.publish("component:deselected", {
                        widgetId: currentWidgetId
                    });
                }, 0);
            }
        } finally {
            // Clear processing flag after a small delay
            debounceTimerRef.current = setTimeout(() => {
                isProcessingSelectionRef.current = false;
            }, 100);
        }
    }, [selectedWidgetId, storeDeselectAll]);

    /**
     * Select a widget without selecting any component
     * @param widgetId Widget ID to select
     */
    const selectWidget = useCallback((widgetId: EntityId) => {
        // Skip if already processing selection
        if (isProcessingSelectionRef.current) return;

        // Set processing flag
        isProcessingSelectionRef.current = true;

        // Update last selection reference
        lastSelectionRef.current = {
            componentId: null,
            widgetId,
            timestamp: Date.now()
        };

        try {
            // Set widget as active but don't select a component
            widgetStore.setActiveWidget(widgetId);

            // Clear component selection but set widget
            storeSelectComponent(null, widgetId, {
                syncWithLayoutPanel,
                openPropertyPanel: false
            });

            // Publish widget selection event with slight delay
            setTimeout(() => {
                eventBus.publish("widget:selected", {
                    widgetId
                });
            }, 0);
        } finally {
            // Clear processing flag after a small delay
            debounceTimerRef.current = setTimeout(() => {
                isProcessingSelectionRef.current = false;
            }, 100);
        }
    }, [widgetStore, storeSelectComponent, syncWithLayoutPanel]);

    /**
     * Handle widget background click to deselect components
     * @param widgetId Widget ID that was clicked
     * @param e Mouse event
     */
    const handleWidgetBackgroundClick = useCallback((widgetId: EntityId, e: MouseEvent) => {
        if (e.target === e.currentTarget) {
            // Skip if already processing selection
            if (isProcessingSelectionRef.current) return;

            // Set processing flag
            isProcessingSelectionRef.current = true;

            try {
                // Deselect all components
                storeDeselectAll();

                // Set the widget as active, but with no selected component
                widgetStore.setActiveWidget(widgetId);

                // Publish deselection event with slight delay
                setTimeout(() => {
                    eventBus.publish("component:deselected", {
                        widgetId: widgetId
                    });
                }, 0);
            } finally {
                // Clear processing flag after a small delay
                debounceTimerRef.current = setTimeout(() => {
                    isProcessingSelectionRef.current = false;
                }, 100);
            }
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
            setTimeout(() => {
                eventBus.publish("component:deleted", {
                    componentId: selectedComponentId,
                    widgetId: selectedWidgetId
                });
            }, 0);

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

        // Publish deletion event with slight delay
        setTimeout(() => {
            eventBus.publish("component:deleted", {
                componentId,
                widgetId
            });
        }, 0);

        return result;
    }, [selectedComponentId, storeDeselectAll]);

    /**
     * Select a component by its instance ID
     * @param instanceId Instance ID to select
     */
    const selectByInstanceId = useCallback((instanceId: EntityId) => {
        return builderService.selectComponentByInstanceId(instanceId);
    }, []);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
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