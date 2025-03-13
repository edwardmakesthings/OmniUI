import { EntityId } from '../types/EntityTypes';

/**
 * Notification types for widget changes
 */
export type WidgetChangeType = 'componentAdded' | 'componentRemoved' | 'componentUpdated' | 'hierarchyChanged' | 'widgetUpdated';

/**
 * Centralizes notification of widget changes to ensure all interested components are notified
 * @param widgetId The ID of the widget that changed
 * @param changeType The type of change that occurred
 */
export function notifyWidgetChange(widgetId: EntityId, changeType: WidgetChangeType): void {
    console.log(`Notifying widget change: ${changeType} for widget ${widgetId}`);

    // Create the event details
    const eventDetail = {
        widgetId,
        changeType,
        timestamp: Date.now()
    };

    // Create custom events - use multiple event types to ensure all listeners are notified
    const widgetUpdatedEvent = new CustomEvent('widget-updated', {
        detail: eventDetail,
        bubbles: true
    });

    const hierarchyChangedEvent = new CustomEvent('component-hierarchy-changed', {
        detail: eventDetail,
        bubbles: true
    });

    // Dispatch to layout hierarchy panel specifically
    const layoutPanel = document.querySelector('[data-panel-id="layout-hierarchy"]');
    if (layoutPanel) {
        console.log('Dispatching to layout hierarchy panel directly');
        layoutPanel.dispatchEvent(widgetUpdatedEvent);
        layoutPanel.dispatchEvent(hierarchyChangedEvent);
    }

    // Also dispatch at document level as fallback
    document.dispatchEvent(widgetUpdatedEvent);
    document.dispatchEvent(hierarchyChangedEvent);

    // Try to notify via global store if available (for React components that don't use DOM events)
    if (window._layoutHierarchyStore && window._layoutHierarchyStore.refreshView) {
        console.log('Notifying layout hierarchy store via global reference');
        window._layoutHierarchyStore.refreshView();
    }
}

/**
 * Enhanced debug version that logs component data
 * @param widgetId The ID of the widget that changed
 * @param changeType The type of change that occurred
 * @param componentData Optional component data for debugging
 */
export function debugNotifyWidgetChange(
    widgetId: EntityId,
    changeType: WidgetChangeType,
    componentData?: any
): void {
    console.group(`Widget Update: ${changeType}`);
    console.log(`Widget ID: ${widgetId}`);
    if (componentData) {
        console.log('Component data:', componentData);
    }
    console.groupEnd();

    notifyWidgetChange(widgetId, changeType);
}

/**
 * Helper to ensure the Layout Panel is properly registered for event notification
 * Should be called when the Layout Panel is mounted
 */
export function registerLayoutPanelForEvents(): void {
    // Find the panel element
    const panelElement = document.querySelector('.layout-hierarchy-panel');
    if (!panelElement) {
        console.warn('Layout hierarchy panel not found for event registration');
        return;
    }

    // Set panel ID data attribute for event targeting
    panelElement.setAttribute('data-panel-id', 'layout-hierarchy');
    console.log('Layout hierarchy panel registered for events');
}