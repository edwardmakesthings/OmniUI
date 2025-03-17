import {
    ReactNode,
    useCallback,
    useRef,
    KeyboardEvent,
    AriaAttributes,
} from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    DivProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import listViewPreset, {
    ListViewVariant,
} from "@/components/base/style/presets/listView";
import { ScrollBox } from "../ScrollBox";
import { ListItem, ListItemMetadata, ListItemProps } from "./ListItem";

export interface ListViewProps<T extends ListItemMetadata = ListItemMetadata>
    extends Omit<DivProps<"list">, "as"> {
    // Content
    items: T[];
    renderItem?: (item: T) => ReactNode;
    itemProps?: Partial<
        Omit<ListItemProps, "metadata" | "selected" | "onSelect">
    >;

    // Selection
    selectedIds?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
    multiSelect?: boolean;

    // Style
    variant?: ListViewVariant;
    className?: string;
    listClassName?: string;
    maxHeight?: number | string;
}

export function ListView<T extends ListItemMetadata>({
    // Content
    items,
    renderItem,
    itemProps,

    // Selection
    selectedIds = [],
    onSelectionChange,
    multiSelect = false,

    // Style
    variant = "default",
    className,
    listClassName,
    maxHeight,
    styleProps,

    ...props
}: ListViewProps<T>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastSelectedRef = useRef<string | null>(null);

    // Handle item selection
    const handleItemSelect = useCallback(
        (item: T) => {
            if (!onSelectionChange) return;

            if (multiSelect) {
                // Handle multi-select
                const newSelectedIds = selectedIds.includes(item.id)
                    ? selectedIds.filter((id) => id !== item.id)
                    : [...selectedIds, item.id];

                onSelectionChange(newSelectedIds);
                lastSelectedRef.current = item.id;
            } else {
                // Handle single select
                onSelectionChange([item.id]);
                lastSelectedRef.current = item.id;
            }
        },
        [selectedIds, onSelectionChange, multiSelect]
    );

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLDivElement>) => {
            const currentIndex = lastSelectedRef.current
                ? items.findIndex((item) => item.id === lastSelectedRef.current)
                : -1;

            switch (e.key) {
                case "ArrowDown": {
                    e.preventDefault();
                    if (currentIndex < items.length - 1) {
                        const nextItem = items[currentIndex + 1];
                        handleItemSelect(nextItem);
                    }
                    break;
                }
                case "ArrowUp": {
                    e.preventDefault();
                    if (currentIndex > 0) {
                        const prevItem = items[currentIndex - 1];
                        handleItemSelect(prevItem);
                    }
                    break;
                }
                case "a": {
                    if (multiSelect && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        onSelectionChange?.(items.map((item) => item.id));
                    }
                    break;
                }
            }
        },
        [items, handleItemSelect, multiSelect, onSelectionChange]
    );

    // Render function for the list view
    const renderListView = ({
        elementProps,
        state: _state,
        computedStyle,
    }: RenderElementProps) => {
        // Get container ID for ARIA
        const componentId =
            (elementProps as any)?.["data-component-id"] || "list-view";

        const ariaAttributes: AriaAttributes & { role?: string } = {
            role: "listbox",
            "aria-multiselectable": multiSelect,
        };

        return (
            <div
                {...elementProps}
                ref={containerRef}
                id={componentId}
                className={computedStyle.root}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                {...ariaAttributes}
            >
                <ScrollBox
                    maxHeight={maxHeight}
                    variant={variant === "default" ? "ghost" : variant}
                >
                    <div className={computedStyle.list}>
                        {items.map((item) => (
                            <ListItem
                                key={item.id}
                                metadata={item}
                                selected={selectedIds.includes(item.id)}
                                onSelect={handleItemSelect}
                                variant={variant}
                                {...itemProps}
                            >
                                {renderItem ? renderItem(item) : item.id}
                            </ListItem>
                        ))}
                    </div>
                </ScrollBox>
            </div>
        );
    };

    return (
        <BaseInteractor
            as="div"
            stylePreset={listViewPreset}
            styleProps={{
                variant,
                elements: {
                    root: {
                        base: className,
                    },
                    list: {
                        base: listClassName,
                    },
                },
            }}
            renderElement={renderListView}
            {...props}
        />
    );
}

export default ListView;
