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

import { ComponentType, useState } from "react";
import { Panel, ScrollBox, Drawer, Modal, Tabs } from "@/components/ui/atoms";
import { IconButton, PushButton } from "@/components/ui/atoms";
import {
    SearchIcon,
    EditIcon,
    XIcon,
    GearIcon,
    StarIcon,
} from "@/components/ui/icons";
import ListView from "../atoms/ListView/ListView";
import ListItem, { ListItemMetadata } from "../atoms/ListView/ListItem";
import { IconProps } from "@/lib/icons/types";

// Panel Examples
export const PanelExamples = () => {
    return (
        <div className="space-y-6">
            {/* Basic Panel */}
            <Panel header="Unstyled header">
                <p>Basic, unstyled panel content</p>
            </Panel>

            <Panel header="Unstyled header (elevated)" variant="elevated">
                <p>Basic, unstyled panel content</p>
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
                <p className="text-font-dark m-1 mt-0">
                    Panel with header content
                </p>
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
            </Panel>

            {/* Elevated Panel */}
            <Panel
                variant="elevated"
                header={
                    <h2 className="text-lg font-medium text-font-dark">
                        Elevated Panel
                    </h2>
                }
                className="bg-bg-dark-darker shadow-lg rounded-lg w-66"
            >
                <p className="text-font-dark">
                    Elevated panel with custom padding, rounded corners, and set
                    width.
                </p>
                <p className="text-font-dark-muted mt-2">
                    Additional content with muted text
                </p>
            </Panel>
        </div>
    );
};

