import { useState, useCallback, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CaretDownIcon } from "../../icons";

// Style configurations
const VARIANTS = {
    default: {
        trigger: 'bg-white hover:bg-gray-50 border',
        item: 'hover:bg-gray-50 focus:bg-gray-50'
    },
    outline: {
        trigger: 'border-2 border-gray-300 hover:border-gray-400',
        item: 'hover:bg-gray-100 focus:bg-gray-100 border-l-2 border-transparent hover:border-gray-300'
    },
    ghost: {
        trigger: 'hover:bg-gray-700',
        item: 'hover:bg-gray-700 focus:bg-gray-700'
    }
} as const;

const SIZES = {
    sm: {
        trigger: 'px-2 py-1 text-sm',
        item: 'px-2 text-sm'
    },
    md: {
        trigger: 'px-4 py-2',
        item: 'px-4 py-1'
    },
    lg: {
        trigger: 'px-6 py-3 text-lg',
        item: 'px-6 py-2 text-lg'
    }
} as const;

// Types
type DropdownVariant = keyof typeof VARIANTS;
type DropdownSize = keyof typeof SIZES;

interface DropdownOption {
    label: string;
    value: string;
    icon?: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

// Base interfaces for all dropdowns
interface BaseDropdownProps {
    /** Array of dropdown options */
    options: DropdownOption[];
    /** Whether dropdown is disabled */
    disabled?: boolean;
    /** Optional variant for styling */
    variant?: DropdownVariant;
    /** Optional size variant */
    size?: DropdownSize;
    /** Optional className for styling flexibility */
    className?: string;
    /** Callback when dropdown open state changes */
    onOpenChange?: (isOpen: boolean) => void;
}

// Utility functions with memoization support
const getVariantClasses = (variant: DropdownVariant, isItem = false) => {
    return VARIANTS[variant][isItem ? 'item' : 'trigger'];
};

const getSizeClasses = (size: DropdownSize, isItem = false) => {
    return SIZES[size][isItem ? 'item' : 'trigger'];
};

/**
 * A base dropdown component providing common functionality
 *
 * @param {ReactNode} children - The content to be rendered inside the dropdown.
 * @param {string} [className=''] - Optional additional classes for styling the dropdown.
 * @param {boolean} [disabled=false] - If true, the dropdown is disabled and cannot be interacted with.
 * @param {(isOpen: boolean) => void} [onOpenChange] - Callback function invoked when the dropdown open state changes.
 *
 * @returns {JSX.Element} The rendered dropdown component.
 */
const BaseDropdown = ({
    children,
    className = '',
    disabled = false,
    onOpenChange
}: BaseDropdownProps & { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggles the dropdown open state
    const handleToggle = useCallback(() => {
        if (!disabled) {
            const newState = !isOpen;
            setIsOpen(newState);
            onOpenChange?.(newState);
        }
    }, [disabled, isOpen, onOpenChange]);

    return (
        <div className={cn(
            'relative inline-block',
            disabled && 'opacity-50 cursor-not-allowed',
            className
        )}>
            {children}
        </div>
    );
};

// Button variant props
interface DropdownButtonProps extends BaseDropdownProps {
    /** Text label for the button */
    label: string;
}

/**
 * Button-style dropdown component
 * The component accepts a label and an array of options.
 * The component is disabled if the disabled prop is true.
 * The component emits a boolean value indicating whether the dropdown is open or not
 * when the onOpenChange prop is provided.
 * The component also emits the value of the selected option when the onClick prop
 * is provided.
 * @param {string} label The label of the button.
 * @param {DropdownOption[]} options The options of the dropdown menu.
 * @param {'default' | 'outline' | 'ghost'} [variant='default'] The style variant of the button.
 * @param {'sm' | 'md' | 'lg'} [size='md'] The size of the button.
 * @param {string} [className=''] The class name of the button.
 * @param {boolean} [disabled=false] Whether the button is disabled.
 * @param {(isOpen: boolean) => void} [onOpenChange] The callback function invoked when the open state changes.
 * @returns {JSX.Element} The rendered dropdown component.
 */
export const DropdownButton = ({
    label,
    options,
    variant = 'default',
    size = 'md',
    className = '',
    disabled = false,
    onOpenChange
}: DropdownButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggles the dropdown open state, repeated from BaseDropdown
    const handleToggle = useCallback(() => {
        if (!disabled) {
            const newState = !isOpen;
            setIsOpen(newState);
            onOpenChange?.(newState);
        }
    }, [disabled, isOpen, onOpenChange]);

    return (
        <BaseDropdown
            options={options}
            className={className}
            disabled={disabled}
            onOpenChange={onOpenChange}

        >
            <button onClick={handleToggle}
                disabled={disabled}
                className={cn(
                    'inline-flex items-center gap-1 rounded-md',
                    getVariantClasses(variant),
                    getSizeClasses(size),
                    disabled && 'cursor-not-allowed',
                    className
                )}
            >
                <span>{label}</span>
                <CaretDownIcon
                    className={cn(
                        'transition-transform duration-200 p-1',
                        isOpen && 'rotate-180'
                    )}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 min-w-[200px] py-1 bg-bg-dark border rounded-md shadow-lg">
                    {options.map((option, index) => (
                        <button
                            key={option.value || index}
                            onClick={() => {
                                option.onClick?.();
                                setIsOpen(false);
                                onOpenChange?.(false);
                            }}
                            disabled={option.disabled}
                            className={cn(
                                'w-full text-left flex items-center gap-2',
                                getVariantClasses(variant, true),
                                getSizeClasses(size, true),
                                option.disabled && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {option.icon && (
                                <span className="flex-shrink-0">{option.icon}</span>
                            )}
                            <span className="flex-grow">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </BaseDropdown>
    );
};

// Select variant props
interface DropdownSelectProps extends BaseDropdownProps {
    /** Currently selected value */
    value: string;
    /** Callback when selection changes */
    onChange: (value: string) => void;
    /** Optional placeholder text */
    placeholder?: string;
}

/**
 * Select-style dropdown component
 * The component accepts a value and an array of options.
 * The component emits the value of the selected option when the onChange prop
 * is provided.
 * The component also emits a boolean value indicating whether the dropdown is open or not
 * when the onOpenChange prop is provided.
 * @param {string} value The value of the currently selected option.
 * @param {DropdownOption[]} options The options of the dropdown menu.
 * @param {(value: string) => void} onChange The callback function invoked when the selection changes.
 * @param {string} [placeholder='Select an option'] The placeholder text when no option is selected.
 * @param {string} [className=''] The class name of the button.
 * @param {boolean} [disabled=false] Whether the button is disabled.
 * @param {(isOpen: boolean) => void} [onOpenChange] The callback function invoked when the open state changes.
 * @returns {JSX.Element} The rendered dropdown component.
 */
export const DropdownSelect = ({
    value,
    options,
    onChange,
    placeholder = 'Select an option',
    variant = 'default',
    size = 'md',
    className = '',
    disabled = false,
    onOpenChange
}: DropdownSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    // Toggles the dropdown open state, repeated from BaseDropdown
    const handleToggle = useCallback(() => {
        if (!disabled) {
            const newState = !isOpen;
            setIsOpen(newState);
            onOpenChange?.(newState);
        }
    }, [disabled, isOpen, onOpenChange]);

    return (
        <BaseDropdown
            options={options}
            className={className}
            disabled={disabled}
            onOpenChange={onOpenChange}
        >
            <button onClick={handleToggle}
                disabled={disabled}
                className={cn(
                    'w-full text-left bg-white rounded-md',
                    'flex items-center justify-between',
                    getVariantClasses(variant),
                    getSizeClasses(size),
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                <span className={cn(!selectedOption && 'text-gray-400')}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <CaretDownIcon
                    className={cn(
                        'transition-transform duration-200',
                        isOpen && 'rotate-180'
                    )}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 py-1 bg-white border rounded-md shadow-lg">
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
                                'w-full text-left flex items-center gap-2',
                                getVariantClasses(variant, true),
                                getSizeClasses(size, true),
                                option.value === value && 'bg-gray-100',
                                option.disabled && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            {option.icon && (
                                <span className="flex-shrink-0">{option.icon}</span>
                            )}
                            <span className="flex-grow">{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </BaseDropdown>
    );
};

export default {
    Button: DropdownButton,
    Select: DropdownSelect,
    Base: BaseDropdown
};