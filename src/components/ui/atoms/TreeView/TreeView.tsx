import { AriaAttributes, useCallback, useMemo, useState } from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    DivProps,
    DropTarget,
    RenderElementProps,
} from "@/components/base/interactive/types";
import { ScrollBox } from "../ScrollBox";
import { TreeItem } from "./TreeItem";
import { TreeItemData, TreeSelectionManager } from "./types";
import { treeViewPreset } from "@/components/base/style/presets/treeView";

export interface TreeViewProps
    extends Omit<DivProps<"tree">, "as" | "onDragStart" | "onDragOver"> {
    // Data
    items: TreeItemData[];

    // Selection
    selectedIds?: string[];
    defaultSelectedIds?: string[];
    onSelectionChange?: (ids: string[]) => void;

    // Expansion
    expandedIds?: string[];
    defaultExpandedIds?: string[];
    onExpansionChange?: (ids: string[]) => void;

    // Movement
    onMove?: (items: TreeItemData[]) => void;

    // Drag event callbacks
    onDragStart?: (draggedId: string, data?: any) => void;
    onDragOver?: (targetId: string, data?: any) => void;
    onDragEnd?: (data?: any) => void;

    // Extended behaviors
    getDragData?: (item: TreeItemData) => any;
    getDropData?: (item: TreeItemData) => any;

    // Configuration
    multiSelect?: boolean;
    maxHeight?: number | string;

    // Style customization
    className?: string;
    treeClassName?: string;
}

