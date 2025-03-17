import { AriaAttributes, memo, useRef } from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    DivProps,
    DropPosition,
    DropTarget,
    RenderElementProps,
} from "@/components/base/interactive/types";
import { CaretDownIcon } from "../../icons";
import { TreeItemData, TreeSelectionManager } from "./types";
import { cn } from "@/lib/utils";
import { treeItemPreset } from "@/components/base/style/presets/treeView";
import { draggingStyles } from "@/components/base/style/compositions";

export interface TreeItemProps
    extends Omit<DivProps<"content" | "icon" | "caret">, "as"> {
    // Core props
    item: TreeItemData;
    level: number;
    selectionManager: TreeSelectionManager;
    onMove?: (draggedId: string, target: DropTarget) => void;

    // Style customization
    className?: string;
    contentClassName?: string;
    iconClassName?: string;
}

export const TreeItem = memo(
    ({
        // Core props
        item,
        level,
        selectionManager,
        onMove,

        // Style props
        className,
        contentClassName,
        iconClassName,
        styleProps,
        ...props
    }: TreeItemProps) => {
        const itemRef = useRef<HTMLDivElement>(null);
        const hasChildren = Boolean(item.children?.length);
        const isSelected = selectionManager.isSelected(item.id);
        const isExpanded = selectionManager.isExpanded(item.id);

        // Handle selection and expansion
        const handleSelect = () => {
            if (!item.disabled) {
                selectionManager.toggleSelection(item.id);
            }
        };

        const handleExpand = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (hasChildren) {
                selectionManager.toggleExpansion(item.id);
            }
        };

        const renderTreeItem = ({
            elementProps,
            state,
            computedStyle,
        }: RenderElementProps) => {
            const Icon = item.icon;

            const ariaAttributes: AriaAttributes & { role?: string } = {
                role: "treeitem",
                "aria-selected": state.isSelected,
                "aria-expanded": hasChildren ? state.isActive : undefined,
                "aria-disabled": state.isDisabled,
                "aria-level": level,
            };

            // Add classNames for drag states
            const rootClassName = cn(
                computedStyle.root,
                state.isDragging && "opacity-50 bg-accent-dark-bright/30",
                // Add the dragging style from the state
                state.isDragging && draggingStyles.base
            );

            return (
                <div
                    {...elementProps}
                    ref={itemRef}
                    style={{ paddingLeft: `${level * 20}px` }}
                    className={rootClassName}
                    onClick={handleSelect}
                    {...ariaAttributes}
                >
                    {/* Caret for expansion */}
                    <div
                        className={cn(
                            computedStyle.caret,
                            "w-4 h-4 flex items-center justify-center",
                            !hasChildren && "invisible"
                        )}
                        onClick={handleExpand}
                    >
                        <CaretDownIcon
                            size={12}
                            className={cn(
                                "transition-transform duration-200",
                                isExpanded && "rotate-180"
                            )}
                        />
                    </div>

                    {/* Icon */}
                    {Icon && (
                        <div className={computedStyle.icon}>
                            <Icon size={16} />
                        </div>
                    )}

                    {/* Content */}
                    <div className={computedStyle.content}>{item.label}</div>
                </div>
            );
        };

        return (
            <>
                <BaseInteractor
                    as="div"
                    stylePreset={treeItemPreset}
                    styleProps={{
                        variant: "default",
                        elements: {
                            root: {
                                base: cn(
                                    className,
                                    // Add these classes for drop position indicators
                                    "relative before:absolute before:inset-0 before:pointer-events-none",
                                    // These classes will highlight the drop positions:
                                    "data-drop-before:before:border-t-2 data-drop-before:before:border-accent-dark-bright",
                                    "data-drop-after:before:border-b-2 data-drop-after:before:border-accent-dark-bright",
                                    "data-drop-inside:before:bg-accent-dark-bright/20"
                                ),
                            },
                            content: {
                                base: contentClassName,
                            },
                            icon: {
                                base: iconClassName,
                            },
                        },
                    }}
                    state={{
                        isSelected,
                        isActive: isExpanded,
                        isDisabled: item.disabled,
                        isEditing: true, // Enable drag/drop functionality
                    }}
                    // Drag and drop configuration
                    draggable={!item.disabled && item.canDrag !== false}
                    dragType="tree-item"
                    dragData={{
                        id: item.id,
                        data: {
                            level,
                            hasChildren,
                            parentId: item.parentId,
                        },
                    }}
                    droppable={!item.disabled && item.canDrag !== false}
                    acceptTypes={["tree-item"]}
                    dropPositions={[
                        "before",
                        "after",
                        ...(item.canDrop ? ["inside" as DropPosition] : []),
                    ]}
                    onDrop={(_e, dragData, target) => {
                        console.log("TreeItem onDrop:", {
                            draggedId: dragData.id,
                            target,
                            item: item, // Log the current item
                        });
                        onMove?.(dragData.id, target);
                    }}
                    renderElement={renderTreeItem}
                    elementRef={itemRef}
                    {...props}
                />

                {/* Render children if expanded */}
                {isExpanded &&
                    item.children?.map((child) => (
                        <TreeItem
                            key={child.id}
                            item={child}
                            level={level + 1}
                            selectionManager={selectionManager}
                            onMove={onMove}
                        />
                    ))}
            </>
        );
    }
);

TreeItem.displayName = "TreeItem";

export default TreeItem;
