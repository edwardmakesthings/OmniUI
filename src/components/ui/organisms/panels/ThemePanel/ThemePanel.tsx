import { BasePanel } from "../BasePanel";
import { usePanelConfig } from "@/store/uiStore"

const ThemePanel = () => {
    const themeManagerConfig = usePanelConfig('THEME_MANAGER');

    return (
        <BasePanel {...themeManagerConfig}>
            <h2 className="text-lg font-bold">Theme Manager</h2>
            <ul>
                <li>BUTTONS!</li>
            </ul>
        </BasePanel>
    );
};

export default ThemePanel;