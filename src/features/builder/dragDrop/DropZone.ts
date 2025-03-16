import { EntityId } from '@/core/types/EntityTypes';
import { DropTarget } from './DragDropCore';

/**
 * Enumeration of possible drop positions
 */
export enum DropPosition {
    BEFORE = 'before',
    AFTER = 'after',
    INSIDE = 'inside',
}

/**
 * Interface for a drop zone configuration
 */
export interface DropZoneConfig {
    targetId: EntityId;
    element: HTMLElement;
    isContainer: boolean;
    positions: DropPosition[];
}

/**
 * Manager for drop zone indicators during drag and drop operations.
 * Centralizes all DOM manipulations related to drop zones.
 */
export class DropZoneManager {
    private static instance: DropZoneManager;
    private activeElements: Map<EntityId, { element: HTMLElement, activePosition: DropPosition | null }> = new Map();
    private indicators: Map<string, HTMLElement> = new Map();

    /**
     * Get the singleton instance of the DropZoneManager
     */
    public static getInstance(): DropZoneManager {
        if (!DropZoneManager.instance) {
            DropZoneManager.instance = new DropZoneManager();
        }
        return DropZoneManager.instance;
    }

    /**
     * Private constructor
     */
    private constructor() { }

    /**
     * Creates a DropZoneConfig from a DropTarget. The DropTarget must have an
     * element set. The positions of the drop zone are determined by the
     * positions property of the DropTarget, or by default will be set to
     * [DropPosition.INSIDE]. The isContainer property of the DropZoneConfig
     * is determined by whether DropPosition.INSIDE is in the positions
     * array.
     * @param target The DropTarget to create the DropZoneConfig from
     * @returns A DropZoneConfig
     */
    public createDropZoneConfigFromTarget(target: DropTarget): DropZoneConfig | null {
        if (!target.element) {
            console.warn('Cannot create DropZoneConfig from DropTarget without element');
            return null;
        }

        const positions = target.positions || [DropPosition.INSIDE];

        return {
            targetId: target.id,
            element: target.element,
            positions,
            isContainer: positions.includes(DropPosition.INSIDE)
        };
    }

    /**
   * Set the target element's drop position state
   * Creates indicators if they don't exist yet
   */
    public setDropPosition(
        targetId: EntityId,
        element: HTMLElement,
        position: DropPosition | null,
        isContainer: boolean
    ): void {
        // Register the element if it's not already tracked
        if (!this.activeElements.has(targetId)) {
            this.activeElements.set(targetId, {
                element,
                activePosition: null
            });

            // Create indicators for this element
            this.createIndicatorsForElement(targetId, element, isContainer);
        }

        const tracked = this.activeElements.get(targetId);
        if (!tracked) return;

        // If position is unchanged, do nothing
        if (tracked.activePosition === position) return;

        // Update position
        tracked.activePosition = position;

        // Update element data attributes for CSS styling
        this.updateElementAttributes(element, position);

        // Show/hide appropriate indicators
        this.updateIndicatorVisibility(targetId, position);
    }

    /**
     * Create indicator elements for a target
     */
    private createIndicatorsForElement(
        targetId: EntityId,
        element: HTMLElement,
        isContainer: boolean
    ): void {
        // Remove any existing indicators first
        this.cleanupTarget(targetId);

        // Create before indicator
        const beforeIndicator = this.createDropIndicator(element, DropPosition.BEFORE);
        if (beforeIndicator) {
            this.indicators.set(`${targetId}-${DropPosition.BEFORE}`, beforeIndicator);
            element.appendChild(beforeIndicator);
        }

        // Create after indicator
        const afterIndicator = this.createDropIndicator(element, DropPosition.AFTER);
        if (afterIndicator) {
            this.indicators.set(`${targetId}-${DropPosition.AFTER}`, afterIndicator);
            element.appendChild(afterIndicator);
        }

        // Create inside indicator only for containers
        if (isContainer) {
            const insideIndicator = this.createDropIndicator(element, DropPosition.INSIDE);
            if (insideIndicator) {
                this.indicators.set(`${targetId}-${DropPosition.INSIDE}`, insideIndicator);
                element.appendChild(insideIndicator);
            }
        }

        // Initially hide all indicators
        this.updateIndicatorVisibility(targetId, null);
    }

