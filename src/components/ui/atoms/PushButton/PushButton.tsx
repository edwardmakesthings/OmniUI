import { ComponentType, ReactNode } from "react";
import { IconProps } from "@/lib/icons/types";
import { AbstractInteractiveBase } from "@/components/base/interactive/AbstractInteractiveBase";
import { ButtonProps } from "@/components/base/interactive/types";
import { IconUtils } from "@/lib/icons/utils";
import { IconPresetSize } from "@/lib/icons/presets";
import buttonPreset, {
    ButtonVariant,
} from "@/components/base/style/presets/button";
import { cn } from "@/lib/utils";

export interface PushButtonProps
    extends Omit<ButtonProps<"content" | "startIcon" | "endIcon">, "as"> {
    // Content
    children: ReactNode;

    // Icon configuration
    startIcon?: ComponentType<IconProps> | ReactNode;
    endIcon?: ComponentType<IconProps> | ReactNode;
    iconProps?: Partial<IconProps>;
    iconSize?: IconPresetSize | number;

    // Style configuration
    variant?: ButtonVariant;
    className?: string;

    // Behavioral props
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;

    // Accessibility
    ariaLabel?: string;
}

export const PushButton = ({
    // Content props
    children,

    // Icon props
    startIcon,
    endIcon,
    iconProps = {},
    iconSize = "sm",

    // Style props
    variant = "default",
    className,
    styleProps,

    // Behavioral props
    type = "button",
    disabled = false,
    loading = false,

    // Accessibility
    ariaLabel,

    ...props
}: PushButtonProps) => {
    // Get final icon size in pixels
    const finalIconSize = IconUtils.getIconSize(iconSize);

    // Merge style props
    const finalStyleProps = {
        ...styleProps,
        variant,
        elements: {
            root: {
                base: cn(styleProps?.elements?.root?.base, className),
            },
            content: styleProps?.elements?.content,
            startIcon: styleProps?.elements?.startIcon,
            endIcon: styleProps?.elements?.endIcon,
        },
    };

    // Props specifically for the button element
    const buttonProps = {
        type,
        ...props,
    };

    return (
        <AbstractInteractiveBase<"content" | "startIcon" | "endIcon">
            as="button"
            aria-label={ariaLabel}
            stylePreset={buttonPreset}
            styleProps={finalStyleProps}
            state={{
                isDisabled: disabled || loading,
            }}
            {...buttonProps}
        >
            {startIcon && (
                <span className={cn("mr-2", loading && "opacity-0")}>
                    {IconUtils.render(startIcon, finalIconSize, iconProps)}
                </span>
            )}
            <span className={cn(loading && "opacity-0")}>{children}</span>
            {endIcon && (
                <span className={cn("ml-2", loading && "opacity-0")}>
                    {IconUtils.render(endIcon, finalIconSize, iconProps)}
                </span>
            )}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* loading spinner component here */}
                    <span className="animate-spin">⟳</span>
                </div>
            )}
        </AbstractInteractiveBase>
    );
};

export default PushButton;
