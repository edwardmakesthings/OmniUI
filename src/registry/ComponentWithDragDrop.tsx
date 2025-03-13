import {
    MouseEvent,
    useState,
    useCallback,
    useRef,
    useEffect,
    useMemo,
    DragEvent,
    Children,
} from "react";
import { EntityId } from "@/core/types/EntityTypes";
import { useWidgetStore } from "@/store/widgetStore";
import { notifyWidgetChange } from "@/core/eventBus/widgetEvents";
import { cn } from "@/lib/utils";
import { useDragAndDrop } from "@/core/dragDrop/DragDropManager";

export interface ComponentRenderOptions {
    isEditMode?: boolean;
    isSelected?: boolean;
    onSelect?: (id: EntityId, e?: MouseEvent) => void;
    onDelete?: (id: EntityId, e?: MouseEvent) => void;
    actionHandler?: (action: string, targetId?: EntityId) => void;
    dragDropEnabled?: boolean;
}

/**
 * Identifies container components from an event target
 * Helps determine which container a component is being dragged over
 */
function findContainerFromEvent(e: DragEvent, widgetId: EntityId) {
    // Get the element we're dragging over
    let target = e.target as HTMLElement;
    let containerElement = null;

    // Walk up the DOM to find the first container element
    while (target && !containerElement) {
        // Check if this is a container component
        if (
            target.getAttribute("data-is-container") === "true" &&
            target.getAttribute("data-widget-id") === widgetId
        ) {
            containerElement = target;
        }
        // Move up to parent
        target = target.parentElement;
    }

    if (containerElement) {
        return {
            id: containerElement.getAttribute("data-component-id"),
            element: containerElement,
            type: containerElement.getAttribute("data-component-type"),
        };
    }

    return null;
}

/**
 * Calculates which drop position (before, after, inside) is being targeted based on mouse position
 * relative to the component's bounding rectangle
 * @param e The drag event
 * @param rect The component's bounding rectangle
 * @param isContainer Whether the component is a container
 * @returns The drop position: 'before', 'after', or 'inside'
 */
function calculateDropPosition(
    e: DragEvent,
    rect: DOMRect,
    isContainer: boolean
): "before" | "after" | "inside" {
    // Calculate relative position within component
    const relativeY = e.clientY - rect.top;
    const percentage = relativeY / rect.height;

    // Define the size of the top/bottom zones (20% of height, min 10px, max 20px)
    const topBottomZoneSize = Math.min(Math.max(rect.height * 0.2, 10), 20);

    // If this is a container and the drag is in the middle area, target inside
    if (
        isContainer &&
        relativeY > topBottomZoneSize &&
        relativeY < rect.height - topBottomZoneSize
    ) {
        return "inside";
    }

    // For top/bottom areas, return before/after
    return percentage < 0.5 ? "before" : "after";
}

/**
 * Wrapper component that adds drag-drop functionality to a component
 */
