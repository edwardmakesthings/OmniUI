import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useUIStore, PANEL_IDS } from "@/store/uiStore";
import { useWidgetStore } from "@/store/widgetStore";
import { EntityId } from "@/core/types/EntityTypes";
import { Handle, Position as NodePosition } from "@xyflow/react";
import { ScrollBox } from "@/components/ui/atoms";
import { useComponentStore } from "@/store/componentStore";
import { useComponentRegistry } from "@/registry";
import { useWidgetDropTarget } from "@/core/dragDrop/widgetHooks";
import { ComponentDragDropHelper } from "@/core/dragDrop/ComponentDragDropHelper";
import { Position } from "@/core/types/Geometry";
import { notifyWidgetChange } from "@/core/eventBus/widgetEvents";
import {
    renderComponentHierarchy,
    useWidgetComponentChanges,
} from "@/registry/ComponentWithDragDrop";

export const WidgetNode = ({ data, selected = false }) => {
    // Stores
    const widgetStore = useWidgetStore.getState();
    const uiStore = useUIStore.getState();
    const registry = useComponentRegistry.getState();

    // State and refs
    const [selectedComponentId, setSelectedComponentId] =
        useState<EntityId | null>(null);
    const [propertyEditorOpen, setPropertyEditorOpen] = useState(false);
    const [forceRender, setForceRender] = useState(0);

    const widgetRef = useRef<HTMLDivElement>(null);
    // const selectedComponentRef = useRef<HTMLDivElement | null>(null);
    // const dragStartPos = useRef({ x: 0, y: 0 });
    const previousDimensionsRef = useRef({
        width: data.size.width.value,
        height: data.size.height.value,
    });

    // Handle component addition
    const handleComponentAdded = useCallback((newComponentId: EntityId) => {
        setSelectedComponentId(newComponentId);
        // setForceRender((prev) => prev + 1);
    }, []);

    // Handle component selection
    const handleComponentSelect = useCallback(
        (componentId: EntityId, event?: React.MouseEvent) => {
            if (event) {
                event.stopPropagation();
            }

            // Update the selected component ID - this triggers a rerender
            setSelectedComponentId(componentId);

            // Log for debugging
            console.log(`Set selected component ID to: ${componentId}`);

            // Get the component's instance ID
            const component = data.components.find((c) => c.id === componentId);
            if (!component || !component.instanceId) {
                console.warn(
                    `Component ${componentId} not found or has no instanceId`
                );
                return;
            }

            // Set component as selected in the UI store
            uiStore.selectComponent(component.instanceId);

            // Open property editor if needed
            const propertyEditorConfig =
                uiStore.panelStates[PANEL_IDS.PROPERTY_EDITOR];
            if (!propertyEditorConfig?.isVisible) {
                uiStore.togglePanel(PANEL_IDS.PROPERTY_EDITOR);
                setPropertyEditorOpen(true);
            }

            // Sync with layout hierarchy
            const layoutHierarchy = window._layoutHierarchyStore;
            if (layoutHierarchy?.selectItem) {
                layoutHierarchy.selectItem(`${data.id}/${componentId}`);
            }

            // Force a re-render
            setForceRender((prev) => prev + 1);
        },
        [data.id, data.components, uiStore]
    );

    // Handle widget background click to deselect
    const handleWidgetBackgroundClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === e.currentTarget) {
                setSelectedComponentId(null);
                uiStore.selectComponent(null);
            }
        },
        [uiStore]
    );

    // Handle component deletion
    const handleDeleteComponent = useCallback(
        (componentId: EntityId, e?: React.MouseEvent) => {
            if (e) {
                e.stopPropagation();
            }

            // Deselect if deleting selected component
            if (selectedComponentId === componentId) {
                setSelectedComponentId(null);
                uiStore.selectComponent(null);
            }

            // Remove from widget
            widgetStore.removeComponent(data.id, componentId);

            // Trigger the layout hierarchy update
            notifyWidgetChange(data.id, "componentRemoved");
        },
        [data.id, selectedComponentId, uiStore, widgetStore]
    );

    // Set up drop target for widget background
    const { dropProps, isOver } = useWidgetDropTarget(
        data.id,
        data.isEditMode,
        handleComponentAdded
    );

    // Handler for widget action buttons
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

    // Subscribe to widget component changes to force re-render
    useWidgetComponentChanges(data.id, () => {
        setForceRender((prev) => prev + 1);
    });

    // Get component instances for root components
    const rootComponents = data.components
        .filter((comp) => !comp.parentId)
        .sort((a, b) => a.zIndex - b.zIndex);

    const isComponentSelected = useCallback(
        (componentId: EntityId) => {
            return componentId === selectedComponentId;
        },
        [selectedComponentId]
    );

    // In both view and edit mode, use the same rendering approach
    const renderWidgetContent = () => (
        <div
            className="h-full widget-content-container"
            onClick={handleWidgetBackgroundClick}
            {...dropProps}
        >
            <ScrollBox className="h-full widget-scroll-container">
                <div className="flex flex-col gap-2 p-2">
                    {rootComponents.map((comp) => {
                        console.log(
                            `Rendering root component ${
                                comp.id
                            }, selected ID: ${selectedComponentId}, match: ${isComponentSelected(
                                comp.id
                            )}`
                        );
                        return registry.renderComponentHierarchy(
                            comp.instanceId,
                            data.id,
                            {
                                isEditMode: data.isEditMode,
                                isSelected: isComponentSelected(comp.id),
                                onSelect: handleComponentSelect,
                                onDelete: handleDeleteComponent,
                                actionHandler: handleAction,
                                dragDropEnabled: data.isEditMode,
                            },
                            selectedComponentId
                        );
                    })}
                </div>
            </ScrollBox>
        </div>
    );

    // Add CSS styles for component editing
    useEffect(() => {
        const styleId = "widget-component-styles";

        if (document.getElementById(styleId)) {
            return;
        }

        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            /* Component container styles */
            .component-container {
                position: relative;
                transition: all 0.15s ease;
                border-radius: 3px;
                width: 100%;
            }

            /* Selected component highlighting */
            .component-container.selected-component {
                outline: 2px solid #3b82f6 !important;
                z-index: 5;
                box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
            }

            /* Hover state */
            .component-container:hover {
                outline: 1px solid rgba(59, 130, 246, 0.3);
            }

            /* Dragging state */
            .component-container.dragging-component {
                opacity: 0.7;
                cursor: grabbing;
                transform: scale(1.02);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                outline: 2px dashed #4e9bff;
                z-index: 1000;
            }

            /* Drop target highlighting */
            .component-container.drop-target {
                background-color: rgba(100, 165, 115, 0.1);
                outline: 2px dashed #64a573;
            }

            /* Empty container styling */
            .component-container.empty-container {
                min-height: 80px;
                border: 2px dashed rgba(100, 100, 100, 0.3);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* Container component minimum size */
            [data-widget-id][data-edit-mode="true"] [data-component-type="Panel"],
            [data-widget-id][data-edit-mode="true"] [data-component-type="ScrollBox"] {
                min-height: 80px;
                width: 100%;
            }

            /* Child container styling */
            .panel-children-container,
            .scrollbox-children-container {
                position: relative;
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding: 8px;
                min-height: 50px;
            }

            /* Delete button styling */
            .delete-button {
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .component-container.selected-component .delete-button {
                opacity: 1;
            }

            /* Drop indicators */
            .drop-indicator {
                pointer-events: none;
                transition: opacity 0.2s ease;
                z-index: 100;
            }
        `;

        document.head.appendChild(style);

        return () => {
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                document.head.removeChild(styleElement);
            }
        };
    }, []);

    // Monitor selected component ID changes
    useEffect(() => {
        if (selectedComponentId) {
            console.log(
                `WidgetNode: selectedComponentId changed to ${selectedComponentId}`
            );
        }
    }, [selectedComponentId]);

    // For auto-sizing in edit mode
    useEffect(() => {
        // Only apply auto-sizing in edit mode
        if (!data.isEditMode) return;

        // Find all components in the widget
        const widgetElement = widgetRef.current;
        if (!widgetElement) return;

        // Skip if resized recently
        const now = Date.now();
        const lastResizeTime = widgetElement.getAttribute(
            "data-last-resize-time"
        );
        if (lastResizeTime && now - parseInt(lastResizeTime) < 500) return;

        // Use a slight delay to ensure components have rendered
        const resizeTimer = setTimeout(() => {
            const allComponents = widgetElement.querySelectorAll(
                "[data-component-id]"
            );

            if (allComponents.length === 0) return;

            // Calculate total size needed
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

            // Get current dimensions
            const currentWidth = data.size.width.value;
            const currentHeight = data.size.height.value;

            // Calculate new dimensions
            const newWidth = Math.max(currentWidth, maxRight + padding);
            const newHeight = Math.max(currentHeight, maxBottom + padding);

            // Check if dimensions changed significantly
            const widthDiff = Math.abs(
                newWidth - previousDimensionsRef.current.width
            );
            const heightDiff = Math.abs(
                newHeight - previousDimensionsRef.current.height
            );

            if (widthDiff > 10 || heightDiff > 10) {
                // Store the new dimensions
                previousDimensionsRef.current = {
                    width: newWidth,
                    height: newHeight,
                };
                widgetStore.updateWidget(data.id, {
                    size: {
                        width: {
                            value: newWidth,
                            unit: "px",
                        },
                        height: {
                            value: newHeight,
                            unit: "px",
                        },
                    },
                });

                // Mark the time of the resize
                widgetElement.setAttribute(
                    "data-last-resize-time",
                    Date.now().toString()
                );
            }
        }, 300); // Delay to ensure render

        return () => clearTimeout(resizeTimer);
    }, [
        data.isEditMode,
        data.id,
        data.size.width.value,
        data.size.height.value,
        widgetStore,
        forceRender,
        rootComponents.length,
        widgetStore,
    ]);

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
                } ${isOver ? "bg-accent-dark-neutral/20" : ""}`}
                style={{
                    width: data.size.width.value,
                    height: data.size.height.value,
                    minWidth: 200,
                    minHeight: 100,
                }}
                data-widget-id={data.id}
                data-edit-mode={data.isEditMode ? "true" : "false"}
                // {...dropProps}
            >
                {/* Widget header */}
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

                {/* Widget content */}
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
