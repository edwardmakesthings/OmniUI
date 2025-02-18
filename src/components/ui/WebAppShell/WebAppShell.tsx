import {
    ComponentPanel,
    PropertyEditorPanel,
    ThemePanel,
} from "@/components/ui/organisms/panels";
import { usePanelVisibility } from "@/store/uiStore";
import { IconColumn } from "../molecules/IconColumn";
import { Grid } from "../atoms/Grid";

/**
 * Main application shell that manages the layout and positioning of panels
 * @component
 */

import { useState } from "react";
import { Panel, ScrollBox, Drawer, Modal } from "@/components/ui/atoms";
import { IconButton, PushButton } from "@/components/ui/atoms";
import { SearchIcon, EditIcon, XIcon } from "@/components/ui/icons";

// Panel Examples
export const PanelExamples = () => {
    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold mb-6 text-font-dark">
                Panel Examples
            </h1>

            {/* Basic Panel */}
            <Panel className="bg-bg-dark">
                <p className="text-font-dark p-1">Basic panel content</p>
            </Panel>

            {/* Panel with Header */}
            <Panel
                header={
                    <div className="flex items-center justify-between w-full">
                        <h2 className="text-lg font-medium text-font-dark">
                            Panel Title
                        </h2>
                        <IconButton
                            icon={EditIcon}
                            variant="ghost"
                            size="sm"
                            className="text-font-dark-muted hover:text-font-dark"
                        />
                    </div>
                }
                className="bg-bg-dark"
            >
                <div className="p-1">
                    <p className="text-font-dark">Panel with header content</p>
                    {/* Elevated Panel */}
                    <Panel
                        variant="elevated"
                        header={
                            <h2 className="text-lg font-medium text-font-dark">
                                Elevated Panel Inside Panel
                            </h2>
                        }
                        className="bg-bg-dark-darker shadow-lg"
                    >
                        <div className="p-1">
                            <p className="text-font-dark">
                                Elevated panel with custom padding
                            </p>
                            <p className="text-font-dark-muted mt-2">
                                Additional content with muted text
                            </p>
                        </div>
                    </Panel>
                </div>
            </Panel>

            {/* Elevated Panel */}
            <Panel
                variant="elevated"
                header={
                    <h2 className="text-lg font-medium text-font-dark">
                        Elevated Panel
                    </h2>
                }
                className="bg-bg-dark-darker shadow-lg"
            >
                <div className="p-1">
                    <p className="text-font-dark">
                        Elevated panel with custom padding
                    </p>
                    <p className="text-font-dark-muted mt-2">
                        Additional content with muted text
                    </p>
                </div>
            </Panel>
        </div>
    );
};

