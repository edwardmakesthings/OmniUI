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
