import type { Meta, StoryObj } from "@storybook/react";
import { PushButton } from "./PushButton";
import {
    EditIcon,
    GearIcon,
    CheckIcon,
    PlayIcon,
    PauseIcon,
} from "@/components/ui/icons";
import { fn } from "@storybook/test";
import { ThemeAwareSectionLabel } from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";

/**
 * `PushButton` is a button component with text and optional icons.
 * It supports various styles, states, and can display loading indicators.
 */
const meta: Meta<typeof PushButton> = {
    title: "Atoms/Buttons/PushButton",
    component: PushButton,
    tags: ["autodocs"],
    argTypes: {
        children: {
            control: "text",
            description: "Button text content",
        },
        startIcon: {
            description: "Icon to display before the text",
        },
        endIcon: {
            description: "Icon to display after the text",
        },
        iconSize: {
            control: "select",
            options: ["xs", "sm", "md", "lg", "xl"],
            description: "Size of the icon",
        },
        variant: {
            control: "select",
            options: ["default", "ghost", "bright", "outline"],
            description: "Visual style variant of the button",
        },
        type: {
            control: "select",
            options: ["button", "submit", "reset"],
            description: "HTML button type attribute",
        },
        disabled: {
            control: "boolean",
            description: "Whether the button is disabled",
        },
        loading: {
            control: "boolean",
            description: "Whether to show a loading indicator",
        },
        currentState: {
            description: "Current state for stateful buttons (controlled)",
        },
        states: {
            description: "Configuration for stateful buttons",
        },
        onStateChange: {
            description: "Callback when button state changes",
        },
    },
    args: {
        children: "Button",
        variant: "default",
        type: "button",
        disabled: false,
        loading: false,
    },
    decorators: [withThemeProvider],
} satisfies Meta<typeof PushButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default button with text only.
 */
export const Default: Story = {
    args: {
        children: "Click Me",
    },
};

/**
 * Button with start icon.
 */
export const WithStartIcon: Story = {
    args: {
        children: "Edit",
        startIcon: EditIcon,
    },
};

/**
 * Button with end icon.
 */
export const WithEndIcon: Story = {
    args: {
        children: "Settings",
        endIcon: GearIcon,
    },
};

/**
 * Button with both start and end icons.
 */
export const WithBothIcons: Story = {
    args: {
        children: "Confirm",
        startIcon: CheckIcon,
        endIcon: <span>→</span>,
    },
};

/**
 * Different style variants of the button.
 */
export const Variants: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <ThemeAwareSectionLabel uppercase>Default</ThemeAwareSectionLabel>
            <PushButton variant="default">Default Button</PushButton>

            <ThemeAwareSectionLabel uppercase>Ghost</ThemeAwareSectionLabel>
            <PushButton variant="ghost">Ghost Button</PushButton>

            <ThemeAwareSectionLabel uppercase>Bright</ThemeAwareSectionLabel>
            <PushButton variant="bright">Bright Button</PushButton>

            <ThemeAwareSectionLabel uppercase>Outline</ThemeAwareSectionLabel>
            <PushButton variant="outline">Outline Button</PushButton>
        </div>
    ),
};

/**
 * Different icon sizes for the button.
 */
export const IconSizes: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <ThemeAwareSectionLabel uppercase>
                Extra Small (xs)
            </ThemeAwareSectionLabel>
            <PushButton startIcon={EditIcon} iconSize="xs">
                XS Icon
            </PushButton>

            <ThemeAwareSectionLabel uppercase>
                Small (sm)
            </ThemeAwareSectionLabel>
            <PushButton startIcon={EditIcon} iconSize="sm">
                SM Icon
            </PushButton>

            <ThemeAwareSectionLabel uppercase>
                Medium (md)
            </ThemeAwareSectionLabel>
            <PushButton startIcon={EditIcon} iconSize="md">
                MD Icon
            </PushButton>

            <ThemeAwareSectionLabel uppercase>
                Large (lg)
            </ThemeAwareSectionLabel>
            <PushButton startIcon={EditIcon} iconSize="lg">
                LG Icon
            </PushButton>

            <ThemeAwareSectionLabel uppercase>
                Extra Large (xl)
            </ThemeAwareSectionLabel>
            <PushButton startIcon={EditIcon} iconSize="xl">
                XL Icon
            </PushButton>
        </div>
    ),
};

/**
 * Button in different states.
 */
export const States: Story = {
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <ThemeAwareSectionLabel uppercase>Normal</ThemeAwareSectionLabel>
            <PushButton>Normal Button</PushButton>

            <ThemeAwareSectionLabel uppercase>Disabled</ThemeAwareSectionLabel>
            <PushButton disabled>Disabled Button</PushButton>

            <ThemeAwareSectionLabel uppercase>Loading</ThemeAwareSectionLabel>
            <PushButton loading>Loading Button</PushButton>
        </div>
    ),
};

/**
 * Stateful button that cycles through states when clicked.
 */
export const WithStates: Story = {
    args: {
        children: "Play",
        states: {
            count: 2,
            labels: ["Play", "Pause"],
            startIcons: [PlayIcon, PauseIcon],
            variants: ["default", "bright"],
        },
        onStateChange: fn((state) => console.log(`State changed to: ${state}`)),
    },
};

/**
 * Button with three states that cycle on click.
 */
export const ThreeStateButton: Story = {
    args: {
        children: "Start",
        states: {
            count: 3,
            labels: ["Start", "Processing", "Complete"],
            startIcons: [PlayIcon, null, CheckIcon],
            variants: ["default", "ghost", "bright"],
        },
        onStateChange: fn((state) => console.log(`State changed to: ${state}`)),
    },
};

/**
 * Form submit button example.
 */
export const SubmitButton: Story = {
    args: {
        children: "Submit Form",
        type: "submit",
        variant: "bright",
        startIcon: CheckIcon,
    },
};

/**
 * Button with custom styling.
 */
export const CustomStyled: Story = {
    args: {
        children: "Custom Style",
        className:
            "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow-md",
    },
};
