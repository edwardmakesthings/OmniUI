/**
 * Event Bus System
 *
 * This module provides a centralized event bus for application-wide communication
 * between components. It supports typed events, subscription management, and
 * event history for debugging.
 */

// Event types for strong typing
export type EventType =
    | 'component:selected'
    | 'component:deselected'
    | 'component:added'
    | 'component:deleted'
    | 'component:moved'
    | 'component:updated'
    | 'component:reordered'
    | 'component:info'
    | 'component:getInfo'
    | 'component:instanceNotFound'
    | 'component:instanceRepaired'
    | 'hierarchy:changed'
    | 'widget:created'
    | 'widget:updated'
    | 'widget:deleted'
    | 'widget:selected'
    | 'widget:deselected'
    | 'layout:refreshed'
    | 'ui:panel:toggled'
    | 'store:reset'
    | 'drag:started'
    | 'drag:ended'
    | 'drop:occurred';

// Generic event data interface
export interface EventData {
    [key: string]: any;
}

// Event object interface
export interface Event<T extends EventData = EventData> {
    type: EventType;
    data: T;
    timestamp: number;
    source?: string; // Component that dispatched the event
}

// Event handler type
export type EventHandler<T extends EventData = EventData> = (event: Event<T>) => void;

// Interface for subscription management
interface Subscription {
    id: string;
    type: EventType;
    handler: EventHandler;
}

/**
 * Central event bus for application-wide events
 */
class EventBus {
    private static instance: EventBus;

    // For storing all active subscriptions
    private subscriptions: Map<string, Subscription> = new Map();

    // For tracking recent events (useful for debugging)
    private eventHistory: Event[] = [];
    private maxHistoryLength: number = 100;

    // Debug mode flag
    private debug: boolean = false;

    /**
     * Get the singleton instance of EventBus
     */
    public static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    /**
     * Private constructor for singleton pattern
     */
    private constructor() {
        // Initialize if needed
    }

    /**
     * Enable or disable debug mode
     * @param enable Whether to enable debug mode
     */
    public setDebugMode(enable: boolean): void {
        this.debug = enable;
    }

    /**
     * Subscribe to an event type
     * @param type Event type to subscribe to
     * @param handler Callback function to handle the event
     * @returns Subscription ID that can be used to unsubscribe
     */
    public subscribe<T extends EventData = EventData>(
        type: EventType,
        handler: EventHandler<T>
    ): string {
        const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        this.subscriptions.set(id, {
            id,
            type,
            handler: handler as EventHandler
        });

        if (this.debug) {
            console.log(`[EventBus] New subscription to ${type}, ID: ${id}`);
        }

        return id;
    }

    /**
     * Unsubscribe from an event using subscription ID
     * @param subscriptionId Subscription ID returned from subscribe()
     * @returns True if unsubscription was successful
     */
    public unsubscribe(subscriptionId: string): boolean {
        const result = this.subscriptions.delete(subscriptionId);

        if (this.debug) {
            console.log(`[EventBus] Unsubscribed ${subscriptionId}, success: ${result}`);
        }

        return result;
    }

    /**
     * Publish an event to all subscribers
     * @param type Type of the event
     * @param data Event data
     * @param source Optional source identifier
     */
    public publish<T extends EventData = EventData>(
        type: EventType,
        data: T,
        source?: string
    ): void {
        const event: Event<T> = {
            type,
            data,
            timestamp: Date.now(),
            source
        };

        // Store in history
        this.eventHistory.unshift(event);
        if (this.eventHistory.length > this.maxHistoryLength) {
            this.eventHistory.pop();
        }

        // Find all matching subscriptions and notify
        this.notifySubscribers(event);

        if (this.debug) {
            console.log(`[EventBus] Published event: ${type}`, data);
        }
    }

    /**
     * Notify all subscribers of an event
     * @param event Event object to publish
     */
    private notifySubscribers<T extends EventData = EventData>(event: Event<T>): void {
        for (const subscription of this.subscriptions.values()) {
            if (subscription.type === event.type) {
                try {
                    subscription.handler(event as Event);
                } catch (error) {
                    console.error(`[EventBus] Error in event handler for ${event.type}:`, error);
                }
            }
        }
    }

    /**
     * Get recent event history for debugging
     * @param limit Maximum number of events to return
     * @param type Optional filter by event type
     * @returns Array of recent events
     */
    public getEventHistory(limit: number = 10, type?: EventType): Event[] {
        let history = [...this.eventHistory];

        if (type) {
            history = history.filter(event => event.type === type);
        }

        return history.slice(0, limit);
    }

    /**
     * Clear event history
     */
    public clearEventHistory(): void {
        this.eventHistory = [];
    }

    /**
     * Get count of subscribers by event type
     * @param type Optional event type to filter by
     * @returns Count of subscribers
     */
    public getSubscriberCount(type?: EventType): number {
        if (type) {
            return [...this.subscriptions.values()].filter(sub => sub.type === type).length;
        }
        return this.subscriptions.size;
    }
}

// Export singleton instance
export const eventBus = EventBus.getInstance();

// Default export for simpler imports
export default eventBus;