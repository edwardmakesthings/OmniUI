import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";
import { SearchIcon, XIcon } from "@/components/ui/icons";
import { ThemeAwareSectionLabel } from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";
import { useState } from "react";

/**
 * `Input` is a form component for text entry.
 * It supports different input types, addons, and states.
 */
const meta: Meta<typeof Input> = {
    title: "Atoms/Forms/Input",
    component: Input,
    tags: ["autodocs"],
    argTypes: {
        value: {
            control: "text",
            description: "Current value of the input (controlled)",
        },
        defaultValue: {
            control: "text",
            description: "Initial value of the input (uncontrolled)",
        },
        onChange: {
            description: "Callback when input value changes",
        },
        type: {
            control: "select",
            options: ["text", "password", "email", "number", "search"],
            description: "Type of input field",
        },
        placeholder: {
            control: "text",
            description: "Placeholder text when input is empty",
        },
        variant: {
            control: "select",
            options: ["default", "ghost", "outline"],
            description: "Visual style variant of the input",
        },
        disabled: {
            control: "boolean",
            description: "Whether the input is disabled",
        },
        error: {
            control: "boolean",
            description: "Whether the input has an error state",
        },
        readOnly: {
            control: "boolean",
            description: "Whether the input is read-only",
        },
        required: {
            control: "boolean",
            description: "Whether the input is required",
        },
        prefix: {
            description: "Content to display before the input",
        },
        suffix: {
            description: "Content to display after the input",
        },
    },
    args: {
        type: "text",
        placeholder: "Enter text...",
        variant: "default",
    },
    decorators: [withThemeProvider],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic text input with placeholder.
 */
export const Default: Story = {
    args: {
        placeholder: "Enter text...",
    },
};

/**
 * Different types of inputs.
 */
export const InputTypes: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-64">
            <ThemeAwareSectionLabel uppercase>
                Text Input
            </ThemeAwareSectionLabel>
            <Input type="text" placeholder="Text input..." />

            <ThemeAwareSectionLabel uppercase>
                Password Input
            </ThemeAwareSectionLabel>
            <Input type="password" placeholder="Password input..." />

            <ThemeAwareSectionLabel uppercase>
                Email Input
            </ThemeAwareSectionLabel>
            <Input type="email" placeholder="Email input..." />

            <ThemeAwareSectionLabel uppercase>
                Number Input
            </ThemeAwareSectionLabel>
            <Input type="number" placeholder="Number input..." />

            <ThemeAwareSectionLabel uppercase>
                Search Input
            </ThemeAwareSectionLabel>
            <Input type="search" placeholder="Search input..." />
        </div>
    ),
};

/**
 * Input with prefix and suffix addons.
 */
export const WithAddons: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-64">
            <ThemeAwareSectionLabel uppercase>
                With Prefix
            </ThemeAwareSectionLabel>
            <Input placeholder="With prefix" prefix={{ content: "$" }} />

            <ThemeAwareSectionLabel uppercase>
                With Suffix
            </ThemeAwareSectionLabel>
            <Input placeholder="With suffix" suffix={{ content: "kg" }} />

            <ThemeAwareSectionLabel uppercase>With Both</ThemeAwareSectionLabel>
            <Input
                placeholder="Amount"
                prefix={{ content: "$" }}
                suffix={{ content: ".00" }}
            />

            <ThemeAwareSectionLabel uppercase>With Icon</ThemeAwareSectionLabel>
            <Input
                placeholder="Search..."
                prefix={{ content: <SearchIcon size={16} /> }}
                suffix={{
                    content: <XIcon size={16} />,
                    action: () => alert("Clear search"),
                    tooltip: "Clear search",
                }}
            />
        </div>
    ),
};

/**
 * Different style variants.
 */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-64">
            <ThemeAwareSectionLabel uppercase>Default</ThemeAwareSectionLabel>
            <Input placeholder="Default variant" variant="default" />

            <ThemeAwareSectionLabel uppercase>Ghost</ThemeAwareSectionLabel>
            <Input placeholder="Ghost variant" variant="ghost" />

            <ThemeAwareSectionLabel uppercase>Outline</ThemeAwareSectionLabel>
            <Input placeholder="Outline variant" variant="outline" />
        </div>
    ),
};

/**
 * Input in different states.
 */
export const States: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-64">
            <ThemeAwareSectionLabel uppercase>Normal</ThemeAwareSectionLabel>
            <Input placeholder="Normal state" />

            <ThemeAwareSectionLabel uppercase>Disabled</ThemeAwareSectionLabel>
            <Input placeholder="Disabled state" disabled />

            <ThemeAwareSectionLabel uppercase>Error</ThemeAwareSectionLabel>
            <Input placeholder="Error state" error />

            <ThemeAwareSectionLabel uppercase>Read Only</ThemeAwareSectionLabel>
            <Input value="Read-only content" readOnly />
        </div>
    ),
};

/**
 * Controlled input with state.
 */
export const Controlled: Story = {
    render: () => {
        const [value, setValue] = useState("");

        return (
            <div className="space-y-4 w-64">
                <ThemeAwareSectionLabel uppercase>
                    Controlled Input
                </ThemeAwareSectionLabel>
                <Input
                    placeholder="Type something..."
                    value={value}
                    onChange={setValue}
                />

                <div className="mt-2">
                    Current value: {value ? `"${value}"` : "(empty)"}
                </div>

                <button
                    onClick={() => setValue("")}
                    className="px-2 py-1 bg-gray-500 text-white rounded"
                >
                    Clear
                </button>
            </div>
        );
    },
};

/**
 * Interactive input with addons.
 */
export const InteractiveAddons: Story = {
    render: () => {
        const [value, setValue] = useState("");

        return (
            <div className="space-y-4 w-64">
                <ThemeAwareSectionLabel uppercase>
                    Interactive Search
                </ThemeAwareSectionLabel>
                <Input
                    placeholder="Search..."
                    value={value}
                    onChange={setValue}
                    prefix={{
                        content: <SearchIcon size={16} />,
                    }}
                    suffix={{
                        content: <XIcon size={16} />,
                        action: () => setValue(""),
                        tooltip: "Clear search",
                        isInteractive: true,
                    }}
                />
            </div>
        );
    },
};

/**
 * Form validation example.
 */
export const Validation: Story = {
    render: () => {
        const [email, setEmail] = useState("");
        const [isValid, setIsValid] = useState(true);

        const handleChange = (value: string) => {
            setEmail(value);
            // Simple email validation
            setIsValid(value === "" || /\S+@\S+\.\S+/.test(value));
        };

        return (
            <div className="space-y-4 w-64">
                <ThemeAwareSectionLabel uppercase>
                    Email Validation
                </ThemeAwareSectionLabel>
                <Input
                    type="email"
                    placeholder="Enter email..."
                    value={email}
                    onChange={handleChange}
                    error={!isValid}
                    required
                />

                {!isValid && (
                    <div className="text-red-500 text-sm">
                        Please enter a valid email address
                    </div>
                )}
            </div>
        );
    },
};
