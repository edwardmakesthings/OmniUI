import { useState, useCallback, useRef, useEffect } from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    ButtonProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import { CaretDownIcon, CheckIcon } from "../../icons";
import dropdownPreset, {
    DropdownVariant,
} from "@/components/base/style/presets/dropdown";
import { cn } from "@/lib/utils";
import type { AriaAttributes, ReactNode } from "react";
import { DropdownOption } from "./Dropdown";

export interface DropdownSelectProps
    extends Omit<
        ButtonProps<"trigger" | "content" | "item">,
        "onClick" | "onChange" | "as"
    > {
    // Value handling
    value?: string | string[];
    onChange?: (value: string | string[]) => void;

    // Display
    label?: ReactNode; // Visual label (optional if using placeholder)
    accessibleLabel?: string; // Required for icon-only labels
    placeholder?: string;
    options: DropdownOption[];
    showCaret?: boolean;
    multiple?: boolean;

    // Behavior
    variant?: DropdownVariant;
    closeOnBlur?: boolean;
    closeOnMouseLeave?: boolean;
    closeDelay?: number;
    closeOnSelect?: boolean; // Auto-close after selection (default: true for single, false for multiple)
    disabled?: boolean;
    onOpenChange?: (isOpen: boolean) => void;

    // Style
    className?: string;
}

export const DropdownSelect = ({
    // Value props
    value = [],
    onChange = () => {},

    // Display props
    label,
    accessibleLabel,
    placeholder = "Select an option",
    options,
    showCaret = true,
    multiple = false,

    // Behavior props
    variant = "default",
    closeOnBlur = true,
    closeOnMouseLeave = false,
    closeDelay = 150,
    closeOnSelect,
    disabled = false,
    onOpenChange,

    // Style props
    className,
    styleProps,
    ...props
}: DropdownSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout>();

    // Handle single/multi value types
    const selectedValues = Array.isArray(value)
        ? value
        : [value].filter(Boolean);
    const selectedOptions = options.filter((opt) =>
        selectedValues.includes(opt.value)
    );

    // Default closeOnSelect based on multiple
    const shouldCloseOnSelect = closeOnSelect ?? !multiple;

    const handleToggle = useCallback(() => {
        if (!disabled) {
            const newState = !isOpen;
            setIsOpen(newState);
            onOpenChange?.(newState);
        }
    }, [disabled, isOpen, onOpenChange]);

    const handleSelect = useCallback(
        (option: DropdownOption) => {
            if (multiple) {
                const newValues = selectedValues.includes(option.value)
                    ? selectedValues.filter((v) => v !== option.value)
                    : [...selectedValues, option.value];
                onChange(newValues);
            } else {
                onChange(option.value);
            }

            if (shouldCloseOnSelect) {
                setIsOpen(false);
                onOpenChange?.(false);
            }
        },
        [multiple, selectedValues, onChange, shouldCloseOnSelect, onOpenChange]
    );

    // Handle clicks outside
    useEffect(() => {
        if (!closeOnBlur) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                onOpenChange?.(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, closeOnBlur, onOpenChange]);

    // Clean up timeout on unmount
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (closeOnMouseLeave && isOpen) {
            // Clear any existing timeout
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            // Set new timeout
            closeTimeoutRef.current = setTimeout(() => {
                setIsOpen(false);
                onOpenChange?.(false);
            }, closeDelay);
        }
    }, [closeOnMouseLeave, closeDelay, isOpen, onOpenChange]);

    const handleMouseEnter = useCallback(() => {
        // Clear close timeout if mouse re-enters
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
        }
    }, []);

    const renderDropdown = ({
        elementProps,
        state,
        computedStyle,
    }: RenderElementProps) => {
        const componentId =
            (elementProps as any)?.["data-component-id"] || "root";
        const dropdownId = `dropdown-${componentId}`;
        const labelId = `${dropdownId}-label`;
        const listId = `${dropdownId}-list`;

        // Use accessibleLabel, or label if it's a string, or fall back to placeholder
        const ariaLabel =
            accessibleLabel ||
            (typeof label === "string" ? label : placeholder);

        const ariaAttrs: AriaAttributes & {
            "aria-label"?: string;
            role?: string;
        } = {
            role: "combobox",
            "aria-expanded": isOpen,
            "aria-haspopup": "listbox",
            "aria-label": ariaLabel,
            "aria-controls": isOpen ? listId : undefined,
            "aria-activedescendant": selectedValues.length
                ? `${dropdownId}-option-${selectedValues[0]}`
                : undefined,
            "aria-multiselectable": multiple,
        };

        const getDisplayContent = () => {
            if (label) return label;
            if (selectedOptions.length === 0) return placeholder;
            if (selectedOptions.length === 1) return selectedOptions[0].label;
            return `${selectedOptions.length} items selected`;
        };

        return (
            <div
                {...elementProps}
                ref={dropdownRef}
                className={computedStyle.root}
                aria-labelledby={labelId}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
            >
                <button
                    type="button"
                    onClick={handleToggle}
                    disabled={state.isDisabled}
                    className={computedStyle.trigger}
                    id={labelId}
                    {...ariaAttrs}
                >
                    <span
                        className={cn(
                            !selectedOptions.length && "text-font-dark-dimmed"
                        )}
                    >
                        {getDisplayContent()}
                    </span>
                    {showCaret && (
                        <CaretDownIcon
                            className={cn(
                                "transition-transform duration-200",
                                isOpen && "rotate-180"
                            )}
                            aria-hidden="true"
                        />
                    )}
                </button>

                {isOpen && (
                    <div
                        className={computedStyle.content}
                        role="listbox"
                        id={listId}
                        aria-label={`${ariaLabel} options`}
                    >
                        {options.map((option) => {
                            const isSelected = selectedValues.includes(
                                option.value
                            );

                            const optionAriaAttrs = {
                                id: `${dropdownId}-option-${option.value}`,
                                ...(isSelected
                                    ? { "aria-selected": true }
                                    : {}),
                            };

                            return (
                                <div
                                    key={option.value}
                                    onClick={() =>
                                        !option.disabled && handleSelect(option)
                                    }
                                    className={cn(
                                        computedStyle.item,
                                        isSelected && "bg-accent-dark-neutral",
                                        option.disabled &&
                                            "opacity-50 cursor-not-allowed"
                                    )}
                                    role="option"
                                    {...optionAriaAttrs}
                                >
                                    {multiple && (
                                        <CheckIcon
                                            className={cn(
                                                "mr-2",
                                                !isSelected && "invisible"
                                            )}
                                            aria-hidden="true"
                                        />
                                    )}
                                    {option.icon && (
                                        <span
                                            className="flex-shrink-0 mr-2"
                                            aria-hidden="true"
                                        >
                                            {option.icon}
                                        </span>
                                    )}
                                    <span className="flex-grow text-left">
                                        {option.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <BaseInteractor
            as="div"
            stylePreset={dropdownPreset}
            styleProps={{
                variant,
                elements: {
                    root: {
                        base: className,
                    },
                    ...styleProps?.elements,
                },
            }}
            state={{
                isDisabled: disabled,
                isActive: isOpen,
            }}
            renderElement={renderDropdown}
            {...props}
        />
    );
};

export default DropdownSelect;
