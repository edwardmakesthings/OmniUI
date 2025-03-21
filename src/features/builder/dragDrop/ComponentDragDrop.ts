import { useComponentStore } from '@/store/componentStore';
import { EntityId } from '@/core/types/EntityTypes';
import { Position } from '@/core/types/Geometry';
import dropZoneManager, { DropPosition } from './DropZone';
import { builderService } from '@/store';

/**
 * Component-specific drag & drop operations.
 * This class centralizes logic for handling component drag & drop within widgets.
 * @path src/features/builder/dragDrop/ComponentDragDrop.ts
 */
export class ComponentDragDrop {
    /**
     * Finds all container components at a specific position
     * @param widgetId The widget containing the containers
     * @param clientX Client X coordinate
     * @param clientY Client Y coordinate
     * @returns Array of container elements sorted by nesting depth (deepest first)
     */
    static findContainersAtPosition(
        widgetId: EntityId,
        clientX: number,
        clientY: number
    ): { id: EntityId, depth: number, element: Element }[] {
        // Use dropZoneManager to find containers
        const container = dropZoneManager.findContainerAtPosition(widgetId, clientX, clientY);
        if (!container) return [];

        // Calculate nesting depth
        let depth = 0;
        let parent = container.element.parentElement;
        while (parent) {
            if (
                parent.hasAttribute("data-component-type") &&
                (parent.getAttribute("data-component-type") === "Panel" ||
                    parent.getAttribute("data-component-type") === "ScrollBox")
            ) {
                depth++;
            }
            parent = parent.parentElement;
        }

        return [{ ...container, depth }];
    }

    /**
     * Adds a component to a container
     * @param widgetId The widget ID
     * @param containerId The container component ID
     * @param definitionId The component definition ID
     * @param position Optional position override
     * @returns The new component ID or null if failed
     */
    static addComponentToContainer(
        widgetId: EntityId,
        containerId: EntityId,
        definitionId: EntityId,
        position: Position = { x: { value: 10, unit: "px" }, y: { value: 10, unit: "px" } }
    ): EntityId | null {
        try {
            // If container is not the widget itself, use addChildComponent
            if (containerId !== widgetId) {
                const result = builderService.addChildComponent(
                    widgetId,
                    containerId,
                    definitionId,
                    position
                );

                return result ? result.id : null;
            } else {
                // Otherwise add directly to the widget
                const result = builderService.addComponentToWidget(
                    widgetId,
                    definitionId,
                    position
                );

                return result ? result.id : null;
            }
        } catch (error) {
            console.error('Error adding component to container:', error);
            return null;
        }
    }

    /**
     * Moves a component to a new container
     * @param widgetId The widget ID
     * @param componentId The component to move
     * @param targetContainerId The target container
     * @returns Success status
     */
    static moveComponentToContainer(
        widgetId: EntityId,
        componentId: EntityId,
        targetContainerId: EntityId
    ): boolean {
        try {
            // Directly update the hierarchy
            return builderService.moveComponent(
                widgetId,
                componentId,
                targetContainerId === widgetId ? undefined : targetContainerId
            );
        } catch (error) {
            console.error('Error moving component:', error);
            return false;
        }
    }

    /**
     * Checks if a component can be a valid container
     * @param componentId The component ID to check
     * @param instanceId The instance ID of the component
     * @returns Whether the component can be a container
     */
    static isValidContainer(instanceId: EntityId): boolean {
        try {
            const componentStore = useComponentStore.getState();
            const instance = componentStore.getInstance(instanceId);

            // Check component type
            return instance.type === 'Panel' || instance.type === 'ScrollBox';
        } catch (error) {
            return false;
        }
    }

    /**
     * Updates a component's position within its container
     * @param widgetId The widget ID
     * @param componentId The component to reorder
     * @param targetComponentId The target component to position relative to
     * @param position Whether to place before or after the target
     * @returns Success status
     */
    static reorderComponents(
        widgetId: EntityId,
        containerId: EntityId,
        componentId: EntityId,
        targetComponentId: EntityId,
        position: 'before' | 'after'
    ): boolean {
        try {
            return builderService.reorderComponents(
                widgetId,
                containerId,
                componentId,
                targetComponentId,
                position
            );
        } catch (error) {
            console.error('Error reordering components:', error);
            return false;
        }
    }

