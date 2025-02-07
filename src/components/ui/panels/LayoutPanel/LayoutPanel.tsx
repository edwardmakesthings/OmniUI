import { BasePanel } from "../BasePanel";
import { usePanelConfig } from "../../../../store/uiStore"

const LayoutPanel = () => {
    const layoutHierarchyConfig = usePanelConfig('LAYOUT_HIERARCHY');

    return (
        <BasePanel {...layoutHierarchyConfig}>
            <h2 className="text-lg font-bold">Layout Hierarchy</h2>
            <ul>
                <li>BUTTONS!</li>
            </ul>
        </BasePanel>
    );
};

export default LayoutPanel;