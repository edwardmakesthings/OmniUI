import { ButtonHTMLAttributes, ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { IconProps } from '@/lib/icons/types';

export type IconButtonPresetSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconButtonSize = IconButtonPresetSize | number;
export type IconButtonVariant = 'solid' | 'ghost' | 'outline' | 'minimal';
export type IconButtonPadding = 'none' | 'tight' | 'normal' | 'loose';
export type IconButtonShape = 'square' | 'rounded' | 'circle';

export interface IconButtonStyleProps {
    /** Whether to show focus ring */
    showFocusRing?: boolean;
    /** Custom focus ring color (if showFocusRing is true) */
    focusRingColor?: string;
    /** Whether to show hover effects */
    showHoverEffect?: boolean;
    /** Custom hover background color */
    hoverBackgroundColor?: string;
    /** Custom hover text color */
    hoverTextColor?: string;
    /** Custom disabled styles */
    disabledStyle?: 'faded' | 'hidden' | 'custom';
    /** Opacity when disabled (if disabledStyle is 'faded') */
    disabledOpacity?: number;
    /** Custom background color when disabled */
    disabledBackgroundColor?: string;
    /** Custom text color when disabled */
    disabledTextColor?: string;
}

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Icon component to display */
    icon: ComponentType<IconProps> | ReactNode;
    /** Props to pass to the icon component */
    iconProps?: IconProps;
    /** Optional tooltip text */
    tooltip?: string;
    /** Whether the button is active/selected */
    isActive?: boolean;
    /** Size of the icon - either a preset size or a number in pixels */
    size?: IconButtonSize;
    /** Optional explicit container size in pixels. Defaults to icon size + 2px if not specified */
    containerSize?: number;
    /** Amount of padding around the icon */
    padding?: IconButtonPadding;
    /** Visual style variant */
    variant?: IconButtonVariant;
    /** Shape of the button */
    shape?: IconButtonShape;
    /** Style customization props */
    styleProps?: IconButtonStyleProps;
    /** Additional class names */
    className?: string;
}

// Preset icon sizes in pixels
const presetIconSizes: Record<IconButtonPresetSize, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
} as const;

// Container sizes for preset sizes (slightly larger to account for SVG viewBox)
const presetContainerSizes: Record<IconButtonPresetSize, string> = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4.5 h-4.5',
    md: 'w-5.5 h-5.5',
    lg: 'w-6.5 h-6.5',
    xl: 'w-8.5 h-8.5'
} as const;

const paddingClasses: Record<IconButtonPadding, string> = {
    none: 'p-0',
    tight: 'p-0.5',
    normal: 'p-2',
    loose: 'p-3'
} as const;

const variantClasses: Record<IconButtonVariant, string> = {
    solid: 'bg-gray-800 text-white',
    ghost: 'text-gray-300',
    outline: 'border border-gray-600 text-gray-300',
    minimal: 'text-gray-400'
} as const;

const shapeClasses: Record<IconButtonShape, string> = {
    square: '',
    rounded: 'rounded-md',
    circle: 'rounded-full'
} as const;

/**
 * Gets the icon size in pixels based on the size prop
 */
const getIconSize = (size: IconButtonSize): number => {
    if (typeof size === 'number') return size;
    return presetIconSizes[size];
};

/**
 * Gets the container size classes based on the size prop
 */
const getContainerSizeStyle = (
    size: IconButtonSize,
    containerSize?: number
): React.CSSProperties => {
    if (containerSize !== undefined) {
        return {
            width: `${containerSize}px`,
            height: `${containerSize}px`,
        };
    }

    if (typeof size === 'number') {
        const defaultContainerSize = `${size + 2}px`;
        return {
            width: defaultContainerSize,
            height: defaultContainerSize,
        };
    }
    return {};
};

/**
 * Gets the container size classes based on the size prop
 */
