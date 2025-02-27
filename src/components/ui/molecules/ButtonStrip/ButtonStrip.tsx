import { ComponentType, ReactNode, useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { IconButton, IconButtonProps } from "../../atoms/IconButton";
import { PushButton, PushButtonProps } from "../../atoms/PushButton";
import { IconProps } from "@/lib/icons/types";
import { EntityId } from "@/core/types/EntityTypes";

export type ButtonType = "icon" | "push";

export interface ButtonStripItem {
    id: EntityId;
    type?: ButtonType;
    label?: ReactNode;
    icon?: ComponentType<IconProps> | ReactNode;
    tooltip?: string;
    disabled?: boolean;
    // Pass-through props
    buttonProps?: Partial<IconButtonProps | PushButtonProps>;
}

export interface ButtonStripProps {
    // Content
    items: ButtonStripItem[];

    // Configuration
    selectionMode?: "single" | "multiple" | "toggle" | "none";
    defaultSelected?: string[];
    selected?: string[];
    onSelectionChange?: (selected: string[]) => void;
    orientation?: "horizontal" | "vertical";

    // Style
    className?: string;
    buttonClassName?: string;
    spacing?: "none" | "sm" | "md" | "lg";
    size?: "sm" | "md" | "lg";
    variant?: "default" | "ghost" | "outline";
}

const spacingClasses = {
    none: "",
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
};

export const ButtonStrip = ({
    // Content
    items,

    // Configuration
    selectionMode = "single",
    defaultSelected = [],
    selected: controlledSelected,
    onSelectionChange,
    orientation = "horizontal",

    // Style
    className,
    buttonClassName,
    spacing = "none",
    size = "md",
    variant = "default",
}: ButtonStripProps) => {
    // Manage selection state
    const [internalSelected, setInternalSelected] =
        useState<string[]>(defaultSelected);

    // Use controlled or internal selection
    const selectedItems = controlledSelected ?? internalSelected;

    const handleItemClick = useCallback(
        (itemId: string) => {
            if (selectionMode === "none") return;

            let newSelected: string[];

            switch (selectionMode) {
                case "single":
                    // Single selection mode - always have exactly one item selected
                    newSelected = [itemId];
                    break;

                case "toggle":
                    // Toggle mode - can have 0 or 1 item selected
                    if (selectedItems.includes(itemId)) {
                        // If clicking the already selected item, deselect it
                        newSelected = [];
                    } else {
                        // Otherwise select just this item
                        newSelected = [itemId];
                    }
                    break;

                case "multiple":
                    // Multiple selection mode - toggle individual items
                    if (selectedItems.includes(itemId)) {
                        newSelected = selectedItems.filter(
                            (id) => id !== itemId
                        );
                    } else {
                        newSelected = [...selectedItems, itemId];
                    }
                    break;

                default:
                    newSelected = selectedItems;
                    break;
            }

            // Update internal state if uncontrolled
            if (controlledSelected === undefined) {
                setInternalSelected(newSelected);
            }

            // Notify parent
            onSelectionChange?.(newSelected);
        },
        [selectionMode, selectedItems, controlledSelected, onSelectionChange]
    );

    return (
        <div
            className={cn(
                "flex",
                orientation === "horizontal" ? "flex-row" : "flex-col",
                spacingClasses[spacing],
                className
            )}
        >
            {items.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                const type = item.type || "icon";

                if (type === "icon") {
                    return (
                        <IconButton
                            key={item.id}
                            icon={item.icon}
                            tooltip={item.tooltip}
                            variant={variant}
                            size={size}
                            disabled={item.disabled}
                            selected={isSelected}
                            onClick={() => handleItemClick(item.id)}
                            className={cn(
                                buttonClassName,
                                item.buttonProps?.className
                            )}
                            {...(item.buttonProps as Partial<IconButtonProps>)}
                        />
                    );
                } else {
                    return (
                        <PushButton
                            key={item.id}
                            startIcon={item.icon}
                            variant={variant}
                            disabled={item.disabled}
                            selected={isSelected}
                            onClick={() => handleItemClick(item.id)}
                            className={cn(
                                buttonClassName,
                                item.buttonProps?.className
                            )}
                            {...(item.buttonProps as Partial<PushButtonProps>)}
                        >
                            {item.label}
                        </PushButton>
                    );
                }
            })}
        </div>
    );
};

export default ButtonStrip;
