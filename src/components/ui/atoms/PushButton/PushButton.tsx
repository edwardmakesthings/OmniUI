import { ComponentType, ReactNode, useEffect, useState } from "react";
import { IconProps } from "@/lib/icons/types";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
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

    // State handling
    currentState?: number | boolean;
    states?: {
        count?: number;
        labels?: ReactNode[];
        startIcons?: (ComponentType<IconProps> | ReactNode)[];
        endIcons?: (ComponentType<IconProps> | ReactNode)[];
        iconProps?: Partial<IconProps>[];
        variants?: ButtonVariant[];
        classNames?: string[];
    };
    defaultState?: number;
    onStateChange?: (newState: number) => void;
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

    // State props
    currentState: controlledState,
    states,
    defaultState = 0,
    onStateChange,

    ...props
}: PushButtonProps) => {
    // State management
    const [internalState, setInternalState] = useState(defaultState);

    // Use controlled or internal state
    const currentState =
        controlledState !== undefined
            ? typeof controlledState === "boolean"
                ? controlledState
                    ? 1
                    : 0
                : controlledState
            : internalState;

    // Sync with controlled state if provided
    useEffect(() => {
        if (controlledState !== undefined) {
            const numericState =
                typeof controlledState === "boolean"
                    ? controlledState
                        ? 1
                        : 0
                    : controlledState;
            setInternalState(numericState);
        }
    }, [controlledState]);

    // Determine number of states
    const stateCount =
        states?.count || (typeof controlledState === "boolean" ? 2 : 0);

    // Handle state cycling
    const handleStateChange = () => {
        if (!states) return;

        const nextState = (currentState + 1) % stateCount;
        setInternalState(nextState);
        onStateChange?.(nextState);
    };

    // Determine content based on state
    const stateLabel = states?.labels?.[currentState] || children;
    const stateStartIcon = states?.startIcons?.[currentState] || startIcon;
    const stateEndIcon = states?.endIcons?.[currentState] || endIcon;
    const stateIconProps = states?.iconProps?.[currentState] || iconProps;
    const stateVariant = states?.variants?.[currentState] || variant;
    const stateClassName = states?.classNames?.[currentState] || className;

    // Get final icon size in pixels
    const finalIconSize = IconUtils.getIconSize(iconSize);

    // Merge style props
    const finalStyleProps = {
        ...styleProps,
        variant: stateVariant,
        elements: {
            root: {
                base: cn(styleProps?.elements?.root?.base, stateClassName),
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
        <BaseInteractor<"content" | "startIcon" | "endIcon">
            as="button"
            aria-label={ariaLabel}
            stylePreset={buttonPreset}
            styleProps={finalStyleProps}
            state={{
                isDisabled: disabled || loading,
            }}
            onClick={states ? handleStateChange : undefined}
            {...buttonProps}
        >
            {stateStartIcon && (
                <span className={cn("mr-2", loading && "opacity-0")}>
                    {IconUtils.render(
                        stateStartIcon,
                        finalIconSize,
                        stateIconProps
                    )}
                </span>
            )}
            <span className={cn(loading && "opacity-0")}>{stateLabel}</span>
            {stateEndIcon && (
                <span className={cn("ml-2", loading && "opacity-0")}>
                    {IconUtils.render(
                        stateEndIcon,
                        finalIconSize,
                        stateIconProps
                    )}
                </span>
            )}
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="animate-spin">⟳</span>
                </div>
            )}
        </BaseInteractor>
    );
};

export default PushButton;
