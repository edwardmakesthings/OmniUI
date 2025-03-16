import { useEffect, useState } from "react";
import {
    ComponentPanel,
    LayoutPanel,
    PropertyEditorPanel,
    ThemePanel,
} from "@/components/ui/organisms/panels";
import { IconColumn } from "../molecules/IconColumn";
import { ModalProvider } from "@/contexts/ModalContext";
import ModalContainer from "@/components/ui/modals/ModalContainer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Canvas } from "@/features/builder/components";
import ContainerExamples from "@/components/examples/CombinedExamples";
import { initializeCoreSystem } from "@/core";
import { DevResetButton } from "@/store/utils";

/**
 * Main application shell that manages the layout and positioning of panels
 * @component
 */

const WebAppShell: React.FC = () => {
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize component registry on mount
    // Use a state flag to ensure initialization only happens once
    useEffect(() => {
        const initializeApp = async () => {
            if (!isInitialized) {
                try {
                    await initializeCoreSystem({ resetStores: false });
                    console.log("Core system initialized successfully");
                    setIsInitialized(true);
                } catch (error) {
                    console.error("Failed to initialize core system:", error);
                }
            }
        };

        initializeApp();
    }, [isInitialized]);

    return (
        <ThemeProvider defaultTheme="dark">
            <ModalProvider>
                <div className="relative bg-zinc-700 text-white flex flex-col w-screen h-screen">
                    {/* w-screen h-screen are for Canvas */}
                    {/* Main Canvas Area */}
                    <Canvas />
                    {/* <ContainerExamples /> */}
                    {/* Left Panel Group */}
                    <div className="grid fixed top-0 left-0 bottom-0 z-50 h-screen">
                        <IconColumn />
                        <ComponentPanel />
                        <LayoutPanel />
                        <ThemePanel />
                    </div>
                    {/* Right Panel Group */}
                    <div className="fixed top-0 right-0 bottom-0 z-50 max-h-screen">
                        {/* <PropertyEditorPanel /> */}
                    </div>
                    <DevResetButton />
                    {/* Modal Container - all app modals are rendered here */}
                    <ModalContainer />
                </div>
            </ModalProvider>
        </ThemeProvider>
    );
};

export default WebAppShell;
