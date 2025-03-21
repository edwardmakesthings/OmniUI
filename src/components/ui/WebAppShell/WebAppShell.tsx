import { useEffect, useState } from "react";
import {
    ComponentPanel,
    LayoutPanel,
    // PropertyEditorPanel,
    // ThemePanel,
} from "@/components/ui/organisms/panels";
import { IconColumn } from "../molecules/IconColumn";
import { ModalProvider } from "@/contexts/ModalContext";
import ModalContainer from "@/components/ui/modals/ModalContainer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Canvas } from "@/features/builder/components";
import { forceRefreshSystemComponents, initializeCoreSystem } from "@/core";
import DebugPanel from "@/components/debug/DebugPanel";
import PanelContainer from "@/components/ui/organisms/panels/PanelContainer/PanelContainer";
import { PanelPositionValues } from "@/core/types/UI";
import { usePanelVisibility } from "@/store";

/**
 * Main application shell that manages the layout and positioning of panels
 * @component
 * @path src/components/ui/WebAppShell/WebAppShell.tsx
 */

const WebAppShell: React.FC = () => {
    const [isInitialized, setIsInitialized] = useState(false);

    // Get panel visibility states
    const componentPanelVisibility = usePanelVisibility("COMPONENT_PALETTE");
    const layoutPanelVisibility = usePanelVisibility("LAYOUT_HIERARCHY");
    // const themePanelVisibility = usePanelVisibility("THEME_MANAGER");

    // Check if any left panel is visible
    const isAnyLeftPanelVisible =
        componentPanelVisibility.isVisible || layoutPanelVisibility.isVisible;

    // Check if bottom panel is visible
    // const isBottomPanelVisible = themePanelVisibility.isVisible;

    // Initialize component registry on mount
    // Use a state flag to ensure initialization only happens once
    useEffect(() => {
        const initializeApp = async () => {
            if (!isInitialized) {
                try {
                    // Initialize with version checking enabled
                    await initializeCoreSystem({
                        resetStores: false,
                        checkVersion: true, // Check component version
                        registerComponents: true,
                    });
                    console.log("Core system initialized successfully");
                    setIsInitialized(true);
                } catch (error) {
                    console.error("Failed to initialize core system:", error);

                    // If initialization fails, try a forced reset as fallback
                    try {
                        console.warn(
                            "Attempting emergency reset due to initialization failure"
                        );
                        await initializeCoreSystem({
                            resetStores: true,
                            forceSystemComponentRefresh: true, // Force system component refresh
                            registerComponents: true,
                        });
                        console.log(
                            "Core system initialized successfully after emergency reset"
                        );
                        setIsInitialized(true);
                    } catch (fallbackError) {
                        console.error(
                            "Critical failure during initialization:",
                            fallbackError
                        );
                    }
                }
            }
        };

        initializeApp();
    }, [isInitialized]);

    // Add a debug method to window for manual system component refresh (development only)
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") {
            (window as any).__refreshSystemComponents = async () => {
                try {
                    const result = await forceRefreshSystemComponents();

                    if (result) {
                        console.log(
                            "System components refresh complete. Reloading app..."
                        );
                        // Give time for events to propagate
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }
                } catch (error) {
                    console.error(
                        "Failed to refresh system components:",
                        error
                    );
                }
                return "Check console for results";
            };

            console.info(
                "Development helper available: window.__refreshSystemComponents() - Use to refresh all system components"
            );
        }
    }, []);

    return (
        <ThemeProvider defaultTheme="dark">
            <ModalProvider>
                <div className="relative bg-zinc-700 text-white flex flex-col w-screen h-screen">
                    {/* w-screen h-screen are for Canvas */}
                    {/* Main Canvas Area */}
                    <Canvas />
                    <DebugPanel />
                    {/* <ContainerExamples /> */}
                    {/* Left Panel Group */}
                    <div className="fixed top-0 left-0 bottom-0 z-50 h-screen flex">
                        <IconColumn />
                        {isAnyLeftPanelVisible && (
                            <PanelContainer
                                position={PanelPositionValues.Left}
                                defaultSize={320}
                                minSize={240}
                                maxSize={500}
                            >
                                <div className="flex flex-col w-full h-full">
                                    <ComponentPanel />
                                    <LayoutPanel />
                                    {/* <ThemePanel /> */}
                                </div>
                            </PanelContainer>
                        )}
                    </div>
                    {/* Right Panel Group */}
                    <div className="fixed top-0 right-0 bottom-0 z-50 max-h-screen">
                        {/*
                        <PanelContainer
                            position={PanelPositionValues.Right}
                            defaultSize={320}
                            minSize={240}
                            maxSize={500}
                        >
                            <PropertyEditorPanel />
                        </PanelContainer>
                        */}
                    </div>

                    {/* Modal Container - all app modals are rendered here */}
                    <ModalContainer />
                </div>
            </ModalProvider>
        </ThemeProvider>
    );
};

export default WebAppShell;
