import {
    AriaAttributes,
    memo,
    useEffect,
    useRef,
    DragEvent,
    MouseEvent,
} from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    DivProps,
    DragData,
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
    extends Omit<
        DivProps<"content" | "icon" | "caret">,
        "as" | "onDragStart" | "onDragOver"
    > {
    // Core props
    item: TreeItemData;
    level: number;
    selectionManager: TreeSelectionManager;
    onMove?: (draggedId: string, target: DropTarget) => void;

    // Drag event callbacks
    onDragStart?: (draggedId: string, data?: any) => void;
    onDragOver?: (targetId: string, data?: any) => void;
    onDragEnd?: (data?: any) => void;

    // Extended behaviors
    getDragData?: (item: TreeItemData) => any;
    getDropData?: (
        item: TreeItemData,
        draggedItem?: TreeItemData | null
    ) => any;

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

        // Drag event callbacks
        onDragStart,
        onDragOver,
        onDragEnd,

        // Extended behaviors
        getDragData,
        getDropData,

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

        const handleExpand = (e: MouseEvent) => {
            e.stopPropagation();
            if (hasChildren) {
                selectionManager.toggleExpansion(item.id);
            }
        };

        // Set up event handlers for drag operations
        useEffect(() => {
            if (!itemRef.current) return;

            const element = itemRef.current;

            // Create data attribute for easier identification
            if (item.id.includes("/")) {
                const [widgetId] = item.id.split("/");
                element.setAttribute("data-widget-id", widgetId);
            }

            // Drag start handler
            const handleDragStart = () => {
                // Get custom drag data if callback provided
                const dragData = getDragData ? getDragData(item) : null;

                // Call the callback if provided
                if (onDragStart) {
                    onDragStart(item.id, dragData);
                }
            };

            // Drag end handler
            const handleDragEnd = () => {
                // Call the callback if provided
                if (onDragEnd) {
                    onDragEnd({ id: item.id });
                }
            };

            // Add the event listeners
            element.addEventListener("dragstart", handleDragStart);
            element.addEventListener("dragend", handleDragEnd);

            // Clean up
            return () => {
                element.removeEventListener("dragstart", handleDragStart);
                element.removeEventListener("dragend", handleDragEnd);
            };
        }, [item, onDragStart, onDragEnd, getDragData]);

        const handleOnDrop = (
            _e: DragEvent,
            dragData: DragData,
            target: DropTarget
        ) => {
            console.log("TreeItem onDrop:", {
                draggedId: dragData.id,
                target,
                item: item,
            });

            // Find the currently dragged item if possible
            let draggedItem: TreeItemData | null = null;

            // If we have dragData with an id, try to find the corresponding item
            if (dragData && dragData.id) {
                // This is a simplified approach - in a real implementation, you'd need
                // to have access to the full tree structure to find the item
                // But we can use basic rules to prevent self-drops
                if (dragData.id === item.id) {
                    console.warn("Cannot drop an item onto itself");
                    return; // Prevent self-drops
                }

                // Check for circular reference (if we're dropping a parent onto its child)
                // This is a basic check - a full implementation would need to traverse the tree
                if (item.parentId && dragData.id === item.parentId) {
                    console.warn("Cannot create circular reference");
                    return;
                }

                // If we had access to the full item being dragged, we'd set draggedItem here
                draggedItem = {
                    id: dragData.id,
                    label: "Unknown", // We don't have the label
                    ...dragData.data,
                } as TreeItemData;
            }

            // Now pass both items to getDropData
            const dropData = getDropData
                ? getDropData(item, draggedItem)
                : null;

            // If dropData returns { canAcceptDrop: false }, prevent the drop
            if (dropData && dropData.canAcceptDrop === false) {
                console.warn(
                    `Drop prevented: ${
                        dropData.reason || "Invalid drop target"
                    }`
                );
                return;
            }

            // Call the drag over callback if provided
            if (onDragOver) {
                onDragOver(item.id, { ...dropData, target });
            }

            // Call the original handler with the drop target
            onMove?.(dragData.id, {
                id: item.id,
                position: target.position || "inside",
                data: dropData,
            });
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
                                !isExpanded && "-rotate-90"
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
                    onDrop={handleOnDrop}
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
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDragEnd={onDragEnd}
                            getDragData={getDragData}
                            getDropData={getDropData}
                            className={`tree-item-${child.id.replace(
                                /[^a-zA-Z0-9-_]/g,
                                "-"
                            )}`}
                            styleProps={{
                                variant: "default",
                                elements: {
                                    root: {
                                        base: "data-tree-item-id=" + child.id,
                                    },
                                },
                            }}
                        />
                    ))}
            </>
        );
    }
);

TreeItem.displayName = "TreeItem";

export default TreeItem;
