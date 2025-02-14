import { useState, useCallback, type ReactNode } from "react";
import { AbstractInteractiveBase } from "@/components/base/interactive/AbstractInteractiveBase";
import { ButtonProps } from "@/components/base/interactive/types";
import { CaretDownIcon } from "../../icons";
import dropdownPreset, {
    DropdownVariant,
} from "@/components/base/style/presets/dropdown";
import { cn } from "@/lib/utils";
import { transitionStyles } from "@/components/base/style/compositions";
import { ComputedStyles } from "@/components/base/style/types";
import { composeStyleSets } from "@/components/base/style/utils";

interface DropdownOption {
    label: string;
    value: string;
    icon?: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

// Base props shared by all dropdown variants
interface BaseDropdownProps
    extends Omit<
        ButtonProps<"trigger" | "content" | "item">,
        "onClick" | "onChange" | "as"
    > {
    options: DropdownOption[];
    variant?: DropdownVariant;
    className?: string;
    disabled?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}

// Props specific to button-style dropdown
interface DropdownButtonProps extends BaseDropdownProps {
    label: string;
}

// Props specific to select-style dropdown
interface DropdownSelectProps extends BaseDropdownProps {
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

export const DropdownButton = ({
    label,
    options,
    variant = "default",
    className = "",
    disabled = false,
    onOpenChange,
    ...props
}: DropdownButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = useCallback(() => {
        if (!disabled) {
            const newState = !isOpen;
            setIsOpen(newState);
            onOpenChange?.(newState);
        }
    }, [disabled, isOpen, onOpenChange]);

    // Extract preset styles for the current variant
    const presetStyles =
        dropdownPreset.variants[variant] ?? dropdownPreset.variants.default;

    // Combine preset styles with custom styleProps
    const styleProps = {
        variant,
        elements: {
            root: {
                base: className,
            },
            trigger: {
                base: cn(transitionStyles.transform),
            },
            content: {
                base: cn("absolute z-10 w-full mt-1", transitionStyles.base),
            },
        },
    };

    const combinedStyles = composeStyleSets(
        presetStyles as ComputedStyles<string>,
        styleProps.elements as ComputedStyles<string>
    );

    return (
        <AbstractInteractiveBase
            as="div"
            stylePreset={dropdownPreset}
            styleProps={styleProps}
            {...props}>
            <button
                onClick={handleToggle}
                disabled={disabled}
                className={combinedStyles.trigger.base}>
                <span>{label}</span>
                <CaretDownIcon
                    className={cn(
                        "transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div className={combinedStyles.content.base}>
                    {options.map((option, index) => (
                        <button
                            key={option.value || index}
                            onClick={() => {
                                option.onClick?.();
                                setIsOpen(false);
                                onOpenChange?.(false);
                            }}
                            disabled={option.disabled}
                            className={combinedStyles.item.base}>
                            {option.icon && (
                                <span className="flex-shrink-0">
                                    {option.icon}
                                </span>
                            )}
                            <span className="flex-grow">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </AbstractInteractiveBase>
    );
};

export const DropdownSelect = ({
    value,
    options,
    onChange,
    placeholder = "Select an option",
    variant = "default",
    className = "",
    disabled = false,
    onOpenChange,
    ...props
}: DropdownSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((opt) => opt.value === value);

    const handleToggle = useCallback(() => {
        if (!disabled) {
            const newState = !isOpen;
            setIsOpen(newState);
            onOpenChange?.(newState);
        }
    }, [disabled, isOpen, onOpenChange]);

    // Extract preset styles for the current variant
    const presetStyles = dropdownPreset.variants[variant];

    // Combine preset styles with custom styleProps
    const styleProps = {
        variant,
        elements: {
            root: {
                base: className,
            },
            trigger: {
                base: cn(transitionStyles.transform),
            },
            content: {
                base: cn("absolute z-10 w-full mt-1", transitionStyles.base),
            },
        },
    };

    const combinedStyles = composeStyleSets(
        presetStyles as ComputedStyles<string>,
        styleProps.elements as ComputedStyles<string>
    );

    return (
        <AbstractInteractiveBase
            as="div"
            stylePreset={dropdownPreset}
            styleProps={styleProps}
            {...props}>
            <button
                onClick={handleToggle}
                disabled={disabled}
                className={combinedStyles.trigger.base}>
                <span className={cn(!selectedOption && "text-gray-400")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <CaretDownIcon
                    className={cn(
                        "transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div className={combinedStyles.content.base}>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                                onOpenChange?.(false);
                            }}
                            disabled={option.disabled}
                            className={cn(
                                combinedStyles.item.base,
                                option.value === value &&
                                    "bg-gray-700 text-white"
                            )}>
                            {option.icon && (
                                <span className="flex-shrink-0">
                                    {option.icon}
                                </span>
                            )}
                            <span className="flex-grow">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </AbstractInteractiveBase>
    );
};

export default {
    Button: DropdownButton,
    Select: DropdownSelect,
};
