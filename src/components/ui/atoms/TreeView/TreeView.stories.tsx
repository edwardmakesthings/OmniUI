import type { Meta, StoryObj } from "@storybook/react";
import { TreeView, TreeItemData } from "@/components/ui";
import { useCallback, useState } from "react";
import {
    ButtonIcon,
    FileIcon,
    FolderIcon,
    Panel,
    PanelIcon,
    TabsIcon,
} from "@/components/ui";
import {
    ThemeAwareHeading,
    ThemeAwareBody,
} from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";

/**
 * `TreeView` displays hierarchical data in a tree structure.
 * It supports selection, expansion/collapse, and drag-and-drop rearrangement.
 */
const meta = {
    title: "Atoms/Data Display/TreeView",
    component: TreeView,
    tags: ["autodocs"],
    decorators: [withThemeProvider],
    argTypes: {
        items: {
            description:
                "Array of tree item objects with hierarchical structure",
        },
        selectedIds: {
            description: "Array of selected item IDs (controlled mode)",
        },
        defaultSelectedIds: {
            description:
                "Array of initially selected item IDs (uncontrolled mode)",
        },
        expandedIds: {
            description: "Array of expanded item IDs (controlled mode)",
        },
        defaultExpandedIds: {
            description:
                "Array of initially expanded item IDs (uncontrolled mode)",
        },
        onSelectionChange: {
            description: "Called when selection changes",
        },
        onExpansionChange: {
            description: "Called when expansion state changes",
        },
        onMove: {
            description: "Called when items are rearranged via drag and drop",
        },
        multiSelect: {
            control: "boolean",
            description: "Whether multiple items can be selected",
        },
        maxHeight: {
            control: "text",
            description: "Maximum height of the tree before scrolling",
        },
    },
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

function addParentIds(
    items: TreeItemData[],
    parentId?: string
): TreeItemData[] {
    return items.map((item) => ({
        ...item,
        parentId,
        children: item.children
            ? addParentIds(item.children, item.id)
            : undefined,
    }));
}

export const FileExplorer: Story = {
    render: () => {
        const fileExplorerData = addParentIds([
            {
                id: "folder-1",
                label: "src",
                icon: FolderIcon,
                canDrag: true,
                canDrop: true,
                children: [
                    {
                        id: "folder-1-1",
                        label: "components",
                        icon: FolderIcon,
                        canDrag: true,
                        canDrop: true,
                        children: [
                            {
                                id: "file-1",
                                label: "App.tsx",
                                icon: FileIcon,
                                canDrag: true,
                                canDrop: false,
                            },
                            {
                                id: "file-2",
                                label: "index.ts",
                                icon: FileIcon,
                                canDrag: true,
                                canDrop: false,
                            },
                        ],
                    },
                    {
                        id: "folder-1-2",
                        label: "utils",
                        icon: FolderIcon,
                        canDrag: true,
                        canDrop: true,
                        children: [
                            {
                                id: "file-3",
                                label: "helpers.ts",
                                icon: FileIcon,
                                canDrag: true,
                                canDrop: false,
                            },
                        ],
                    },
                ],
            },
            {
                id: "file-4",
                label: "package.json",
                icon: FileIcon,
                disabled: true,
                canDrag: false,
                canDrop: false,
            },
        ]);

        const [files, setFiles] = useState<TreeItemData[]>(fileExplorerData);
        const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
        const [expandedFolders, setExpandedFolders] = useState<string[]>([
            "folder-1",
        ]);

        const handleMove = useCallback((newItems: TreeItemData[]) => {
            console.log("FileExplorer handleMove:", newItems);
            setFiles(newItems);
        }, []);

        return (
            <div className="space-y-6">
                <ThemeAwareHeading>File Explorer</ThemeAwareHeading>
                <ThemeAwareBody>
                    A tree view that mimics a file explorer with files and
                    folders. Items can be selected, expanded, and rearranged via
                    drag and drop.
                </ThemeAwareBody>

                <Panel header="File Explorer Example">
                    <TreeView
                        items={files}
                        selectedIds={selectedFiles}
                        onSelectionChange={setSelectedFiles}
                        expandedIds={expandedFolders}
                        onExpansionChange={setExpandedFolders}
                        onMove={handleMove}
                        multiSelect
                        maxHeight={400}
                    />
                    <div className="mt-2 text-font-dark-muted">
                        Selected: {selectedFiles.join(", ")}
                    </div>
                </Panel>
            </div>
        );
    },
    args: {
        // Minimum required props
        items: [],
    },
};

export const ComponentHierarchy: Story = {
    render: () => {
        const layoutData: TreeItemData[] = [
            {
                id: "main-window",
                label: "Main Window",
                icon: PanelIcon,
                canDrag: false, // Root can't be dragged
                canDrop: true, // But can receive drops
                children: [
                    {
                        id: "panel-1",
                        label: "TitleOfPanel",
                        icon: PanelIcon,
                        canDrag: true,
                        canDrop: true,
                    },
                    {
                        id: "tab-set",
                        label: "TabSet",
                        icon: TabsIcon,
                        canDrag: true,
                        canDrop: true,
                        children: [
                            {
                                id: "setting-tab",
                                label: "SettingTab",
                                icon: TabsIcon,
                                canDrag: true,
                                canDrop: true,
                            },
                            {
                                id: "custom-tab",
                                label: "CustomTab",
                                icon: TabsIcon,
                                canDrag: true,
                                canDrop: true,
                                children: [
                                    {
                                        id: "button-1",
                                        label: "Button",
                                        icon: ButtonIcon,
                                        canDrag: true,
                                        canDrop: false,
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        id: "bottom-panel",
                        label: "BottomBarPanel",
                        icon: PanelIcon,
                        canDrag: true,
                        canDrop: true,
                        children: [
                            {
                                id: "button-cut",
                                label: "ButtonCut",
                                icon: ButtonIcon,
                                canDrag: true,
                                canDrop: false,
                            },
                            {
                                id: "button-copy",
                                label: "ButtonCopy",
                                icon: ButtonIcon,
                                canDrag: true,
                                canDrop: false,
                            },
                            {
                                id: "button-paste",
                                label: "ButtonPaste",
                                icon: ButtonIcon,
                                canDrag: true,
                                canDrop: false,
                            },
                        ],
                    },
                ],
            },
            {
                id: "second-window",
                label: "Second Window",
                icon: PanelIcon,
                canDrag: false, // Root can't be dragged
                canDrop: true, // But can receive drops
                children: [
                    {
                        id: "panel-2",
                        label: "TitleOfPanel",
                        icon: PanelIcon,
                        canDrag: true,
                        canDrop: true,
                    },
                ],
            },
        ];

        // Single select mode since we're selecting one component at a time
        const [layout, setLayout] = useState<TreeItemData[]>(layoutData);
        const [selectedComponent, setSelectedComponent] = useState<
            string | null
        >(null);
        const [expandedNodes, setExpandedNodes] = useState<string[]>([
            "main-window",
        ]);

        const handleSelectionChange = (ids: string[]) => {
            setSelectedComponent(ids[0] || null);
        };

        return (
            <div className="space-y-6">
                <ThemeAwareHeading>Component Hierarchy</ThemeAwareHeading>
                <ThemeAwareBody>
                    A tree view representing a component hierarchy, such as in a
                    UI builder. Only one component can be selected at a time.
                </ThemeAwareBody>

                <Panel header="Layout Hierarchy" variant="elevated">
                    <TreeView
                        items={layout}
                        selectedIds={
                            selectedComponent ? [selectedComponent] : []
                        }
                        onSelectionChange={handleSelectionChange}
                        expandedIds={expandedNodes}
                        onExpansionChange={setExpandedNodes}
                        onMove={setLayout}
                        multiSelect={false}
                    />
                    <div className="mt-2 p-2 bg-bg-dark-darker rounded text-font-dark-muted text-sm">
                        Selected Component: {selectedComponent || "None"}
                    </div>
                </Panel>
            </div>
        );
    },
    args: {
        // Minimum required props
        items: [],
    },
};
