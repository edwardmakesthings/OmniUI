import {
    useState,
    useCallback,
    type ReactNode,
    AriaAttributes,
    useRef,
    useEffect,
} from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    ButtonProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import { CaretDownIcon } from "../../icons";
import dropdownPreset, {
    DropdownVariant,
} from "@/components/base/style/presets/dropdown";
import { cn } from "@/lib/utils";

export interface DropdownOption {
    label: string;
    value: string;
    icon?: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

// Props specific to button-style dropdown
export interface DropdownButtonProps
    extends Omit<
        ButtonProps<"trigger" | "content" | "item">,
        "onClick" | "onChange" | "as"
    > {
    label: string | ReactNode;
    accessibleLabel?: string; // Required for icon-only labels
    options: DropdownOption[];
    variant?: DropdownVariant;
    className?: string;
    disabled?: boolean;
    showCaret?: boolean;
    closeOnBlur?: boolean;
    closeOnMouseLeave?: boolean;
    closeDelay?: number; // Delay in ms before closing (for mouseLeave)
    onOpenChange?: (isOpen: boolean) => void;
}

export const DropdownButton = ({
    label,
    accessibleLabel,
    options,
    variant = "default",
    className,
    disabled = false,
    showCaret = true,
    closeOnBlur = true,
    closeOnMouseLeave = false,
    closeDelay = 150,
    onOpenChange,
    styleProps,
    ...props
}: DropdownButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout>();

    const handleToggle = useCallback(() => {
        if (!disabled) {
            const newState = !isOpen;
            setIsOpen(newState);
            onOpenChange?.(newState);
        }
    }, [disabled, isOpen, onOpenChange]);

    const handleOptionClick = useCallback(
        (option: DropdownOption) => {
            option.onClick?.();
            setIsOpen(false);
            onOpenChange?.(false);
        },
        [onOpenChange]
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

    // Render function for the dropdown content
    const renderDropdown = ({
        elementProps,
        state,
        computedStyle,
    }: RenderElementProps) => {
        // Component and ARIA identifiers
        const componentId =
            (elementProps as any)?.["data-component-id"] || "root";
        const dropdownId = `dropdown-${componentId}`;
        const labelId = `${dropdownId}-label`;

        // ARIA attributes for accessibility
        const ariaAttrs: AriaAttributes & { "aria-label"?: string } = {
            "aria-expanded": isOpen,
            "aria-haspopup": "listbox",
            "aria-label": accessibleLabel,
            "aria-controls": isOpen ? `${dropdownId}-list` : undefined,
            "aria-labelledby": labelId,
        };

        return (
            <div
                {...elementProps}
                ref={dropdownRef}
                className={computedStyle.root}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={handleMouseEnter}
            >
                {/* Text and trigger (caret) container */}
                <button
                    type="button"
                    id={labelId}
                    onClick={handleToggle}
                    disabled={state.isDisabled}
                    className={computedStyle.trigger}
                    {...ariaAttrs}
                >
                    {typeof label === "string" ? <span>{label}</span> : label}
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

                {/* Dropdown Content */}
                {isOpen && (
                    <div
                        className={computedStyle.content}
                        role="listbox"
                        id={`${dropdownId}-list`}
                        aria-label={`${label} options`}
                    >
                        {options.map((option, index) => (
                            <button
                                key={option.value || index}
                                role="option"
                                onClick={() => handleOptionClick(option)}
                                disabled={option.disabled}
                                className={computedStyle.item}
                                aria-selected="false"
                                id={`${dropdownId}-option-${index}`}
                            >
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
                            </button>
                        ))}
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

export default DropdownButton;
