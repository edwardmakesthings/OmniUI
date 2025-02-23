import { AriaAttributes, forwardRef, ReactNode } from "react";
import { AbstractInteractiveBase } from "@/components/base/interactive/AbstractInteractiveBase";
import {
    ButtonProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import inputPreset, {
    InputVariant,
} from "@/components/base/style/presets/input";

export interface InputAddon {
    content: ReactNode;
    action?: () => void;
    tooltip?: string;
    isInteractive?: boolean;
}

export interface InputProps
    extends Omit<
        ButtonProps<
            "input" | "prefix" | "suffix" | "prefixGroup" | "suffixGroup"
        >,
        | "as"
        | "children"
        | "content"
        | "type"
        | "prefix"
        | "suffix"
        | "onChange"
    > {
    // Value handling
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;

    // Input configuration
    type?: "text" | "password" | "email" | "number" | "search";
    placeholder?: string;
    pattern?: string;
    required?: boolean;
    readOnly?: boolean;

    // Addons
    prefix?: InputAddon | InputAddon[];
    suffix?: InputAddon | InputAddon[];

    // Style configuration
    variant?: InputVariant;
    className?: string;

    // State
    disabled?: boolean;
    error?: boolean;
    focused?: boolean;

    // Accessibility
    ariaLabel?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            // Value props
            value,
            defaultValue,
            onChange,

            // Input props
            type = "text",
            placeholder,
            pattern,
            required,
            readOnly,

            // Addon props
            prefix,
            suffix,

            // Style props
            variant = "default",
            className,
            styleProps,

            // State props
            disabled = false,
            error = false,
            focused = false,

            // Accessibility
            ariaLabel,

            ...props
        },
        ref
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.value);
        };

        const renderInput = ({
            elementProps,
            state,
            computedStyle,
        }: RenderElementProps) => {
            // Convert single addon to array for consistent processing
            const prefixAddons = Array.isArray(prefix)
                ? prefix
                : prefix
                ? [prefix]
                : [];
            const suffixAddons = Array.isArray(suffix)
                ? suffix
                : suffix
                ? [suffix]
                : [];

            // Component and ARIA identifiers
            const componentId =
                (elementProps as any)?.["data-component-id"] || "root";
            const inputId = `input-${componentId}`;

            // ARIA attributes
            const ariaAttrs: AriaAttributes & { "aria-label"?: string } = {
                "aria-label": ariaLabel,
                "aria-invalid": error,
                "aria-required": required,
                "aria-disabled": state.isDisabled,
                "aria-readonly": readOnly,
            };

            return (
                <div {...elementProps} className={computedStyle.root}>
                    {prefixAddons.length > 0 && (
                        <div className={computedStyle.prefixGroup}>
                            {prefixAddons.map((addon, index) => (
                                <span
                                    key={index}
                                    className={computedStyle.prefix}
                                    onClick={addon.action}
                                    title={addon.tooltip}
                                    {...(addon.action
                                        ? {
                                              role: "button",
                                              tabIndex: 0,
                                          }
                                        : {})}
                                >
                                    {addon.content}
                                </span>
                            ))}
                        </div>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        type={type}
                        value={value}
                        defaultValue={defaultValue}
                        onChange={handleChange}
                        placeholder={placeholder}
                        pattern={pattern}
                        required={required}
                        readOnly={readOnly}
                        disabled={state.isDisabled}
                        className={computedStyle.input}
                        size={3}
                        {...ariaAttrs}
                    />

                    {suffixAddons.length > 0 && (
                        <div className={computedStyle.suffixGroup}>
                            {suffixAddons.map((addon, index) => (
                                <span
                                    key={index}
                                    className={computedStyle.suffix}
                                    onClick={addon.action}
                                    title={addon.tooltip}
                                    {...(addon.action
                                        ? {
                                              role: "button",
                                              tabIndex: 0,
                                          }
                                        : {})}
                                >
                                    {addon.content}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            );
        };

        return (
            <AbstractInteractiveBase
                as="div"
                stylePreset={inputPreset}
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
                }}
                renderElement={renderInput}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export default Input;