const getContainerSizeClass = (size: IconButtonSize): string => {
    if (typeof size === 'string') {
        return presetContainerSizes[size];
    }
    return '';
};

/**
 * Gets interactive state classes based on style props
 */
const getInteractiveClasses = (
    variant: IconButtonVariant,
    styleProps: IconButtonStyleProps = {}
): string => {
    const {
        showFocusRing = false,
        focusRingColor = 'gray-500',
        showHoverEffect = true,
        hoverBackgroundColor,
        hoverTextColor,
        disabledStyle = 'faded',
        disabledOpacity = 0.5,
        disabledBackgroundColor,
        disabledTextColor,
    } = styleProps;

    const classes: string[] = [];

    // Focus styles
    if (showFocusRing) {
        classes.push(`focus:outline-none focus:ring-2 focus:ring-${focusRingColor}`);
    } else {
        classes.push('focus:outline-none');
    }

    // Hover styles
    if (showHoverEffect) {
        if (hoverBackgroundColor || hoverTextColor) {
            if (hoverBackgroundColor) classes.push(`hover:bg-${hoverBackgroundColor}`);
            if (hoverTextColor) classes.push(`hover:text-${hoverTextColor}`);
        } else {
            // Default hover styles by variant
            switch (variant) {
                case 'solid':
                    classes.push('hover:bg-gray-700');
                    break;
                case 'ghost':
                case 'outline':
                    classes.push('hover:bg-gray-700/50 hover:text-white');
                    break;
                case 'minimal':
                    classes.push('hover:text-white');
                    break;
            }
        }
    }

    // Disabled styles
    switch (disabledStyle) {
        case 'faded':
            classes.push(`disabled:opacity-[${disabledOpacity}] disabled:cursor-not-allowed`);
            break;
        case 'hidden':
            classes.push('disabled:opacity-0');
            break;
        case 'custom':
            if (disabledBackgroundColor) classes.push(`disabled:bg-${disabledBackgroundColor}`);
            if (disabledTextColor) classes.push(`disabled:text-${disabledTextColor}`);
            classes.push('disabled:cursor-not-allowed');
            break;
    }

    return classes.join(' ');
};

/**
 * Enhanced IconButton component with independent control over icon size, padding, visual style, and shape.
 * Supports both preset sizes and custom numeric sizes in pixels.
 *
 * @example
 * ```tsx
 * // Using preset size
 * <IconButton icon={Search} size="lg" />
 *
 * // Using custom size with explicit container size
 * <IconButton
 *   icon={Search}
 *   size={20}
 *   containerSize={32}
 * />
 *
 * // Minimal style with custom size
 * <IconButton
 *   icon={X}
 *   size={18}
 *   variant="minimal"
 *   padding="none"
 * />
 * ```
 */
export const IconButton = ({
    icon: Icon,
    iconProps = {},
    tooltip,
    isActive = false,
    size = 'md',
    containerSize,
    padding = 'normal',
    variant = 'solid',
    shape = 'rounded',
    styleProps,
    className,
    disabled,
    ...props
}: IconButtonProps) => {
    // Remove size from iconProps as we'll handle it separately
    const { size: _, ...restIconProps } = iconProps;

    return (
        <button
            type="button"
            title={tooltip}
            disabled={disabled}
            className={cn(
                'inline-flex items-center justify-center transition-colors',
                variantClasses[variant],
                shapeClasses[shape],
                paddingClasses[padding],
                getInteractiveClasses(variant, styleProps),
                isActive && 'bg-gray-700',
                getContainerSizeClass(size),
                className
            )}
            {...props}
        >
            <span className="inline-flex items-center justify-center"
                style={getContainerSizeStyle(size, containerSize)}
            >
                {typeof Icon === 'function' ? (
                    <Icon
                        size={getIconSize(size)}
                        {...restIconProps}
                    />
                ) : (
                    Icon
                )}
            </span>
        </button>
    );
};

export default IconButton;