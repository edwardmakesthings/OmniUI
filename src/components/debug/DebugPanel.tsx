/**
 * @file src/components/debug/DebugPanel.tsx
 * Emergency debug and reset panel to recover from broken states
 */
import React, { useState, useCallback } from "react";
import { useEventDebug } from "@/hooks/useEventDebug";
import { builderService } from "@/services/builderService";
import eventBus from "@/core/eventBus/eventBus";
import { useComponentStore, useWidgetStore } from "@/store";
import { purgeAllStores } from "@/store/utils";

/**
 * Debug panel that can be added to help diagnose and fix runtime issues
 */
const DebugPanel: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [stats, setStats] = useState<{
        subscriptions: number;
        components: number;
        widgets: number;
        prevSubscriptions?: number;
        prevComponents?: number;
        prevWidgets?: number;
    }>({
        subscriptions: 0,
        components: 0,
        widgets: 0,
        prevSubscriptions: 0,
        prevComponents: 0,
        prevWidgets: 0,
    });

    const { listSubscriptions, clearAllSubscriptions } = useEventDebug();

    // Collect and display stats
    const collectStats = useCallback(() => {
        const subscriptionCount = listSubscriptions();

        // Get component and widget counts from builder service
        try {
            const componentStore = useComponentStore.getState();
            const widgetStore = useWidgetStore.getState();

            const prevSubscriptions = stats.subscriptions || 0;
            const prevComponents = stats.components || 0;
            const prevWidgets = stats.widgets || 0;

            const componentCount = componentStore
                ? Object.keys(componentStore.instances || {}).length
                : 0;

            const widgetCount = widgetStore
                ? Object.keys(widgetStore.widgets || {}).length
                : 0;

            setStats({
                subscriptions: subscriptionCount,
                components: componentCount,
                widgets: widgetCount,
                prevSubscriptions,
                prevComponents,
                prevWidgets,
            });
        } catch (e) {
            console.error("Error collecting stats:", e);
        }
    }, [listSubscriptions, stats]);

    // Reset the entire application state
    const handleEmergencyReset = useCallback(() => {
        if (
            window.confirm(
                "This will reset the entire application state. Continue?"
            )
        ) {
            // First clear all event subscriptions
            clearAllSubscriptions();

            // Reset the stores
            try {
                builderService.resetAllStores({ keepSystemComponents: true });
            } catch (e) {
                console.error("Error resetting stores:", e);
            }

            // Dispatch a reset event
            eventBus.publish("store:reset", { timestamp: Date.now() });

            // Refresh stats
            setTimeout(collectStats, 100);
        }
    }, [clearAllSubscriptions, collectStats]);

    if (process.env.NODE_ENV !== "development") return null;

    // Toggle visibility of the panel
    const togglePanel = useCallback(() => {
        setIsOpen((prev) => !prev);
        if (!isOpen) {
            collectStats();
        }
    }, [isOpen, collectStats]);

    return (
        <>
            {/* Small button always visible in corner */}
            <button
                className="fixed z-50 bottom-2 right-15 bg-red-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                onClick={togglePanel}
                title="Debug Panel"
            >
                🔧
            </button>

            {/* Expanded panel when open */}
            {isOpen && (
                <div className="fixed z-50 bottom-16 right-15 bg-bg-dark-darker text-white p-4 pt-3 rounded-lg shadow-lg w-80">
                    <h3 className="text-lg font-bold mb-1">Debug Panel</h3>

                    <div className="mb-2">
                        <h4 className="font-bold">Stats:</h4>
                        <div className="text-sm">
                            <div>
                                Event Subscriptions: {stats.prevSubscriptions}{" "}
                                {" -> "} {stats.subscriptions}
                            </div>
                            <div>
                                Component Instances: {stats.prevComponents}{" "}
                                {" -> "} {stats.components}
                            </div>
                            <div>
                                Widgets: {stats.prevWidgets} {" -> "}{" "}
                                {stats.widgets}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <button
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                            onClick={collectStats}
                        >
                            Refresh Stats
                        </button>

                        <button
                            className="bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                            onClick={clearAllSubscriptions}
                        >
                            Clear Event Subscriptions
                        </button>

                        <button
                            className="bg-red-700 text-white px-3 py-1 rounded text-sm"
                            onClick={handleEmergencyReset}
                        >
                            Emergency Reset
                        </button>

                        <button
                            onClick={() => purgeAllStores()}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                            title="Reset all stores to defaults"
                        >
                            Reset Stores
                        </button>
                    </div>

                    <div className="mt-2 text-xs text-gray-400">
                        * Use Emergency Reset if the application becomes
                        unresponsive
                    </div>
                </div>
            )}
        </>
    );
};

export default DebugPanel;
