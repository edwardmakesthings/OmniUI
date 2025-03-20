import {
    useState,
    useCallback,
    useRef,
    useEffect,
    useMemo,
    Children,
    memo,
    ReactNode,
    MouseEvent as ReactMouseEvent,
} from "react";
import { EntityId } from "@/core/types/EntityTypes";
import {
    useWidgetStore,
    WidgetComponent,
} from "@/features/builder/stores/widgetStore";
import {
    ComponentDragData,
    useDraggable,
} from "@/features/builder/dragDrop/DragDropCore";
import useDragDropStyles from "@/hooks/useDragDropStyles";

// import DeleteButton from "@/features/builder/components/WidgetActionButtons/DeleteButton";
import { useComponentSelection } from "@/hooks/useComponentSelection";
import eventBus from "@/core/eventBus/eventBus";
import { useEventSubscription } from "@/hooks/useEventBus";
import useComponentStyling from "@/hooks/useComponentStyling";
import { ComponentInstance } from "@/core";

/**
 * Props for component rendering with drag capabilities
 */
export interface ComponentRenderOptions {
    isEditMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: EntityId, e?: ReactMouseEvent<Element, MouseEvent>) => void;
    onDelete?: (id: EntityId, e?: ReactMouseEvent<Element, MouseEvent>) => void;
    actionHandler?: (action: string, targetId?: EntityId) => void;
    dragDropEnabled?: boolean;
}

/**
 * Props for the ComponentWithDragDrop component
 */
export interface ComponentWithDragDropProps {
    /** The component instance */
    instance: ComponentInstance;

    /** The widget component reference */
    widgetComponent: WidgetComponent;

    /** The ID of the widget containing this component */
    widgetId: EntityId;

    /** Whether this component can contain other components */
    isContainer: boolean;

    /** Whether this component is currently selected */
    isSelected?: boolean;

    /** Whether edit mode is enabled */
    isEditMode?: boolean;

    /** Callback when the component is selected */
    onSelect?: (id: EntityId, e?: ReactMouseEvent<Element, MouseEvent>) => void;

    /** Callback when the component is deleted */
    onDelete?: (id: EntityId, e?: ReactMouseEvent<Element, MouseEvent>) => void;

    /** Handler for component actions */
    actionHandler?: (action: string, targetId?: EntityId) => void;

    /** Whether drag and drop is enabled for this component */
    dragDropEnabled?: boolean;

    /** The ID of the parent component, if any */
    parentId?: EntityId;

    /** Function to render the actual component content */
    renderComponent: (
        instance: ComponentInstance,
        props: {
            widgetId: EntityId;
            isEditMode?: boolean;
            isSelected?: boolean;
            children?: ReactNode;
            onDelete?: (
                id: EntityId,
                e?: ReactMouseEvent<Element, MouseEvent>
            ) => void;
            actionHandler?: (action: string, targetId?: EntityId) => void;
        }
    ) => ReactNode;

