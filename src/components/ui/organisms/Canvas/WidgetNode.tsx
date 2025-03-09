import { EntityId } from "@/core/types/EntityTypes";
import { UnitType } from "@/core/types/Measurement";
import { useAllInstances } from "@/store/componentStore";
import { useWidgetStore, Widget } from "@/store/widgetStore";
import { Handle, Position as NodePosition } from "@xyflow/react";
import {
    DragEvent,
    MouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { ScrollBox } from "../../atoms";
import { resolveComponent } from "./componentResolver";

interface WidgetNodeProps {
    data: Widget;
    selected?: boolean;
}

export const WidgetNode = ({ data, selected = false }: WidgetNodeProps) => {
    const widgetStore = useWidgetStore();
    const componentInstances = useAllInstances();

    // State for tracking component dragging inside widget
    const [draggedComponent, setDraggedComponent] = useState<EntityId | null>(
        null
    );
    const dragStartPos = useRef({ x: 0, y: 0 });
    const widgetRef = useRef<HTMLDivElement>(null);

    // Find actual component instances for the widget components
    const resolvedComponents = data.components.map((comp) => {
        const instance = componentInstances.find(
            (inst) => inst.id === comp.instanceId
        );
        return {
            ...comp,
            instance,
        };
    });

    // Allow dropping components into widgets
    const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    // Handle component drops inside this widget
    const onDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation(); // Prevent it from bubbling to canvas

            try {
                // Get drag data
                const dragData = event.dataTransfer.getData("application/json");
                if (!dragData) return;

                const parsedData = JSON.parse(dragData);

                // Get drop position relative to the widget
                const rect = event.currentTarget.getBoundingClientRect();
                const position = {
                    x: {
                        value: event.clientX - rect.left,
                        unit: "px" as UnitType,
                    },
                    y: {
                        value: event.clientY - rect.top,
                        unit: "px" as UnitType,
                    },
                };

                // Add component to widget
                if (parsedData.type === "component-definition") {
                    widgetStore.addComponentToWidget(
                        data.id,
                        parsedData.definitionId,
                        position
                    );
                }
            } catch (err) {
                console.error("Error handling drop in widget:", err);
            }
        },
        [data.id, widgetStore]
    );

    // Start dragging a component inside the widget
    const handleComponentDragStart = useCallback(
        (event: MouseEvent, componentId: EntityId) => {
            if (!data.isEditMode || event.button !== 0) return;

            // Prevent default to avoid text selection
            event.preventDefault();

            setDraggedComponent(componentId);

            // Record start position for drag
            dragStartPos.current = {
                x: event.clientX,
                y: event.clientY,
            };

            // Set cursor to indicate dragging
            document.body.style.cursor = "grabbing";

            // Prevent other events
            event.stopPropagation();
        },
        [data.isEditMode]
    );

    // Handle component dragging - mousemove event handler
    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!draggedComponent || !data.isEditMode) return;

            // Calculate delta from start position
            const deltaX = e.clientX - dragStartPos.current.x;
            const deltaY = e.clientY - dragStartPos.current.y;

            // Only update if there's meaningful movement
            if (Math.abs(deltaX) < 2 && Math.abs(deltaY) < 2) return;

            // Find the component being dragged
            const component = data.components.find(
                (comp) => comp.id === draggedComponent
            );
            if (!component) return;

            // Update position
            const newPosition = {
                x: {
                    value: component.position.x.value + deltaX,
                    unit: component.position.x.unit,
                },
                y: {
                    value: component.position.y.value + deltaY,
                    unit: component.position.y.unit,
                },
            };

            // Use the existing updateComponent method directly
            widgetStore.updateComponent(data.id, draggedComponent, {
                position: newPosition,
            });

            // Reset drag start for next delta calculation
            dragStartPos.current = {
                x: e.clientX,
                y: e.clientY,
            };
        },
        [
            draggedComponent,
            data.id,
            data.isEditMode,
            data.components,
            widgetStore,
        ]
    );

    // End component dragging
    const handleMouseUp = useCallback(() => {
        if (draggedComponent) {
            setDraggedComponent(null);
            document.body.style.cursor = "default";
        }
    }, [draggedComponent]);

    // Toggle edit mode for this widget
    const toggleEditMode = () => {
        widgetStore.updateWidget(data.id, {
            isEditMode: !data.isEditMode,
        });
    };

    // Handle deleting a component
    const handleDeleteComponent = (componentId: EntityId) => {
        widgetStore.removeComponent(data.id, componentId);
    };

    // Handle widget actions (show/hide/toggle other widgets)
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
                default:
                    console.log(`Unhandled action: ${action}`);
            }
        },
        [widgetStore]
    );

    // Add mouse event listeners to document for drag handling
    useEffect(() => {
        if (draggedComponent) {
            const handleDocMouseMove = (e: any) =>
                handleMouseMove(e as MouseEvent);
            const handleDocMouseUp = () => handleMouseUp();

            document.addEventListener("mousemove", handleDocMouseMove as any);
            document.addEventListener("mouseup", handleDocMouseUp);

            return () => {
                document.removeEventListener(
                    "mousemove",
                    handleDocMouseMove as any
                );
                document.removeEventListener("mouseup", handleDocMouseUp);
            };
        }
    }, [draggedComponent, handleMouseMove, handleMouseUp]);

    return (
        <>
            {/* ReactFlow requires at least one handle for connections (even if not used) */}
            <Handle
                type="target"
                position={NodePosition.Top}
                style={{ visibility: "hidden" }}
            />

            <div
                ref={widgetRef}
                className={`bg-bg-dark border rounded shadow-lg ${
                    selected
                        ? "border-accent-primary"
                        : "border-accent-dark-neutral"
                }`}
                style={{
                    width: data.size.width.value,
                    height: data.size.height.value,
                    minWidth: 200,
                    minHeight: 100,
                }}
            >
                <div className="widget-header flex justify-between items-center p-2 border-b border-accent-dark-neutral">
                    <div className="font-bold text-font-dark truncate max-w-[70%]">
                        {data.label}
                    </div>
                    <div className="flex gap-1">
                        <button
                            className="text-xs px-2 py-0.5 bg-accent-dark-neutral rounded hover:bg-accent-dark"
                            onClick={toggleEditMode}
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

                <div
                    className="widget-content p-2 relative"
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    style={{ height: "calc(100% - 36px)", overflow: "auto" }}
                >
                    {data.isEditMode ? (
                        <div className="h-full relative">
                            {resolvedComponents.length === 0 ? (
                                <div className="text-sm italic text-center p-4 text-font-dark-muted">
                                    Drop components here
                                </div>
                            ) : (
                                <div className="relative w-full h-full">
                                    {resolvedComponents.map((comp) => (
                                        <div
                                            key={comp.id}
                                            className={`absolute border ${
                                                draggedComponent === comp.id
                                                    ? "border-accent-primary bg-accent-dark-neutral/30"
                                                    : "border-dashed border-accent-dark-neutral bg-bg-dark-accent"
                                            } rounded group cursor-grab ${
                                                draggedComponent === comp.id
                                                    ? "z-10"
                                                    : ""
                                            }`}
                                            style={{
                                                left: comp.position.x.value,
                                                top: comp.position.y.value,
                                                width: comp.size.width.value,
                                                height: comp.size.height.value,
                                                zIndex: comp.zIndex,
                                            }}
                                            onMouseDown={(e) =>
                                                handleComponentDragStart(
                                                    e,
                                                    comp.id
                                                )
                                            }
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="p-1 text-xs text-font-dark-muted">
                                                {comp.instance?.type}:{" "}
                                                {comp.instance?.label ||
                                                    "Component"}
                                                {/* Component actions that appear on hover */}
                                                <button
                                                    className="absolute top-1 right-1 text-xs text-accent-dark-neutral invisible group-hover:visible hover:text-accent-primary"
                                                    onClick={() =>
                                                        handleDeleteComponent(
                                                            comp.id
                                                        )
                                                    }
                                                    title="Delete component"
                                                >
                                                    ✕
                                                </button>
                                            </div>

                                            {/* If the component has action bindings, show an indicator */}
                                            {comp.actionBindings && (
                                                <div className="absolute bottom-1 right-1 text-xs text-accent-primary">
                                                    ⚡
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        // Render actual components in view mode
                        <ScrollBox className="h-full">
                            <div className="space-y-2">
                                {resolvedComponents.map((comp) => {
                                    if (!comp.instance) return null;

                                    // Use the component resolver to render the appropriate component
                                    return resolveComponent(
                                        comp.instance,
                                        data.id,
                                        handleAction
                                    );
                                })}
                            </div>
                        </ScrollBox>
                    )}
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
