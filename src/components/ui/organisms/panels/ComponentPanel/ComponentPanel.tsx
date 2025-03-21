import { BasePanel } from "../BasePanel";
import { usePanelConfig } from "@/store/uiStore";
import ComponentThumbnail from "@/components/ui/molecules/ComponentThumbnail/ComponentThumbnail";
import { DropdownPanel } from "@/components/ui/atoms";
import { useComponents } from "@/registry";

export const ComponentPanel = () => {
    const componentPaletteConfig = usePanelConfig("COMPONENT_PALETTE");

    const { getDefinitionsByCategory } = useComponents();
    const layoutComponents = getDefinitionsByCategory("layout");
    const controlComponents = getDefinitionsByCategory("control");
    const displayComponents = getDefinitionsByCategory("display");

    return (
        <BasePanel {...componentPaletteConfig}>
            <h2 className="text-lg font-bold p-2 border-b border-accent-dark-neutral">
                Component Palette
            </h2>
            <div className="overflow-y-auto scrollbar-custom scrollbar-dark">
                {/* Layout Components */}
                <DropdownPanel
                    title="Layout"
                    defaultOpen={true}
                    contentLayout="grid"
                >
                    {layoutComponents.map((comp) => (
                        <ComponentThumbnail key={comp.id} component={comp} />
                    ))}
                </DropdownPanel>

                {/* Control Components */}
                <DropdownPanel
                    title="Control"
                    defaultOpen={true}
                    contentLayout="grid"
                >
                    {controlComponents.map((comp) => (
                        <ComponentThumbnail key={comp.id} component={comp} />
                    ))}
                </DropdownPanel>

                {/* Display Components */}
                <DropdownPanel
                    title="Display"
                    defaultOpen={true}
                    contentLayout="grid"
                >
                    {displayComponents.map((comp) => (
                        <ComponentThumbnail key={comp.id} component={comp} />
                    ))}
                </DropdownPanel>
            </div>
        </BasePanel>
    );
};

export default ComponentPanel;
