import { useDraggable } from '../DragDropCore';
import { EntityId } from '@/core/types/EntityTypes';

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
            type: 'component-definition',
            definitionId: componentDefinitionId,
            componentType,
            label: componentLabel
        }
    );

    return {
        dragProps,
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
 * @returns Drag props and dragging state
 */
export function useComponentWidgetDrag(
    widgetId: EntityId,
    componentId: EntityId,
    componentType: string,
    isEditMode: boolean
) {
    // Set up draggable with component instance data
    const { dragProps, isDragging, elementRef } = useDraggable(
        'component',
        componentId,
        {
            id: componentId,
            widgetId,
            componentType,
            type: 'component'
        },
        {
            disabled: !isEditMode
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