import type { Meta, StoryObj } from "@storybook/react";
import { DropdownButton } from "./Dropdown";
import { EditIcon, GearIcon, CheckIcon, XIcon } from "@/components/ui/icons";
import { ThemeAwareSectionLabel } from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";

/**
 * `DropdownButton` is a button that displays a dropdown menu when clicked.
 * It supports various options, icons, and customizations.
 */
const meta: Meta<typeof DropdownButton> = {
    title: "Atoms/Controls/DropdownButton",
    component: DropdownButton,
    tags: ["autodocs"],
    argTypes: {
        label: {
            control: "text",
            description: "The text or node displayed on the button",
        },
        options: {
            description: "Array of options to display in the dropdown",
        },
        variant: {
            control: "select",
            options: ["default", "ghost", "bright", "outline"],
            description: "Visual style variant of the dropdown",
        },
        disabled: {
            control: "boolean",
            description: "Whether the dropdown is disabled",
        },
        showCaret: {
            control: "boolean",
            description: "Whether to show the dropdown caret icon",
        },
        closeOnBlur: {
            control: "boolean",
            description: "Whether to close the dropdown when clicking outside",
        },
        closeOnMouseLeave: {
            control: "boolean",
            description: "Whether to close the dropdown when the mouse leaves",
        },
        closeDelay: {
            control: "number",
            description: "Delay in ms before closing (for mouseLeave)",
        },
        onOpenChange: {
            description: "Callback when dropdown opens or closes",
        },
    },
    args: {
        label: "Dropdown",
        options: [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" },
        ],
        variant: "default",
        showCaret: true,
        closeOnBlur: true,
        closeOnMouseLeave: false,
        closeDelay: 150,
    },
    decorators: [withThemeProvider],
} satisfies Meta<typeof DropdownButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default dropdown button with basic options.
 */
export const Default: Story = {
    args: {
        label: "Dropdown",
        options: [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" },
        ],
    },
};

/**
 * Dropdown with icons in the options.
 */
export const WithIcons: Story = {
    args: {
        label: "Actions",
        options: [
            { label: "Edit", value: "edit", icon: <EditIcon size={16} /> },
            {
                label: "Settings",
                value: "settings",
                icon: <GearIcon size={16} />,
            },
            {
                label: "Approve",
                value: "approve",
                icon: <CheckIcon size={16} />,
            },
            { label: "Reject", value: "reject", icon: <XIcon size={16} /> },
        ],
    },
};

/**
 * Different style variants of the dropdown.
 */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <ThemeAwareSectionLabel uppercase>Default</ThemeAwareSectionLabel>
            <DropdownButton
                label="Default"
                variant="default"
                options={[
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                ]}
            />

            <ThemeAwareSectionLabel uppercase>Ghost</ThemeAwareSectionLabel>
            <DropdownButton
                label="Ghost"
                variant="ghost"
                options={[
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                ]}
            />

            <ThemeAwareSectionLabel uppercase>Bright</ThemeAwareSectionLabel>
            <DropdownButton
                label="Bright"
                variant="bright"
                options={[
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                ]}
            />

            <ThemeAwareSectionLabel uppercase>Outline</ThemeAwareSectionLabel>
            <DropdownButton
                label="Outline"
                variant="outline"
                options={[
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                ]}
            />
        </div>
    ),
};

/**
 * Dropdown in disabled state.
 */
export const Disabled: Story = {
    args: {
        label: "Disabled Dropdown",
        disabled: true,
        options: [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
        ],
    },
};

/**
 * Dropdown with disabled options.
 */
export const DisabledOptions: Story = {
    args: {
        label: "Dropdown with Disabled Options",
        options: [
            { label: "Available Option", value: "1" },
            { label: "Disabled Option", value: "2", disabled: true },
            { label: "Another Available Option", value: "3" },
        ],
    },
};

/**
 * Dropdown that closes when mouse leaves.
 */
export const CloseOnMouseLeave: Story = {
    args: {
        label: "Hover Out to Close",
        closeOnMouseLeave: true,
        closeDelay: 300,
        options: [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" },
        ],
    },
};

/**
 * Dropdown with custom click handlers for options.
 */
export const WithClickHandlers: Story = {
    args: {
        label: "Interactive Options",
        options: [
            {
                label: "Click me",
                value: "click",
                onClick: () => alert("Option 1 clicked!"),
            },
            {
                label: "Click me too",
                value: "click2",
                onClick: () => alert("Option 2 clicked!"),
            },
        ],
    },
};
