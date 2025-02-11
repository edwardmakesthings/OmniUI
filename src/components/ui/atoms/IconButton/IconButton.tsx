import { ComponentType, ReactNode } from 'react';
import { IconProps } from '@/lib/icons/types';
import { StylePreset } from '@/components/base/style/presets/types';
import AbstractInteractiveBase from '@/components/base/interactive/AbstractInteractiveBase';
import { ButtonProps } from '@/components/base/interactive/types';
import { SizeUtils, SizeValue } from '@/core/types/Geometry';
import { cn } from '@/lib/utils';
import { IconUtils } from '@/lib/icons/utils';
import { ICON_SIZE_CLASSES, IconPresetSize, UI_ICON_CLASSES, UIIconComponent } from '@/lib/icons/presets';

export type IconButtonVariant = 'default' | 'ghost' | 'outline' | 'minimal';
type IconButtonElements = 'icon';

// Style preset definition - could potentially move to presets/buttons.ts
export const iconButtonPreset: StylePreset<IconButtonElements> = {
    name: 'iconButton',
    elements: ['icon'],
    variants: {
        default: {
            root: {
                base: 'inline-flex items-center justify-center bg-gray-600 text-white rounded-md',
                hover: 'hover:bg-gray-700',
                focus: 'focus:ring-2 focus:ring-gray-500',
                active: 'active:bg-gray-800',
                disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
            },
            icon: {
                base: 'flex-shrink-0',
                hover: 'group-hover:text-white',
                disabled: 'group-disabled:text-gray-400'
            }
        },
        ghost: {
            root: {
                base: 'inline-flex items-center justify-center bg-transparent text-gray-300',
                hover: 'hover:bg-gray-700/50 hover:text-white',
                focus: 'focus:ring-2 focus:ring-gray-500',
                active: 'active:bg-gray-800/50',
                disabled: 'disabled:opacity-50 disabled:cursor-not-allowed'
            },
            icon: {
                base: 'flex-shrink-0',
                hover: 'group-hover:text-white',
                disabled: 'group-disabled:text-gray-400'
            }
        }
        // outline, minimal
    }
};

// Props specific to IconButton
export interface IconButtonProps extends ButtonProps<IconButtonElements> {
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
    size = 'md',
    iconSize,
    containerSize,
    // Style props
    variant = 'default',
    className,
    styleProps,
    // Visual props
    tooltip,
    // Base props
    ...props
}: IconButtonProps) => {
    const { as, ...restProps } = props;

    // Determine container size classes
    const containerClasses = IconUtils.getContainerClasses(containerSize || size);

    // Determine icon size
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
                    'inline-flex items-center justify-center',
                    containerClasses, className
                )
            }
        }
    };

    return (
        <AbstractInteractiveBase<IconButtonElements>
            as="button"
            type="button"
            title={tooltip}
            stylePreset={iconButtonPreset}
            styleProps={finalStyleProps}
            {...restProps}
        >
            {IconUtils.render(icon, finalIconSize, iconProps)}
        </AbstractInteractiveBase>
    );
};

export default IconButton;