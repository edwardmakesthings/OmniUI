import {
    EditIcon,
    Panel,
    PushButton,
    ScrollBox,
    SearchIcon,
    Tabs,
} from "@/components/ui";

const NestedTabsExample = () => {
    return (
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
                                            <div className="space-y-4">
                                                <p className="text-font-dark-muted">
                                                    Configure basic application
                                                    settings here.
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
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-semibold">
                                                    Appearance Settings
                                                </h3>
                                                <p className="text-font-dark-muted">
                                                    Customize the look and feel
                                                    of the application.
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
                                {Array.from({ length: 10 }, (_, i) => (
                                    <div
                                        key={i}
                                        className="p-4 bg-bg-dark border border-accent-dark-neutral rounded"
                                    >
                                        <h4 className="font-medium">
                                            Content Item {i + 1}
                                        </h4>
                                        <p className="text-font-dark-muted mt-2">
                                            This is a content item that
                                            demonstrates scrolling behavior in
                                            the tab panel area.
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </ScrollBox>
                    ),
                },
            ]}
        />
    );
};

// Example of basic tab usage with different variants
const BasicTabsExample = () => {
    return (
        <div className="space-y-8">
            {/* Default Tabs */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Default Tabs</h2>
                <Tabs
                    variant="default"
                    tabs={[
                        {
                            id: "tab1",
                            label: "First Tab",
                            content: (
                                <div className="space-y-4">
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
                                <div className="space-y-4">
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

            {/* Inset Tabs */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Inset Tabs</h2>
                <Tabs
                    variant="inset"
                    tabs={[
                        {
                            id: "info1",
                            label: "Information",
                            content: (
                                <div className="space-y-4">
                                    <h3 className="font-medium">
                                        Important Information
                                    </h3>
                                    <p className="text-font-dark-muted">
                                        This demonstrates the inset variant with
                                        elevated styling.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            id: "info2",
                            label: "More Info",
                            content: (
                                <div className="space-y-4">
                                    <h3 className="font-medium">
                                        Additional Information
                                    </h3>
                                    <p className="text-font-dark-muted">
                                        Another tab showing the inset variant
                                        styling.
                                    </p>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const TabsExamples = () => {
    return (
        <div className="space-y-12">
            <section>
                <h2 className="text-xl font-bold mb-6">Basic Tabs</h2>
                <BasicTabsExample />
            </section>

            <section>
                <h2 className="text-xl font-bold mb-6">Nested Tabs</h2>
                <NestedTabsExample />
            </section>
        </div>
    );
};

export default TabsExamples;
