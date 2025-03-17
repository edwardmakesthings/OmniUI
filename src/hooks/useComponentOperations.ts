/**
 * @file src/hooks/useComponentOperations.ts
 * Hook that provides operations for working with components
 * using the builder service for cross-store coordination.
 */

import { EntityId } from "@/core/types/EntityTypes";
import { Position, Size } from "@/core/types/Geometry";
import { builderService } from "@/services/builderService";
import { useActiveWidget } from "@/features/builder/stores/widgetStore";
import { useCallback, useState } from "react";

/**
 * Options for component operations
 */
interface ComponentOperationsOptions {
    defaultWidgetId?: EntityId;
}

/**
 * Hook that provides operations for working with components
 * with easy access to builder service functionality.
 *
 * @param options - Configuration options
 * @returns Component operations and state
 */
export function useComponentOperations(options: ComponentOperationsOptions = {}) {
    const { defaultWidgetId } = options;

    // Get the active widget if no default is provided
    const activeWidget = useActiveWidget();
    const activeWidgetId = activeWidget?.id;

    // Default to the provided widget ID or active widget ID
    const targetWidgetId = defaultWidgetId || activeWidgetId;

    // Loading state for async operations
    const [isLoading, setLoading] = useState(false);
    const [lastError, setLastError] = useState<Error | null>(null);

    /**
     * Add a component to the target widget
     */
    const addComponent = useCallback(async (
        definitionId: EntityId,
        position: Position,
        options?: { size?: Size, autoSelect?: boolean }
    ) => {
        if (!targetWidgetId) {
            setLastError(new Error("No target widget ID available"));
            return null;
        }

        setLoading(true);
        setLastError(null);

        try {
            const component = builderService.addComponentToWidget(
                targetWidgetId,
                definitionId,
                position,
                options
            );

            return component;
        } catch (error) {
            setLastError(error instanceof Error ? error : new Error(String(error)));
            return null;
        } finally {
            setLoading(false);
        }
    }, [targetWidgetId]);

    /**
     * Delete a component from the target widget
     */
    const deleteComponent = useCallback((componentId: EntityId, widgetId?: EntityId) => {
        const targetId = widgetId || targetWidgetId;

        if (!targetId) {
            setLastError(new Error("No target widget ID available"));
            return false;
        }

        try {
            return builderService.deleteComponent(targetId, componentId);
        } catch (error) {
            setLastError(error instanceof Error ? error : new Error(String(error)));
            return false;
        }
    }, [targetWidgetId]);

    /**
     * Get information about a component
     */
    const getComponentInfo = useCallback((componentId: EntityId, widgetId?: EntityId) => {
        const targetId = widgetId || targetWidgetId;

        if (!targetId) {
            setLastError(new Error("No target widget ID available"));
            return null;
        }

        try {
            return builderService.getComponentInfo(targetId, componentId);
        } catch (error) {
            setLastError(error instanceof Error ? error : new Error(String(error)));
            return null;
        }
    }, [targetWidgetId]);

    return {
        // State
        targetWidgetId,
        isLoading,
        lastError,

        // Component operations
        addComponent,
        deleteComponent,
        getComponentInfo,

        // Additional builder service methods
        findComponentByInstanceId: builderService.findComponentByInstanceId,
        selectComponentByInstanceId: builderService.selectComponentByInstanceId
    };
}