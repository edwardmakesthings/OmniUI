import { useEffect, useRef, useState, useCallback } from 'react';
import eventBus, { EventType, EventData, Event, EventHandler } from '@/core/eventBus/eventBus';

// Global registry to track active subscriptions for debugging
const __DEBUG_SUBSCRIPTIONS = new Map<string, {
    component: string;
    type: EventType;
    createdAt: number;
}>();

/**
 * Hook to subscribe to events from the event bus
 *
 * @param eventType Type of event to subscribe to
 * @param handler Event handler function
 * @param deps Dependencies array (similar to useEffect)
 * @param componentName Optional name for debugging
 */
export function useEventSubscription<T extends EventData = EventData>(
    eventType: EventType,
    handler: EventHandler<T>,
    deps: React.DependencyList = [],
    componentName: string = 'Unknown'
): void {
    // Keep handler in ref to avoid unnecessary resubscriptions
    const handlerRef = useRef(handler);
    // Track subscription ID for cleanup
    const subscriptionIdRef = useRef<string | null>(null);
    // Track if component is mounted to prevent memory leaks
    const isMountedRef = useRef(true);

    // Update handler ref when it changes
    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        // Create a stable handler that uses the current ref
        // and checks mounted status before calling
        const stableHandler: EventHandler<T> = (event: Event<T>) => {
            if (isMountedRef.current) {
                try {
                    handlerRef.current(event);
                } catch (error) {
                    console.error(`Error in event handler for ${eventType}:`, error);
                }
            }
        };

        // Subscribe to the event
        const subscriptionId = eventBus.subscribe<T>(eventType, stableHandler);
        subscriptionIdRef.current = subscriptionId;

        // Store subscription info for debugging
        if (process.env.NODE_ENV !== 'production') {
            __DEBUG_SUBSCRIPTIONS.set(subscriptionId, {
                component: componentName,
                type: eventType,
                createdAt: Date.now()
            });
        }

        // Cleanup subscription on unmount or when deps change
        return () => {
            if (subscriptionIdRef.current) {
                eventBus.unsubscribe(subscriptionIdRef.current);

                // Remove from debug registry
                if (process.env.NODE_ENV !== 'production') {
                    __DEBUG_SUBSCRIPTIONS.delete(subscriptionIdRef.current);
                }

                subscriptionIdRef.current = null;
            }
        };
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps

    // Track mounted status for safety
    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;

            // Extra safety: ensure subscription is cleaned up on unmount
            if (subscriptionIdRef.current) {
                eventBus.unsubscribe(subscriptionIdRef.current);

                // Remove from debug registry
                if (process.env.NODE_ENV !== 'production') {
                    __DEBUG_SUBSCRIPTIONS.delete(subscriptionIdRef.current);
                }

                subscriptionIdRef.current = null;
            }
        };
    }, []);
}

/**
 * Hook to publish events to the event bus
 *
 * @returns Function to publish events
 */
export function useEventPublisher() {
    return useCallback(<T extends EventData = EventData>(
        type: EventType,
        data: T,
        source?: string
    ) => {
        eventBus.publish<T>(type, data, source);
    }, []);
}

/**
 * Hook for both publishing and subscribing to events
 *
 * @returns Object with publish and subscribe functions
 */
export function useEventBus() {
    const publish = useEventPublisher();

    const subscribe = useCallback(<T extends EventData = EventData>(
        type: EventType,
        handler: EventHandler<T>
    ): (() => void) => {
        const subscriptionId = eventBus.subscribe<T>(type, handler);
        return () => eventBus.unsubscribe(subscriptionId);
    }, []);

    return { publish, subscribe };
}

/**
 * Hook to listen for an event and get the latest event data
 *
 * @param eventType Type of event to listen for
 * @returns The latest event data, or null if no event has been received
 */
export function useEventState<T extends EventData = EventData>(eventType: EventType): T | null {
    const [eventData, setEventData] = useState<T | null>(null);

    useEventSubscription<T>(
        eventType,
        (event) => {
            setEventData(event.data);
        },
        [eventType],
        'useEventState'
    );

    return eventData;
}

/**
 * Hook to count events of a specific type
 *
 * @param eventType Type of event to count
 * @returns Number of events received since component mounted
 */
export function useEventCounter(eventType: EventType): number {
    const [count, setCount] = useState(0);

    useEventSubscription(
        eventType,
        () => {
            setCount(prev => prev + 1);
        },
        [eventType],
        'useEventCounter'
    );

    return count;
}

/**
 * Utility for debugging and managing event subscriptions
 */
export function useEventDebug() {
    /**
     * List all active subscriptions for debugging
     */
    const listSubscriptions = useCallback(() => {
        if (process.env.NODE_ENV === 'production') {
            console.warn('Event debugging is disabled in production');
            return 0;
        }

        const subscriptionCount = eventBus.getSubscriberCount();
        console.group(`EventBus Subscriptions (${subscriptionCount} total)`);

        // Group by event type
        const byType = new Map<EventType, string[]>();

        for (const [_id, info] of __DEBUG_SUBSCRIPTIONS) {
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
        if (process.env.NODE_ENV === 'production') {
            console.warn('Event debugging is disabled in production');
            return 0;
        }

        const count = eventBus.getSubscriberCount();

        // Unsubscribe each one
        __DEBUG_SUBSCRIPTIONS.forEach((_, id) => {
            eventBus.unsubscribe(id);
        });

        // Clear tracking
        __DEBUG_SUBSCRIPTIONS.clear();

        console.log(`Cleared ${count} event subscriptions`);
        return count;
    }, []);

    /**
     * Emergency reset for when things get really broken
     */
    const emergencyReset = useCallback(() => {
        if (process.env.NODE_ENV === 'production') {
            console.warn('Event debugging is disabled in production');
            return 0;
        }

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

// Add to window object for console debugging in development
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    (window as any).__eventDebug = {
        listSubscriptions: () => {
            const count = eventBus.getSubscriberCount();
            console.log(`Total subscriptions: ${count}`);
            console.log('Types:', Array.from(new Set(Array.from(__DEBUG_SUBSCRIPTIONS.values()).map(v => v.type))));
            return count;
        },
        clearAll: () => {
            __DEBUG_SUBSCRIPTIONS.forEach((_, id) => eventBus.unsubscribe(id));
            __DEBUG_SUBSCRIPTIONS.clear();
            console.log('All event subscriptions cleared');
        }
    };
}

export default useEventBus;