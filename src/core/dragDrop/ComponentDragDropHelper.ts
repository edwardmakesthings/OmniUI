import { useComponentStore } from '@/store/componentStore';
import { useWidgetStore } from '@/store/widgetStore';
import { EntityId } from '@/core/types/EntityTypes';
import { Position } from '../types/Geometry';

/**
 * Helper for component drag & drop operations
 * This centralizes logic for finding containers and updating hierarchies
 */
export class ComponentDragDropHelper {
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
        // Query for all container elements in the widget
        const containerElements = document.querySelectorAll(
            `[data-widget-id="${widgetId}"] [data-component-type="Panel"], [data-widget-id="${widgetId}"] [data-component-type="ScrollBox"]`
        );

        const potentialContainers: Array<{
            id: EntityId;
            depth: number;
            element: Element;
        }> = [];

        // Check which containers the pointer is over
        containerElements.forEach((element) => {
            const rect = element.getBoundingClientRect();

            // Check if point is inside rectangle
            if (
                clientX >= rect.left &&
                clientX <= rect.right &&
                clientY >= rect.top &&
                clientY <= rect.bottom
            ) {
                // Get container ID
                const containerId = element.getAttribute("data-component-id");
                if (!containerId) return;

                // Calculate nesting depth
                let depth = 0;
                let parent = element.parentElement;
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

                potentialContainers.push({
                    id: containerId as EntityId,
                    depth,
                    element,
                });
            }
        });

        // Sort by depth (innermost first)
        return potentialContainers.sort((a, b) => b.depth - a.depth);
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
        position = { x: { value: 10, unit: "px" }, y: { value: 10, unit: "px" } }
    ): EntityId | null {
        try {
            const widgetStore = useWidgetStore.getState();

            // If container is not the widget itself, use addChildComponent
            if (containerId !== widgetId) {
                const result = widgetStore.addChildComponent(
                    widgetId,
                    containerId,
                    definitionId,
                    position as Position
                );

                return result ? result.id : null;
            } else {
                // Otherwise add directly to the widget
                const result = widgetStore.addComponentToWidget(
                    widgetId,
                    definitionId,
                    position as Position
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
            const widgetStore = useWidgetStore.getState();

            // Directly update the hierarchy
            widgetStore.moveComponent(
                widgetId,
                componentId,
                targetContainerId === widgetId ? undefined : targetContainerId
            );

            return true;
        } catch (error) {
            console.error('Error moving component:', error);
            return false;
        }
    }

    /**
     * Checks if a container can accept a component
     */
    static isValidContainer(componentId: EntityId, instanceId: EntityId): boolean {
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
     * Handles the drop of a component
     * @param e The drag event
     * @param widgetId The widget ID
     * @param position The drop position
     * @returns Result of the drop operation
     */
    static handleComponentDrop(
        e: DragEvent,
        widgetId: EntityId,
        position: { x: number, y: number }
    ): { success: boolean, componentId?: EntityId, containerId?: EntityId } {
        try {
            // Get drag data
            const dragData = e.dataTransfer?.getData('application/json');
            if (!dragData) {
                return { success: false };
            }

            const parsedData = JSON.parse(dragData);

            // Find potential containers at drop position
            const containers = this.findContainersAtPosition(widgetId, position.x, position.y);

            // Clear any highlighting from previous operations
            document.querySelectorAll(".drop-highlight").forEach(el => {
                el.classList.remove("drop-highlight");
            });

            // No containers found, drop on widget itself
            if (containers.length === 0) {
                // If this is a component definition
                if (parsedData.type === 'component-definition') {
                    const definitionId = parsedData.definitionId || parsedData.id;
                    if (!definitionId) return { success: false };

                    // Add to widget root
                    const newCompId = this.addComponentToContainer(
                        widgetId,
                        widgetId,
                        definitionId,
                        { x: { value: position.x, unit: "px" }, y: { value: position.y, unit: "px" } }
                    );

                    return {
                        success: !!newCompId,
                        componentId: newCompId as EntityId,
                        containerId: widgetId
                    };
                }
                // If this is an existing component
                else if (parsedData.type === 'component') {
                    const componentId = parsedData.id;
                    if (!componentId) return { success: false };

                    // Move to widget root
                    const success = this.moveComponentToContainer(widgetId, componentId, widgetId);
                    return { success, componentId, containerId: widgetId };
                }

                return { success: false };
            }

            // Use innermost container (sorted by depth)
            const container = containers[0];

            // If this is a component definition
            if (parsedData.type === 'component-definition') {
                const definitionId = parsedData.definitionId || parsedData.id;
                if (!definitionId) return { success: false };

                // Add to container
                const newCompId = this.addComponentToContainer(
                    widgetId,
                    container.id,
                    definitionId
                );

                return {
                    success: !!newCompId,
                    componentId: newCompId as EntityId,
                    containerId: container.id
                };
            }
            // If this is an existing component
            else if (parsedData.type === 'component') {
                const componentId = parsedData.id;
                if (!componentId) return { success: false };

                // Check if we're trying to drop onto itself
                if (componentId === container.id) {
                    return { success: false };
                }

                // Move to container
                const success = this.moveComponentToContainer(widgetId, componentId, container.id);
                return { success, componentId, containerId: container.id };
            }

            return { success: false };
        } catch (error) {
            console.error('Error handling component drop:', error);
            return { success: false };
        }
    }

    /**
     * Adds a CSS class to highlight drop targets
     * @param element The element to highlight
     * @param addClass Whether to add or remove the highlight
     */
    static highlightDropTarget(element: Element | null, addClass: boolean): void {
        if (!element) return;

        if (addClass) {
            element.classList.add('drop-highlight');
        } else {
            element.classList.remove('drop-highlight');
        }
    }

    /**
     * Creates and positions a drop indicator
     * @param target The target element
     * @param position The indicator position
     * @returns The created indicator element
     */
    static createDropIndicator(
        target: HTMLElement,
        position: 'before' | 'after' | 'inside'
    ): HTMLElement {
        // Remove any existing indicators
        document.querySelectorAll('.drop-indicator').forEach(el => el.remove());

        const indicator = document.createElement('div');
        indicator.classList.add('drop-indicator');

        // Set position-specific styles
        if (position === 'inside') {
            indicator.classList.add('drop-indicator-inside');

            // Absolute positioning for "inside" indicator
            indicator.style.position = 'absolute';
            indicator.style.inset = '0';
            indicator.style.zIndex = '1000';
            indicator.style.pointerEvents = 'none';

            target.appendChild(indicator);
        } else {
            // Create a line indicator for before/after
            indicator.classList.add('drop-indicator-horizontal');
            indicator.style.position = 'absolute';
            indicator.style.left = '0';
            indicator.style.right = '0';
            indicator.style.height = '4px';
            indicator.style.zIndex = '1000';
            indicator.style.pointerEvents = 'none';

            if (position === 'before') {
                indicator.style.top = '0';
                target.parentElement?.insertBefore(indicator, target);
            } else {
                indicator.style.bottom = '0';
                target.parentElement?.insertBefore(indicator, target.nextSibling);
            }
        }

        return indicator;
    }
}