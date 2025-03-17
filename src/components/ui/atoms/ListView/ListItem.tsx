import { AriaAttributes, ComponentType, ReactNode } from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    DivProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import { IconProps } from "@/lib/icons/types";
import { IconUtils } from "@/lib/icons/utils";
import listItemPreset, {
    ListItemVariant,
} from "@/components/base/style/presets/listItem";
import { cn } from "@/lib/utils";

export interface ListItemMetadata {
    id: string;
    [key: string]: any;
}

export interface ListItemProps<T extends ListItemMetadata = ListItemMetadata>
    extends Omit<
        DivProps<"content" | "startIcon" | "endIcon">,
        "as" | "onSelect"
    > {
    // Content
    children?: ReactNode;
    metadata?: T;

    // Icons
    startIcon?: ComponentType<IconProps> | ReactNode;
    endIcon?: ComponentType<IconProps> | ReactNode;
    iconProps?: Partial<IconProps>;

    // State
    selected?: boolean;
    disabled?: boolean;
    focused?: boolean;

    // Style
    variant?: ListItemVariant;
    className?: string;
    contentClassName?: string;
    startIconClassName?: string;
    endIconClassName?: string;

    // Handlers
    onSelect?: (metadata: T) => void;
}

export function ListItem<T extends ListItemMetadata>({
    // Content
    children,
    metadata,

    // Icons
    startIcon,
    endIcon,
    iconProps = {},

    // State
    selected = false,
    disabled = false,
    focused = false,

    // Style
    variant = "default",
    className,
    contentClassName,
    startIconClassName,
    endIconClassName,
    styleProps,

    // Handlers
    onSelect,
    onClick,

    ...props
}: ListItemProps<T>) {
    // Combine click handlers
    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!disabled) {
            onClick?.(e);
            if (metadata) {
                onSelect?.(metadata);
            }
        }
    };

    // Render function for the list item
    const renderListItem = ({
        elementProps,
        state: _state,
        computedStyle,
    }: RenderElementProps) => {
        // Get container ID for ARIA
        const componentId =
            (elementProps as any)?.["data-component-id"] || "list-item";

        const ariaAttributes: AriaAttributes & { role?: string } = {
            role: "option",
            "aria-selected": selected,
            "aria-disabled": disabled,
        };

        return (
            <div
                {...elementProps}
                id={componentId}
                className={computedStyle.root}
                onClick={handleClick}
                tabIndex={disabled ? -1 : 0}
                {...ariaAttributes}
            >
                {/* Start Icon */}
                {startIcon && (
                    <span
                        className={cn(
                            computedStyle.startIcon,
                            startIconClassName
                        )}
                    >
                        {IconUtils.render(startIcon, 20, iconProps)}
                    </span>
                )}

                {/* Content */}
                <span className={cn(computedStyle.content, contentClassName)}>
                    {children}
                </span>

                {/* End Icon */}
                {endIcon && (
                    <span
                        className={cn(computedStyle.endIcon, endIconClassName)}
                    >
                        {IconUtils.render(endIcon, 20, iconProps)}
                    </span>
                )}
            </div>
        );
    };

    return (
        <BaseInteractor
            as="div"
            stylePreset={listItemPreset}
            styleProps={{
                variant,
                elements: {
                    root: {
                        base: className,
                    },
                    content: {
                        base: contentClassName,
                    },
                    startIcon: {
                        base: startIconClassName,
                    },
                    endIcon: {
                        base: endIconClassName,
                    },
                },
            }}
            state={{
                isSelected: selected,
                isDisabled: disabled,
                isFocused: focused,
            }}
            renderElement={renderListItem}
            {...props}
        />
    );
}

export default ListItem;
