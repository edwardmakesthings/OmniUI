import type { Meta, StoryObj } from "@storybook/react";
import { Modal, PushButton, ScrollBox, SearchIcon } from "@/components/ui";
import { useState } from "react";
import {
    ThemeAwareHeading,
    ThemeAwareBody,
} from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";

/**
 * `Modal` is a dialog component that appears on top of the app content.
 * It captures focus and requires user interaction before returning to the main content.
 */
const meta = {
    title: "Atoms/Overlay/Modal",
    component: Modal,
    tags: ["autodocs"],
    decorators: [withThemeProvider],
    parameters: {
        layout: "centered",
    },
    argTypes: {
        title: {
            description: "Content for the modal header",
        },
        footer: {
            description: "Content for the modal footer",
        },
        open: {
            control: "boolean",
            description: "Controls whether the modal is visible",
        },
        onClose: {
            description: "Callback when the modal is requested to close",
        },
        variant: {
            control: "select",
            options: ["default", "elevated"],
            description: "Visual style variant of the modal",
        },
        width: {
            control: "text",
            description: "Width of the modal",
        },
        maxHeight: {
            control: "text",
            description: "Maximum height of the modal before content scrolls",
        },
        closeOnBackdropClick: {
            control: "boolean",
            description: "Whether clicking the backdrop closes the modal",
        },
        closeOnEscape: {
            control: "boolean",
            description: "Whether pressing Escape key closes the modal",
        },
        showHeader: {
            control: "boolean",
            description: "Whether to show the header section",
        },
        showFooter: {
            control: "boolean",
            description: "Whether to show the footer section",
        },
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="space-y-6 h-80 flex flex-col justify-center">
                <ThemeAwareHeading>Basic Modal</ThemeAwareHeading>
                <ThemeAwareBody>
                    A simple modal with a title, content, and footer.
                </ThemeAwareBody>

                <PushButton variant="bright" onClick={() => setIsOpen(true)}>
                    Open Basic Modal
                </PushButton>

                <Modal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    title={
                        <h2 className="text-lg font-medium text-font-dark">
                            Basic Modal
                        </h2>
                    }
                    footer={
                        <div className="flex justify-end space-x-3">
                            <PushButton
                                variant="ghost"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancel
                            </PushButton>
                            <PushButton
                                variant="bright"
                                onClick={() => setIsOpen(false)}
                            >
                                Confirm
                            </PushButton>
                        </div>
                    }
                    className="bg-bg-dark"
                >
                    <div className="p-6">
                        <p className="text-font-dark">
                            This is a basic modal with header and footer.
                        </p>
                        <p className="text-font-dark-muted mt-3">
                            Additional content can be added here.
                        </p>
                    </div>
                </Modal>
            </div>
        );
    },
};

export const Complex: Story = {
    render: () => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="space-y-6 h-120 flex flex-col justify-center">
                <ThemeAwareHeading>Complex Modal</ThemeAwareHeading>
                <ThemeAwareBody>
                    A more complex modal with a scrollable content area, custom
                    width, and elevated styling.
                </ThemeAwareBody>

                <PushButton variant="ghost" onClick={() => setIsOpen(true)}>
                    Open Complex Modal
                </PushButton>

                <Modal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    variant="elevated"
                    width={600}
                    title={
                        <div className="flex items-center space-x-3">
                            <SearchIcon className="text-font-dark" />
                            <h2 className="text-lg font-medium text-font-dark">
                                Search Results
                            </h2>
                        </div>
                    }
                    footer={
                        <div className="flex justify-between items-center w-full">
                            <span className="text-font-dark-muted text-sm">
                                Showing 20 of 100 results
                            </span>
                            <div className="space-x-3 flex">
                                <PushButton
                                    variant="ghost"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Cancel
                                </PushButton>
                                <PushButton
                                    variant="bright"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Apply
                                </PushButton>
                            </div>
                        </div>
                    }
                    className="bg-bg-dark-darker"
                >
                    <ScrollBox maxHeight={400}>
                        <div className="divide-y divide-accent-dark-neutral">
                            {Array.from({ length: 20 }, (_, i) => (
                                <div
                                    key={i}
                                    className="p-3 hover:bg-bg-dark transition-colors"
                                >
                                    <h3 className="text-font-dark font-medium">
                                        Result Item {i + 1}
                                    </h3>
                                    <p className="text-font-dark-muted mt-1">
                                        Description for result item {i + 1}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </ScrollBox>
                </Modal>
            </div>
        );
    },
};