    /**
     * Handles the drop of a component
     * @param e The drag event
     * @param widgetId The widget ID
     * @param position The drop position
     * @param dropPos The drop position type (before/after/inside)
     * @returns Result of the drop operation
     */
    static handleComponentDrop(
        e: DragEvent,
        widgetId: EntityId,
        position: { x: number, y: number },
        dropPos?: DropPosition
    ): { success: boolean, componentId?: EntityId, containerId?: EntityId, position?: DropPosition } {
        try {
            // Get drag data
            const dragData = e.dataTransfer?.getData('application/json');
            if (!dragData) {
                return { success: false };
            }

            const parsedData = JSON.parse(dragData);

            // Find container at drop position
            const containers = this.findContainersAtPosition(widgetId, position.x, position.y);

            // Clear any highlighting from previous operations
            dropZoneManager.clearAllDropStates();

            // No containers found, drop on widget itself
            if (containers.length === 0) {
                // If this is a component definition
                if (parsedData.type === 'component-definition') {
                    const definitionId = parsedData.definitionId || parsedData.id;
                    if (!definitionId) return { success: false };

                    // Add to widget root
                    const newComponent = builderService.addComponentToWidget(
                        widgetId,
                        definitionId,
                        { x: { value: position.x, unit: "px" }, y: { value: position.y, unit: "px" } }
                    );

                    return {
                        success: !!newComponent,
                        componentId: newComponent ? newComponent.id : undefined,
                        containerId: widgetId
                    };
                }
                // If this is an existing component
                else if (parsedData.type === 'component') {
                    const componentId = parsedData.id;
                    if (!componentId) return { success: false };

                    // Move to widget root
                    const success = builderService.moveComponent(widgetId, componentId, widgetId);
                    return { success, componentId, containerId: widgetId };
                }

                return { success: false };
            }

            // Use innermost container (sorted by depth)
            const container = containers[0];

            // Determine drop position if not provided
            const finalDropPos = dropPos || (container.element instanceof HTMLElement
                ? dropZoneManager.calculateDropPosition(
                    container.element as HTMLElement,
                    position.x,
                    position.y,
                    {
                        priorities: [DropPosition.INSIDE, DropPosition.BEFORE, DropPosition.AFTER]
                    }
                )
                : DropPosition.INSIDE);

            // If this is a component definition
            if (parsedData.type === 'component-definition') {
                const definitionId = parsedData.definitionId || parsedData.id;
                if (!definitionId) return { success: false };

                // Handle drop based on position
                if (finalDropPos === DropPosition.INSIDE) {
                    // Add to container
                    const newComponent = builderService.addChildComponent(
                        widgetId,
                        container.id,
                        definitionId
                    );

                    return {
                        success: !!newComponent,
                        componentId: newComponent ? newComponent.id : undefined,
                        containerId: container.id,
                        position: DropPosition.INSIDE
                    };
                } else {
                    // Add to parent and reorder
                    // Get parent container
                    const parentEl = container.element.closest('[data-component-id]');
                    const parentId = parentEl?.getAttribute('data-component-id') as EntityId || widgetId;

                    // Add to widget first
                    const newComponent = builderService.addComponentToWidget(
                        widgetId,
                        definitionId,
                        { x: { value: position.x, unit: "px" }, y: { value: position.y, unit: "px" } }
                    );

                    if (newComponent) {
                        // Move to parent
                        builderService.moveComponent(widgetId, newComponent.id, parentId);

                        // Reorder
                        builderService.reorderComponents(
                            widgetId,
                            parentId,
                            newComponent.id,
                            container.id,
                            finalDropPos === DropPosition.BEFORE ? 'before' : 'after'
                        );

                        return {
                            success: true,
                            componentId: newComponent.id,
                            containerId: parentId,
                            position: finalDropPos
                        };
                    }
                }
            }
            // If this is an existing component
            else if (parsedData.type === 'component') {
                const componentId = parsedData.id;
                if (!componentId) return { success: false };

                // Check if we're trying to drop onto itself
                if (componentId === container.id) {
                    return { success: false };
                }

                // Handle drop based on position
                if (finalDropPos === DropPosition.INSIDE) {
                    // Move to container
                    const success = builderService.moveComponent(widgetId, componentId, container.id);
                    return {
                        success,
                        componentId,
                        containerId: container.id,
                        position: DropPosition.INSIDE
                    };
                } else {
                    // Get parent container
                    const parentEl = container.element.closest('[data-component-id]');
                    const parentId = parentEl?.getAttribute('data-component-id') as EntityId || widgetId;

                    // Move to parent and reorder
                    builderService.moveComponent(widgetId, componentId, parentId);
                    builderService.reorderComponents(
                        widgetId,
                        parentId,
                        componentId,
                        container.id,
                        finalDropPos === DropPosition.BEFORE ? 'before' : 'after'
                    );

                    return {
                        success: true,
                        componentId,
                        containerId: parentId,
                        position: finalDropPos
                    };
                }
            }

            return { success: false };
        } catch (error) {
            console.error('Error handling component drop:', error);
            return { success: false };
        }
    }
}

// Create a singleton instance for simpler access
export const componentDragDrop = new ComponentDragDrop();

// Export default for simpler imports
export default ComponentDragDrop;