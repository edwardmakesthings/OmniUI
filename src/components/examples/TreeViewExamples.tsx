import { useCallback, useState } from "react";
import {
    ButtonIcon,
    FileIcon,
    FolderIcon,
    Panel,
    PanelIcon,
    TabsIcon,
    TreeItemData,
    TreeView,
} from "@/components/ui";

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

const FileExplorerExample = () => {
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
    );
};

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
];

const LayoutHierarchyExample = () => {
    // Single select mode since we're selecting one component at a time
    const [layout, setLayout] = useState<TreeItemData[]>(layoutData);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(
        null
    );
    const [expandedNodes, setExpandedNodes] = useState<string[]>([
        "main-window",
    ]);

    const handleSelectionChange = (ids: string[]) => {
        setSelectedComponent(ids[0] || null);
    };

    return (
        <Panel header="Layout Hierarchy" variant="elevated" className="w-80">
            <TreeView
                items={layout}
                selectedIds={selectedComponent ? [selectedComponent] : []}
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
    );
};

export const TreeViewExamples = () => {
    return (
        <div className="space-y-12">
            <FileExplorerExample />
            <LayoutHierarchyExample />
        </div>
    );
};

export default TreeViewExamples;
