import {
    ComponentPanel,
    LayoutPanel,
    PropertyEditorPanel,
    ThemePanel,
} from "@/components/ui/organisms/panels";
import { IconColumn } from "../molecules/IconColumn";
import { Grid } from "../atoms/Grid";
import { ModalProvider } from "@/contexts/ModalContext";
import ModalContainer from "@/components/ui/modals/ModalContainer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ContainerExamples from "@/components/examples/CombinedExamples";
import { Canvas } from "@/components/ui/organisms/Canvas";

/**
 * Main application shell that manages the layout and positioning of panels
 * @component
 */

const WebAppShell: React.FC = () => {
    return (
        <ThemeProvider defaultTheme="dark">
            <ModalProvider>
                <div className="relative bg-zinc-700 text-white flex flex-col">
                    {/* Main Canvas Area */}
                    <ContainerExamples />
                    {/* <Canvas /> */}
                    {/* <div className="flex-1">Canvas Area</div> */}

                    <Grid mode="contained" />
                    <Grid mode="contained" cellSize={10} />
                    <Grid mode="contained" cellSize={40} />

                    {/* Left Panel Group */}
                    <div className="grid fixed top-0 left-0 bottom-0 z-50 h-screen">
                        <IconColumn />
                        <ComponentPanel />
                        <LayoutPanel />
                        <ThemePanel />
                    </div>

                    {/* Right Panel Group */}
                    <div className="fixed top-0 right-0 bottom-0 z-50 max-h-screen">
                        <PropertyEditorPanel />
                    </div>

                    {/* Modal Container - all app modals are rendered here */}
                    <ModalContainer />
                </div>
            </ModalProvider>
        </ThemeProvider>
    );
};

export default WebAppShell;
