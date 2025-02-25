import { EditIcon, IconButton, Panel } from "@/components/ui";

export const PanelExamples = () => {
    return (
        <div className="space-y-6">
            {/* Basic Panel */}
            <Panel header="Unstyled header">
                <p>Basic, unstyled panel content</p>
            </Panel>

            <Panel header="Unstyled header (elevated)" variant="elevated">
                <p>Basic, unstyled panel content</p>
            </Panel>

            {/* Panel with Header */}
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

            {/* Elevated Panel */}
            <Panel
                variant="elevated"
                header={
                    <h2 className="text-lg font-medium text-font-dark">
                        Elevated Panel
                    </h2>
                }
                className="bg-bg-dark-darker shadow-lg rounded-lg w-66"
            >
                <p className="text-font-dark">
                    Elevated panel with custom padding, rounded corners, and set
                    width.
                </p>
                <p className="text-font-dark-muted mt-2">
                    Additional content with muted text
                </p>
            </Panel>
        </div>
    );
};

export default PanelExamples;
