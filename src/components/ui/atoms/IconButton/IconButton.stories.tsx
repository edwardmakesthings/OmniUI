import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./IconButton";
import {
    PlayIcon,
    PauseIcon,
    CheckIcon,
    XIcon,
    EditIcon,
    GearIcon,
} from "@/components/ui/icons"; // Adjust import path based on your project
import { fn } from "@storybook/test";
import { ThemeAwareSectionLabel } from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";

/**
 * `IconButton` is a button component that displays an icon. It supports various sizes,
 * variants, and state management.
 */
const meta: Meta<typeof IconButton> = {
    title: "Atoms/Buttons/IconButton",
    component: IconButton,
    tags: ["autodocs"],
    argTypes: {
        icon: {
            control: "select",
            options: [
                "PlayIcon",
                "PauseIcon",
                "CheckIcon",
                "XIcon",
                "EditIcon",
                "GearIcon",
            ],
            mapping: {
                PlayIcon: PlayIcon,
                PauseIcon: PauseIcon,
                CheckIcon: CheckIcon,
                XIcon: XIcon,
                EditIcon: EditIcon,
                GearIcon: GearIcon,
            },
        },
        size: {
            control: "select",
            options: ["xs", "sm", "md", "lg", "xl"],
        },
        iconSize: {
            control: "select",
            options: ["xs", "sm", "md", "lg", "xl"],
        },
        containerSize: {
            control: "select",
            options: ["xs", "sm", "md", "lg", "xl"],
        },
        variant: {
            control: "select",
            options: ["default", "ghost", "bright", "outline"],
        },
        disabled: { control: "boolean" },
        tooltip: { control: "text" },
        onClick: { action: "clicked" },
        onStateChange: { action: "state changed" },
    },
    parameters: {
        layout: "centered",
    },
    // Add explicit actions using Storybook's fn function
    args: {
        onClick: fn(), // This creates a spy function that Storybook will track
        onStateChange: fn(), // Another spy function for state changes
    },
    decorators: [withThemeProvider],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default icon button using the default settings.
 */
export const Default: Story = {
    args: {
        icon: PlayIcon,
        "aria-label": "Play button",
    },
};

/**
 * Different size variations of the IconButton.
 */
export const Sizes: Story = {
    render: () => (
        <div className="w-full space-y-1">
            <ThemeAwareSectionLabel uppercase>Size</ThemeAwareSectionLabel>

            <div className="flex items-center gap-4">
                <IconButton
                    icon={PlayIcon}
                    size="xs"
                    aria-label="Extra Small"
                />
                <IconButton icon={PlayIcon} size="sm" aria-label="Small" />
                <IconButton icon={PlayIcon} size="md" aria-label="Medium" />
                <IconButton icon={PlayIcon} size="lg" aria-label="Large" />
                <IconButton
                    icon={PlayIcon}
                    size="xl"
                    aria-label="Extra Large"
                />
            </div>

            <ThemeAwareSectionLabel uppercase>Icon Size</ThemeAwareSectionLabel>

            <div className="flex items-center gap-4">
                <IconButton
                    icon={PlayIcon}
                    iconSize="xs"
                    aria-label="Extra Small"
                />
                <IconButton icon={PlayIcon} iconSize="sm" aria-label="Small" />
                <IconButton icon={PlayIcon} iconSize="md" aria-label="Medium" />
                <IconButton icon={PlayIcon} iconSize="lg" aria-label="Large" />
                <IconButton
                    icon={PlayIcon}
                    iconSize="xl"
                    aria-label="Extra Large"
                />
            </div>

            <ThemeAwareSectionLabel uppercase>
                Icon Size + Container Size
            </ThemeAwareSectionLabel>

            <div className="flex items-center gap-4">
                <IconButton
                    icon={PlayIcon}
                    iconSize="xs"
                    containerSize="xs"
                    aria-label="Extra Small"
                />
                <IconButton
                    icon={PlayIcon}
                    iconSize="sm"
                    containerSize="sm"
                    aria-label="Small"
                />
                <IconButton
                    icon={PlayIcon}
                    iconSize="md"
                    containerSize="md"
                    aria-label="Medium"
                />
                <IconButton
                    icon={PlayIcon}
                    iconSize="lg"
                    containerSize="lg"
                    aria-label="Large"
                />
                <IconButton
                    icon={PlayIcon}
                    iconSize="xl"
                    containerSize="xl"
                    aria-label="Extra Large"
                />
            </div>
        </div>
    ),
};

/**
 * Different style variants of the IconButton.
 */
export const Variants: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <IconButton
                icon={PlayIcon}
                variant="default"
                aria-label="Default"
            />
            <IconButton icon={PlayIcon} variant="ghost" aria-label="Ghost" />
            <IconButton icon={PlayIcon} variant="bright" aria-label="Bright" />
            <IconButton
                icon={PlayIcon}
                variant="outline"
                aria-label="Outline"
            />
        </div>
    ),
};

/**
 * Disabled state of the IconButton.
 */
export const Disabled: Story = {
    args: {
        icon: PlayIcon,
        disabled: true,
        "aria-label": "Disabled button",
    },
};

/**
 * IconButton with tooltip.
 */
export const WithTooltip: Story = {
    args: {
        icon: PlayIcon,
        tooltip: "Play item",
        "aria-label": "Play item",
    },
};

/**
 * IconButton with state management (toggleable).
 */
export const WithState: Story = {
    args: {
        icon: PlayIcon,
        states: {
            count: 2,
            icons: [PlayIcon, PauseIcon],
            tooltips: ["Play item", "Pause item"],
            variants: ["default", "bright"],
        },
        "aria-label": "Toggle action",
    },
};

/**
 * Interactive example showing action tracking
 */
export const WithInteraction: Story = {
    args: {
        icon: PlayIcon,
        "aria-label": "Interactive Button",
        onClick: fn((_e) => console.log("Button clicked!")), // Using fn with a callback
    },
    // play: async ({ canvasElement, args }) => {
    // This function will automatically run when the story renders
    // You can use it to simulate interactions
    // },
};

/**
 * Multiple IconButtons showcasing different icons.
 */
export const IconVariations: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <IconButton icon={PlayIcon} variant="default" aria-label="Play" />
            <IconButton icon={PauseIcon} variant="bright" aria-label="Pause" />
            <IconButton
                icon={CheckIcon}
                variant="outline"
                aria-label="Confirm"
            />
            <IconButton icon={XIcon} variant="outline" aria-label="Cancel" />
            <IconButton icon={EditIcon} variant="bright" aria-label="Edit" />
            <IconButton
                icon={GearIcon}
                variant="default"
                aria-label="Settings"
            />
        </div>
    ),
};

/**
 * IconButton with custom styling.
 */
export const CustomStyling: Story = {
    args: {
        icon: CheckIcon,
        className:
            "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded shadow-md",
        "aria-label": "Custom styled button",
    },
};
