import { ComponentPanel, PropertyEditorPanel, ThemePanel } from '../panels';
import { usePanelVisibility } from '../../../store/uiStore';
import { IconColumn } from '../elements/IconColumn';
import { Grid } from '../elements/Grid';

/**
 * Main application shell that manages the layout and positioning of panels
 * @component
 */
const WebAppShell: React.FC = () => {
    const { isVisible: themePanelVisible } = usePanelVisibility('THEME_MANAGER')

    return (
        <div className="w-full h-screen bg-zinc-700 text-white flex flex-col">
            <div className="flex-1 flex">
                {/* Left Panel Group */}
                <div className="flex flex-row">
                    {/* <IconColumn /> */}
                    <IconColumn />
                    <ComponentPanel />
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1">
                    Canvas Area
                </div>

                {/* Right Panel Group */}
                <div className="flex flex-col">
                    <PropertyEditorPanel />
                </div>
            </div>

            {/* Bottom Panel */}
            {themePanelVisible && (
                <ThemePanel />
            )}
            <Grid mode="overlay" />
            <Grid mode="overlay" cellSize={10} />
            <Grid mode="overlay" cellSize={40} />
        </div>
    );
};

export default WebAppShell;