// ScrollBox Examples
export const ScrollBoxExamples = () => {
    const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

    return (
        <div className="space-y-6">
            {/* Unstyled ScrollBox */}
            <ScrollBox maxHeight={300}>
                <div className="divide-y divide-accent-dark-neutral">
                    {items.map((item) => (
                        <div
                            key={item}
                            className="text-font-dark hover:bg-bg-dark-lighter transition-colors"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </ScrollBox>

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
    const [rightUnstyledDrawer, setRightUnstyledDrawer] = useState(false);
    const [topDrawer, setTopDrawer] = useState(false);

    return (
        <div className="space-y-6">
            {/* Left Drawer Example */}
            <PushButton onClick={() => setLeftDrawer(true)}>
                Left Drawer
            </PushButton>
            <Drawer
                open={leftDrawer}
                onClose={() => setLeftDrawer(false)} // This function will be called by backdrop click and Escape
                variant="left"
                width={480}
                showOverlay={false}
            >
                <div className="flex flex-col h-screen">
                    {/* Header - Fixed height */}
                    <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral shrink-0">
                        <h2 className="text-lg font-bold">Drawer Title</h2>
                        <IconButton
                            icon={XIcon}
                            variant="ghost"
                            onClick={() => setLeftDrawer(false)}
                        />
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {/* Demo content */}
                        {Array.from({ length: 50 }, (_, i) => (
                            <div
                                key={i}
                                className="mb-4 p-4 bg-bg-dark-darker border border-accent-dark-neutral rounded"
                            >
                                <h3 className="text-font-dark font-medium">
                                    Item {i + 1}
                                </h3>
                                <p className="text-font-dark-muted mt-2">
                                    This is a long content item that
                                    demonstrates proper scrolling behavior in
                                    the drawer content area.
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Footer - Fixed height */}
                    <div className="flex justify-end gap-2 p-4 border-t border-accent-dark-neutral shrink-0">
                        <PushButton
                            variant="ghost"
                            onClick={() => setLeftDrawer(false)}
                        >
                            Cancel
                        </PushButton>
                        <PushButton variant="bright">Save</PushButton>
                    </div>
                </div>
            </Drawer>

            {/* Right Drawer Unstyled Example */}
            <PushButton onClick={() => setRightUnstyledDrawer(true)}>
                Right Drawer (Unstyled)
            </PushButton>
            <Drawer
                open={rightUnstyledDrawer}
                onClose={() => setRightUnstyledDrawer(false)}
                variant="right"
                width={400}
            >
                <Panel header="Unstyled Test">
                    <p>Unstyled right drawer content with custom width.</p>
                </Panel>
            </Drawer>

            {/* Right Drawer Example */}
            <PushButton onClick={() => setRightDrawer(true)}>
                Right Drawer
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
                        {/* Fixed: Properly calling setRightDrawer */}
                        <IconButton
                            icon={XIcon}
                            variant="ghost"
                            onClick={() => setRightDrawer(false)}
                        />
                    </div>
                    <div className="flex-1 p-4 overflow-auto">
                        <p>Right drawer content with custom width.</p>
                    </div>
                </div>
            </Drawer>

            {/* Top Drawer Example */}
            <PushButton onClick={() => setTopDrawer(true)}>
                Top Drawer
            </PushButton>
            <Drawer
                open={topDrawer}
                onClose={() => setTopDrawer(false)}
                variant="top"
                height={320}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral">
                        <h2 className="text-lg font-bold">Notifications</h2>
                        {/* Fixed: Properly calling setTopDrawer */}
                        <IconButton
                            icon={XIcon}
                            variant="ghost"
                            onClick={() => setTopDrawer(false)}
                        />
                    </div>
                    <div className="flex-1 p-4 overflow-auto">
                        <p>Top drawer content with custom height.</p>
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
        <div className="space-y-6 ">
            {/* Basic Modal */}
            <PushButton variant="bright" onClick={() => setBasicModal(true)}>
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
            <PushButton variant="ghost" onClick={() => setComplexModal(true)}>
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
                    <div className="flex justify-between items-center w-full">
                        <span className="text-font-dark-muted text-sm">
                            Showing 20 of 100 results
                        </span>
                        <div className="space-x-3 flex">
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
                                className="p-0.5 hover:bg-bg-dark transition-colors"
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
    );
};

// Tabs example
const NestedTabsExample = () => {
    return (
        <Tabs
            variant="default"
            tabs={[
                {
                    id: "settings",
                    label: "Settings",
                    content: (
                        <Tabs
                            variant="inset"
                            tabs={[
                                {
                                    id: "general",
                                    label: "General",
                                    content: (
                                        <Panel
                                            variant="elevated"
                                            header="General Settings"
                                        >
                                            <div className="space-y-4">
                                                <p className="text-font-dark-muted">
                                                    Configure basic application
                                                    settings here.
                                                </p>
                                                <div className="space-x-2">
                                                    <PushButton variant="ghost">
                                                        Reset
                                                    </PushButton>
                                                    <PushButton variant="bright">
                                                        Save
                                                    </PushButton>
                                                </div>
                                            </div>
                                        </Panel>
                                    ),
                                },
                                {
                                    id: "appearance",
                                    label: "Appearance",
                                    content: (
                                        <Panel
                                            variant="elevated"
                                            className="mt-4"
                                        >
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold">
                                                    Appearance Settings
                                                </h3>
                                                <p className="text-font-dark-muted">
                                                    Customize the look and feel
                                                    of the application.
                                                </p>
                                                <div className="space-x-2">
                                                    <PushButton variant="ghost">
                                                        Reset Theme
                                                    </PushButton>
                                                    <PushButton variant="bright">
                                                        Apply
                                                    </PushButton>
                                                </div>
                                            </div>
                                        </Panel>
                                    ),
                                },
                            ]}
                        />
                    ),
                },
                {
                    id: "content",
                    label: "Content",
                    content: (
                        <ScrollBox
                            maxHeight={400}
                            variant="inset"
                            className="mt-4"
                        >
                            <div className="space-y-4 p-4">
                                <h3 className="text-lg font-semibold">
                                    Content Management
                                </h3>
                                {Array.from({ length: 10 }, (_, i) => (
                                    <div
                                        key={i}
                                        className="p-4 bg-bg-dark border border-accent-dark-neutral rounded"
                                    >
                                        <h4 className="font-medium">
                                            Content Item {i + 1}
                                        </h4>
                                        <p className="text-font-dark-muted mt-2">
                                            This is a content item that
                                            demonstrates scrolling behavior in
                                            the tab panel area.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </ScrollBox>
                    ),
                },
            ]}
        />
    );
};

// Example of basic tab usage with different variants
const BasicTabsExample = () => {
    return (
        <div className="space-y-8">
            {/* Default Tabs */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Default Tabs</h2>
                <Tabs
                    variant="default"
                    tabs={[
                        {
                            id: "tab1",
                            label: "First Tab",
                            content: (
                                <div className="space-y-4">
                                    <PushButton
                                        endIcon={EditIcon}
                                        variant="ghost"
                                    >
                                        Continue
                                    </PushButton>
                                    <PushButton disabled>
                                        Unavailable
                                    </PushButton>
                                </div>
                            ),
                        },
                        {
                            id: "tab2",
                            label: "Second Tab",
                            content: (
                                <div className="space-y-4">
                                    <PushButton>Click Me</PushButton>
                                    <PushButton
                                        startIcon={SearchIcon}
                                        variant="bright"
                                    >
                                        Search
                                    </PushButton>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {/* Inset Tabs */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Inset Tabs</h2>
                <Tabs
                    variant="inset"
                    tabs={[
                        {
                            id: "info1",
                            label: "Information",
                            content: (
                                <div className="space-y-4">
                                    <h3 className="font-medium">
                                        Important Information
                                    </h3>
                                    <p className="text-font-dark-muted">
                                        This demonstrates the inset variant with
                                        elevated styling.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            id: "info2",
                            label: "More Info",
                            content: (
                                <div className="space-y-4">
                                    <h3 className="font-medium">
                                        Additional Information
                                    </h3>
                                    <p className="text-font-dark-muted">
                                        Another tab showing the inset variant
                                        styling.
                                    </p>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const TabsExamples = () => {
    return (
        <div className="space-y-12">
            <section>
                <h2 className="text-xl font-bold mb-6">Basic Tabs</h2>
                <BasicTabsExample />
            </section>

            <section>
                <h2 className="text-xl font-bold mb-6">Nested Tabs</h2>
                <NestedTabsExample />
            </section>
        </div>
    );
};

// Simple list example
const SimpleListExample = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const items = [
        { id: "item-1", label: "First Item" },
        { id: "item-2", label: "Second Item" },
        { id: "item-3", label: "Third Item" },
        { id: "item-4", label: "Fourth Item" },
        { id: "item-5", label: "Fifth Item" },
    ];

    return (
        <Panel variant="elevated" header="Simple List">
            <div className="space-y-4">
                <ListView
                    items={items}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    renderItem={(item) => item.label}
                    maxHeight={300}
                />
                <div className="text-font-dark-muted">
                    Selected: {selectedIds.join(", ")}
                </div>
            </div>
        </Panel>
    );
};

// Complex list example with custom items
interface ComplexItem extends ListItemMetadata {
    title: string;
    description: string;
    type: "file" | "folder" | "setting";
    favorite: boolean;
    modified: string;
}

const ComplexListExample = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const items: ComplexItem[] = [
        {
            id: "file-1",
            title: "Project Documentation",
            description: "Main project documentation and guidelines",
            type: "file",
            favorite: true,
            modified: "2024-02-20",
        },
        {
            id: "folder-1",
            title: "Source Code",
            description: "Main application source code",
            type: "folder",
            favorite: false,
            modified: "2024-02-19",
        },
        {
            id: "setting-1",
            title: "Project Settings",
            description: "Configuration and environment settings",
            type: "setting",
            favorite: true,
            modified: "2024-02-18",
        },
        {
            id: "file-2",
            title: "API Documentation",
            description: "REST API endpoints and usage",
            type: "file",
            favorite: false,
            modified: "2024-02-17",
        },
    ];

    // Get icon based on item type and favorite status
    const getStartIcon = (item: ComplexItem) => {
        switch (item.type) {
            case "file":
                return EditIcon;
            case "folder":
                return SearchIcon;
            case "setting":
                return GearIcon;
            default:
                return undefined;
        }
    };

    return (
        <Panel variant="elevated" header="Complex List">
            <div className="space-y-4">
                <ListView
                    items={items}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    multiSelect
                    maxHeight={400}
                    renderItem={(item) => {
                        const complexItem = item as ComplexItem;
                        const itemIcon = getStartIcon(complexItem);
                        return (
                            <ListItem
                                metadata={complexItem}
                                startIcon={itemIcon} // Pass resolved icon
                                endIcon={
                                    complexItem.favorite ? StarIcon : undefined
                                }
                                endIconClassName="text-accent-dark-bright"
                            >
                                <div className="flex flex-col py-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {complexItem.title}
                                        </span>
                                        <span className="text-font-dark-muted text-sm">
                                            {complexItem.modified}
                                        </span>
                                    </div>
                                    <span className="text-font-dark-muted text-sm">
                                        {complexItem.description}
                                    </span>
                                </div>
                            </ListItem>
                        );
                    }}
                />

                <div className="flex justify-between items-center">
                    <span className="text-font-dark-muted">
                        {selectedIds.length} item(s) selected
                    </span>
                    <PushButton
                        variant="ghost"
                        disabled={selectedIds.length === 0}
                        onClick={() => setSelectedIds([])}
                    >
                        Clear Selection
                    </PushButton>
                </div>
            </div>
        </Panel>
    );
};

// Combined examples
const ListViewExamples = () => {
    return (
        <div className="space-y-8">
            <SimpleListExample />
            <ComplexListExample />
        </div>
    );
};

// Combined Example Page
export const ContainerExamplesPage = () => {
    return (
        <div className="p-8 flex gap-4">
            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2">
                <h2 className="text-2xl font-bold mb-4">Panel Examples</h2>
                <PanelExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2">
                <h2 className="text-2xl font-bold mb-4">ScrollBox Examples</h2>
                <ScrollBoxExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2 w-96">
                <h2 className="text-2xl font-bold mb-4">Drawer Examples</h2>
                <DrawerExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2 w-96">
                <h2 className="text-2xl font-bold mb-4">Modal Examples</h2>
                <ModalExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2">
                <h2 className="text-2xl font-bold mb-4">Tabs Examples</h2>
                <TabsExamples />
            </section>

            <section className="border-3 border-accent-dark-neutral rounded-xl px-3 py-2 w-192">
                <h2 className="text-2xl font-bold mb-4">ListView Examples</h2>
                <ListViewExamples />
            </section>
        </div>
    );
};

const WebAppShell: React.FC = () => {
    const { isVisible: themePanelVisible } =
        usePanelVisibility("THEME_MANAGER");

    return (
        <div className=" bg-zinc-700 text-white flex flex-col">
            <div className="flex-1 flex">
                {/* Left Panel Group */}
                {/* <div className="flex flex-row">
                    <IconColumn />
                    <ComponentPanel />
                </div> */}

                {/* Main Canvas Area */}
                <ContainerExamplesPage />
                {/* <div className="flex-1">Canvas Area</div> */}

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
