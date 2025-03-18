import type { Meta, StoryObj } from "@storybook/react";
import {
    EditIcon,
    Panel,
    PushButton,
    ScrollBox,
    SearchIcon,
    Tabs,
} from "@/components/ui";
import {
    ThemeAwareHeading,
    ThemeAwareBody,
} from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";

/**
 * `Tabs` provides a way to organize content into multiple sections.
 * Each tab panel can contain any content, and only one panel is shown at a time.
 */
const meta = {
    title: "Atoms/Navigation/Tabs",
    component: Tabs,
    tags: ["autodocs"],
    decorators: [withThemeProvider],
    argTypes: {
        tabs: {
            description: "Array of tab objects with id, label, and content",
        },
        variant: {
            control: "select",
            options: ["default", "inset"],
            description: "Visual style variant of the tabs",
        },
        defaultTab: {
            control: "text",
            description: "ID of the initially selected tab (uncontrolled mode)",
        },
        selectedTab: {
            control: "text",
            description: "ID of the selected tab (controlled mode)",
        },
        disabled: {
            control: "boolean",
            description: "Whether the entire tabs component is disabled",
        },
        onTabChange: {
            description: "Called when the selected tab changes",
        },
    },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTabs: Story = {
    args: {
        variant: "default",
        tabs: [
            {
                id: "tab1",
                label: "First Tab",
                content: <div className="p-4">Content for the first tab</div>,
            },
            {
                id: "tab2",
                label: "Second Tab",
                content: <div className="p-4">Content for the second tab</div>,
            },
            {
                id: "tab3",
                label: "Third Tab",
                content: <div className="p-4">Content for the third tab</div>,
            },
        ],
    },
};

export const InsetTabs: Story = {
    args: {
        variant: "inset",
        tabs: [
            {
                id: "tab1",
                label: "First Tab",
                content: <div className="p-4">Content for the first tab</div>,
            },
            {
                id: "tab2",
                label: "Second Tab",
                content: <div className="p-4">Content for the second tab</div>,
            },
            {
                id: "tab3",
                label: "Third Tab",
                content: <div className="p-4">Content for the third tab</div>,
            },
        ],
    },
};

export const TabsWithButtons: Story = {
    render: () => {
        return (
            <div className="space-y-6">
                <ThemeAwareHeading>Tabs with Button Content</ThemeAwareHeading>
                <ThemeAwareBody>
                    Tabs can contain various types of content, including buttons
                    and other interactive elements.
                </ThemeAwareBody>

                <Tabs
                    variant="default"
                    tabs={[
                        {
                            id: "tab1",
                            label: "First Tab",
                            content: (
                                <div className="space-y-4 p-4">
                                    <PushButton
                                        endIcon={EditIcon}
                                        variant="ghost"
                                    >
                                        Continue
                                    </PushButton>
                                    <PushButton disabled>
                                        Unavailable
                                    </PushButton>
                                </div>
                            ),
                        },
                        {
                            id: "tab2",
                            label: "Second Tab",
                            content: (
                                <div className="space-y-4 p-4">
                                    <PushButton>Click Me</PushButton>
                                    <PushButton
                                        startIcon={SearchIcon}
                                        variant="bright"
                                    >
                                        Search
                                    </PushButton>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        );
    },
    args: {
        // Minimum required props
        tabs: [],
    },
};

export const NestedTabs: Story = {
    render: () => {
        return (
            <div className="space-y-6">
                <ThemeAwareHeading>Nested Tabs</ThemeAwareHeading>
                <ThemeAwareBody>
                    Tabs can be nested within other tabs to create hierarchical
                    navigation.
                </ThemeAwareBody>

                <Tabs
                    variant="default"
                    tabs={[
                        {
                            id: "settings",
                            label: "Settings",
                            content: (
                                <Tabs
                                    variant="inset"
                                    tabs={[
                                        {
                                            id: "general",
                                            label: "General",
                                            content: (
                                                <Panel
                                                    variant="elevated"
                                                    header="General Settings"
                                                >
                                                    <div className="space-y-4 p-4">
                                                        <p className="text-font-dark-muted">
                                                            Configure basic
                                                            application settings
                                                            here.
                                                        </p>
                                                        <div className="space-x-2">
                                                            <PushButton variant="ghost">
                                                                Reset
                                                            </PushButton>
                                                            <PushButton variant="bright">
                                                                Save
                                                            </PushButton>
                                                        </div>
                                                    </div>
                                                </Panel>
                                            ),
                                        },
                                        {
                                            id: "appearance",
                                            label: "Appearance",
                                            content: (
                                                <Panel
                                                    variant="elevated"
                                                    className="mt-4"
                                                >
                                                    <div className="space-y-4 p-4">
                                                        <h3 className="text-lg font-semibold">
                                                            Appearance Settings
                                                        </h3>
                                                        <p className="text-font-dark-muted">
                                                            Customize the look
                                                            and feel of the
                                                            application.
                                                        </p>
                                                        <div className="space-x-2">
                                                            <PushButton variant="ghost">
                                                                Reset Theme
                                                            </PushButton>
                                                            <PushButton variant="bright">
                                                                Apply
                                                            </PushButton>
                                                        </div>
                                                    </div>
                                                </Panel>
                                            ),
                                        },
                                    ]}
                                />
                            ),
                        },
                        {
                            id: "content",
                            label: "Content",
                            content: (
                                <ScrollBox
                                    maxHeight={400}
                                    variant="inset"
                                    className="mt-4"
                                >
                                    <div className="space-y-4 p-4">
                                        <h3 className="text-lg font-semibold">
                                            Content Management
                                        </h3>
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <div
                                                key={i}
                                                className="p-4 bg-bg-dark border border-accent-dark-neutral rounded"
                                            >
                                                <h4 className="font-medium">
                                                    Content Item {i + 1}
                                                </h4>
                                                <p className="text-font-dark-muted mt-2">
                                                    This is a content item that
                                                    demonstrates scrolling
                                                    behavior in the tab panel
                                                    area.
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollBox>
                            ),
                        },
                    ]}
                />
            </div>
        );
    },
    args: {
        // Minimum required props
        tabs: [],
    },
};
