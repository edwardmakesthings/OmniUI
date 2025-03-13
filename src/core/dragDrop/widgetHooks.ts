import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EntityId } from '@/core/types/EntityTypes';
import { useDraggable, useDroppable, useDragAndDrop, useDragDrop, DragSource } from './DragDropManager';
import { useWidgetStore } from '@/store/widgetStore';
import { UnitType } from '@/core/types/Measurement';

/**
 * Hook for making component panels draggable
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
    // Set up draggable
    const { dragProps, isDragging } = useDraggable(
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
        isDragging
    };
}

/**
 * Hook for making a widget a drop target for components
 * @param widgetId The widget ID
 * @param isEditMode Whether the widget is in edit mode
 * @param onComponentAdded Callback when a component is added
 * @returns Drop props and state
 */
export function useWidgetDropTarget(
    widgetId: EntityId,
    isEditMode: boolean,
    onComponentAdded?: (componentId: EntityId) => void
) {
    const widgetStore = useWidgetStore();
    const [isOver, setIsOver] = useState(false);

    // Keep stable reference to callback
    const callbackRef = useRef(onComponentAdded);
    useEffect(() => {
        callbackRef.current = onComponentAdded;
    }, [onComponentAdded]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        if (!isEditMode) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
    }, [isEditMode]);

    const handleDragLeave = useCallback(() => {
        setIsOver(false);
    }, []);

    // Handle dropping a component onto a widget
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        if (!isEditMode) return;
        e.preventDefault();
        setIsOver(false);

        try {
            const dragData = e.dataTransfer.getData('application/json');
            if (!dragData) {
                console.warn('No drag data found');
                return;
            }

            const parsedData = JSON.parse(dragData);

            // Check if this is a component definition being dragged
            if (parsedData.type === 'component-definition') {
                // Extract the definition ID, being careful about potential formats
                let definitionId;

                // Check various possible locations for the definition ID
                if (parsedData.definitionId) {
                    definitionId = parsedData.definitionId;
                } else if (parsedData.id) {
                    // Fallback to id if definitionId isn't available
                    definitionId = parsedData.id;
                } else if (parsedData.data && parsedData.data.definitionId) {
                    // Check if definitionId is nested in data
                    definitionId = parsedData.data.definitionId;
                }

                // Validate we have a definition ID before proceeding
                if (!definitionId) {
                    console.error('Missing definition ID in drag data:', parsedData);
                    return;
                }

                // Get mouse coordinates for drop position
                const dropPosition = {
                    x: e.nativeEvent.offsetX,
                    y: e.nativeEvent.offsetY
                };

                // Create position for component
                const position = {
                    x: { value: dropPosition.x, unit: 'px' as UnitType },
                    y: { value: dropPosition.y, unit: 'px' as UnitType }
                };

                // Add the component to the widget
                const newComponent = widgetStore.addComponentToWidget(
                    widgetId,
                    definitionId,
                    position
                );

                // Call the callback if component was created and callback exists
                if (newComponent && callbackRef.current) {
                    callbackRef.current(newComponent.id);
                }
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    }, [isEditMode, widgetId, widgetStore]);

    // Memoize the props object
    const dropProps = useMemo(() => ({
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop
    }), [handleDragOver, handleDragLeave, handleDrop]);

    return { dropProps, isOver };
}

/**
 * Hook for component drag and drop within widgets
 * @param widgetId The widget ID
 * @param componentId The component ID
 * @param componentType The component type
 * @param isEditMode Whether edit mode is enabled
 * @param isContainer Whether this is a container type
 * @param parentId Optional parent component ID
 * @returns Drag and drop props and state
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
                const newComponent = widgetStore.addComponentToWidget(
                    widgetId,
                    definitionId,
                    { x: { value: 10, unit: "px" }, y: { value: 10, unit: "px" } }
                );

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

        // Trigger layout hierarchy update
        const layoutHierarchyPanel = document.querySelector('[data-panel-id="layout-hierarchy"]');
        if (layoutHierarchyPanel) {
            const event = new CustomEvent('widget-updated', {
                detail: { widgetId }
            });
            layoutHierarchyPanel.dispatchEvent(event);
        }
    }, [
        isEditMode, isContainer, componentId,
        widgetId, parentId, widgetStore, clearDropIndicators
    ]);

    // Set up drag and drop with specified allowed positions
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