export function ComponentWithDragDrop({
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
    const widgetStoreRef = useRef(useWidgetStore.getState());
    const instanceRef = useRef(instance);
    const widgetComponentRef = useRef(widgetComponent);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const isDragEnabledRef = useRef(dragDropEnabled);

    // Current drop position
    const [dropPosition, setDropPosition] = useState<
        "before" | "after" | "inside" | null
    >(null);

    // Sync refs with props to keep them updated
    useEffect(() => {
        instanceRef.current = instance;
        widgetComponentRef.current = widgetComponent;
        isDragEnabledRef.current = dragDropEnabled;

        // Log component initialization for debugging
        console.log(
            `ComponentWithDragDrop updated for ${widgetComponent.id} (${instance.type})`
        );

        // Clean up function
        return () => {
            console.log(
                `ComponentWithDragDrop unmounting for ${widgetComponent.id}`
            );
        };
    }, [instance, widgetComponent, dragDropEnabled]);

    // Use store subscription to keep store ref updated
    useEffect(() => {
        const unsubscribe = useWidgetStore.subscribe((state) => {
            widgetStoreRef.current = state;
        });
        return unsubscribe;
    }, []);

    // Local state for drag-drop indicators
    const [isDragging, setIsDragging] = useState(false);

    // Handle delete action
    const handleDelete = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            if (onDelete) {
                onDelete(instanceRef.current.id, e);
            } else {
                // Default delete behavior
                widgetStoreRef.current.removeComponent(
                    widgetId,
                    widgetComponentRef.current.id
                );
                notifyWidgetChange(widgetId, "componentRemoved");
            }
        },
        [widgetId, onDelete]
    );

    // Handle selection
    const handleSelect = useCallback(
        (e: MouseEvent) => {
            // Stop propagation to prevent parent components from also getting selected
            e.stopPropagation();

            console.log(`Component selected: ${widgetComponentRef.current.id}`);

            // First apply immediate visual feedback
            if (containerRef.current) {
                // Remove selection from other components
                document
                    .querySelectorAll(".selected-component")
                    .forEach((el) => {
                        if (el !== containerRef.current) {
                            el.classList.remove("selected-component");
                            el.setAttribute("data-selected", "false");
                        }
                    });

                // Add selection to this component
                containerRef.current.classList.add("selected-component");
                containerRef.current.setAttribute("data-selected", "true");
            }

            // Then call the provided handler (which should update the state)
            if (onSelect) {
                onSelect(widgetComponentRef.current.id, e);
            }
        },
        [onSelect]
    );

    /**
     * dragOver handler that determines drop position
     */
    const handleDragOver = useCallback(
        (e: DragEvent) => {
            if (!isDragEnabledRef.current || !containerRef.current) return;

            e.preventDefault();
            e.stopPropagation();

            // Get the component's bounding rectangle
            const rect = containerRef.current.getBoundingClientRect();

            // Calculate which drop position is being targeted
            const position = calculateDropPosition(e, rect, isContainer);

            // Only update state if position changed (prevents unnecessary re-renders)
            if (position !== dropPosition) {
                setDropPosition(position);
            }

            // Set drop effect
            e.dataTransfer.dropEffect = "move";
        },
        [isContainer, dropPosition]
    );

    /**
     * Handle when drag leaves the component
     */
    const handleDragLeave = useCallback(() => {
        setDropPosition(null);
    }, []);

    /**
     * Enhanced dragOver handler specifically for handling nested containers
     */
    const handleNestedDragOver = useCallback(
        (e: DragEvent) => {
            if (!isDragEnabledRef.current) return;

            e.preventDefault();
            e.stopPropagation();

            // Find container directly from event
            const container = findContainerFromEvent(e, widgetId);

            if (container && container.id === widgetComponent.id) {
                console.log(
                    `Dragging over container ${container.id} (${instance.type})`
                );

                // Set drop position to 'inside' for containers
                if (isContainer) {
                    setDropPosition("inside");

                    // Highlight the container
                    container.element.classList.add("drop-highlight");
                    container.element.setAttribute("data-drop-inside", "true");

                    // Change cursor
                    document.body.style.cursor = "copy";
                }
            }
        },
        [widgetId, widgetComponent.id, isContainer, instance.type]
    );

    /**
     * Enhanced drop handler that uses the calculated position
     */
    const handleDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            // Safety check for ref
            if (!containerRef.current) {
                console.warn("Container ref is null during drop event");
                return;
            }

            // Reset drop position
            setDropPosition(null);

            try {
                // Get drag data
                const dragDataStr = e.dataTransfer.getData("application/json");
                if (!dragDataStr) {
                    console.warn("No drag data found in drop event");
                    return;
                }

                const dragData = JSON.parse(dragDataStr);

                // Get store for operations
                const store = widgetStoreRef.current;
                const thisCompId = widgetComponentRef.current.id;

                // Calculate final drop position if not already set and ref is available
                const finalPosition =
                    dropPosition ||
                    (containerRef.current
                        ? calculateDropPosition(
                              e,
                              containerRef.current.getBoundingClientRect(),
                              isContainer
                          )
                        : "after"); // Default to 'after' if ref isn't available

                // Different handling based on the source type
                if (dragData.type === "component-definition") {
                    // Adding a new component from the component palette
                    const definitionId = dragData.definitionId || dragData.id;
                    if (!definitionId) return;

                    if (finalPosition === "inside" && isContainer) {
                        // Add as a child of this container
                        store.addChildComponent(
                            widgetId,
                            thisCompId,
                            definitionId,
                            {
                                x: { value: 10, unit: "px" },
                                y: { value: 10, unit: "px" },
                            }
                        );
                    } else if (
                        finalPosition === "before" ||
                        finalPosition === "after"
                    ) {
                        // Add as a sibling
                        const newComponent = store.addComponentToWidget(
                            widgetId,
                            definitionId,
                            {
                                x: { value: 10, unit: "px" },
                                y: { value: 10, unit: "px" },
                            }
                        );

                        if (newComponent) {
                            // Set the parent
                            store.moveComponent(
                                widgetId,
                                newComponent.id,
                                parentId
                            );

                            // Reorder components
                            store.reorderComponents(
                                widgetId,
                                parentId || widgetId,
                                newComponent.id,
                                thisCompId,
                                finalPosition
                            );
                        }
                    }
                } else if (dragData.type === "component") {
                    // Moving an existing component
                    const sourceComponentId = dragData.id;

                    // Prevent dropping onto itself
                    if (sourceComponentId === thisCompId) {
                        return;
                    }

                    // Check for circular references (can't drop parent into child)
                    if (isChildOf(widgetId, sourceComponentId, thisCompId)) {
                        console.warn(
                            "Cannot create circular reference in component hierarchy"
                        );
                        return;
                    }

                    if (finalPosition === "inside" && isContainer) {
                        // Move inside this container
                        store.moveComponent(
                            widgetId,
                            sourceComponentId,
                            thisCompId
                        );
                    } else if (
                        finalPosition === "before" ||
                        finalPosition === "after"
                    ) {
                        // Move as a sibling
                        store.moveComponent(
                            widgetId,
                            sourceComponentId,
                            parentId
                        );

                        // Reorder after moving
                        store.reorderComponents(
                            widgetId,
                            parentId || widgetId,
                            sourceComponentId,
                            thisCompId,
                            finalPosition
                        );
                    }
                }

                // Notify about hierarchy changes with explicit console log
                console.log(
                    `Component drop completed: notifying changes for widget ${widgetId}`
                );
                notifyWidgetChange(widgetId, "hierarchyChanged");

                // Also dispatch a more general DOM event for wider compatibility
                document.dispatchEvent(
                    new CustomEvent("component-hierarchy-changed", {
                        detail: { widgetId, timestamp: Date.now() },
                    })
                );
            } catch (error) {
                console.error("Error handling drop:", error);
            }
        },
        [widgetId, isContainer, parentId, dropPosition]
    );

    /**
     * Enhanced drop handler specifically for nested containers
     */
    const handleNestedDrop = useCallback(
        (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();

            // Reset drops and highlights
            setDropPosition(null);
            document.querySelectorAll(".drop-highlight").forEach((el) => {
                el.classList.remove("drop-highlight");
                el.removeAttribute("data-drop-inside");
            });

            try {
                // Get drag data
                const dragDataStr = e.dataTransfer.getData("application/json");
                if (!dragDataStr) {
                    console.warn("No drag data found in drop event");
                    return;
                }

                const dragData = JSON.parse(dragDataStr);

                // Find container from event
                const container = findContainerFromEvent(e, widgetId);

                if (!container) {
                    console.warn("No container found during drop event");
                    return;
                }

                console.log(
                    `Drop on container: ${container.id}, type: ${container.type}`
                );

                // Get widget store
                const store = widgetStoreRef.current;

                // Handle dropping component definition
                if (dragData.type === "component-definition") {
                    const definitionId = dragData.definitionId || dragData.id;

                    // Add as child of the container
                    const component = store.addChildComponent(
                        widgetId,
                        container.id,
                        definitionId,
                        {
                            x: { value: 10, unit: "px" },
                            y: { value: 10, unit: "px" },
                        }
                    );

                    console.log(
                        `Added component with definition ${definitionId} to container ${container.id}`
                    );

                    // Notify about changes
                    notifyWidgetChange(widgetId, "componentAdded");
                    notifyWidgetChange(widgetId, "hierarchyChanged");
                }
                // Handle dropping existing component
                else if (dragData.type === "component") {
                    const sourceComponentId = dragData.id;

                    // Prevent dropping onto itself
                    if (sourceComponentId === container.id) {
                        console.warn("Cannot drop component onto itself");
                        return;
                    }

                    // Move component to this container
                    store.moveComponent(
                        widgetId,
                        sourceComponentId,
                        container.id
                    );

                    console.log(
                        `Moved component ${sourceComponentId} to container ${container.id}`
                    );

                    // Notify about changes
                    notifyWidgetChange(widgetId, "componentUpdated");
                    notifyWidgetChange(widgetId, "hierarchyChanged");
                }
            } catch (error) {
                console.error("Error handling nested drop:", error);
            }
        },
        [widgetId, widgetComponent.id]
    );

    /**
     * Helper function to check if a component is a child of another component
     * This prevents circular references when dragging
     */
    function isChildOf(
        widgetId: EntityId,
        potentialChildId: EntityId,
        potentialParentId: EntityId
    ): boolean {
        const widget = widgetStoreRef.current.getWidget(widgetId);
        if (!widget) return false;

        // Start from the potential parent
        const checkChildren = (componentId: EntityId): boolean => {
            // Get the component's children
            const component = widget.components.find(
                (c) => c.id === componentId
            );
            if (!component) return false;

            // Check if any child is the potential child
            for (const childId of component.childIds || []) {
                if (childId === potentialChildId) return true;
                if (checkChildren(childId)) return true;
            }

            return false;
        };

        return checkChildren(potentialParentId);
    }

    // Create a stable component ID for useDragAndDrop
    const componentId = useMemo(() => widgetComponent.id, [widgetComponent.id]);

    // Stabilize the source data object to prevent rerenders
    const sourceData = useMemo(
        () => ({
            id: componentId,
            widgetId,
            componentType: instance.type,
            parentId,
        }),
        [componentId, widgetId, instance.type, parentId]
    );

    // Stabilize positions array
    const positions = useMemo(
        () =>
            isContainer ? ["before", "after", "inside"] : ["before", "after"],
        [isContainer]
    );

    // Stable accept types
    const acceptTypes = useMemo(
        () => ["component-definition", "component"],
        []
    );

    // Get props from the central drag-drop system
    const {
        elementProps,
        isDragging: isDragActive,
        isOver,
    } = useDragAndDrop(
        "component",
        componentId,
        sourceData,
        acceptTypes,
        null, // We'll handle drops manually for more control
        {
            dragDisabled: !isDragEnabledRef.current,
            dropDisabled: !isDragEnabledRef.current,
            positions,
        }
    );

    // Update local dragging state
    useEffect(() => {
        setIsDragging(isDragActive);
    }, [isDragActive]);

    useEffect(() => {
        // Component mounted
        console.log(`Component mounted: ${widgetComponent.id}`);

        return () => {
            // Component will unmount - clean up
            console.log(`Component unmounting: ${widgetComponent.id}`);

            // Reset any state or refs that might cause memory leaks
            setDropPosition(null);

            // Remove any remaining drop highlights
            document.querySelectorAll(".drop-highlight").forEach((el) => {
                el.classList.remove("drop-highlight");
            });
        };
    }, [widgetComponent.id]);

    // Use props from the central drag-drop system but exclude the drag event handlers we want to override
    const {
        onClick,
        onDragOver: _dragOver,
        onDragLeave: _dragLeave,
        onDrop: _drop,
        ...otherElementProps
    } = elementProps;

    // Create handlers that respect dragDropEnabled
    const safeDragOver = useCallback(
        (e: DragEvent) => {
            if (isDragEnabledRef.current) {
                handleDragOver(e);
            }
        },
        [handleDragOver]
    );

    const safeDragLeave = useCallback(
        (e: DragEvent) => {
            if (isDragEnabledRef.current) {
                handleDragLeave(e);
            }
        },
        [handleDragLeave]
    );

    const safeDrop = useCallback(
        (e: DragEvent) => {
            if (isDragEnabledRef.current) {
                handleDrop(e);
            }
        },
        [handleDrop]
    );

    // Set up ref callback to log when the ref is assigned
    const setContainerRef = useCallback(
        (element: HTMLDivElement | null) => {
            // Update our own ref
            containerRef.current = element;

            // Handle the elementProps ref if it's a function
            if (
                otherElementProps.ref &&
                typeof otherElementProps.ref === "function"
            ) {
                otherElementProps.ref(element);
            }

            // For debugging
            if (element) {
                console.log(`Component ref assigned for ${widgetComponent.id}`);
            }
        },
        [otherElementProps.ref, widgetComponent.id]
    );

    // Child container class based on component type
    const childContainerClass = isContainer
        ? instance.type === "Panel"
            ? "panel-children-container"
            : "scrollbox-children-container"
        : "";

    // Create stable classNames
    const className = cn(
        "component-container relative",
        isContainer ? "container-component" : "",
        isSelected ? "selected-component" : "",
        isDragging ? "dragging-component" : "",
        isOver ? "drop-target" : "",
        dropPosition ? `drop-position-${dropPosition}` : "",
        `component-type-${instance.type.toLowerCase()}`,
        isContainer && (!children || Children.count(children) === 0)
            ? "empty-container"
            : ""
    );

    // Render the component
    return (
        <div
            ref={setContainerRef}
            className={className}
            data-component-id={widgetComponent.id}
            data-component-type={instance.type}
            data-instance-id={instance.id}
            data-widget-id={widgetId}
            data-is-container={isContainer ? "true" : "false"}
            data-has-children={
                children && Children.count(children) > 0 ? "true" : "false"
            }
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            // Add data attributes for drop positioning - these work with the CSS
            data-drop-before={dropPosition === "before" ? "true" : "false"}
            data-drop-after={dropPosition === "after" ? "true" : "false"}
            data-drop-inside={dropPosition === "inside" ? "true" : "false"}
            onClick={(e) => {
                if (!isSelected) {
                    console.log(
                        `Component container clicked for ${widgetComponent.id}`
                    );
                    handleSelect(e);
                }
                // Still call the original onClick if provided
                if (onClick) onClick(e);
            }}
            onDragOver={safeDragOver}
            onDragLeave={safeDragLeave}
            onDrop={safeDrop}
            {...otherElementProps}
        >
            {/* Add a selection overlay in edit mode */}
            {isEditMode && (
                <div
                    className="absolute inset-0 z-10 cursor-pointer selection-overlay"
                    style={{
                        backgroundColor: "transparent",
                        pointerEvents: isSelected ? "none" : "auto", // Disable when selected
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log(
                            `Selection overlay clicked for ${widgetComponent.id}`
                        );
                        handleSelect(e);
                    }}
                />
            )}

            {/* Render the actual component */}
            {renderComponent(instance, {
                widgetId,
                actionHandler,
                isEditMode,
                isSelected,
                children,
                // Don't pass onSelect down - we handle it at this level
                onDelete,
            })}

            {/* Delete button - only for selected components in edit mode */}
            {isEditMode && isSelected && (
                <button
                    className="delete-button absolute top-1 right-1 w-5 h-5 bg-bg-dark bg-opacity-70 hover:bg-accent-dark-bright text-font-dark-muted hover:text-font-dark rounded-full flex items-center justify-center z-50"
                    onClick={handleDelete}
                    title="Delete component"
                    style={{ pointerEvents: "auto" }} // Ensure clicks aren't intercepted
                >
                    ✕
                </button>
            )}

            {/* Drop zone indicators */}
            {isOver && dragDropEnabled && (
                <>
                    <div className="drop-indicator drop-indicator-before absolute top-0 left-0 right-0 h-1 bg-accent-dark-bright z-10" />
                    <div className="drop-indicator drop-indicator-after absolute bottom-0 left-0 right-0 h-1 bg-accent-dark-bright z-10" />
                    {isContainer && (
                        <div className="drop-indicator drop-indicator-inside absolute inset-0 border-2 border-dashed border-accent-dark-bright bg-accent-dark-bright/20 z-5 pointer-events-none" />
                    )}
                </>
            )}

            {/* Container for capturing drop events specifically for nested components */}
            {isContainer && isEditMode && (
                <div
                    className="nested-drop-container"
                    style={{
                        position: "absolute",
                        inset: "0",
                        pointerEvents: isDragging ? "none" : "auto",
                        zIndex: 4, // Below the indicator layers but above content
                        backgroundColor: "transparent",
                    }}
                    data-container-id={widgetComponent.id}
                    data-is-nested-container="true"
                    data-widget-id={widgetId}
                    data-has-children={
                        children && Children.count(children) > 0
                            ? "true"
                            : "false"
                    }
                    onDragOver={handleNestedDragOver}
                    onDrop={handleNestedDrop}
                />
            )}

            {/* Children container - normal rendering */}
            {isContainer && children && (
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
            )}
            {!isContainer && (
                <div
                    className="absolute inset-0 z-15 non-container-overlay"
                    style={{
                        pointerEvents: isSelected ? "none" : "auto",
                        backgroundColor: "transparent",
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log(
                            `Non-container overlay clicked for ${widgetComponent.id}`
                        );
                        handleSelect(e);
                    }}
                />
            )}
        </div>
    );
}

/**
 * Hook to subscribe to widget changes
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

    useEffect(() => {
        // Use a stable handler that reads from ref
        const handleWidgetUpdate = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail?.widgetId === widgetId) {
                console.log(
                    `Widget update event received for ${widgetId}, triggering callback`
                );
                callbackRef.current();
            }
        };

        // Add event listeners
        document.addEventListener("widget-updated", handleWidgetUpdate);
        document.addEventListener(
            "component-hierarchy-changed",
            handleWidgetUpdate
        );

        // Clean up
        return () => {
            document.removeEventListener("widget-updated", handleWidgetUpdate);
            document.removeEventListener(
                "component-hierarchy-changed",
                handleWidgetUpdate
            );
        };
    }, [widgetId]);
}
