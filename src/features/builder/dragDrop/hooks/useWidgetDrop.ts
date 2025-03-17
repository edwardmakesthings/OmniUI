import { DragEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EntityId } from '@/core/types/EntityTypes';
import { useDragAndDrop, useDragDrop, DragSource } from '../DragDropCore';
import { UnitType } from '@/core/types/Measurement';
import { DropPosition } from '../DropZone';
import { builderService } from '@/store';

/**
 * Hook for making a widget a drop target for components
 *
 * @path src/features/builder/dragDrop/hooks/useWidgetDrop.ts
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
    const [isOver, setIsOver] = useState(false);

    // Keep stable reference to callback
    const callbackRef = useRef(onComponentAdded);
    useEffect(() => {
        callbackRef.current = onComponentAdded;
    }, [onComponentAdded]);

    // Handle entering a widget
    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        if (!isEditMode) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
    }, [isEditMode]);

    // Handle leaving a widget
    const handleDragLeave = useCallback(() => {
        setIsOver(false);
    }, []);

    // Handle dropping a component onto a widget
    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
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
                const newComponent = builderService.addComponentToWidget(
                    widgetId,
                    definitionId,
                    position
                );

                // Call the callback if component was created and callback exists
                if (newComponent && callbackRef.current) {
                    callbackRef.current(newComponent.id);
                }

                // Notify that a component was added (for other components that might be listening)
                const event = new CustomEvent('widget-updated', {
                    detail: { widgetId, action: 'component-added' }
                });
                document.dispatchEvent(event);
            }
        } catch (error) {
            console.error('Error handling drop:', error);
        }
    }, [isEditMode, widgetId]);

    // Memoize the props object
    const dropProps = useMemo(() => ({
        onDragOver: handleDragOver,
        onDragLeave: handleDragLeave,
        onDrop: handleDrop,
        'data-widget-id': widgetId,
        'data-edit-mode': isEditMode ? 'true' : 'false',
        className: isOver ? 'drop-target-active' : ''
    }), [handleDragOver, handleDragLeave, handleDrop, widgetId, isEditMode, isOver]);

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
export function useComponentWithinWidgetDragDrop(
    widgetId: EntityId,
    componentId: EntityId,
    componentType: string,
    isEditMode: boolean,
    isContainer: boolean,
    parentId?: EntityId
) {
    const { clearDropIndicators } = useDragDrop();

    // Handle dropping another component onto this one
    const handleDrop = useCallback((source: DragSource, position?: DropPosition) => {
        if (!isEditMode) return;

        // Prevent dropping onto self
        if (source.id === componentId) {
            console.warn('Cannot drop component onto itself');
            return;
        }

        try {
            // If this is a container and the drop is inside
            if (isContainer && position === 'inside') {
                // If dropping a component definition (from panel)
                if (source.type === 'component-definition') {
                    const { definitionId } = source.data;

                    // Create a default position
                    const defaultPosition = {
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
                    builderService.addChildComponent(
                        widgetId,
                        componentId,
                        definitionId,
                        defaultPosition
                    );
                }
                // If dropping an existing component (moving within widget)
                else if (source.type === 'component') {
                    const { id: draggedId } = source.data;

                    // Move component to this container
                    builderService.moveComponent(
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
                    const newComponent = builderService.addComponentToWidget(
                        widgetId,
                        definitionId,
                        { x: { value: 10, unit: "px" }, y: { value: 10, unit: "px" } }
                    );

                    if (newComponent) {
                        // Update parent
                        builderService.moveComponent(
                            widgetId,
                            newComponent.id,
                            parentId
                        );

                        // Reorder components
                        builderService.reorderComponents(
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
                    builderService.moveComponent(
                        widgetId,
                        draggedId,
                        parentId
                    );

                    // Reorder components
                    builderService.reorderComponents(
                        widgetId,
                        parentId || `${widgetId}-root` as EntityId,
                        draggedId,
                        componentId,
                        position as 'before' | 'after'
                    );
                }
            }
        } catch (error) {
            console.error('Error handling component drop:', error);
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
        widgetId, parentId, clearDropIndicators
    ]);

    // Available drop positions based on component type
    const availablePositions = isContainer
        ? [DropPosition.BEFORE, DropPosition.AFTER, DropPosition.INSIDE]
        : [DropPosition.BEFORE, DropPosition.AFTER];

    // Set up drag and drop with specified allowed positions
    const {
        elementProps,
        isDragging,
        isOver,
        dropPosition,
        canDrop,
        elementRef
    } = useDragAndDrop(
        'component',
        componentId,
        { id: componentId, widgetId, componentType, parentId },
        ['component-definition', 'component'],
        handleDrop,
        {
            dragDisabled: !isEditMode,
            dropDisabled: !isEditMode,
            positions: availablePositions
        }
    );

    // Enhanced props with more specific CSS classes and data attributes
    const enhancedProps = useMemo(() => ({
        ...elementProps,
        'data-component-id': componentId,
        'data-component-type': componentType,
        'data-widget-id': widgetId,
        'data-is-container': isContainer ? 'true' : 'false',
        'data-parent-id': parentId || '',
        'data-drop-position': dropPosition || '',
        className: `component-container ${elementProps.className || ''} ${isDragging ? 'dragging-component' : ''
            } ${isOver ? 'drop-target' : ''} ${isContainer ? 'container-component' : ''
            } component-type-${componentType.toLowerCase()}`
    }), [
        elementProps,
        componentId,
        componentType,
        widgetId,
        isContainer,
        parentId,
        dropPosition,
        isDragging,
        isOver
    ]);

    return {
        dragDropProps: enhancedProps,
        isDragging,
        isOver,
        dropPosition,
        canDrop,
        elementRef
    };
}