// ScrollBox Examples
export const ScrollBoxExamples = () => {
    const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold mb-6 text-font-dark">
                ScrollBox Examples
            </h1>

            {/* Basic ScrollBox */}
            <ScrollBox
                maxHeight={300}
                className="bg-bg-dark border border-accent-dark-neutral rounded-md"
            >
                <div className="divide-y divide-accent-dark-neutral">
                    {items.map((item) => (
                        <div
                            key={item}
                            className="p-3 text-font-dark hover:bg-bg-dark-lighter transition-colors"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </ScrollBox>

            {/* Inset ScrollBox with Cards */}
            <ScrollBox
                variant="inset"
                maxHeight={400}
                className="bg-bg-dark-darker rounded-md border border-accent-dark-neutral"
            >
                <div className="p-4 space-y-3">
                    {items.map((item) => (
                        <div
                            key={item}
                            className="bg-bg-dark p-4 rounded-md border border-accent-dark-neutral
                         hover:border-accent-dark-bright transition-colors"
                        >
                            <h3 className="text-font-dark font-medium">
                                {item}
                            </h3>
                            <p className="text-font-dark-muted mt-1">
                                Description for {item.toLowerCase()}
                            </p>
                        </div>
                    ))}
                </div>
            </ScrollBox>
        </div>
    );
};

// Drawer Examples
export const DrawerExamples = () => {
    const [leftDrawer, setLeftDrawer] = useState(false);
    const [rightDrawer, setRightDrawer] = useState(false);

    return (
        <div className="space-x-4">
            {/* Left Drawer */}
            <PushButton onClick={() => setLeftDrawer(true)}>
                Open Left Drawer
            </PushButton>
            <Drawer
                open={leftDrawer}
                onClose={() => setLeftDrawer(false)}
                variant="left"
                width={320}
            >
                <div className="p-4">
                    <h2 className="text-lg font-bold mb-4">Left Drawer</h2>
                    <p>This is a left-side drawer with custom width.</p>
                </div>
            </Drawer>

            {/* Right Drawer with Header */}
            <PushButton onClick={() => setRightDrawer(true)}>
                Open Right Drawer
            </PushButton>
            <Drawer
                open={rightDrawer}
                onClose={() => setRightDrawer(false)}
                variant="right"
                width={400}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral">
                        <h2 className="text-lg font-bold">Settings</h2>
                        <IconButton
                            icon={XIcon}
                            variant="ghost"
                            onClick={() => setRightDrawer(false)}
                        />
                    </div>
                    <div className="flex-1 p-4">
                        <p>Right drawer content with custom header.</p>
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

// Modal Examples
export const ModalExamples = () => {
    const [basicModal, setBasicModal] = useState(false);
    const [complexModal, setComplexModal] = useState(false);

    return (
        <div className="space-y-6 p-6">
            <h1 className="text-2xl font-bold mb-6 text-font-dark">
                Modal Examples
            </h1>

            <div className="space-x-4">
                {/* Basic Modal */}
                <PushButton
                    variant="bright"
                    onClick={() => setBasicModal(true)}
                >
                    Open Basic Modal
                </PushButton>

                <Modal
                    open={basicModal}
                    onClose={() => setBasicModal(false)}
                    title={
                        <h2 className="text-lg font-medium text-font-dark">
                            Basic Modal
                        </h2>
                    }
                    footer={
                        <div className="flex justify-end space-x-3">
                            <PushButton
                                variant="ghost"
                                onClick={() => setBasicModal(false)}
                            >
                                Cancel
                            </PushButton>
                            <PushButton
                                variant="bright"
                                onClick={() => setBasicModal(false)}
                            >
                                Confirm
                            </PushButton>
                        </div>
                    }
                    className="bg-bg-dark"
                >
                    <div className="p-6">
                        <p className="text-font-dark">
                            This is a basic modal with header and footer.
                        </p>
                        <p className="text-font-dark-muted mt-3">
                            Additional content can be added here.
                        </p>
                    </div>
                </Modal>

                {/* Complex Modal */}
                <PushButton
                    variant="ghost"
                    onClick={() => setComplexModal(true)}
                >
                    Open Complex Modal
                </PushButton>

                <Modal
                    open={complexModal}
                    onClose={() => setComplexModal(false)}
                    variant="elevated"
                    width={600}
                    title={
                        <div className="flex items-center space-x-3">
                            <SearchIcon className="text-font-dark" />
                            <h2 className="text-lg font-medium text-font-dark">
                                Search Results
                            </h2>
                        </div>
                    }
                    footer={
                        <div className="flex justify-between items-center">
                            <span className="text-font-dark-muted text-sm">
                                Showing 20 of 100 results
                            </span>
                            <div className="space-x-3">
                                <PushButton
                                    variant="ghost"
                                    onClick={() => setComplexModal(false)}
                                >
                                    Cancel
                                </PushButton>
                                <PushButton
                                    variant="bright"
                                    onClick={() => setComplexModal(false)}
                                >
                                    Apply
                                </PushButton>
                            </div>
                        </div>
                    }
                    className="bg-bg-dark-darker"
                >
                    <ScrollBox maxHeight={400}>
                        <div className="divide-y divide-accent-dark-neutral">
                            {Array.from({ length: 20 }, (_, i) => (
                                <div
                                    key={i}
                                    className="p-4 hover:bg-bg-dark transition-colors"
                                >
                                    <h3 className="text-font-dark font-medium">
                                        Result Item {i + 1}
                                    </h3>
                                    <p className="text-font-dark-muted mt-1">
                                        Description for result item {i + 1}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollBox>
                </Modal>
            </div>
        </div>
    );
};

// Combined Example Page
export const ContainerExamplesPage = () => {
    return (
        <div className="p-8 space-y-8">
            <section>
                <h2 className="text-xl font-bold mb-4">Panel Examples</h2>
                <PanelExamples />
            </section>

            {/* <section>
                <h2 className="text-xl font-bold mb-4">ScrollBox Examples</h2>
                <ScrollBoxExamples />
            </section> */}

            {/* <section>
                <h2 className="text-xl font-bold mb-4">Drawer Examples</h2>
                <DrawerExamples />
            </section> */}

            <section>
                <h2 className="text-xl font-bold mb-4">Modal Examples</h2>
                <ModalExamples />
            </section>
        </div>
    );
};

const WebAppShell: React.FC = () => {
    const { isVisible: themePanelVisible } =
        usePanelVisibility("THEME_MANAGER");

    return (
        <div className="w-full h-screen bg-zinc-700 text-white flex flex-col">
            <div className="flex-1 flex">
                {/* Left Panel Group */}
                {/* <div className="flex flex-row">
                    <IconColumn />
                    <ComponentPanel />
                </div> */}

                {/* Main Canvas Area */}
                <ContainerExamplesPage />
                <div className="flex-1">Canvas Area</div>

                {/* Right Panel Group */}
                {/* <div className="flex flex-col">
                    <PropertyEditorPanel />
                </div> */}
            </div>

            {/* Bottom Panel */}
            {themePanelVisible && <ThemePanel />}
            {/* <Grid mode="overlay" />
            <Grid mode="overlay" cellSize={10} />
            <Grid mode="overlay" cellSize={40} /> */}
        </div>
    );
};

export default WebAppShell;
