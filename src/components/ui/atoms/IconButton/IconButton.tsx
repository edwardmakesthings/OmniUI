import { ComponentType, ReactNode, useEffect, useState } from "react";
import { IconProps } from "@/lib/icons/types";
import BaseInteractor from "@/components/base/interactive/BaseInteractor";
import { ButtonProps } from "@/components/base/interactive/types";
import { IconUtils } from "@/lib/icons/utils";
import { ICON_SIZE_CLASSES, IconPresetSize } from "@/lib/icons/presets";
import iconButtonPreset, {
    IconButtonVariant,
} from "@/components/base/style/presets/iconButton";
import { cn } from "@/lib/utils";

// Props specific to IconButton
export interface IconButtonProps extends Omit<ButtonProps<"icon">, "as"> {
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

    // State handling
    currentState?: number | boolean;
    states?: {
        count?: number;
        icons?: (ComponentType<IconProps> | ReactNode)[];
        iconProps?: Partial<IconProps>[];
        tooltips?: string[];
        variants?: IconButtonVariant[];
        classNames?: string[];
    };
    defaultState?: number;
    onStateChange?: (newState: number) => void;
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
    // State handling
    currentState: controlledState,
    states,
    defaultState = 0,
    onStateChange,
    // Base props
    ...props
}: IconButtonProps) => {
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
        states?.count || (typeof controlledState === "boolean" ? 2 : 1);

    // Handle state cycling
    const handleStateChange = () => {
        if (!states) return;

        const nextState = (currentState + 1) % stateCount;
        setInternalState(nextState);
        onStateChange?.(nextState);
    };

    // Determine which icon to use based on state
    const stateIcon = states?.icons?.[currentState] || icon;
    const stateIconProps = states?.iconProps?.[currentState] || iconProps;
    const stateTooltip = states?.tooltips?.[currentState] || tooltip;
    const stateVariant = states?.variants?.[currentState] || variant;
    const stateClassName = states?.classNames?.[currentState] || className;

    // Get final icon size and container classes
    const finalIconSize = IconUtils.getIconSize(
        iconSize ||
            (IconUtils.isPresetSize(size) ? ICON_SIZE_CLASSES[size].icon : size)
    );

    // Get container size classes from IconUtils
    const containerClasses = IconUtils.getContainerClasses(
        containerSize || size
    );

    // Determine icon size with utility function

    // Merge style props
    const finalStyleProps = {
        ...styleProps,
        variant: stateVariant,
        elements: {
            root: {
                base: cn(
                    containerClasses,
                    styleProps?.elements?.root,
                    stateClassName
                ),
            },
            icon: styleProps?.elements?.icon,
        },
    };

    return (
        <BaseInteractor<"icon">
            as="button"
            type="button"
            title={stateTooltip}
            stylePreset={iconButtonPreset}
            styleProps={finalStyleProps}
            state={{
                isEditable: false,
            }}
            onClick={states ? handleStateChange : undefined}
            {...props}
        >
            {IconUtils.render(stateIcon, finalIconSize, stateIconProps)}
        </BaseInteractor>
    );
};

export default IconButton;
