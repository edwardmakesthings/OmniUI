import {
    MouseEvent,
    useState,
    useCallback,
    useRef,
    useEffect,
    useMemo,
    Children,
    memo,
} from "react";
import { EntityId } from "@/core/types/EntityTypes";
import { useWidgetStore } from "@/features/builder/stores/widgetStore";
import { cn } from "@/lib/utils";
import { useDraggable } from "@/features/builder/dragDrop/DragDropCore";
import useDragDropStyles from "@/hooks/useDragDropStyles";

import DeleteButton from "@/features/builder/components/WidgetActionButtons/DeleteButton";
import { builderService, useUIStore } from "@/store";
import eventBus from "@/core/eventBus/eventBus";
import { useEventSubscription } from "@/hooks/useEventBus";
import useComponentStyling from "@/hooks/useComponentStyling";

/**
 * Props for component rendering with drag capabilities
 */
export interface ComponentRenderOptions {
    isEditMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: EntityId, e?: MouseEvent) => void;
    onDelete?: (id: EntityId, e?: MouseEvent) => void;
    actionHandler?: (action: string, targetId?: EntityId) => void;
    dragDropEnabled?: boolean;
}

/**
 * Wrapper component that adds drag functionality to any component
 * The drop handling is now delegated to the WidgetOverlay
 *
 * @path src/features/builder/components/ComponentWithDragDrop.tsx
 */
export const ComponentWithDragDrop = memo(function ComponentWithDragDrop({
    instance,
    widgetComponent,
    widgetId,
    isContainer,
    isSelected,
    isEditMode,
    onSelect,
    onDelete,
    actionHandler,
    dragDropEnabled,
    parentId,
    renderComponent,
    children,
}) {
    // Store access via refs to prevent unnecessary re-renders
    const widgetStoreRef = useRef(useWidgetStore.getState());
    const selectionState = useUIStore();

    // Refs for component data to ensure stable identity
    const instanceRef = useRef(instance);
    const widgetComponentRef = useRef(widgetComponent);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isDragEnabledRef = useRef(dragDropEnabled);

    // State to track dragging
    const [isDragging, setIsDragging] = useState(false);

    // Load drag-drop styles
    useDragDropStyles();

    // Sync refs with props to keep them updated
    useEffect(() => {
        instanceRef.current = instance;
        widgetComponentRef.current = widgetComponent;
        isDragEnabledRef.current = dragDropEnabled;
    }, [instance, widgetComponent, dragDropEnabled]);

    // Keep store ref updated via subscription
    useEffect(() => {
        const unsubscribe = useWidgetStore.subscribe((state) => {
            widgetStoreRef.current = state;
        });
        return unsubscribe;
    }, []);

    /**
     * Handle component selection with proper event propagation control
     */
    const handleSelect = useCallback(
        (e: MouseEvent) => {
            // Stop propagation to prevent parent components from also getting selected
            e.stopPropagation();

            // Get component ID and check if different from current selection
            const componentId = widgetComponentRef.current.id;
            if (
                componentId === selectionState.selectedComponentId &&
                widgetId === selectionState.selectedWidgetId
            ) {
                return; // Already selected
            }

            // Use the selection state to handle selection
            selectionState.selectComponent(componentId, widgetId, {
                syncWithLayoutPanel: true,
                openPropertyPanel: true,
            });

            // Call the provided handler for backwards compatibility
            if (onSelect) {
                onSelect(componentId, e);
            }

            // Publish selection event
            eventBus.publish("component:selected", {
                componentId,
                widgetId,
            });
        },
        [onSelect, widgetId, selectionState]
    );

    /**
     * Handle component deletion with proper cleanup
     */
    const handleDelete = useCallback(
        (e?: MouseEvent) => {
            // Stop event propagation to prevent parent handlers from firing
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }

            const componentId = widgetComponentRef.current.id;

            // Check if this component is selected
            if (componentId === selectionState.selectedComponentId) {
                selectionState.deselectAll();
            }

            // Use ComponentOperations service for deletion
            builderService.deleteComponent(widgetId, componentId);

            // Publish deletion event
            eventBus.publish("component:deleted", {
                componentId,
                widgetId,
                parentId,
            });
        },
        [widgetId, parentId, selectionState]
    );

    // Component data for drag operations
    const componentId = useMemo(() => widgetComponent.id, [widgetComponent.id]);

    const sourceData = useMemo(
        () => ({
            id: componentId,
            widgetId,
            componentType: instance.type,
            parentId,
            type: "component", // Important for the overlay to identify
        }),
        [componentId, widgetId, instance.type, parentId]
    );

    // Set up draggable with the central system
    const {
        dragProps,
        isDragging: isDragActive,
        elementRef,
    } = useDraggable("component", componentId, sourceData, {
        disabled: !isDragEnabledRef.current,
    });

    // Update local dragging state
    useEffect(() => {
        setIsDragging(isDragActive);
    }, [isDragActive]);

    // Listen for global selection events to sync up
    useEventSubscription(
        "component:selected",
        (event) => {
            // Check if this component was selected
            if (event.data.componentId === componentId) {
                // No need to call select as the parent already handled it
                // Just refresh the UI if needed
            }
        },
        [componentId]
    );

    // Extract drag props
    const { ref, className, ...otherDragProps } = dragProps;

    // Merge the elementRef from useDraggable with our containerRef
    const setMergedRef = useCallback(
        (element: HTMLDivElement | null) => {
            // Update our local ref
            containerRef.current = element;

            // Also update the ref from useDraggable
            if (elementRef) {
                (
                    elementRef as React.MutableRefObject<HTMLDivElement | null>
                ).current = element;
            }

            if (element) {
                element.setAttribute("data-component-id", widgetComponent.id);
                element.setAttribute(
                    "data-component-depth",
                    parentId ? "1" : "0"
                );
                element.setAttribute(
                    "data-is-container",
                    isContainer ? "true" : "false"
                );
                element.setAttribute("data-parent-id", parentId || "");
                element.setAttribute("data-component-type", instance.type);
            }
        },
        [widgetComponent.id, parentId, isContainer, instance.type, elementRef]
    );

    // Use the componentStyling hook for consistent styling
    const { classNames, dataAttributes } = useComponentStyling({
        base: "component-container relative",
        isContainer,
        isSelected,
        isDragging,
        componentType: instance.type,
        isEmpty: isContainer && (!children || Children.count(children) === 0),
        className: "",
        isEditMode,
        widgetId,
        componentId: widgetComponent.id,
        instanceId: instance.id,
        parentId,
        hasChildren: !!(children && Children.count(children) > 0),
    });

    // Child container class based on component type
    const childContainerClass = isContainer
        ? instance.type === "Panel"
            ? "panel-children-container"
            : "scrollbox-children-container"
        : "";

    // Render the component with drag functionality
    return (
        <div
            ref={setMergedRef}
            className={classNames}
            {...dataAttributes}
            onClick={handleSelect}
            {...otherDragProps}
            draggable={isEditMode && isDragEnabledRef.current}
        >
            {/* Render the actual component */}
            {renderComponent(instance, {
                widgetId,
                actionHandler,
                isEditMode,
                isSelected,
                children,
                onDelete,
            })}

            {/* Delete button for selected components in edit mode */}
            {isEditMode && isSelected && (
                <button
                    className="delete-button absolute top-1 right-1 w-5 h-5 bg-bg-dark bg-opacity-70 hover:bg-red-500 text-white rounded-full flex items-center justify-center z-50"
                    onClick={(e) => {
                        // Explicitly stop propagation to prevent parent handlers from firing
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete(e);
                    }}
                    // Stop all mouse events from propagating
                    onMouseDown={(e) => e.stopPropagation()}
                    onMouseUp={(e) => e.stopPropagation()}
                    onMouseEnter={(e) => e.stopPropagation()}
                    onMouseLeave={(e) => e.stopPropagation()}
                    title="Delete component"
                    style={{
                        pointerEvents: "auto", // Ensure it captures clicks
                        zIndex: 1000, // Ensure it's above everything
                    }}
                    data-testid="delete-button"
                >
                    ✕
                </button>
            )}

            {process.env.NODE_ENV !== "production" && (
                <div
                    className="absolute top-0 left-0 bg-gray-900 text-white text-xs px-1 py-0.5 rounded opacity-70 z-50"
                    style={{ fontSize: "8px", pointerEvents: "none" }}
                >
                    ID: {widgetComponent.id.split("-")[1]}
                    {isDragging && " (dragging)"}
                    {isSelected && " (selected)"}
                    <span className="ml-1 text-yellow-400">
                        z:{widgetComponent.zIndex}
                    </span>
                </div>
            )}

            {/* Container for children - only render if this is a container AND has children */}
            {/* {isContainer && children && Children.count(children) > 0 && (
                <div
                    className={cn(
                        "relative children-container w-full",
                        childContainerClass
                    )}
                    data-children-container="true"
                    data-parent-id={widgetComponent.id}
                    data-component-type={instance.type}
                >
                    {children}
                </div>
            )} */}
        </div>
    );
});

