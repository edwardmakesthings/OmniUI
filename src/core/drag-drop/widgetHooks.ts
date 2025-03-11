import { useCallback } from 'react';
import { EntityId } from '@/core/types/EntityTypes';
import { useDraggable, useDroppable, useDragAndDrop, useDragDrop, DragSource } from './DragDropManager';
import { useWidgetStore } from '@/store/widgetStore';
import { UnitType } from '@/core/types/Measurement';

/**
 * Hook for dragging components from component panel
 */
export function useComponentPanelDrag(
    componentDefinitionId: EntityId,
    componentType: string,
    componentLabel: string
) {
    // Set up draggable
    const { dragProps, isDragging } = useDraggable(
        'component-definition',
        componentDefinitionId,
        {
            definitionId: componentDefinitionId,
            type: 'component-definition',
            componentType,
            label: componentLabel
        }
    );

    return {
        dragProps,
        isDragging
    };
}

/**
 * Hook for making a widget a drop target for components
 */
export function useWidgetDropTarget(
    widgetId: EntityId,
    isEditMode: boolean,
    onComponentAdded?: (componentId: EntityId) => void
) {
    const widgetStore = useWidgetStore();

    // Handle dropping a component onto a widget
    const handleDrop = useCallback((source: DragSource) => {
        if (!isEditMode) return;

        console.log('Widget drop:', source);

        // If dropping a component definition (from panel)
        if (source.type === 'component-definition') {
            const { definitionId } = source.data;

            // Create a default position
            const position = {
                x: {
                    value: 20,
                    unit: "px" as UnitType,
                },
                y: {
                    value: 20,
                    unit: "px" as UnitType,
                },
            };

            // Add component to widget
            const newComponent = widgetStore.addComponentToWidget(
                widgetId,
                definitionId,
                position
            );

            // Notify parent
            if (newComponent && onComponentAdded) {
                onComponentAdded(newComponent.id);
            }
        }
    }, [isEditMode, widgetId, widgetStore, onComponentAdded]);

    // Set up droppable
    const { dropProps, isOver, canDrop } = useDroppable(
        'widget',
        widgetId,
        ['component-definition', 'component'],
        handleDrop,
        { disabled: !isEditMode }
    );

    return {
        dropProps,
        isOver,
        canDrop
    };
}

/**
 * Hook for dragging and dropping components within a widget
 */
export function useComponentDragDrop(
    widgetId: EntityId,
    componentId: EntityId,
    componentType: string,
    isEditMode: boolean,
    isContainer: boolean,
    parentId?: EntityId
) {
    const widgetStore = useWidgetStore();
    const { clearDropIndicators } = useDragDrop();

    // Handle dropping another component onto this one
    const handleDrop = useCallback((source: DragSource, position?: string) => {
        if (!isEditMode) return;

        console.log('Component drop:', source, 'position:', position);

        // Prevent dropping onto self
        if (source.id === componentId) {
            console.log('Cannot drop component onto itself');
            return;
        }

        // If this is a container and the drop is inside
        if (isContainer && position === 'inside') {
            // If dropping a component definition (from panel)
            if (source.type === 'component-definition') {
                const { definitionId } = source.data;

                // Create a default position
                const position = {
                    x: {
                        value: 10,
                        unit: "px" as UnitType,
                    },
                    y: {
                        value: 10,
                        unit: "px" as UnitType,
                    },
                };

                // Add as child of this container
                widgetStore.addChildComponent(
                    widgetId,
                    componentId,
                    definitionId,
                    position
                );
            }
            // If dropping an existing component (moving within widget)
            else if (source.type === 'component') {
                const { id: draggedId } = source.data;

                // Move component to this container
                widgetStore.moveComponent(
                    widgetId,
                    draggedId,
                    componentId
                );
            }
        }
        // If the drop is before/after
        else if (position === 'before' || position === 'after') {
            // If dropping a component definition (from panel)
            if (source.type === 'component-definition') {
                const { definitionId } = source.data;

                // Add to the same parent and reorder
                widgetStore.addComponentToWidget(
                    widgetId,
                    definitionId,
                    { x: { value: 10, unit: "px" }, y: { value: 10, unit: "px" } }
                )?.then(newComponent => {
                    if (newComponent) {
                        // Update parent
                        widgetStore.moveComponent(
                            widgetId,
                            newComponent.id,
                            parentId
                        );

                        // Reorder components
                        widgetStore.reorderComponents(
                            widgetId,
                            parentId || `${widgetId}-root` as EntityId,
                            newComponent.id,
                            componentId,
                            position as 'before' | 'after'
                        );
                    }
                });
            }
            // If dropping an existing component (moving within widget)
            else if (source.type === 'component') {
                const { id: draggedId } = source.data;

                // Move to the same parent
                widgetStore.moveComponent(
                    widgetId,
                    draggedId,
                    parentId
                );

                // Reorder components
                widgetStore.reorderComponents(
                    widgetId,
                    parentId || `${widgetId}-root` as EntityId,
                    draggedId,
                    componentId,
                    position as 'before' | 'after'
                );
            }
        }

        // Clean up
        clearDropIndicators();
    }, [
        isEditMode, isContainer, componentId,
        widgetId, parentId, widgetStore, clearDropIndicators
    ]);

    // Set up drag and drop
    const { elementProps, isDragging, isOver, canDrop } = useDragAndDrop(
        'component',
        componentId,
        { id: componentId, widgetId, componentType, parentId },
        ['component-definition', 'component'],
        handleDrop,
        {
            dragDisabled: !isEditMode,
            dropDisabled: !isEditMode,
            positions: isContainer ?
                ['before', 'after', 'inside'] :
                ['before', 'after']
        }
    );

    return {
        dragDropProps: elementProps,
        isDragging,
        isOver,
        canDrop
    };
}