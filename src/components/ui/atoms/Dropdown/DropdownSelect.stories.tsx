import type { Meta, StoryObj } from "@storybook/react";
import { DropdownSelect } from "./DropdownSelect";
import { EditIcon, GearIcon, CheckIcon, XIcon } from "@/components/ui/icons";
import { ThemeAwareSectionLabel } from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";
import { useState } from "react";

/**
 * `DropdownSelect` is a form control that displays a dropdown list of options.
 * It supports single and multiple selection, and can be customized with icons and placeholders.
 */
const meta: Meta<typeof DropdownSelect> = {
    title: "Atoms/Controls/DropdownSelect",
    component: DropdownSelect,
    tags: ["autodocs"],
    argTypes: {
        value: {
            description:
                "Selected value(s) - string for single select, string[] for multiple",
        },
        onChange: {
            description: "Callback when selection changes",
        },
        label: {
            description: "Label to display instead of the selected value",
        },
        placeholder: {
            control: "text",
            description: "Text to display when no option is selected",
        },
        options: {
            description: "Array of options to display in the dropdown",
        },
        multiple: {
            control: "boolean",
            description: "Whether multiple options can be selected",
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
        closeOnSelect: {
            control: "boolean",
            description: "Whether to close the dropdown after selection",
        },
    },
    args: {
        placeholder: "Select an option",
        options: [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" },
        ],
        variant: "default",
        showCaret: true,
        closeOnBlur: true,
        multiple: false,
    },
    decorators: [withThemeProvider],
} satisfies Meta<typeof DropdownSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default select dropdown with basic options.
 */
export const Default: Story = {
    args: {
        placeholder: "Select an option",
        options: [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" },
        ],
    },
};

/**
 * Select dropdown with a pre-selected value.
 */
export const WithSelectedValue: Story = {
    args: {
        value: "2",
        options: [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" },
        ],
    },
};

/**
 * Multiple selection dropdown.
 */
export const MultiSelect: Story = {
    render: () => {
        const [selected, setSelected] = useState<string[]>([]);

        return (
            <div className="space-y-4">
                <ThemeAwareSectionLabel uppercase>
                    Multi-Select Dropdown
                </ThemeAwareSectionLabel>
                <DropdownSelect
                    placeholder="Select multiple options"
                    multiple
                    value={selected}
                    onChange={(value) => setSelected(value as string[])}
                    options={[
                        { label: "Option 1", value: "1" },
                        { label: "Option 2", value: "2" },
                        { label: "Option 3", value: "3" },
                        { label: "Option 4", value: "4" },
                    ]}
                />

                <div className="mt-2">
                    Selected: {selected.length ? selected.join(", ") : "None"}
                </div>
            </div>
        );
    },
};

/**
 * Select dropdown with icons.
 */
export const WithIcons: Story = {
    args: {
        placeholder: "Select an action",
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
 * Different style variants of the select dropdown.
 */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <ThemeAwareSectionLabel uppercase>Default</ThemeAwareSectionLabel>
            <DropdownSelect
                placeholder="Default variant"
                variant="default"
                options={[
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                ]}
            />

            <ThemeAwareSectionLabel uppercase>Ghost</ThemeAwareSectionLabel>
            <DropdownSelect
                placeholder="Ghost variant"
                variant="ghost"
                options={[
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                ]}
            />

            <ThemeAwareSectionLabel uppercase>Bright</ThemeAwareSectionLabel>
            <DropdownSelect
                placeholder="Bright variant"
                variant="bright"
                options={[
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                ]}
            />

            <ThemeAwareSectionLabel uppercase>Outline</ThemeAwareSectionLabel>
            <DropdownSelect
                placeholder="Outline variant"
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
 * Disabled select dropdown.
 */
export const Disabled: Story = {
    args: {
        placeholder: "Disabled dropdown",
        disabled: true,
        options: [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
        ],
    },
};

/**
 * Select dropdown with disabled options.
 */
export const DisabledOptions: Story = {
    args: {
        placeholder: "Some options disabled",
        options: [
            { label: "Available Option", value: "1" },
            { label: "Disabled Option", value: "2", disabled: true },
            { label: "Another Available Option", value: "3" },
        ],
    },
};

/**
 * Select dropdown with a custom label.
 */
export const WithCustomLabel: Story = {
    args: {
        label: <span className="text-accent-dark-bright">Custom Label</span>,
        options: [
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" },
        ],
    },
};

/**
 * Controlled select dropdown with state management.
 */
export const Controlled: Story = {
    render: () => {
        const [value, setValue] = useState("");

        return (
            <div className="space-y-4">
                <ThemeAwareSectionLabel uppercase>
                    Controlled Dropdown
                </ThemeAwareSectionLabel>
                <DropdownSelect
                    placeholder="Select an option"
                    value={value}
                    onChange={(newValue) => setValue(newValue as string)}
                    options={[
                        { label: "Red", value: "red" },
                        { label: "Green", value: "green" },
                        { label: "Blue", value: "blue" },
                    ]}
                />

                <div className="mt-2">Selected: {value || "None"}</div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setValue("red")}
                        className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                        Set Red
                    </button>
                    <button
                        onClick={() => setValue("green")}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                        Set Green
                    </button>
                    <button
                        onClick={() => setValue("blue")}
                        className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                        Set Blue
                    </button>
                    <button
                        onClick={() => setValue("")}
                        className="px-2 py-1 bg-gray-500 text-white rounded"
                    >
                        Clear
                    </button>
                </div>
            </div>
        );
    },
};
