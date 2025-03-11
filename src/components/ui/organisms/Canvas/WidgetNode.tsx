// This is a simplified version of the WidgetNode component with all necessary changes integrated

import {
    useState,
    useRef,
    useEffect,
    useCallback,
    DragEvent,
    MouseEvent,
    useMemo,
} from "react";
import { useUIStore, PANEL_IDS } from "@/store/uiStore";
import { useWidgetStore } from "@/store/widgetStore";
import { resolveComponent } from "./componentResolver";
import { EntityId } from "@/core/types/EntityTypes";
import { Handle, Position as NodePosition } from "@xyflow/react";
import { ScrollBox } from "@/components/ui/atoms";
import { useComponentStore } from "@/store/componentStore";

export const WidgetNode = ({ data, selected = false }) => {
    // Stores
    const widgetStore = useWidgetStore();
    const uiStore = useUIStore();

    // State and refs
    const [selectedComponentId, setSelectedComponentId] =
        useState<EntityId | null>(null);
    const [draggedComponentId, setDraggedComponentId] =
        useState<EntityId | null>(null);
    const [dropIndicators, setDropIndicators] = useState<
        Array<{
            containerId: EntityId;
            position: "before" | "after" | "inside";
            targetId: EntityId;
            element: HTMLElement | null;
        }>
    >([]);
    const [propertyEditorOpen, setPropertyEditorOpen] = useState(false);

    const widgetRef = useRef<HTMLDivElement>(null);
    const selectedComponentRef = useRef<HTMLDivElement | null>(null);
    const dragStartPos = useRef({ x: 0, y: 0 });

    // Get resolved components
    const resolvedComponents = useMemo(() => {
        // Get component instances for widget components
        return data.components.map((comp) => {
            const instance = useComponentStore
                .getState()
                .getInstance(comp.instanceId);
            return {
                ...comp,
                instance,
            };
        });
    }, [data.components]);

    // Component selection handler
    const handleComponentSelect = useCallback(
        (componentId: EntityId, event?: React.MouseEvent) => {
            // Stop event propagation if provided
            if (event) {
                event.stopPropagation();
            }

            // Set component as selected in the widget
            setSelectedComponentId(componentId);

            // Get the component
            const component = resolvedComponents.find(
                (comp) => comp.id === componentId
            );
            if (!component || !component.instanceId) return;

            // Set component as selected in the UI store
            uiStore.selectComponent(component.instanceId);

            // Open property editor if not already open
            const propertyEditorConfig =
                uiStore.panelStates[PANEL_IDS.PROPERTY_EDITOR];
            if (!propertyEditorConfig?.isVisible) {
                uiStore.togglePanel(PANEL_IDS.PROPERTY_EDITOR);
                setPropertyEditorOpen(true);
            }

            // Scroll selected component into view if needed
            if (selectedComponentRef.current) {
                selectedComponentRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }

            // Sync with layout hierarchy
            const layoutHierarchyConfig =
                uiStore.panelStates[PANEL_IDS.LAYOUT_HIERARCHY];
            if (layoutHierarchyConfig?.isVisible) {
                // This requires an implementation in your layout hierarchy component
                const layoutStore = window._layoutHierarchyStore;
                if (layoutStore?.selectItem) {
                    layoutStore.selectItem(`${data.id}/${componentId}`);
                }
            }
        },
        [resolvedComponents, data.id, uiStore]
    );

    // Deselect component
    const handleDeselectComponent = useCallback(() => {
        setSelectedComponentId(null);
        uiStore.selectComponent(null);
    }, [uiStore]);

    // Handle widget background click to deselect
    const handleWidgetBackgroundClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                handleDeselectComponent();
            }
        },
        [handleDeselectComponent]
    );

    // Handle component drag start
    const handleDragStart = useCallback(
        (e: React.DragEvent<HTMLDivElement>, componentId: EntityId) => {
            e.stopPropagation();

            // Set dragged component
            setDraggedComponentId(componentId);

            // Store initial position
            dragStartPos.current = {
                x: e.clientX,
                y: e.clientY,
            };

            // Set drag data
            const dragData = JSON.stringify({
                type: "component",
                id: componentId,
                widgetId: data.id,
            });
            e.dataTransfer.setData("application/json", dragData);
            e.dataTransfer.effectAllowed = "move";

            // Set cursor
            document.body.style.cursor = "grabbing";
        },
        [data.id]
    );

    // Find potential containers at a position
    const findPotentialContainers = useCallback(
        (clientX: number, clientY: number) => {
            // Get all container elements in this widget
            const containerElements = document.querySelectorAll(
                `[data-widget-id="${data.id}"] [data-component-type="Panel"], [data-widget-id="${data.id}"] [data-component-type="ScrollBox"]`
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
                    const containerId =
                        element.getAttribute("data-component-id");
                    if (!containerId) return;

                    // Calculate nesting depth
                    let depth = 0;
                    let parent = element.parentElement;
                    while (parent) {
                        if (
                            parent.hasAttribute("data-component-type") &&
                            (parent.getAttribute("data-component-type") ===
                                "Panel" ||
                                parent.getAttribute("data-component-type") ===
                                    "ScrollBox")
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

            return potentialContainers;
        },
        [data.id]
    );

    // Calculate drop position
    const calculateDropPosition = useCallback(
        (
            containerId: EntityId,
            draggedId: EntityId,
            clientX: number,
            clientY: number
        ) => {
            // Find the container component
            const containerComp = resolvedComponents.find(
                (comp) => comp.id === containerId
            );
            if (!containerComp) return null;

            // Get layout type (default to column)
            const layoutType = containerComp.layoutConfig?.type || "column";

            // Get container element
            const containerElement = document.querySelector(
                `[data-component-id="${containerId}"]`
            );
            if (!containerElement) return null;

            const containerRect = containerElement.getBoundingClientRect();

            // Get child components (excluding dragged one)
            const childComponents = resolvedComponents.filter(
                (comp) => comp.parentId === containerId && comp.id !== draggedId
            );

            // If no children, drop inside
            if (childComponents.length === 0) {
                return {
                    position: "inside" as const,
                    targetId: containerId,
                    rect: containerRect,
                };
            }

            // Detailed position calculation based on layout type
            // See complete implementation in drag-drop-implementation.tsx

            // This is a simplified version
            if (layoutType === "column") {
                // Vertical positioning logic
                // ...
            } else if (layoutType === "row") {
                // Horizontal positioning logic
                // ...
            } else if (layoutType === "grid") {
                // Grid cell positioning logic
                // ...
            }

            // Default: drop inside
            return {
                position: "inside" as const,
                targetId: containerId,
                rect: containerRect,
            };
        },
        [resolvedComponents]
    );

    // Create drop indicator
    const createDropIndicator = useCallback(
        (
            containerId: EntityId,
            position: "before" | "after" | "inside",
            targetId: EntityId,
            rect: DOMRect
        ) => {
            // Create and position indicator element
            // See complete implementation in drag-drop-implementation.tsx
        },
        []
    );

    // Clear drop indicators
    const clearDropIndicators = useCallback(() => {
        document.querySelectorAll(".drop-indicator").forEach((el) => {
            el.remove();
        });
        setDropIndicators([]);
    }, []);

    // Handle drag over
    const handleDragOver = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            // Skip if no dragged component
            if (!draggedComponentId) return;

            // Clear existing indicators
            clearDropIndicators();

            // Find potential containers
            const containers = findPotentialContainers(e.clientX, e.clientY);
            if (containers.length === 0) return;

            // Sort by depth (innermost first)
            containers.sort((a, b) => b.depth - a.depth);

            // Calculate drop position for innermost container
            const container = containers[0];
            const dropPosition = calculateDropPosition(
                container.id,
                draggedComponentId,
                e.clientX,
                e.clientY
            );

            if (dropPosition) {
                createDropIndicator(
                    container.id,
                    dropPosition.position,
                    dropPosition.targetId,
                    dropPosition.rect
                );
            }
        },
        [
            draggedComponentId,
            findPotentialContainers,
            calculateDropPosition,
            createDropIndicator,
            clearDropIndicators,
        ]
    );

    // Handle drop
    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            try {
                // Get drag data
                const dragData = e.dataTransfer.getData("application/json");
                if (!dragData) return;

                const { id: draggedId, type } = JSON.parse(dragData);

                // Only handle component drops
                if (type !== "component") return;

                // Check for drop indicators
                if (dropIndicators.length === 0) return;

                // Use first indicator (innermost)
                const indicator = dropIndicators[0];

                // Handle drop
                if (indicator.position === "inside") {
                    // Move to container
                    widgetStore.moveComponent(
                        data.id,
                        draggedId as EntityId,
                        indicator.containerId
                    );
                } else {
                    // Move and reorder
                    widgetStore.reorderComponents(
                        data.id,
                        indicator.containerId,
                        draggedId as EntityId,
                        indicator.targetId,
                        indicator.position
                    );
                }
            } catch (error) {
                console.error("Error handling drop:", error);
            } finally {
                // Clean up
                clearDropIndicators();
                setDraggedComponentId(null);
                document.body.style.cursor = "default";
            }
        },
        [data.id, dropIndicators, clearDropIndicators, widgetStore]
    );

    // Handle drag end
    const handleDragEnd = useCallback(() => {
        clearDropIndicators();
        setDraggedComponentId(null);
        document.body.style.cursor = "default";
    }, [clearDropIndicators]);

    // Handle component deletion
    const handleDeleteComponent = useCallback(
        (componentId: EntityId) => {
            // Deselect if deleting selected component
            if (selectedComponentId === componentId) {
                handleDeselectComponent();
            }

            // Remove from widget
            widgetStore.removeComponent(data.id, componentId);
        },
        [data.id, selectedComponentId, handleDeselectComponent, widgetStore]
    );

    // Handle widget actions
    const handleAction = useCallback(
        (action: string, targetId?: EntityId) => {
            if (!targetId) return;

            switch (action) {
                case "show":
                    widgetStore.showWidget(targetId);
                    break;
                case "hide":
                    widgetStore.hideWidget(targetId);
                    break;
                case "toggle":
                    widgetStore.toggleWidget(targetId);
                    break;
            }
        },
        [widgetStore]
    );

    // Calculate if component is an empty container
    const isEmptyContainer = useCallback((component) => {
        if (!component?.instance) return false;

        const isContainer =
            component.instance.type === "Panel" ||
            component.instance.type === "ScrollBox";
        const hasChildren = component.childIds && component.childIds.length > 0;

        return isContainer && !hasChildren;
    }, []);

    // Render a selectable component
    const renderSelectableComponent = useCallback(
        (component) => (
            <div
                key={component.id}
                ref={
                    selectedComponentId === component.id
                        ? selectedComponentRef
                        : null
                }
                className={`relative component-container ${
                    selectedComponentId === component.id ? "selected" : ""
                } ${
                    isEmptyContainer(component)
                        ? "min-h-16 border border-dashed border-gray-500/50"
                        : ""
                }`}
                onClick={(e) => handleComponentSelect(component.id, e)}
                draggable={data.isEditMode}
                onDragStart={(e) => handleDragStart(e, component.id)}
                onDragEnd={handleDragEnd}
                data-component-id={component.id}
                data-component-type={component.instance?.type || "unknown"}
                data-instance-id={component.instanceId}
            >
                {/* Render component */}
                {component.instance &&
                    resolveComponent(component.instance, data.id, handleAction)}

                {/* Delete button - only for selected component */}
                {data.isEditMode && selectedComponentId === component.id && (
                    <button
                        className="absolute top-1 right-1 w-5 h-5 bg-bg-dark bg-opacity-70 hover:bg-accent-dark-bright text-font-dark-muted hover:text-font-dark rounded-full flex items-center justify-center z-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteComponent(component.id);
                        }}
                        title="Delete component"
                    >
                        ✕
                    </button>
                )}
            </div>
        ),
        [
            selectedComponentId,
            data.id,
            data.isEditMode,
            handleComponentSelect,
            handleDragStart,
            handleDragEnd,
            handleAction,
            handleDeleteComponent,
            isEmptyContainer,
        ]
    );

    // Recursive component renderer that supports deep selection
    const renderComponentTree = useCallback(
        (component, isNested = false) => {
            // Skip rendering if no instance
            if (!component?.instance) return null;

            const isContainer =
                component.instance.type === "Panel" ||
                component.instance.type === "ScrollBox";

            // Find children of this component
            const childComponents = resolvedComponents
                .filter((comp) => comp.parentId === component.id)
                .sort((a, b) => a.zIndex - b.zIndex);

            return (
                <div
                    key={component.id}
                    ref={
                        selectedComponentId === component.id
                            ? selectedComponentRef
                            : null
                    }
                    className={`component-container ${
                        selectedComponentId === component.id ? "selected" : ""
                    } ${isEmptyContainer(component) ? "empty-container" : ""} ${
                        isNested ? "nested-component" : "root-component"
                    }`}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleComponentSelect(component.id, e);
                    }}
                    draggable={data.isEditMode}
                    onDragStart={(e) => handleDragStart(e, component.id)}
                    onDragEnd={handleDragEnd}
                    data-component-id={component.id}
                    data-component-type={component.instance?.type || "unknown"}
                    data-instance-id={component.instanceId}
                    data-has-children={
                        childComponents.length > 0 ? "true" : "false"
                    }
                >
                    {/* Render component */}
                    {component.instance &&
                        resolveComponent(
                            component.instance,
                            data.id,
                            handleAction
                        )}

                    {/* Recursively render children if this is a container */}
                    {isContainer && childComponents.length > 0 && (
                        <div className="container-children">
                            {childComponents.map((child) =>
                                renderComponentTree(child, true)
                            )}
                        </div>
                    )}

                    {/* Delete button - show for ANY selected component, not just root */}
                    {data.isEditMode &&
                        selectedComponentId === component.id && (
                            <button
                                className="absolute top-1 right-1 w-5 h-5 bg-bg-dark bg-opacity-70 hover:bg-accent-dark-bright text-font-dark-muted hover:text-font-dark rounded-full flex items-center justify-center z-50"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteComponent(component.id);
                                }}
                                title="Delete component"
                            >
                                ✕
                            </button>
                        )}
                </div>
            );
        },
        [
            selectedComponentId,
            resolvedComponents,
            data.id,
            data.isEditMode,
            handleComponentSelect,
            handleDragStart,
            handleDragEnd,
            handleAction,
            handleDeleteComponent,
            isEmptyContainer,
        ]
    );

    // In both view and edit mode, use the same rendering approach
    const renderWidgetContent = () => (
        <div
            className="h-full widget-content-container"
            onClick={handleWidgetBackgroundClick}
            onDragOver={data.isEditMode ? handleDragOver : undefined}
            onDrop={data.isEditMode ? handleDrop : undefined}
        >
            {data.isEditMode ? (
                // In edit mode, don't use ScrollBox - allow widget to expand
                <div className="p-2 flex flex-col gap-2">
                    {resolvedComponents
                        .filter((comp) => !comp.parentId) // Only render root components
                        .sort((a, b) => a.zIndex - b.zIndex)
                        .map((comp) => renderComponentTree(comp))}
                </div>
            ) : (
                // In view mode, use ScrollBox
                <ScrollBox className="h-full">
                    <div className="p-2 flex flex-col gap-2">
                        {resolvedComponents
                            .filter((comp) => !comp.parentId)
                            .sort((a, b) => a.zIndex - b.zIndex)
                            .map((comp) => renderComponentTree(comp))}
                    </div>
                </ScrollBox>
            )}
        </div>
    );

    // Add styles for drop indicators
    useEffect(() => {
        const style = document.createElement("style");
        style.textContent = `
            .drop-indicator {
                transition: all 0.15s ease-in-out;
                pointer-events: none;
            }

            .component-container {
                transition: all 0.15s ease;
            }

            .component-container:hover {
                outline: 1px solid rgba(59, 130, 246, 0.3);
            }

            .component-container.selected {
                outline: 2px solid #3b82f6;
            }
        `;

        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    // Sync with property editor panel visibility
    useEffect(() => {
        const unsubscribe = useUIStore.subscribe(
            (state) => state.panelStates[PANEL_IDS.PROPERTY_EDITOR]?.isVisible,
            (isVisible) => {
                if (propertyEditorOpen && !isVisible) {
                    setPropertyEditorOpen(false);
                }
            }
        );

        return unsubscribe;
    }, [propertyEditorOpen]);

    // For auto-sizing in edit mode
    useEffect(() => {
        // Only apply auto-sizing in edit mode
        if (!data.isEditMode) return;

        // Find all components in the widget
        const widgetElement = widgetRef.current;
        if (!widgetElement) return;

        // Use a slight delay to ensure components have rendered
        const resizeTimer = setTimeout(() => {
            const allComponents = widgetElement.querySelectorAll(
                "[data-component-id]"
            );

            // If no components, keep default size
            if (allComponents.length === 0) return;

            // Calculate total height needed
            let maxBottom = 0;
            let maxRight = 0;

            allComponents.forEach((comp) => {
                const rect = comp.getBoundingClientRect();
                const widgetRect = widgetElement.getBoundingClientRect();

                // Calculate position relative to widget
                const relBottom = rect.bottom - widgetRect.top;
                const relRight = rect.right - widgetRect.left;

                maxBottom = Math.max(maxBottom, relBottom);
                maxRight = Math.max(maxRight, relRight);
            });

            // Add padding
            const padding = 50; // Extra space for dragging

            // Apply new size if it's larger than current
            if (
                maxBottom + padding > data.size.height.value ||
                maxRight + padding > data.size.width.value
            ) {
                widgetStore.updateWidget(data.id, {
                    size: {
                        width: {
                            value: Math.max(
                                data.size.width.value,
                                maxRight + padding
                            ),
                            unit: "px",
                        },
                        height: {
                            value: Math.max(
                                data.size.height.value,
                                maxBottom + padding
                            ),
                            unit: "px",
                        },
                    },
                });
            }
        }, 300); // Delay to ensure render

        return () => clearTimeout(resizeTimer);
    }, [
        data.isEditMode,
        data.components,
        data.id,
        data.size.width.value,
        data.size.height.value,
    ]);

    return (
        <>
            {/* ReactFlow handles */}
            <Handle
                type="target"
                position={NodePosition.Top}
                style={{ visibility: "hidden" }}
            />

            <div
                ref={widgetRef}
                className={`rounded shadow-lg ${
                    selected ? "outline outline-accent-dark-bright" : ""
                }`}
                style={{
                    width: data.size.width.value,
                    height: data.size.height.value,
                    minWidth: 200,
                    minHeight: 100,
                }}
                data-widget-id={data.id}
                data-edit-mode={data.isEditMode ? "true" : "false"}
            >
                <div className="flex justify-between items-center mb-0.25 drag-handle__widget">
                    <div className="text-xs text-font-dark-muted truncate max-w-[70%]">
                        {data.label}
                    </div>
                    <div className="flex gap-1">
                        <button
                            className={`text-xxs px-1 py-0.25 bg-accent-dark-neutral hover:bg-accent-dark-bright transition rounded ${
                                data.isEditMode ? "bg-accent-dark-bright" : ""
                            }`}
                            onClick={() =>
                                widgetStore.updateWidget(data.id, {
                                    isEditMode: !data.isEditMode,
                                })
                            }
                            title={
                                data.isEditMode
                                    ? "Switch to view mode"
                                    : "Switch to edit mode"
                            }
                        >
                            {data.isEditMode ? "View" : "Edit"}
                        </button>
                    </div>
                </div>

                <div className="widget-content relative h-full">
                    {renderWidgetContent()}
                </div>
            </div>

            <Handle
                type="source"
                position={NodePosition.Bottom}
                style={{ visibility: "hidden" }}
            />
        </>
    );
};

export default WidgetNode;