export const TreeView = ({
    // Data props
    items,

    // Selection props
    selectedIds: controlledSelectedIds,
    defaultSelectedIds = [],
    onSelectionChange,

    // Expansion props
    expandedIds: controlledExpandedIds,
    defaultExpandedIds = [],
    onExpansionChange,

    // Movement prop
    onMove,

    // Drag event callbacks
    onDragStart,
    onDragOver,
    onDragEnd,
    getDragData,
    getDropData,

    // Config props
    multiSelect = false,
    maxHeight,

    // Style props
    className,
    treeClassName,
    styleProps,
    ...props
}: TreeViewProps) => {
    // Selection state management
    const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(
        new Set(defaultSelectedIds)
    );
    const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string>>(
        new Set(defaultExpandedIds)
    );

    // Use controlled if provided, otherwise use internal
    const selectedIdsSet = useMemo(
        () => new Set(controlledSelectedIds || Array.from(internalSelectedIds)),
        [controlledSelectedIds, internalSelectedIds]
    );

    const expandedIdsSet = useMemo(
        () => new Set(controlledExpandedIds || Array.from(internalExpandedIds)),
        [controlledExpandedIds, internalExpandedIds]
    );

    // Selection manager
    const selectionManager = useMemo<TreeSelectionManager>(
        () => ({
            selectedIds: selectedIdsSet,
            expandedIds: expandedIdsSet,

            toggleSelection: (
                id: string,
                mode: "single" | "toggle" | "range" = "toggle"
            ) => {
                const newSelected = new Set(selectedIdsSet);

                if (!multiSelect || mode === "single") {
                    newSelected.clear();
                }

                if (newSelected.has(id)) {
                    newSelected.delete(id);
                } else {
                    newSelected.add(id);
                }

                if (controlledSelectedIds === undefined) {
                    setInternalSelectedIds(newSelected);
                }
                onSelectionChange?.(Array.from(newSelected));
            },

            toggleExpansion: (id: string) => {
                const newExpanded = new Set(expandedIdsSet);

                if (newExpanded.has(id)) {
                    newExpanded.delete(id);
                } else {
                    newExpanded.add(id);
                }

                if (controlledExpandedIds === undefined) {
                    setInternalExpandedIds(newExpanded);
                }
                onExpansionChange?.(Array.from(newExpanded));
            },

            isSelected: (id: string) => selectedIdsSet.has(id),
            isExpanded: (id: string) => expandedIdsSet.has(id),
        }),
        [
            selectedIdsSet,
            expandedIdsSet,
            multiSelect,
            controlledSelectedIds,
            controlledExpandedIds,
            onSelectionChange,
            onExpansionChange,
        ]
    );

    // Function to handle movement of items
    const handleMove = useCallback(
        (draggedId: string, target: DropTarget) => {
            console.log("Tree handleMove:", { draggedId, target });

            // Make a deep copy of the items array to avoid mutations
            const cloneItems = (items: TreeItemData[]): TreeItemData[] => {
                return items.map((item) => ({
                    ...item,
                    children: item.children
                        ? cloneItems(item.children)
                        : undefined,
                }));
            };

            const updatedItems = cloneItems(items);

            // Function to find an item by ID
            const findItemById = (
                items: TreeItemData[],
                id: string,
                parent?: TreeItemData
            ): {
                item?: TreeItemData;
                parent?: TreeItemData;
                index: number;
                path: string[];
            } => {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].id === id) {
                        return {
                            item: items[i],
                            parent,
                            index: i,
                            path: parent ? [parent.id, id] : [id],
                        };
                    }

                    if (items[i].children?.length) {
                        const result = findItemById(
                            items[i].children!,
                            id,
                            items[i]
                        );
                        if (result.item) {
                            return result;
                        }
                    }
                }

                return { index: -1, path: [] };
            };

            // Find the dragged item
            const {
                item: draggedItem,
                parent: sourceParent,
                index: sourceIndex,
                path: sourcePath,
            } = findItemById(updatedItems, draggedId);

            // Find the target item
            const {
                item: targetItem,
                parent: targetParent,
                index: targetIndex,
                path: targetPath,
            } = findItemById(updatedItems, target.id);

            // Validate that we found both items
            if (!draggedItem || !targetItem) {
                console.error("Could not find dragged or target item", {
                    draggedId,
                    targetId: target.id,
                });
                return;
            }

            // Check for circular reference
            if (
                sourcePath.length < targetPath.length &&
                targetPath.includes(draggedId)
            ) {
                console.error("Cannot create circular reference");
                return;
            }

            // Extract dragged item from source
            let itemToMove: TreeItemData | undefined;

            if (sourceParent) {
                // Remove from parent's children
                itemToMove = sourceParent.children!.splice(sourceIndex, 1)[0];
            } else {
                // Remove from root
                itemToMove = updatedItems.splice(sourceIndex, 1)[0];
            }

            if (!itemToMove) {
                console.error("Failed to extract item to move");
                return;
            }

            // Store original parentId for item history tracking
            itemToMove.parentId = sourceParent ? sourceParent.id : undefined;

            // Insert at destination
            switch (target.position) {
                case "before":
                    if (targetParent) {
                        targetParent.children!.splice(
                            targetIndex,
                            0,
                            itemToMove
                        );
                    } else {
                        updatedItems.splice(targetIndex, 0, itemToMove);
                    }
                    break;

                case "after":
                    if (targetParent) {
                        targetParent.children!.splice(
                            targetIndex + 1,
                            0,
                            itemToMove
                        );
                    } else {
                        updatedItems.splice(targetIndex + 1, 0, itemToMove);
                    }
                    break;

                case "inside":
                    // Ensure target item has a children array
                    targetItem.children = targetItem.children || [];
                    // Add to end of children
                    targetItem.children.push(itemToMove);

                    // Auto-expand the target
                    if (!expandedIdsSet.has(targetItem.id)) {
                        selectionManager.toggleExpansion(targetItem.id);
                    }
                    break;

                default:
                    console.error("Unknown drop position", target.position);
                    return;
            }

            // Notify parent of changes with the updated structure
            console.log("Updated tree structure:", updatedItems);
            onMove?.(updatedItems);
        },
        [items, expandedIdsSet, selectionManager, onMove]
    );

    const ariaAttributes: AriaAttributes & { role?: string } = {
        role: "tree",
    };

    // Render function for the tree
    const renderTree = ({
        elementProps,
        state: _state,
        computedStyle,
    }: RenderElementProps) => (
        <div
            {...elementProps}
            className={computedStyle.root}
            {...ariaAttributes}
        >
            <ScrollBox
                maxHeight={maxHeight}
                variant="ghost"
                className={computedStyle.tree}
            >
                {items.map((item) => (
                    <TreeItem
                        key={item.id}
                        item={item}
                        level={0}
                        selectionManager={selectionManager}
                        onMove={handleMove}
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDragEnd={onDragEnd}
                        getDragData={getDragData}
                        getDropData={getDropData}
                        className={`tree-item-${item.id.replace(
                            /[^a-zA-Z0-9-_]/g,
                            "-"
                        )}`}
                        styleProps={{
                            variant: "default",
                            elements: {
                                root: {
                                    base: "data-tree-item-id=" + item.id,
                                },
                            },
                        }}
                    />
                ))}
            </ScrollBox>
        </div>
    );

    return (
        <BaseInteractor
            as="div"
            stylePreset={treeViewPreset}
            styleProps={{
                variant: "default",
                elements: {
                    root: {
                        base: className,
                    },
                    tree: {
                        base: treeClassName,
                    },
                },
            }}
            renderElement={renderTree}
            {...props}
        />
    );
};

export default TreeView;
