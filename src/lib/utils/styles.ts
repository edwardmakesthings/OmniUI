import { cn } from '@/lib/utils';

/**
 * Interface for component styling options
 */
export interface ComponentStyleOptions {
    base?: string;
    isContainer?: boolean;
    isSelected?: boolean;
    isDragging?: boolean;
    dropPosition?: 'before' | 'after' | 'inside' | null;
    componentType?: string;
    isEmpty?: boolean;
    className?: string;
}

/**
 * Creates a consistent class string for component containers
 */
export function createComponentClasses({
    base = '',
    isContainer = false,
    isSelected = false,
    isDragging = false,
    dropPosition = null,
    componentType = '',
    isEmpty = false,
    className = ''
}: ComponentStyleOptions): string {
    return cn(
        // Base styles
        'component-container',
        base,

        // Component type modifiers
        isContainer && 'container-component',
        isEmpty && isContainer && 'empty-container',
        componentType && `component-type-${componentType.toLowerCase()}`,

        // State modifiers
        isSelected && 'selected-component',
        isDragging && 'dragging-component',

        // Additional classes
        className
    );
}

/**
 * Creates data attributes for component states
 */
export function createComponentDataAttributes({
    isContainer = false,
    isSelected = false,
    isDragging = false,
    dropPosition = null,
    componentType = '',
    isEditMode = false,
    widgetId = '',
    componentId = '',
    instanceId = '',
    parentId = '',
    hasChildren = false,
}: {
    isContainer?: boolean;
    isSelected?: boolean;
    isDragging?: boolean;
    dropPosition?: 'before' | 'after' | 'inside' | null;
    componentType?: string;
    isEditMode?: boolean;
    widgetId?: string;
    componentId?: string;
    instanceId?: string;
    parentId?: string;
    hasChildren?: boolean;
}): Record<string, string | undefined> {
    return {
        'data-component-type': componentType || undefined,
        'data-component-id': componentId || undefined,
        'data-instance-id': instanceId || undefined,
        'data-widget-id': widgetId || undefined,
        'data-parent-id': parentId || undefined,
        'data-is-container': isContainer ? 'true' : undefined,
        'data-has-children': hasChildren ? 'true' : undefined,
        'data-selected': isSelected ? 'true' : undefined,
        'data-dragging': isDragging ? 'true' : undefined,
        'data-edit-mode': isEditMode ? 'true' : undefined,
        'data-drop-before': dropPosition === 'before' ? 'true' : undefined,
        'data-drop-after': dropPosition === 'after' ? 'true' : undefined,
        'data-drop-inside': dropPosition === 'inside' ? 'true' : undefined,
    };
}