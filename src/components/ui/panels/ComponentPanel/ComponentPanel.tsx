import { BasePanel } from "../BasePanel";
import { usePanelConfig } from "../../../../store/uiStore"
import { ProjectHeader } from "../../elements/ProjectHeader";

const ComponentPanel = () => {
    const componentPaletteConfig = usePanelConfig('COMPONENT_PALETTE');

    return (
        <BasePanel {...componentPaletteConfig}>
            <ProjectHeader />
            <h2 className="text-lg font-bold">Component Palette</h2>
            <ul>
                <li>BUTTONS!</li>
            </ul>
        </BasePanel>
    );
};

export default ComponentPanel;