    /**
     * Create a single indicator element for a specific position
     */
    public createDropIndicator(
        element: HTMLElement,
        position: DropPosition,
        highlightClass?: string
    ): HTMLElement | null {
        // Create the indicator element
        const indicator = document.createElement('div');
        indicator.className = `drop-indicator drop-indicator-${position} ${highlightClass || ''}`;

        // Set position-specific styles
        indicator.style.position = 'absolute';
        indicator.style.pointerEvents = 'none';
        indicator.style.zIndex = '1000';
        indicator.style.transition = 'opacity 0.15s ease';

        // Position-specific styling
        switch (position) {
            case DropPosition.BEFORE:
                indicator.style.top = '0';
                indicator.style.left = '0';
                indicator.style.right = '0';
                indicator.style.height = '4px';
                indicator.style.backgroundColor = '#3b82f6';
                indicator.style.borderRadius = '2px';
                indicator.style.boxShadow = '0 0 3px rgba(59, 130, 246, 0.5)';
                break;
            case DropPosition.AFTER:
                indicator.style.bottom = '0';
                indicator.style.left = '0';
                indicator.style.right = '0';
                indicator.style.height = '4px';
                indicator.style.backgroundColor = '#3b82f6';
                indicator.style.borderRadius = '2px';
                indicator.style.boxShadow = '0 0 3px rgba(59, 130, 246, 0.5)';
                break;
            case DropPosition.INSIDE:
                indicator.style.inset = '0';
                indicator.style.border = '2px dashed #3b82f6';
                indicator.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                indicator.style.borderRadius = '4px';
                break;
            default:
                return null;
        }

        // Add animation
        indicator.style.animation = 'pulse 1.5s infinite';

        // Append to element
        element.appendChild(indicator);

        return indicator;
    }

    /**
   * Update element data attributes for CSS styling
   */
    private updateElementAttributes(
        element: HTMLElement,
        position: DropPosition | null
    ): void {
        // Clear all position attributes
        Object.values(DropPosition).forEach(pos => {
            element.setAttribute(`data-drop-${pos}`, 'false');
        });

        // Set active position if one is specified
        if (position !== null) {
            element.setAttribute(`data-drop-${position}`, 'true');
        }
    }

    /**
     * Update indicator visibility based on active position
     */
    private updateIndicatorVisibility(
        targetId: EntityId,
        position: DropPosition | null
    ): void {
        // Hide all indicators first
        Object.values(DropPosition).forEach(pos => {
            const indicator = this.indicators.get(`${targetId}-${pos}`);
            if (indicator) {
                indicator.style.opacity = '0';
            }
        });

        // Show active indicator if position is specified
        if (position !== null) {
            const indicator = this.indicators.get(`${targetId}-${position}`);
            if (indicator) {
                indicator.style.opacity = '1';
            }
        }
    }

    /**
     * Clear drop state for a specific target
     */
    public clearDropState(targetId: EntityId): void {
        const tracked = this.activeElements.get(targetId);
        if (!tracked) return;

        // Reset element attributes
        this.updateElementAttributes(tracked.element, null);

        // Hide all indicators
        this.updateIndicatorVisibility(targetId, null);

        // Update tracked state
        tracked.activePosition = null;
    }

    /**
     * Clear all drop states and remove indicators
     */
    public clearAllDropStates(): void {
        // Clear each active element
        this.activeElements.forEach((_tracked, targetId) => {
            this.clearDropState(targetId);
        });
    }

    /**
     * Remove all indicators and clean up state for a target
     */
    public cleanupTarget(targetId: EntityId): void {
        const tracked = this.activeElements.get(targetId);
        if (!tracked) return;

        // Remove all indicators from DOM
        Object.values(DropPosition).forEach(pos => {
            const indicator = this.indicators.get(`${targetId}-${pos}`);
            if (indicator && indicator.parentElement) {
                indicator.parentElement.removeChild(indicator);
            }
            this.indicators.delete(`${targetId}-${pos}`);
        });

        // Remove from tracked elements
        this.activeElements.delete(targetId);
    }

    /**
     * Clean up all targets
     */
    public cleanupAllTargets(): void {
        // Get all target IDs
        const targetIds = Array.from(this.activeElements.keys());

        // Clean up each target
        targetIds.forEach(targetId => {
            this.cleanupTarget(targetId);
        });
    }

    /**
     * Calculate drop position based on cursor position
     * Takes into account both vertical and horizontal positions and component aspect ratio
     */
    public calculateDropPosition(
        element: HTMLElement,
        x: number,
        y: number,
        isContainer: boolean,
        availablePositions: DropPosition[] = [DropPosition.BEFORE, DropPosition.AFTER, DropPosition.INSIDE]
    ): DropPosition {
        // If only one position is available, return it
        if (availablePositions.length === 1) {
            return availablePositions[0];
        }

        const rect = element.getBoundingClientRect();

        // Calculate relative positions
        const relativeX = x - rect.left;
        const relativeY = y - rect.top;

        // Calculate percentages
        const percentageX = relativeX / rect.width;
        const percentageY = relativeY / rect.height;

        // Determine if the component is wider than it is tall
        // const isWide = rect.width > rect.height * 1.5;

        // Define edge zones - 25% for more reliable edge detection
        const edgeZoneY = rect.height * 0.25;

        // Check for container-specific logic
        if (isContainer && availablePositions.includes(DropPosition.INSIDE)) {
            // For containers, use larger middle area (50%)
            if (relativeY > edgeZoneY && relativeY < rect.height - edgeZoneY) {
                return DropPosition.INSIDE;
            }
        }

        // Use before/after based on vertical position
        if (percentageY < 0.5 && availablePositions.includes(DropPosition.BEFORE)) {
            return DropPosition.BEFORE;
        } else if (availablePositions.includes(DropPosition.AFTER)) {
            return DropPosition.AFTER;
        }

        // Fallback to first available position
        return availablePositions[0];
    }

