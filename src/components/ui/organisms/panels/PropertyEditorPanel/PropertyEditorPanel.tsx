import { BasePanel } from "../BasePanel";
import { usePanelConfig } from "@/store/uiStore"

const PropertyEditorPanel = () => {
    const themeManagerConfig = usePanelConfig('PROPERTY_EDITOR');

    return (
        <BasePanel {...themeManagerConfig}>
            <h2 className="text-lg font-bold">Property Editor</h2>
            <form>
                <label>
                    Property 1:
                    <input type="text" />
                </label>
                <label>
                    Property 2:
                    <input type="text" />
                </label>
            </form>
        </BasePanel>
    );
};

export default PropertyEditorPanel;