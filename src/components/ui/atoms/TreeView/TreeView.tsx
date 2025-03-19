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

export interface TreeViewProps extends Omit<DivProps<"tree">, "as"> {
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
            const updatedItems = [...items];

            // Find the dragged item and its current parent
            let draggedItem: TreeItemData | undefined;
            let sourceParent: TreeItemData | undefined;
            let sourceIndex = -1;

            const findItem = (
                items: TreeItemData[],
                parent?: TreeItemData
            ): boolean => {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].id === draggedId) {
                        draggedItem = items[i];
                        sourceParent = parent;
                        sourceIndex = i;
                        return true;
                    }
                    if (items[i].children?.length) {
                        if (findItem(items[i].children!, items[i])) return true;
                    }
                }
                return false;
            };

            findItem(updatedItems);

            if (!draggedItem) return;

            // Remove item from its current position
            if (sourceParent) {
                sourceParent.children!.splice(sourceIndex, 1);
            } else {
                updatedItems.splice(sourceIndex, 1);
            }

            // Find target item and its parent
            let targetItem: TreeItemData | undefined;
            let targetParent: TreeItemData | undefined;
            let targetIndex = -1;

            const findTarget = (
                items: TreeItemData[],
                parent?: TreeItemData
            ): boolean => {
                for (let i = 0; i < items.length; i++) {
                    if (items[i].id === target.id) {
                        targetItem = items[i];
                        targetParent = parent;
                        targetIndex = i;
                        return true;
                    }
                    if (items[i].children?.length) {
                        if (findTarget(items[i].children!, items[i]))
                            return true;
                    }
                }
                return false;
            };

            findTarget(updatedItems);

            if (!targetItem) return;

            // Insert item at new position
            switch (target.position) {
                case "before":
                    if (targetParent) {
                        targetParent.children!.splice(
                            targetIndex,
                            0,
                            draggedItem
                        );
                    } else {
                        updatedItems.splice(targetIndex, 0, draggedItem);
                    }
                    break;

                case "after":
                    if (targetParent) {
                        targetParent.children!.splice(
                            targetIndex + 1,
                            0,
                            draggedItem
                        );
                    } else {
                        updatedItems.splice(targetIndex + 1, 0, draggedItem);
                    }
                    break;

                case "inside":
                    targetItem.children = targetItem.children || [];
                    targetItem.children.push(draggedItem);

                    // Auto-expand the target when dropping inside
                    if (!expandedIdsSet.has(targetItem.id)) {
                        selectionManager.toggleExpansion(targetItem.id);
                    }
                    break;
            }

            // Notify parent of changes
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