    /**
     * Find a container element at the given coordinates
     */
    public findContainerAtPosition(
        widgetId: EntityId,
        x: number,
        y: number
    ): { id: EntityId, element: Element, type: string } | null {
        // First look for nested container overlays specifically
        const nestedContainers = document.querySelectorAll(
            `[data-widget-id="${widgetId}"] [data-is-nested-container="true"]`
        );

        // Check nested container overlays first (they should take priority)
        for (const element of Array.from(nestedContainers)) {
            const rect = element.getBoundingClientRect();

            // Check if point is inside rectangle
            if (this.isPointInRectangle(x, y, rect)) {
                // Get container ID
                const containerId = element.getAttribute("data-container-id");
                if (!containerId) continue;

                return {
                    id: containerId as EntityId,
                    element,
                    type: element.parentElement?.getAttribute("data-component-type") || "unknown"
                };
            }
        }

        // If no nested container overlay is found, check regular containers
        const containerElements = document.querySelectorAll(
            `[data-widget-id="${widgetId}"][data-is-container="true"],
             [data-widget-id="${widgetId}"] [data-is-container="true"]`
        );

        for (const element of Array.from(containerElements)) {
            const rect = element.getBoundingClientRect();

            // Check if point is inside rectangle
            if (this.isPointInRectangle(x, y, rect)) {
                // Get container ID
                const containerId = element.getAttribute("data-component-id");
                if (!containerId) continue;

                return {
                    id: containerId as EntityId,
                    element,
                    type: element.getAttribute("data-component-type") || "unknown"
                };
            }
        }

        return null;
    }

    findAllComponentsAtPosition = (
        widgetId: EntityId,
        x: number,
        y: number): { id: EntityId; element: Element; depth: number }[] => {
        const components: { id: EntityId; element: Element; depth: number }[] = [];

        // Find all component elements within this widget
        const componentElements = document.querySelectorAll(
            `[data-widget-id="${widgetId}"] [data-component-id]`
        );

        // Create a map to track which elements contain the point
        const hitElements: Map<Element, { id: EntityId, depth: number }> = new Map();

        // Check each element to see if the point is inside
        componentElements.forEach(element => {
            const rect = element.getBoundingClientRect();

            // Check if point is inside this element
            if (this.isPointInRectangle(x, y, rect)) {
                // Calculate accurate nesting depth
                let depth = 0;
                let current = element;
                let parentComponents = [];

                // Count parent components to get true nesting depth
                while (current && current.parentElement) {
                    current = current.parentElement;

                    // If this parent has a component ID, increment depth
                    if (current.hasAttribute('data-component-id')) {
                        depth++;
                        parentComponents.push(current.getAttribute('data-component-id'));
                    }

                    // Stop if we reach the widget
                    if (current.hasAttribute('data-widget-id')) {
                        break;
                    }
                }

                // Add to our map - this ensures we only have one entry per element
                hitElements.set(element, {
                    id: element.getAttribute("data-component-id") as EntityId,
                    depth
                });
            }
        });

        // Convert map entries to array
        hitElements.forEach((data, element) => {
            components.push({
                id: data.id,
                element,
                depth: data.depth
            });
        });

        // Sort components by DOM nesting level (deepest first)
        // This ensures we find the most deeply nested component that contains the point
        return components.sort((a, b) => {
            // Primary sort by depth (deeper components first)
            if (b.depth !== a.depth) {
                return b.depth - a.depth;
            }

            // Secondary sort by DOM position for components at the same depth
            // Components that appear later in the DOM (possibly rendered on top) come first
            const aIndex = Array.from(componentElements).indexOf(a.element);
            const bIndex = Array.from(componentElements).indexOf(b.element);
            return bIndex - aIndex;
        });
    };

    /**
 * Check if a point is within an element's bounds
 */
    public isPointInElement(element: HTMLElement, x: number, y: number): boolean {
        const rect = element.getBoundingClientRect();
        return this.isPointInRectangle(x, y, rect);
    }

    /**
     * Helper method to check if a point is inside a rectangle
     */
    private isPointInRectangle(x: number, y: number, rect: DOMRect): boolean {
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom
        );
    }
}

// Create and export singleton instance
export const dropZoneManager = DropZoneManager.getInstance();

// Default export for simpler imports
export default dropZoneManager;