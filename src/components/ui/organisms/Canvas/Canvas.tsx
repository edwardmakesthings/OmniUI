import {
    useState,
    useRef,
    useEffect,
    useCallback,
    DragEvent,
    MouseEvent,
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
import ContainerExamples from "@/components/examples/CombinedExamples";
import { useWidgetChanges, useWidgetStore } from "@/store/widgetStore";
import WidgetNode from "./WidgetNode";
import { PositionUtils } from "@/core/types/Geometry";
import { EntityId } from "@/core/types/EntityTypes";

// Register custom node types
const nodeTypes = {
    widget: WidgetNode,
};

export const Canvas = () => {
    // Store access
    const { gridSettings } = useUIStore();
    const safeGridSize = gridSettings.gridSize || 10;
    const widgetStore = useWidgetStore();

    // ReactFlow state
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, _setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] =
        useState<ReactFlowInstance<Node, never> | null>(null);

    // Track if the user is panning (to prevent node creation during pan)
    const [isPanning, setIsPanning] = useState(false);
    const isInitialized = useRef(false);
    const flowWrapper = useRef<HTMLDivElement>(null);

    // Update nodes from widget store
    const updateNodesFromWidgets = useCallback(() => {
        // Use the convertToNodes method to get properly formatted nodes
        const formattedNodes = widgetStore.convertToNodes();
        // console.log("Setting nodes:", formattedNodes);
        setNodes(formattedNodes);
    }, [widgetStore, setNodes]);

    // Subscribe to widget changes
    useWidgetChanges(updateNodesFromWidgets);

    // Handle canvas drag over
    const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    // Handle component dropping on the canvas
    const onDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();

            if (!reactFlowInstance || isPanning) return;

            try {
                // Determine if dropping on a node or blank canvas
                const targetEl = event.target as HTMLElement;
                const isOnWidget =
                    targetEl.closest(".react-flow__node") !== null;

                // If dropping on a widget, the widget's onDrop will handle it
                if (isOnWidget) return;

                // Get drop position
                const reactFlowBounds =
                    flowWrapper.current?.getBoundingClientRect();
                if (!reactFlowBounds) return;

                // Calculate position in flow coordinates
                const clientX = event.clientX - reactFlowBounds.left;
                const clientY = event.clientY - reactFlowBounds.top;

                let position = reactFlowInstance.screenToFlowPosition({
                    x: clientX,
                    y: clientY,
                });

                // Handle grid snapping if enabled
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

                // Get drag data
                const dragData = event.dataTransfer.getData("application/json");
                if (!dragData) return;

                const parsedData = JSON.parse(dragData);
                console.log("Dropped component at:", snappedPos, parsedData);

                // Create a new widget from the dropped component
                if (parsedData.type === "component-definition") {
                    const widget = widgetStore.createWidget(
                        parsedData.label || "Widget",
                        PositionUtils.fromXYPosition(snappedPos)
                    );

                    // Add the dropped component to the widget
                    if (parsedData.definitionId) {
                        widgetStore.addComponentToWidget(
                            widget.id,
                            parsedData.definitionId,
                            {
                                x: { value: 20, unit: "px" },
                                y: { value: 20, unit: "px" },
                            } // Initial position inside widget
                        );
                    }
                }
            } catch (err) {
                console.error("Error handling drop:", err);
            }
        },
        [
            reactFlowInstance,
            gridSettings.snapToGrid,
            gridSettings.gridSize,
            isPanning,
            widgetStore,
        ]
    );

    // Handle when nodes connect - disabled for MVP
    const onConnect = useCallback((params: Connection) => {
        console.log("Connection attempt:", params);
        // Connections disabled for MVP
    }, []);

    // Handle when nodes move
    const onNodeDragStop = useCallback(
        (_event: MouseEvent, node: Node) => {
            // Update widget position in store using the node id
            widgetStore.updateWidget(node.id as EntityId, {
                position: PositionUtils.fromXYPosition(node.position),
            });
        },
        [widgetStore]
    );

    // Handle node deletion
    const onNodesDelete = useCallback(
        (nodesToDelete: Node[]) => {
            // Delete the corresponding widgets from the store
            nodesToDelete.forEach((node) => {
                widgetStore.deleteWidget(node.id as EntityId);
            });
        },
        [widgetStore]
    );

    // Initialize ReactFlow instance
    const onInit: OnInit<Node, never> = useCallback((instance) => {
        setReactFlowInstance(instance);
    }, []);

    // Handle keyboard shortcuts and interaction state
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Space + drag for panning
            if (e.code === "Space") {
                setIsPanning(true);
                document.body.style.cursor = "grab";
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
    }, []);

    // Load widgets on initial render
    useEffect(() => {
        // Initial update of nodes from widget store
        updateNodesFromWidgets();

        // If we have no widgets yet, create a default starter widget
        // BUT only do this on first mount, not after deletions
        const widgets = widgetStore.getVisibleWidgets();
        if (widgets.length === 0 && !isInitialized.current) {
            widgetStore.createWidget("Main Canvas", {
                x: { value: 100, unit: "px" },
                y: { value: 180, unit: "px" },
            });
            isInitialized.current = true;
        }
    }, [updateNodesFromWidgets, widgetStore]);

    return (
        <div className="w-full h-full relative" ref={flowWrapper}>
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
                    <Background
                        variant={BackgroundVariant.Dots} // Explicitly use dots variant
                        gap={Math.max(10, gridSettings.gridSize || 20)} // Ensure gap is always >0 and reasonable
                        size={Math.max(1, gridSettings.gridSize / 20 || 1)} // Scale dot size relative to grid
                        color={
                            gridSettings.showGrid
                                ? "rgba(100, 100, 100, 0.8)"
                                : "transparent"
                        }
                    />
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

                    {/* <div
                        className="absolute transform transition-transform"
                        style={{
                            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                        }}
                    > */}
                    {/* Canvas content */}
                    {/* <ContainerExamples /> */}
                    {/* Grid overlay */}
                    {/* <Grid
                        visible={gridSettings.showGrid}
                        cellSize={safeGridSize}
                        color="rgba(100, 100, 100, 0.2)"
                    /> */}
                    {/* <Grid mode="contained" />
                            <Grid mode="contained" cellSize={10} />
                            <Grid mode="contained" cellSize={40} /> */}
                    {/* </div> */}
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};

export default Canvas;
