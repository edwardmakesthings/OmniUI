import { ComponentDragData, useDraggable } from '../DragDropCore';
import { EntityId } from '@/core/types/EntityTypes';

/**
 * Extended ComponentDragData for component definitions from palette
 * This allows component definitions to be dragged without requiring a widgetId
 */
export interface ComponentDefinitionDragData extends Partial<ComponentDragData> {
    id: EntityId;
    definitionId: EntityId;
    componentType: string;
    label: string;
    type: 'component-definition';
    // widgetId is optional for component definitions from palette
}

/**
 * Hook for making component panels draggable from the component palette
 *
 * @param componentDefinitionId The component definition ID
 * @param componentType The component type
 * @param componentLabel Display label
 * @returns Drag props and state
 */
export function useComponentPanelDrag(
    componentDefinitionId: EntityId,
    componentType: string,
    componentLabel: string
) {
    // Set up draggable with the component definition data
    const { dragProps, isDragging, elementRef } = useDraggable(
        'component-definition',
        componentDefinitionId,
        {
            id: componentDefinitionId, // Required by ComponentDragData
            widgetId: 'palette' as EntityId,
            type: 'component-definition',
            definitionId: componentDefinitionId,
            componentType,
            label: componentLabel
        }
    );

    // Remove the data-source-widget-id attribute since it's not relevant for palette items
    const { 'data-source-widget-id': _, ...cleanDragProps } = dragProps;

    return {
        dragProps: cleanDragProps,
        isDragging,
        elementRef
    };
}

/**
 * Hook for making component instances draggable within a widget
 *
 * @param widgetId The widget ID
 * @param componentId The component ID
 * @param componentType The component type
 * @param isEditMode Whether the widget is in edit mode
 * @param parentId Optional parent component ID
 * @returns Drag props and dragging state
 */
export function useComponentWidgetDrag(
    widgetId: EntityId,
    componentId: EntityId,
    componentType: string,
    isEditMode: boolean,
    parentId?: EntityId
) {
    // Set up draggable with component instance data
    const { dragProps, isDragging, elementRef } = useDraggable(
        'component',
        componentId,
        {
            id: componentId,
            widgetId, // Real widget ID for actual components
            componentType,
            parentId, // Include parent ID for hierarchy drag operations
            type: 'component'
        },
        {
            disabled: !isEditMode,
            crossWidgetEnabled: true // Enable cross-widget dragging
        }
    );

    // Add a CSS class for dragging state
    const enhancedDragProps = {
        ...dragProps,
        className: `${dragProps.className || ''} ${isDragging ? 'dragging-component' : ''}`,
        'data-component-id': componentId,
        'data-widget-id': widgetId,
        'data-component-type': componentType,
        'data-edit-mode': isEditMode ? 'true' : 'false'
    };

    return {
        dragProps: enhancedDragProps,
        isDragging,
        elementRef
    };
}

export default {
    useComponentPanelDrag,
    useComponentWidgetDrag
};