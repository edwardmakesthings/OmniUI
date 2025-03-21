/**
 * @file src/hooks/useEventDebug.ts
 * Utility for debugging and managing event subscriptions
 */
import { useCallback } from 'react';
import eventBus, { EventType } from '@/core/eventBus/eventBus';

// Keep track of all active subscriptions globally
const activeSubscriptions = new Map<string, {
    component: string;
    type: EventType;
    createdAt: number;
}>();

/**
 * Hook to debug event subscriptions and handler accumulation
 */
export function useEventDebug() {
    /**
     * List all active subscriptions for debugging
     */
    const listSubscriptions = useCallback(() => {
        const subscriptionCount = eventBus.getSubscriberCount();
        console.group(`EventBus Subscriptions (${subscriptionCount} total)`);

        // Group by event type
        const byType = new Map<EventType, string[]>();

        for (const [_id, info] of activeSubscriptions) {
            if (!byType.has(info.type)) {
                byType.set(info.type, []);
            }
            byType.get(info.type)?.push(`${info.component} (${Math.floor((Date.now() - info.createdAt) / 1000)}s old)`);
        }

        // Log each type
        for (const [type, subscribers] of byType) {
            console.group(`${type} (${subscribers.length})`);
            subscribers.forEach(sub => console.log(sub));
            console.groupEnd();
        }

        console.groupEnd();
        return subscriptionCount;
    }, []);

    /**
     * Clear all subscriptions to reset the event system
     */
    const clearAllSubscriptions = useCallback(() => {
        const count = eventBus.getSubscriberCount();

        // Unsubscribe each one
        activeSubscriptions.forEach((_, id) => {
            eventBus.unsubscribe(id);
        });

        // Clear tracking
        activeSubscriptions.clear();

        console.log(`Cleared ${count} event subscriptions`);
        return count;
    }, []);

    /**
     * Emergency reset for when things get really broken
     */
    const emergencyReset = useCallback(() => {
        // First, list all subscriptions
        listSubscriptions();

        // Then clear them
        const count = clearAllSubscriptions();

        // Add a global reset event with a small delay
        setTimeout(() => {
            eventBus.publish('store:reset', {
                timestamp: Date.now(),
                emergency: true
            });

            console.log('Emergency reset completed. Refresh the page if issues persist.');
        }, 50);

        return count;
    }, [listSubscriptions, clearAllSubscriptions]);

    return {
        listSubscriptions,
        clearAllSubscriptions,
        emergencyReset
    };
}

/**
 * Enhanced version of useEventSubscription that tracks subscriptions
 * Drop-in replacement for existing useEventSubscription
 */
export function useTrackedEventSubscription(
    type: EventType,
    handler: (event: any) => void,
    deps: any[] = [],
    componentName: string = 'Unknown'
) {
    const internalHandler = useCallback(handler, deps);

    // On mount, create subscription and track it
    const subscriptionId = eventBus.subscribe(type, internalHandler);

    // Store info about this subscription
    activeSubscriptions.set(subscriptionId, {
        component: componentName,
        type,
        createdAt: Date.now()
    });

    // On unmount, clean up
    return () => {
        eventBus.unsubscribe(subscriptionId);
        activeSubscriptions.delete(subscriptionId);
    };
}

// Add this to window for console access
if (typeof window !== 'undefined') {
    (window as any).eventDebug = {
        listSubscriptions: () => {
            const count = eventBus.getSubscriberCount();
            console.log(`Total subscriptions: ${count}`);
            console.log('Types:', Array.from(new Set(Array.from(activeSubscriptions.values()).map(v => v.type))));
            return count;
        },
        clearAll: () => {
            activeSubscriptions.forEach((_, id) => eventBus.unsubscribe(id));
            activeSubscriptions.clear();
            console.log('All event subscriptions cleared');
        }
    };
}

export default useEventDebug;