/**
 * Hook to subscribe to widget component changes using both eventBus and legacy events
 * @param widgetId The widget ID to listen for changes
 * @param callback The callback to execute when changes occur
 */
export function useWidgetComponentChanges(
    widgetId: EntityId,
    callback: () => void
) {
    const callbackRef = useRef(callback);

    // Keep callback ref updated
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Set up event subscriptions
    useEffect(() => {
        // EventBus subscription
        const subscriptionIds = [
            eventBus.subscribe("widget:updated", (event) => {
                if (event.data?.widgetId === widgetId) {
                    callbackRef.current();
                }
            }),
            eventBus.subscribe("component:added", (event) => {
                if (event.data?.widgetId === widgetId) {
                    callbackRef.current();
                }
            }),
            eventBus.subscribe("component:deleted", (event) => {
                if (event.data?.widgetId === widgetId) {
                    callbackRef.current();
                }
            }),
            eventBus.subscribe("component:updated", (event) => {
                if (event.data?.widgetId === widgetId) {
                    callbackRef.current();
                }
            }),
            eventBus.subscribe("hierarchy:changed", (event) => {
                if (event.data?.widgetId === widgetId) {
                    callbackRef.current();
                }
            }),
        ];

        // Legacy DOM event handler (for backward compatibility)
        const handleWidgetUpdate = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail?.widgetId === widgetId) {
                callbackRef.current();
            }
        };

        // Add legacy event listeners
        document.addEventListener("widget-updated", handleWidgetUpdate);
        document.addEventListener(
            "component-hierarchy-changed",
            handleWidgetUpdate
        );

        // Clean up
        return () => {
            // Clean up eventBus subscriptions
            subscriptionIds.forEach((id) => eventBus.unsubscribe(id));

            // Clean up legacy event listeners
            document.removeEventListener("widget-updated", handleWidgetUpdate);
            document.removeEventListener(
                "component-hierarchy-changed",
                handleWidgetUpdate
            );
        };
    }, [widgetId]);
}

export default ComponentWithDragDrop;
