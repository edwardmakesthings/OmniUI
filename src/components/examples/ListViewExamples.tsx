import { useState } from "react";
import {
    EditIcon,
    GearIcon,
    Panel,
    PushButton,
    SearchIcon,
    StarIcon,
} from "@/components/ui";
import ListView from "@/components/ui/atoms/ListView/ListView";
import ListItem, {
    ListItemMetadata,
} from "@/components/ui/atoms/ListView/ListItem";

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

export default ListViewExamples;
