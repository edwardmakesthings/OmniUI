/**
 * @file src/hooks/useComponentSelection.ts
 * Hook for working with component selection in UI components.
 * Provides easy access to selection state and operations.
 */

import { EntityId } from "@/core/types/EntityTypes";
import { builderService } from "@/services/builderService";
import { useUIStore } from "@/store/uiStore";
import { useCallback, useEffect, useState } from "react";

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
}

/**
 * Hook that provides component selection state and operations
 * with enhanced functionality for working with selected components.
 *
 * @param options - Configuration options
 * @returns Selection state and operations
 */
export function useComponentSelection(options: ComponentSelectionOptions = {}) {
    const { listenToInfoEvents = true } = options;

    // Get selection state from UI store
    const {
        selectedComponentId,
        selectedWidgetId,
        selectComponent,
        deselectAll,
        isComponentSelected
    } = useUIStore(state => ({
        selectedComponentId: state.selectedComponentId,
        selectedWidgetId: state.selectedWidgetId,
        selectComponent: state.selectComponent,
        deselectAll: state.deselectAll,
        isComponentSelected: state.isComponentSelected
    }));

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
        setSelectionInfo(prev => ({
            ...prev,
            componentId: selectedComponentId,
            widgetId: selectedWidgetId,
            isSelected: !!selectedComponentId
        }));

        // If component is selected, get its info
        if (selectedComponentId && selectedWidgetId) {
            const info = builderService.getComponentInfo(selectedWidgetId, selectedComponentId);
            if (info) {
                setSelectionInfo(prev => ({
                    ...prev,
                    instanceId: info.instanceId,
                    type: info.type,
                    instance: info.instance
                }));
            }
        }
    }, [selectedComponentId, selectedWidgetId]);

    // Listen for component info events if enabled
    useEffect(() => {
        if (!listenToInfoEvents) return;

        const handleComponentInfo = (event: Event) => {
            const customEvent = event as CustomEvent;
            const info = customEvent.detail;

            if (info && info.componentId === selectedComponentId) {
                setSelectionInfo(prev => ({
                    ...prev,
                    instanceId: info.instanceId,
                    type: info.type,
                    instance: info.instance
                }));
            }
        };

        document.addEventListener('component:info', handleComponentInfo);
        return () => {
            document.removeEventListener('component:info', handleComponentInfo);
        };
    }, [listenToInfoEvents, selectedComponentId]);

    // Check if a specific component is selected
    const isSelected = useCallback((componentId: EntityId) => {
        return isComponentSelected(componentId);
    }, [isComponentSelected]);

    // Delete the currently selected component
    const deleteSelected = useCallback(() => {
        if (selectedComponentId && selectedWidgetId) {
            return builderService.deleteComponent(selectedWidgetId, selectedComponentId);
        }
        return false;
    }, [selectedComponentId, selectedWidgetId]);

    // Select a component by its instance ID
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
        select: selectComponent,
        deselect: deselectAll,
        isSelected,
        deleteSelected,
        selectByInstanceId
    };
}