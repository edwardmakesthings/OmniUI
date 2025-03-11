import { useAllDefinitions } from "@/store/componentStore";
import { BasePanel } from "../BasePanel";
import { usePanelConfig } from "@/store/uiStore";
import ComponentThumbnail from "@/components/ui/molecules/ComponentThumbnail/ComponentThumbnail";
import { ComponentDefinition } from "@/core/base/ComponentDefinition";
import { useMemo } from "react";
import { DropdownPanel } from "@/components/ui/atoms";
import { useComponents } from "@/registry";

// function ComponentThumbnail({ component }: { component: ComponentDefinition }) {
//     // Use the drag hook
//     const { dragProps, isDragging } = useComponentPanelDrag(
//         component.id,
//         component.type,
//         component.label
//     );

//     return (
//         <div
//             {...dragProps}
//             className={`component-thumbnail ${isDragging ? "dragging" : ""}`}
//         >
//             {component.label}
//         </div>
//     );
// }

export const ComponentPanel = () => {
    const componentPaletteConfig = usePanelConfig("COMPONENT_PALETTE");
    const { definitions, getDefinitionsByType } = useComponents();

    const layoutComponents = getDefinitionsByType("Panel");
    const controlComponents = getDefinitionsByType("PushButton");

    // Get all available components from store
    // Use useMemo to prevent re-renders causing store updates
    const components = useAllDefinitions();

    // Handle drag start
    const handleDragStart = (
        e: React.DragEvent,
        component: ComponentDefinition
    ) => {
        console.log("Dragging component:", component.name);

        // Set the drag data with the required format
        const dragData = {
            type: "component-definition",
            definitionId: component.id,
            label: component.label || component.name,
            componentType: component.type,
        };

        // Set as JSON with the correct MIME type
        e.dataTransfer.setData("application/json", JSON.stringify(dragData));
        e.dataTransfer.effectAllowed = "move";

        // Optional: Create a ghost element for better drag feedback
        const dragElement = e.currentTarget as HTMLElement;
        if (dragElement) {
            // You can optionally customize the drag image
            e.dataTransfer.setDragImage(dragElement, 0, 0);
        }
    };

    // Use useMemo for derived data to prevent unnecessary recalculations
    // const layoutComponents = useMemo(() => {
    //     return components.filter(
    //         (comp) => comp.type === "Panel" || comp.type === "ScrollBox"
    //     );
    // }, [components]);

    // const controlComponents = useMemo(() => {
    //     return components.filter(
    //         (comp) => comp.type === "PushButton" || comp.type === "Input"
    //     );
    // }, [components]);

    // const displayComponents = useMemo(() => {
    //     return components.filter((comp) => comp.type === "Label");
    // }, [components]);

    return (
        <BasePanel {...componentPaletteConfig}>
            <h2 className="text-lg font-bold p-2 border-b border-accent-dark-neutral">
                Component Palette
            </h2>

            {/* Layout Components */}
            <DropdownPanel
                title="Layout"
                defaultOpen={true}
                contentLayout="grid"
            >
                {layoutComponents.map((comp) => (
                    <ComponentThumbnail
                        key={comp.id}
                        component={comp}
                        onDragStart={handleDragStart}
                    />
                ))}
            </DropdownPanel>

            {/* Control Components */}
            <DropdownPanel
                title="Control"
                defaultOpen={true}
                contentLayout="grid"
            >
                {controlComponents.map((comp) => (
                    <ComponentThumbnail
                        key={comp.id}
                        component={comp}
                        onDragStart={handleDragStart}
                    />
                ))}
            </DropdownPanel>

            {/* Display Components */}
            {/* <DropdownPanel
                title="Display"
                defaultOpen={true}
                contentLayout="grid"
            >
                {displayComponents.map((comp) => (
                    <ComponentThumbnail
                        key={comp.id}
                        component={comp}
                        onDragStart={handleDragStart}
                    />
                ))}
            </DropdownPanel> */}
        </BasePanel>
    );
};

export default ComponentPanel;
