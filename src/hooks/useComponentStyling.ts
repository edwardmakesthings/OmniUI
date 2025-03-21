import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ComponentStyleOptions, createComponentClasses, createComponentDataAttributes } from '@/lib/utils/styles';

/**
 * Interface for component styling hook options
 */
export interface ComponentStylingOptions extends ComponentStyleOptions {
    isEditMode?: boolean;
    widgetId?: string;
    componentId?: string;
    instanceId?: string;
    parentId?: string;
    hasChildren?: boolean;
}

/**
 * Hook to provide styling for components with drag and drop support
 *
 * @returns Classes, data attributes, and helper functions for component styling
 */
export function useComponentStyling({
    base,
    isContainer = false,
    isSelected = false,
    isDragging = false,
    dropPosition = null,
    componentType = '',
    isEmpty = false,
    className = '',
    isEditMode = false,
    widgetId = '',
    componentId = '',
    instanceId = '',
    parentId = '',
    hasChildren = false,
}: ComponentStylingOptions) {
    // Generate data attributes
    const dataAttributes = useMemo(() =>
        createComponentDataAttributes({
            isContainer,
            isSelected,
            isDragging,
            dropPosition,
            componentType,
            isEditMode,
            widgetId,
            componentId,
            instanceId,
            parentId,
            hasChildren,
        }),
        [
            isContainer, isSelected, isDragging, dropPosition, componentType,
            isEditMode, widgetId, componentId, instanceId, parentId, hasChildren
        ]);

    // Generate class names
    const classNames = useMemo(() =>
        createComponentClasses({
            base,
            isContainer,
            isSelected,
            isDragging,
            dropPosition,
            componentType,
            isEmpty,
            className,
        }),
        [
            base, isContainer, isSelected, isDragging, dropPosition,
            componentType, isEmpty, className
        ]);

    // Delete button styles and visibility
    const deleteButton = useMemo(() => ({
        visible: isSelected && isEditMode,
        className: cn(
            'delete-button',
            isSelected && 'opacity-100',
        )
    }), [isSelected, isEditMode]);

    // Child container class for container components
    const childContainerClass = useMemo(() => {
        if (!isContainer) return "";

        const containerClassMap: Record<string, string> = {
            "Panel": "panel-children-container",
            "ScrollBox": "scrollbox-children-container",
            "Drawer": "drawer-children-container",
            "Modal": "modal-children-container",
            "DropdownPanel": "dropdown-panel-children-container",
            "Tabs": "tabs-children-container"
        };

        return containerClassMap[componentType] || "children-container";
    }, [isContainer, componentType]);

    return {
        dataAttributes,
        classNames,
        deleteButton,
        childContainerClass,
        isHoverable: isEditMode
    };
}

export default useComponentStyling;