import { useEffect, useRef, useState, useCallback } from 'react';
import eventBus, { EventType, EventData, Event, EventHandler } from '@/core/eventBus/eventBus';

/**
 * Hook to subscribe to events from the event bus
 *
 * @param eventType Type of event to subscribe to
 * @param handler Event handler function
 * @param deps Dependencies array (similar to useEffect)
 */
export function useEventSubscription<T extends EventData = EventData>(
    eventType: EventType,
    handler: EventHandler<T>,
    deps: React.DependencyList = []
): void {
    // Keep handler in ref to avoid unnecessary resubscriptions
    const handlerRef = useRef(handler);

    // Update handler ref when it changes
    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        // Create a stable handler that uses the current ref
        const stableHandler: EventHandler<T> = (event: Event<T>) => {
            handlerRef.current(event);
        };

        // Subscribe to the event
        const subscriptionId = eventBus.subscribe<T>(eventType, stableHandler);

        // Cleanup subscription on unmount or when deps change
        return () => {
            eventBus.unsubscribe(subscriptionId);
        };
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
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
        [eventType]
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
        [eventType]
    );

    return count;
}

export default useEventBus;