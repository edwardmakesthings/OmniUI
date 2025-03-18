import type { Meta, StoryObj } from "@storybook/react";
import { ScrollBox } from "@/components/ui";
import {
    ThemeAwareHeading,
    ThemeAwareBody,
} from "@/components/utils/storybook/ThemeAwareText";
import { withThemeProvider } from "@/components/utils/storybook/ThemeContext";

/**
 * `ScrollBox` provides a scrollable container with consistent scrollbar styling.
 * It supports different variants and scrollbar customization.
 */
const meta = {
    title: "Atoms/Containers/ScrollBox",
    component: ScrollBox,
    tags: ["autodocs"],
    decorators: [withThemeProvider],
    args: {
        maxHeight: 200,
        variant: "default",
        scrollbarStyle: "dark",
        scrollbarSize: "normal",
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "inset", "ghost"],
            description: "Visual style variant of the scrollbox",
        },
        maxHeight: {
            control: {
                type: "number",
                min: 200,
                max: 500,
                step: 10,
            },
            description: "Maximum height of the container before scrolling",
        },
        scrollToTop: {
            control: "boolean",
            description: "When true, scrolls the content to the top",
        },
        scrollbarStyle: {
            control: "select",
            options: ["dark", "light", "accent", "invisible"],
            description: "Style of the scrollbar",
        },
        scrollbarSize: {
            control: "select",
            options: ["normal", "thin"],
            description: "Size of the scrollbar",
        },
    },
} satisfies Meta<typeof ScrollBox>;

export default meta;
type Story = StoryObj<typeof meta>;

// Common data for examples
const generateItems = (count: number) =>
    Array.from({ length: count }, (_, i) => `Item ${i + 1}`);

export const Basic: Story = {
    args: {
        maxHeight: 200,
        children: (
            <div className="space-y-2 w-96">
                {generateItems(20).map((item) => (
                    <div
                        key={item}
                        className="p-2 border border-accent-dark-neutral"
                    >
                        {item}
                    </div>
                ))}
            </div>
        ),
    },
};

export const UnstyledScrollBox: Story = {
    render: () => {
        const items = generateItems(20);

        return (
            <div className="space-y-6">
                <ThemeAwareHeading>Unstyled ScrollBox</ThemeAwareHeading>
                <ThemeAwareBody>
                    The basic ScrollBox without any additional styling.
                </ThemeAwareBody>

                <ScrollBox maxHeight={300}>
                    <div className="divide-y divide-accent-dark-neutral">
                        {items.map((item) => (
                            <div
                                key={item}
                                className="text-font-dark hover:bg-bg-dark-lighter transition-colors p-2"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </ScrollBox>
            </div>
        );
    },
};

export const StyledScrollBox: Story = {
    render: () => {
        const items = generateItems(20);

        return (
            <div className="space-y-6">
                <ThemeAwareHeading>Styled ScrollBox</ThemeAwareHeading>
                <ThemeAwareBody>
                    A ScrollBox with custom border and background styling.
                </ThemeAwareBody>

                <ScrollBox
                    maxHeight={300}
                    className="bg-bg-dark border border-accent-dark-neutral rounded-md"
                >
                    <div className="divide-y divide-accent-dark-neutral">
                        {items.map((item) => (
                            <div
                                key={item}
                                className="p-3 text-font-dark hover:bg-bg-dark-lighter transition-colors"
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                </ScrollBox>
            </div>
        );
    },
};

export const InsetScrollBox: Story = {
    render: () => {
        const items = generateItems(20);

        return (
            <div className="space-y-6">
                <ThemeAwareHeading>Inset ScrollBox</ThemeAwareHeading>
                <ThemeAwareBody>
                    The inset variant adds an inset shadow around the scrollable
                    area, which helps to visually indicate that the content is
                    scrollable.
                </ThemeAwareBody>

                <ScrollBox
                    variant="inset"
                    maxHeight={400}
                    className="bg-bg-dark-darker rounded-md border border-accent-dark-neutral"
                >
                    <div className="p-4 space-y-3">
                        {items.map((item) => (
                            <div
                                key={item}
                                className="bg-bg-dark p-4 rounded-md border border-accent-dark-neutral
                     hover:border-accent-dark-bright transition-colors"
                            >
                                <h3 className="text-font-dark font-medium">
                                    {item}
                                </h3>
                                <p className="text-font-dark-muted mt-1">
                                    Description for {item.toLowerCase()}
                                </p>
                            </div>
                        ))}
                    </div>
                </ScrollBox>
            </div>
        );
    },
};
