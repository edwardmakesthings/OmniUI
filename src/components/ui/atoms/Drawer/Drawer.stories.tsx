import type { Meta, StoryObj } from "@storybook/react";
import { Drawer, IconButton, Panel, PushButton, XIcon } from "@/components/ui";
import { useState } from "react";
import {
    ThemeAwareHeading,
    ThemeAwareBody,
} from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";

/**
 * `Drawer` is a slide-in panel component that appears from the edges of the screen.
 * It can be configured to appear from left, right, top, or bottom edges and
 * supports custom width/height and backdrop options.
 */
const meta = {
    title: "Atoms/Overlay/Drawer",
    component: Drawer,
    tags: ["autodocs"],
    decorators: [withThemeProvider],
    parameters: {
        layout: "fullscreen",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["left", "right", "top", "bottom"],
            description: "Determines which edge the drawer slides in from",
        },
        width: {
            control: "text",
            description: "Width of the drawer when using left/right variants",
        },
        height: {
            control: "text",
            description: "Height of the drawer when using top/bottom variants",
        },
        closeOnOverlayClick: {
            control: "boolean",
            description: "Whether clicking the backdrop closes the drawer",
        },
        closeOnEscape: {
            control: "boolean",
            description: "Whether pressing Escape key closes the drawer",
        },
        showOverlay: {
            control: "boolean",
            description: "Whether to show a backdrop overlay",
        },
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LeftDrawer: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="p-6 space-y-6 h-200 flex flex-col justify-center">
                <ThemeAwareHeading>Left Drawer</ThemeAwareHeading>
                <ThemeAwareBody>
                    A drawer that slides in from the left side of the screen.
                </ThemeAwareBody>

                <PushButton onClick={() => setIsOpen(true)}>
                    Open Left Drawer
                </PushButton>

                <Drawer
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    variant="left"
                    width={480}
                    showOverlay={false}
                >
                    <div className="flex flex-col h-full">
                        {/* Header - Fixed height */}
                        <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral shrink-0">
                            <h2 className="text-lg font-bold">Drawer Title</h2>
                            <IconButton
                                icon={XIcon}
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                            />
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {/* Demo content */}
                            {Array.from({ length: 20 }, (_, i) => (
                                <div
                                    key={i}
                                    className="mb-4 p-4 bg-bg-dark-darker border border-accent-dark-neutral rounded"
                                >
                                    <h3 className="text-font-dark font-medium">
                                        Item {i + 1}
                                    </h3>
                                    <p className="text-font-dark-muted mt-2">
                                        This is a content item that demonstrates
                                        proper scrolling behavior in the drawer
                                        content area.
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Footer - Fixed height */}
                        <div className="flex justify-end gap-2 p-4 border-t border-accent-dark-neutral shrink-0">
                            <PushButton
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </PushButton>
                            <PushButton variant="bright">Save</PushButton>
                        </div>
                    </div>
                </Drawer>
            </div>
        );
    },
};

export const RightDrawer: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="p-6 space-y-6 h-200 flex flex-col justify-center">
                <ThemeAwareHeading>Right Drawer</ThemeAwareHeading>
                <ThemeAwareBody>
                    A drawer that slides in from the right side of the screen.
                </ThemeAwareBody>

                <PushButton onClick={() => setIsOpen(true)}>
                    Open Right Drawer
                </PushButton>

                <Drawer
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    variant="right"
                    width={400}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral">
                            <h2 className="text-lg font-bold">Settings</h2>
                            <IconButton
                                icon={XIcon}
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                            />
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <p>Right drawer content with custom width.</p>
                        </div>
                    </div>
                </Drawer>
            </div>
        );
    },
};

export const UnstyledRightDrawer: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="p-6 space-y-6 h-200 flex flex-col justify-center">
                <ThemeAwareHeading>Unstyled Right Drawer</ThemeAwareHeading>
                <ThemeAwareBody>
                    A drawer that uses a Panel component for its content.
                </ThemeAwareBody>

                <PushButton onClick={() => setIsOpen(true)}>
                    Open Right Drawer (Unstyled)
                </PushButton>

                <Drawer
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    variant="right"
                    width={400}
                >
                    <Panel header="Unstyled Test">
                        <p>Unstyled right drawer content with custom width.</p>
                    </Panel>
                </Drawer>
            </div>
        );
    },
};

export const TopDrawer: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="p-6 space-y-6 h-200 flex flex-col justify-center">
                <ThemeAwareHeading>Top Drawer</ThemeAwareHeading>
                <ThemeAwareBody>
                    A drawer that slides in from the top of the screen.
                </ThemeAwareBody>

                <PushButton onClick={() => setIsOpen(true)}>
                    Open Top Drawer
                </PushButton>

                <Drawer
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    variant="top"
                    height={320}
                >
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between p-4 border-b border-accent-dark-neutral">
                            <h2 className="text-lg font-bold">Notifications</h2>
                            <IconButton
                                icon={XIcon}
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                            />
                        </div>
                        <div className="flex-1 p-4 overflow-auto">
                            <p>Top drawer content with custom height.</p>
                        </div>
                    </div>
                </Drawer>
            </div>
        );
    },
};
