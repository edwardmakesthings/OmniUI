import React from "react";
import { useTheme, Theme } from "./ThemeContext";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class name merging

interface TextProps {
    children: React.ReactNode;
    variant?: "heading1" | "heading2" | "label" | "body" | "caption";
    className?: string;
    theme?: Theme; // Optional override using our Theme type
    underlined?: boolean; // Add underline styling
    uppercase?: boolean; // Add uppercase styling
    as?: keyof JSX.IntrinsicElements; // Allow changing the HTML element
}

/**
 * A text component that adapts to light/dark theme with additional styling options
 */
export const ThemeAwareText: React.FC<TextProps> = ({
    children,
    variant = "body",
    className = "",
    theme: themeProp, // Optional override
    underlined = false,
    uppercase = false,
    as: Component = "div",
}) => {
    // Use context theme, but allow prop override
    const contextTheme = useTheme();
    const theme = themeProp || contextTheme;

    const isDarkMode = theme === "dark";

    // Base classes for the text
    let textClasses = "";

    // Apply variant-specific styling
    switch (variant) {
        case "heading1":
            textClasses = `text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
            }`;
            break;
        case "heading2":
            textClasses = `text-xl font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
            }`;
            break;
        case "label":
            textClasses = `${
                isDarkMode ? "text-gray-300" : "text-gray-700"
            } tracking-[3px] text-sm font-bold pb-0.25`;
            break;
        case "body":
            textClasses = `${isDarkMode ? "text-gray-300" : "text-gray-700"}`;
            break;
        case "caption":
            textClasses = `text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
            }`;
            break;
    }

    // Add underline styling if requested
    const underlineClasses = underlined
        ? "w-full relative inline-block after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:border-b after:border-font-dark-muted mb-0.5"
        : "";

    // Add uppercase styling if requested
    const uppercaseClasses = uppercase ? "uppercase" : "";

    return (
        <Component
            className={cn(
                textClasses,
                underlineClasses,
                uppercaseClasses,
                className
            )}
        >
            {children}
        </Component>
    );
};

export const ThemeAwareHeading = (props: Omit<TextProps, "variant">) => (
    <ThemeAwareText variant="heading1" {...props} />
);

export const ThemeAwareSubheading = (props: Omit<TextProps, "variant">) => (
    <ThemeAwareText variant="heading2" {...props} />
);

export const ThemeAwareBody = (props: Omit<TextProps, "variant">) => (
    <ThemeAwareText variant="body" {...props} />
);

export const ThemeAwareCaption = (props: Omit<TextProps, "variant">) => (
    <ThemeAwareText variant="caption" {...props} />
);

/**
 * Specialized component for section labels that are underlined
 */
export const ThemeAwareSectionLabel = (
    props: Omit<TextProps, "variant" | "underlined">
) => <ThemeAwareText variant="label" underlined={true} as="h3" {...props} />;
