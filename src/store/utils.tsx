import { useComponentStore } from "@/store/componentStore";
import { useWidgetStore } from "@/features/builder/stores/widgetStore";

/**
 * Purges all stores in the correct order to prevent reference errors
 */
export function purgeAllStores(
    options = {
        resetComponentsToDefaults: true,
        keepSystemComponents: false,
        keepWidgets: false,
    }
) {
    // Always purge the widget store first, since it depends on the component store
    const { widgetCount } = useWidgetStore.getState().purgeStore({
        keepWidgets: options.keepWidgets,
    });

    // Then purge the component store
    const { definitionCount, instanceCount } = useComponentStore
        .getState()
        .purgeStore({
            keepSystemComponents: options.keepSystemComponents,
            resetToDefaults: options.resetComponentsToDefaults,
        });

    console.log(
        `Purged ${widgetCount} widgets, ${definitionCount} definitions, and ${instanceCount} instances`
    );

    return {
        widgetCount,
        definitionCount,
        instanceCount,
    };
}

/**
 * Adds a development reset button to the application
 */
export function DevResetButton() {
    if (process.env.NODE_ENV !== "development") return null;

    return (
        <button
            onClick={() => purgeAllStores()}
            className="fixed bottom-4 right-4 z-50 bg-red-500 text-white px-2 py-1 text-xs rounded"
            title="Reset all stores to defaults"
        >
            Reset Stores
        </button>
    );
}
