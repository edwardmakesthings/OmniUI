import {
    useState,
    useRef,
    useEffect,
    useCallback,
    DragEvent,
    MouseEvent,
    memo,
} from "react";
import {
    Background,
    Controls,
    Node,
    ConnectionMode,
    useNodesState,
    useEdgesState,
    Panel,
    ReactFlow,
    ReactFlowProvider,
    ReactFlowInstance,
    Connection,
    OnInit,
    BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useUIStore } from "@/store/uiStore";
// import ContainerExamples from "@/components/examples/CombinedExamples";
import {
    useWidgetChanges,
    useWidgetStore,
} from "@/features/builder/stores/widgetStore";
import WidgetNode from "./WidgetNode";
import { PositionUtils } from "@/core/types/Geometry";
import { EntityId } from "@/core/types/EntityTypes";
import { eventBus } from "@/core/eventBus/eventBus";
import { useEventSubscription } from "@/hooks/useEventBus";
import { builderService } from "@/services/builderService";

// Register custom node types for ReactFlow
const nodeTypes = {
    widget: WidgetNode,
};

/**
 * Canvas component that serves as the main editing area
 * Handles widget placement, drag-drop of components, and selection
 *
 * @path src/features/builder/components/Canvas.tsx
 */
export const Canvas = memo(function Canvas() {
    // Store access
    const { gridSettings } = useUIStore();
    const widgetStore = useWidgetStore();
    const selectionState = useUIStore();

    // Ensure grid size is valid
    const safeGridSize = Math.max(5, gridSettings.gridSize || 10);

    // ReactFlow state
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, _setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance<Node, never> | null>(null);

    // UI interaction state
    const [isPanning, setIsPanning] = useState(false);
    const isInitialized = useRef(false);
    const flowWrapper = useRef<HTMLDivElement>(null);

    /**
     * Updates the ReactFlow nodes from the widget store
     */
    const updateNodesFromWidgets = useCallback(() => {
        const formattedNodes = widgetStore.convertToNodes();
        setNodes(formattedNodes);
    }, [widgetStore, setNodes]);

    /**
     * Force a refresh of the canvas and all nodes
     */
    const refreshCanvas = useCallback(() => {
        updateNodesFromWidgets();
    }, [updateNodesFromWidgets]);

    // Subscribe to widget changes using the hook
    useWidgetChanges(refreshCanvas);

    // Subscribe to the event bus for widget events
    useEventSubscription("widget:updated", refreshCanvas, [refreshCanvas]);
    useEventSubscription("widget:created", refreshCanvas, [refreshCanvas]);
    useEventSubscription("widget:deleted", refreshCanvas, [refreshCanvas]);

    /**
     * Handle background canvas click to deselect all
     */
    const handleCanvasClick = useCallback(
        (e: React.MouseEvent) => {
            selectionState.deselectAll();
            eventBus.publish("component:deselected", {});
        },
        [selectionState]
    );

    /**
     * Handle dragOver for component dropping
     */
    const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    /**
     * Create a new widget with the dropped component
     */
    const createWidgetFromDrop = useCallback(
        (position: { x: number; y: number }, dragData: any) => {
            try {
                // Create widget with a meaningful name
                const widgetLabel = dragData.label
                    ? `${dragData.label} Widget`
                    : "New Widget";

                // Create the widget using the builder service
                const widget = builderService.createWidget(
                    widgetLabel,
                    PositionUtils.fromXYPosition(position)
                );

                if (!widget?.id) {
                    throw new Error("Failed to create widget");
                }

                // Add the dropped component to the widget if it has a definition
                if (dragData.definitionId) {
                    builderService.addComponentToWidget(
                        widget.id,
                        dragData.definitionId,
                        {
                            x: { value: 20, unit: "px" },
                            y: { value: 20, unit: "px" },
                        },
                        {
                            autoSelect: true,
                            openPropertyPanel: true,
                        }
                    );
                }

                // Publish widget creation event
                eventBus.publish("widget:created", {
                    widgetId: widget.id,
                });

                // Notify about deletion
                eventBus.publish("widget:updated", {
                    widgetId: widget.id,
                });

                return widget.id;
            } catch (error) {
                console.error("Error creating widget from drop:", error);
                return null;
            }
        },
        [selectionState]
    );

    /**
     * Handle component dropping on the canvas
     */
    const onDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            // Don't process if instance isn't ready or we're panning
            if (!reactFlowInstance || isPanning) return;

            try {
                // Determine if we're dropping on a node or empty canvas
                const targetEl = event.target as HTMLElement;
                const isOnWidget =
                    targetEl.closest(".react-flow__node") !== null;

                // If dropping on a widget, let the widget's drop handler handle it
                if (isOnWidget) return;

                // Get drop position in flow coordinates
                const reactFlowBounds =
                    flowWrapper.current?.getBoundingClientRect();
                if (!reactFlowBounds) return;

                // Calculate position
                const clientX = event.clientX - reactFlowBounds.left;
                const clientY = event.clientY - reactFlowBounds.top;
                const position = reactFlowInstance.screenToFlowPosition({
                    x: clientX,
                    y: clientY,
                });

                // Apply grid snapping if enabled
                const snappedPos = gridSettings.snapToGrid
                    ? {
                          x:
                              Math.round(position.x / safeGridSize) *
                              safeGridSize,
                          y:
                              Math.round(position.y / safeGridSize) *
                              safeGridSize,
                      }
                    : position;

                // Process the dropped component
                const dragDataStr =
                    event.dataTransfer.getData("application/json");
                if (!dragDataStr) return;

                const dragData = JSON.parse(dragDataStr);

                // Create a new widget if dropping a component definition
                if (dragData.type === "component-definition") {
                    // Create widget from the drop
                    const newWidgetId = createWidgetFromDrop(
                        snappedPos,
                        dragData
                    );

                    if (newWidgetId) {
                        // Refresh canvas to show the new widget
                        refreshCanvas();
                    }
                }
            } catch (err) {
                console.error("Error handling drop on canvas:", err);
            }
        },
        [
            reactFlowInstance,
            isPanning,
            gridSettings.snapToGrid,
            safeGridSize,
            createWidgetFromDrop,
            refreshCanvas,
        ]
    );

    /**
     * Handle connections between nodes (disabled in MVP)
     */
    const onConnect = useCallback((params: Connection) => {
        console.log("Connection attempt:", params);
        // Connections disabled for MVP
    }, []);

    /**
     * Handle node drag stop - update widget position
     */
    const onNodeDragStop = useCallback((_event: MouseEvent, node: Node) => {
        // Use builder service to update widget position
        builderService.updateWidgetPosition(
            node.id as EntityId,
            PositionUtils.fromXYPosition(node.position)
        );

        // Publish widget update event
        eventBus.publish("widget:updated", {
            widgetId: node.id,
            action: "moved",
        });
    }, []);

    /**
     * Handle node deletion
     */
    const onNodesDelete = useCallback(
        (nodesToDelete: Node[]) => {
            nodesToDelete.forEach((node) => {
                // Use builder service to delete widgets
                builderService.deleteWidget(node.id as EntityId);

                // Publish widget deletion event
                eventBus.publish("widget:deleted", {
                    widgetId: node.id,
                });
            });

            // Refresh canvas
            refreshCanvas();
        },
        [refreshCanvas]
    );

    /**
     * Initialize ReactFlow when ready
     */
    const onInit: OnInit<Node, never> = useCallback((instance) => {
        setReactFlowInstance(instance);
    }, []);

    /**
     * Handle keyboard shortcuts for interaction modes
     */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Space + drag for panning
            if (e.code === "Space") {
                setIsPanning(true);
                document.body.style.cursor = "grab";
            }

            // Delete key for deleting selected widget
            if (
                (e.key === "Delete" || e.key === "Backspace") &&
                selectionState.selectedWidgetId &&
                !selectionState.selectedComponentId
            ) {
                builderService.deleteWidget(selectionState.selectedWidgetId);
                selectionState.deselectAll();

                eventBus.publish("widget:deleted", {
                    widgetId: selectionState.selectedWidgetId,
                });

                refreshCanvas();
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "Space") {
                setIsPanning(false);
                document.body.style.cursor = "default";
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [selectionState, refreshCanvas]);

    /**
     * Initialize the canvas with default widgets if needed
     */
    useEffect(() => {
        // Update nodes from widget store
        updateNodesFromWidgets();

        // Create a default starter widget on first mount if none exist
        const widgets = widgetStore.getVisibleWidgets();
        if (widgets.length === 0 && !isInitialized.current) {
            const defaultWidget = builderService.createWidget("Main Canvas", {
                x: { value: 100, unit: "px" },
                y: { value: 180, unit: "px" },
            });

            if (defaultWidget) {
                // Publish widget creation event
                eventBus.publish("widget:created", {
                    widgetId: defaultWidget.id,
                });
            }

            isInitialized.current = true;
        }
    }, [updateNodesFromWidgets, widgetStore]);

    return (
        <div
            className="w-full h-full relative canvas-container"
            ref={flowWrapper}
            data-testid="canvas"
        >
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={onInit}
                    onDrop={onDrop}
                    onClick={handleCanvasClick}
                    onDragOver={onDragOver}
                    onNodeDragStop={onNodeDragStop}
                    onNodesDelete={onNodesDelete}
                    connectionMode={ConnectionMode.Loose}
                    deleteKeyCode="Delete"
                    snapToGrid={gridSettings.snapToGrid}
                    snapGrid={[safeGridSize, safeGridSize]}
                    fitView
                    attributionPosition="bottom-right"
                    nodesDraggable={true}
                    elementsSelectable={true}
                    selectNodesOnDrag={false}
                >
                    {/* Background grid */}
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={Math.max(10, gridSettings.gridSize || 20)}
                        size={Math.max(1, gridSettings.gridSize / 20 || 1)}
                        color={
                            gridSettings.showGrid
                                ? "rgba(100, 100, 100, 0.8)"
                                : "transparent"
                        }
                    />

                    {/* Canvas controls */}
                    <Controls />

                    {/* Info panel */}
                    <Panel
                        position="bottom-center"
                        className="bg-bg-dark bg-opacity-75 p-2 rounded text-font-dark text-sm"
                    >
                        <div className="text-xs text-font-dark-muted">
                            Drag components onto canvas • Scroll to zoom • Drag
                            in empty space to pan
                        </div>
                    </Panel>
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
});

export default Canvas;
