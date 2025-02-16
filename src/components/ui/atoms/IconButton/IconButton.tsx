import { ComponentType, ReactNode } from "react";
import { IconProps } from "@/lib/icons/types";
import AbstractInteractiveBase from "@/components/base/interactive/AbstractInteractiveBase";
import { ButtonProps } from "@/components/base/interactive/types";
import { IconUtils } from "@/lib/icons/utils";
import { ICON_SIZE_CLASSES, IconPresetSize } from "@/lib/icons/presets";
import iconButtonPreset, {
    IconButtonVariant,
} from "@/components/base/style/presets/iconButton";
import { cn } from "@/lib/utils";

// Props specific to IconButton
export interface IconButtonProps extends ButtonProps<"icon"> {
    // Icon configuration
    icon: ComponentType<IconProps> | ReactNode;
    iconProps?: Partial<IconProps>;

    // Size configuration
    size?: IconPresetSize | string;
    iconSize?: IconPresetSize | number | string;
    containerSize?: IconPresetSize | string;

    // Style configuration
    variant?: IconButtonVariant;
    className?: string;

    // Optional tooltip text
    tooltip?: string;
}

export const IconButton = ({
    // Icon props
    icon,
    iconProps = {},
    // Size props
    size = "md",
    iconSize,
    containerSize,
    // Style props
    variant = "default",
    className,
    styleProps,
    // Visual props
    tooltip,
    // Base props
    ...props
}: IconButtonProps) => {
    const { as, ...restProps } = props;

    // Get container size classes from IconUtils
    const containerClasses = IconUtils.getContainerClasses(
        containerSize || size
    );

    // Determine icon size with utility function
    const finalIconSize = IconUtils.getIconSize(
        iconSize ||
            (IconUtils.isPresetSize(size) ? ICON_SIZE_CLASSES[size].icon : size)
    );

    // Merge style props
    const finalStyleProps = {
        ...styleProps,
        variant,
        elements: {
            root: {
                base: cn(
                    containerClasses,
                    styleProps?.elements?.root,
                    className
                ),
            },
            icon: styleProps?.elements?.icon,
        },
    };

    return (
        <AbstractInteractiveBase<"icon">
            as="button"
            type="button"
            title={tooltip}
            stylePreset={iconButtonPreset}
            styleProps={finalStyleProps}
            isEditable={false}
            {...restProps}>
            {IconUtils.render(icon, finalIconSize, iconProps)}
        </AbstractInteractiveBase>
    );
};

export default IconButton;
