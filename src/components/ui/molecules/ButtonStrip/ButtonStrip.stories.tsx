import type { Meta, StoryObj } from "@storybook/react";
import {
    AlignCenterIcon,
    AlignLeftIcon,
    AlignRightIcon,
    BellFilledIcon,
    BellIcon,
    BoldIcon,
    ButtonStrip,
    CheckIcon,
    IconButton,
    ItalicIcon,
    MoonIcon,
    PauseIcon,
    PlayIcon,
    PushButton,
    SaveIcon,
    UnderlineIcon,
} from "@/components/ui";
import {
    ThemeAwareHeading,
    ThemeAwareBody,
    ThemeAwareSectionLabel,
} from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";
import { fn } from "@storybook/test";

const meta = {
    title: "Molecules/Buttons/ButtonStrip",
    component: ButtonStrip,
    tags: ["autodocs"],
    decorators: [withThemeProvider],
} satisfies Meta<typeof ButtonStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextFormatting: Story = {
    args: {
        items: [
            { id: "bold", icon: <BoldIcon />, tooltip: "Bold" },
            { id: "italic", icon: <ItalicIcon />, tooltip: "Italic" },
            { id: "underline", icon: <UnderlineIcon />, tooltip: "Underline" },
        ],
        selectionMode: "multiple",
        onSelectionChange: fn((selected) =>
            console.log("Text format:", selected)
        ),
    },
};

export const AlignmentOptions: Story = {
    args: {
        items: [
            {
                id: "left",
                icon: <AlignLeftIcon />,
                tooltip: "Align Left",
            },
            {
                id: "center",
                icon: <AlignCenterIcon />,
                tooltip: "Align Center",
            },
            {
                id: "right",
                icon: <AlignRightIcon />,
                tooltip: "Align Right",
            },
        ],
        selectionMode: "single",
        defaultSelected: ["left"],
        onSelectionChange: fn((selected) =>
            console.log("Alignment:", selected[0])
        ),
    },
};

export const FeatureToggles: Story = {
    args: {
        items: [
            {
                id: "notifications",
                icon: <BellIcon />,
                tooltip: "Toggle Notifications",
            },
            {
                id: "darkMode",
                icon: <MoonIcon />,
                tooltip: "Toggle Dark Mode",
            },
            {
                id: "autoSave",
                icon: <SaveIcon />,
                tooltip: "Toggle Auto Save",
            },
        ],
        selectionMode: "toggle",
        onSelectionChange: fn((selected) => {
            // selected will be either [] or [buttonId]
            const feature = selected[0];
            if (feature) {
                console.log(`Enabled: ${feature}`);
            } else {
                console.log("All features disabled");
            }
        }),
    },
};

export const ButtonExamples: Story = {
    render: () => {
        return (
            <div className="space-y-6">
                <ThemeAwareHeading>Button Examples</ThemeAwareHeading>
                <ThemeAwareBody>
                    Various ways to use the ButtonStrip component along with
                    stateful buttons.
                </ThemeAwareBody>

                <div className="flex gap-4 flex-wrap">
                    {/* IconButton with states */}
                    <div>
                        <ThemeAwareSectionLabel>
                            Stateful IconButton
                        </ThemeAwareSectionLabel>
                        <IconButton
                            icon={<BellIcon />}
                            states={{
                                count: 2,
                                icons: [<BellIcon />, <BellFilledIcon />],
                                tooltips: [
                                    "Enable Notifications",
                                    "Disable Notifications",
                                ],
                                variants: ["default", "bright"],
                            }}
                            onStateChange={(state) =>
                                console.log(`Notification state: ${state}`)
                            }
                        />
                    </div>

                    {/* PushButton with states */}
                    <div>
                        <ThemeAwareSectionLabel>
                            Stateful PushButton
                        </ThemeAwareSectionLabel>
                        <PushButton
                            states={{
                                count: 3,
                                labels: ["Initial", "Processing", "Complete"],
                                startIcons: [
                                    <PlayIcon />,
                                    <PauseIcon />,
                                    <CheckIcon />,
                                ],
                                variants: ["default", "ghost", "bright"],
                            }}
                            onStateChange={(state) =>
                                console.log(`Button state: ${state}`)
                            }
                        >
                            Initial
                        </PushButton>
                    </div>

                    {/* ButtonStrip for text formatting */}
                    <div>
                        <ThemeAwareSectionLabel>
                            Text Formatting
                        </ThemeAwareSectionLabel>
                        <ButtonStrip
                            items={[
                                {
                                    id: "bold",
                                    icon: <BoldIcon />,
                                    tooltip: "Bold",
                                },
                                {
                                    id: "italic",
                                    icon: <ItalicIcon />,
                                    tooltip: "Italic",
                                },
                                {
                                    id: "underline",
                                    icon: <UnderlineIcon />,
                                    tooltip: "Underline",
                                },
                            ]}
                            selectionMode="multiple"
                            onSelectionChange={(selected) =>
                                console.log("Text format:", selected)
                            }
                        />
                    </div>

                    {/* ButtonStrip for alignment selection */}
                    <div>
                        <ThemeAwareSectionLabel>
                            Alignment Selection
                        </ThemeAwareSectionLabel>
                        <ButtonStrip
                            items={[
                                {
                                    id: "left",
                                    icon: <AlignLeftIcon />,
                                    tooltip: "Align Left",
                                },
                                {
                                    id: "center",
                                    icon: <AlignCenterIcon />,
                                    tooltip: "Align Center",
                                },
                                {
                                    id: "right",
                                    icon: <AlignRightIcon />,
                                    tooltip: "Align Right",
                                },
                            ]}
                            selectionMode="single"
                            defaultSelected={["left"]}
                            onSelectionChange={(selected) =>
                                console.log("Alignment:", selected[0])
                            }
                        />
                    </div>

                    {/* ButtonStrip with toggle mode */}
                    <div>
                        <ThemeAwareSectionLabel>
                            Feature Toggles
                        </ThemeAwareSectionLabel>
                        <ButtonStrip
                            items={[
                                {
                                    id: "notifications",
                                    icon: <BellIcon />,
                                    tooltip: "Toggle Notifications",
                                },
                                {
                                    id: "darkMode",
                                    icon: <MoonIcon />,
                                    tooltip: "Toggle Dark Mode",
                                },
                                {
                                    id: "autoSave",
                                    icon: <SaveIcon />,
                                    tooltip: "Toggle Auto Save",
                                },
                            ]}
                            selectionMode="toggle"
                            onSelectionChange={(selected) => {
                                // selected will be either [] or [buttonId]
                                const feature = selected[0];
                                if (feature) {
                                    console.log(`Enabled: ${feature}`);
                                } else {
                                    console.log("All features disabled");
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    },
    args: {
        // Minimum required props
        items: [],
    },
};