    /** Child components */
    children?: ReactNode;
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
}: ComponentWithDragDropProps) {
    // Store access via refs to prevent unnecessary re-renders
    const widgetStoreRef = useRef(useWidgetStore.getState());

    // Use our centralized selection hook
    const selection = useComponentSelection();

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
     * Using the centralized selection hook
     */
    const handleSelect = useCallback(
        (e: ReactMouseEvent<Element, MouseEvent>) => {
            // Stop propagation to prevent parent components from also getting selected
            e.stopPropagation();

            // Get component ID
            const componentId = widgetComponentRef.current.id;

            // Use centralized selection hook
            selection.select(componentId, widgetId, e);

            // Call the provided handler for backwards compatibility
            if (onSelect) {
                onSelect(componentId, e);
            }
        },
        [onSelect, widgetId, selection]
    );

    /**
     * Handle component deletion with proper cleanup
     * Using the centralized selection hook
     */
    const handleDelete = useCallback(
        (e?: ReactMouseEvent<Element, MouseEvent>) => {
            // Stop event propagation to prevent parent handlers from firing
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }

            const componentId = widgetComponentRef.current.id;

            // Use centralized delete handler
            selection.deleteComponent(componentId, widgetId, e);

            // Call the provided handler for backwards compatibility
            if (onDelete) {
                onDelete(componentId, e);
            }
        },
        [widgetId, onDelete, selection]
    );

    // Component data for drag operations
    const componentId = useMemo(() => widgetComponent.id, [widgetComponent.id]);

    // Create properly typed data object
    const dragData: ComponentDragData = useMemo(
        () => ({
            id: componentId,
            widgetId,
            componentType: instance.type,
            parentId,
            instanceId: instance.id,
            definitionId: widgetComponent.definitionId,
            position: widgetComponent.position,
            size: widgetComponent.size,
            type: "component",
            // Any other properties you want to include
        }),
        [
            componentId,
            widgetId,
            instance.type,
            instance.id,
            parentId,
            widgetComponent.definitionId,
            widgetComponent.position,
            widgetComponent.size,
        ]
    );

    // Set up draggable with the central system
    const {
        dragProps,
        isDragging: isDragActive,
        isCrossWidgetDrag: _isCrossWidgetDrag,
        elementRef,
    } = useDraggable("component", componentId, dragData, {
        disabled: !isDragEnabledRef.current,
        crossWidgetEnabled: true, // Explicitly enable cross-widget dragging
    });

    // Update local dragging state
    useEffect(() => {
        setIsDragging(isDragActive);
    }, [isDragActive]);

    // Listen for global selection events to sync up
    useEventSubscription(
        "component:selected",
        useCallback(
            (event) => {
                if (event.data.componentId === componentId) {
                    // Component was selected, update UI if needed
                }
            },
            [componentId]
        ),
        [componentId],
        `Component-${componentId}-Selection`
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
                    type="button"
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
                    ID: {widgetId}/{widgetComponent.id}
                    {isDragging && " (dragging)"}
                    {isSelected && " (selected)"}
                    <span className="ml-1 text-yellow-400">
                        z:{widgetComponent.zIndex}
                    </span>
                </div>
            )}
        </div>
    );
});

/**
 * Hook to subscribe to all widget component changes
 * Uses useEventSubscription for efficient subscription management
 *
 * @param widgetId The widget ID to listen for changes
 * @param callback The callback to execute when changes occur
 */
export function useWidgetComponentChanges(
    widgetId: EntityId,
    callback: () => void
) {
    // Keep callback in a ref to avoid unnecessary resubscriptions
    const callbackRef = useRef(callback);

    // Update ref when callback changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Create a stable handler that checks widgetId
    const handleWidgetEvent = useCallback(
        (event: any) => {
            if (event.data?.widgetId === widgetId) {
                callbackRef.current();
            }
        },
        [widgetId]
    );

    // Use useEventSubscription for each event type, with appropriate component name for debugging
    useEventSubscription(
        "widget:updated",
        handleWidgetEvent,
        [widgetId, handleWidgetEvent],
        `Widget-${widgetId}-Updated`
    );

    useEventSubscription(
        "hierarchy:changed",
        handleWidgetEvent,
        [widgetId, handleWidgetEvent],
        `Widget-${widgetId}-Hierarchy`
    );

    useEventSubscription(
        "component:added",
        handleWidgetEvent,
        [widgetId, handleWidgetEvent],
        `Widget-${widgetId}-ComponentAdded`
    );

    useEventSubscription(
        "component:deleted",
        handleWidgetEvent,
        [widgetId, handleWidgetEvent],
        `Widget-${widgetId}-ComponentDeleted`
    );

    useEventSubscription(
        "component:updated",
        handleWidgetEvent,
        [widgetId, handleWidgetEvent],
        `Widget-${widgetId}-ComponentUpdated`
    );

    // Optional: Add component:moved subscription if you need it
    useEventSubscription(
        "component:moved",
        handleWidgetEvent,
        [widgetId, handleWidgetEvent],
        `Widget-${widgetId}-ComponentMoved`
    );
}

export default ComponentWithDragDrop;
