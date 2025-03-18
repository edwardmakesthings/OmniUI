import type { Meta, StoryObj } from "@storybook/react";
import { EditIcon, IconButton, Panel } from "@/components/ui";
import {
    ThemeAwareHeading,
    ThemeAwareBody,
} from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";

/**
 * `Panel` is a container component that groups related content.
 * It supports an optional header and different visual styles.
 */
const meta = {
    title: "Atoms/Containers/Panel",
    component: Panel,
    tags: ["autodocs"],
    decorators: [withThemeProvider],
    argTypes: {
        header: {
            description: "Content for the panel header",
        },
        variant: {
            control: "select",
            options: ["default", "elevated", "inset", "ghost"],
            description: "Visual style variant of the panel",
        },
        showHeader: {
            control: "boolean",
            description: "Whether to show the header area (even if empty)",
        },
        className: {
            control: "text",
            description: "Additional CSS class for the panel",
        },
        headerClassName: {
            control: "text",
            description: "Additional CSS class for the header",
        },
        contentClassName: {
            control: "text",
            description: "Additional CSS class for the content",
        },
    },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        header: "Basic Panel",
        children: (
            <p>This is a basic panel with a simple header and content.</p>
        ),
    },
};

export const Elevated: Story = {
    args: {
        header: "Elevated Panel",
        variant: "elevated",
        children: <p>This panel has the elevated styling variant applied.</p>,
    },
};

export const PanelVariants: Story = {
    render: () => {
        return (
            <div className="space-y-6">
                <ThemeAwareHeading>Panel Variants</ThemeAwareHeading>
                <ThemeAwareBody>
                    Panels can be styled in different ways to suit different
                    uses.
                </ThemeAwareBody>

                <div className="space-y-6">
                    {/* Basic Panel */}
                    <Panel header="Unstyled header">
                        <p>Basic, unstyled panel content</p>
                    </Panel>

                    <Panel
                        header="Unstyled header (elevated)"
                        variant="elevated"
                    >
                        <p>
                            Basic, unstyled panel content with elevated styling
                        </p>
                    </Panel>

                    {/* Panel with Custom Header */}
                    <Panel
                        header={
                            <div className="flex items-center justify-between w-full">
                                <h2 className="text-lg font-medium text-font-dark">
                                    Panel Title
                                </h2>
                                <IconButton
                                    icon={EditIcon}
                                    variant="ghost"
                                    size="sm"
                                    className="text-font-dark-muted hover:text-font-dark"
                                />
                            </div>
                        }
                        className="bg-bg-dark"
                    >
                        <p className="text-font-dark m-1 mt-0">
                            Panel with custom header content
                        </p>
                    </Panel>
                </div>
            </div>
        );
    },
};

export const NestedPanels: Story = {
    render: () => {
        return (
            <div className="space-y-6">
                <ThemeAwareHeading>Nested Panels</ThemeAwareHeading>
                <ThemeAwareBody>
                    Panels can be nested inside other panels to create complex
                    layouts.
                </ThemeAwareBody>

                <Panel
                    header={
                        <div className="flex items-center justify-between w-full">
                            <h2 className="text-lg font-medium text-font-dark">
                                Parent Panel
                            </h2>
                            <IconButton
                                icon={EditIcon}
                                variant="ghost"
                                size="sm"
                                className="text-font-dark-muted hover:text-font-dark"
                            />
                        </div>
                    }
                    className="bg-bg-dark"
                >
                    <p className="text-font-dark m-1 mt-0">
                        Panel with header content
                    </p>
                    {/* Elevated Panel */}
                    <Panel
                        variant="elevated"
                        header={
                            <h2 className="text-lg font-medium text-font-dark">
                                Elevated Panel Inside Panel
                            </h2>
                        }
                        className="bg-bg-dark-darker shadow-lg"
                    >
                        <div className="p-1">
                            <p className="text-font-dark">
                                Elevated panel with custom padding
                            </p>
                            <p className="text-font-dark-muted mt-2">
                                Additional content with muted text
                            </p>
                        </div>
                    </Panel>
                </Panel>
            </div>
        );
    },
};

export const CustomStyling: Story = {
    render: () => {
        return (
            <div className="space-y-6">
                <ThemeAwareHeading>Custom Panel Styling</ThemeAwareHeading>
                <ThemeAwareBody>
                    Panels can be customized with additional CSS classes and
                    styles.
                </ThemeAwareBody>

                <Panel
                    variant="elevated"
                    header={
                        <h2 className="text-lg font-medium text-font-dark">
                            Styled Panel
                        </h2>
                    }
                    className="bg-bg-dark-darker shadow-lg rounded-lg"
                >
                    <p className="text-font-dark">
                        Elevated panel with custom padding, rounded corners, and
                        set width.
                    </p>
                    <p className="text-font-dark-muted mt-2">
                        Additional content with muted text
                    </p>
                </Panel>
            </div>
        );
    },
};
