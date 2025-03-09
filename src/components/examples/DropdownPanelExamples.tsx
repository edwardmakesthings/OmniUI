import React, { useState } from "react";
import { DropdownPanel } from "@/components/ui/atoms/DropdownPanel";
import {
    CompPanelIcon,
    CompScrollBoxIcon,
    CompTabsIcon,
    CompDrawerIcon,
    CompPushButtonIcon,
    AlignLeftIcon,
    AlignCenterIcon,
    AlignRightIcon,
    AlignJustifyIcon,
} from "@/components/ui/icons";
import { ButtonStrip, Input, ScrollBox, SearchBar, Tabs } from "../ui";

// Simple component thumbnail for component palette
const ComponentThumbnail = ({
    icon: Icon,
    label,
    onClick,
}: {
    icon: React.ComponentType<any>;
    label: string;
    onClick?: () => void;
}) => (
    <div
        className="flex flex-col items-center justify-center p-2 hover:bg-accent-dark-neutral/20 cursor-pointer transition-colors"
        onClick={onClick}
    >
        <div className="w-16 h-14 flex items-center justify-center border border-accent-dark-neutral rounded">
            <Icon size={48} />
        </div>
        <span className="mt-1 text-sm text-font-dark-muted">{label}</span>
    </div>
);

export const ComponentPaletteExample = ({ searchQuery = "" }) => {
    const handleComponentClick = (componentName: string) => {
        console.log(`Selected ${componentName} component`);
    };

    // Component definitions
    const containers = [
        { id: "panel", icon: CompPanelIcon, label: "Panel" },
        { id: "scrollbox", icon: CompScrollBoxIcon, label: "Scroll Box" },
        { id: "tabs", icon: CompTabsIcon, label: "Tabs" },
        { id: "drawer", icon: CompDrawerIcon, label: "Drawer" },
    ];

    const buttons = [
        { id: "button", icon: CompPushButtonIcon, label: "Button" },
        { id: "menu", icon: CompPushButtonIcon, label: "Menu" },
        { id: "toggle", icon: CompPushButtonIcon, label: "Toggle" },
    ];

    const inputs = [
        { id: "text", icon: CompPushButtonIcon, label: "Text" },
        { id: "textarea", icon: CompPushButtonIcon, label: "Text Area" },
        { id: "select", icon: CompPushButtonIcon, label: "Select" },
        { id: "value", icon: CompPushButtonIcon, label: "Value" },
        { id: "color", icon: CompPushButtonIcon, label: "Color" },
        { id: "datetime", icon: CompPushButtonIcon, label: "Date/Time" },
    ];

    // Filter function
    const filterBySearch = (components) => {
        if (!searchQuery) return components;
        return components.filter((comp) =>
            comp.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Filtered components
    const filteredContainers = filterBySearch(containers);
    const filteredButtons = filterBySearch(buttons);
    const filteredInputs = filterBySearch(inputs);

    // Determine if sections should be visible based on search
    const showContainers = filteredContainers.length > 0;
    const showButtons = filteredButtons.length > 0;
    const showInputs = filteredInputs.length > 0;

    // No results message
    const noResults =
        !showContainers && !showButtons && !showInputs && searchQuery;

    return (
        <div className="w-96 bg-bg-dark">
            {noResults && (
                <div className="p-4 text-center text-font-dark-muted">
                    No components found matching "{searchQuery}"
                </div>
            )}

            {/* Basic Containers Section */}
            {showContainers && (
                <DropdownPanel
                    title="Basic Containers"
                    defaultOpen={true}
                    contentLayout="grid"
                    variant="ghost"
                >
                    {filteredContainers.map((comp) => (
                        <ComponentThumbnail
                            key={comp.id}
                            icon={comp.icon}
                            label={comp.label}
                            onClick={() => handleComponentClick(comp.label)}
                        />
                    ))}
                </DropdownPanel>
            )}

            {/* Buttons Section */}
            {showButtons && (
                <DropdownPanel
                    title="Buttons"
                    defaultOpen={true}
                    contentLayout="grid"
                    variant="ghost"
                >
                    {filteredButtons.map((comp) => (
                        <ComponentThumbnail
                            key={comp.id}
                            icon={comp.icon}
                            label={comp.label}
                            onClick={() => handleComponentClick(comp.label)}
                        />
                    ))}
                </DropdownPanel>
            )}

            {/* Inputs Section (Collapsed by default) */}
            {showInputs && (
                <DropdownPanel
                    title="Inputs"
                    defaultOpen={searchQuery ? true : false}
                    contentLayout="grid"
                    variant="ghost"
                    description="Form input components"
                >
                    {filteredInputs.map((comp) => (
                        <ComponentThumbnail
                            key={comp.id}
                            icon={comp.icon}
                            label={comp.label}
                            onClick={() => handleComponentClick(comp.label)}
                        />
                    ))}
                </DropdownPanel>
            )}
        </div>
    );
};

// Example with Tabs and SearchBar
export const ComponentPaletteWithTabs = () => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="w-128 bg-bg-dark border-r border-accent-dark-neutral h-full flex flex-col">
            {/* Use Tabs component for Atoms/Molecules */}
            <Tabs
                variant="default"
                className="w-full"
                tabClassName="flex-1"
                tabs={[
                    {
                        id: "atoms",
                        label: "Atoms",
                        content: (
                            <div className="flex flex-col h-full">
                                {/* SearchBar in the tab content */}
                                <div className="p-2 border-b border-accent-dark-neutral">
                                    <SearchBar
                                        value={searchQuery}
                                        onChange={setSearchQuery}
                                        placeholder="Search components..."
                                    />
                                </div>
                                <div className="overflow-auto flex-1">
                                    <ComponentPaletteExample
                                        searchQuery={searchQuery}
                                    />
                                </div>
                            </div>
                        ),
                    },
                    {
                        id: "molecules",
                        label: "Molecules",
                        content: (
                            <div className="flex flex-col h-full">
                                <div className="p-2 border-b border-accent-dark-neutral">
                                    <SearchBar
                                        value={searchQuery}
                                        onChange={setSearchQuery}
                                        placeholder="Search molecules..."
                                    />
                                </div>
                                <div className="p-4 text-center text-font-dark-muted">
                                    No molecules found. Add basic components to
                                    build molecules.
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    );
};

// Property row component for consistent styling
const PropertyRow = ({
    label,
    children,
    tooltip,
    className,
}: {
    label: string;
    children: React.ReactNode;
    tooltip?: string;
    className?: string;
}) => (
    <div className={`flex items-center mb-2 ${className}`}>
        <div className="w-1/3 text-font-dark-muted text-sm">{label}</div>
        <div className="w-2/3">{children}</div>
    </div>
);

export const PropertyPanelExample = () => {
    return (
        <div className="w-96 h-screen bg-bg-dark border-l border-accent-dark-neutral">
            {/* Header with component name */}
            <div className="p-2 border-b border-accent-dark-neutral">
                <h2 className="text-lg font-medium">PanelName</h2>
                <div className="text-xs text-font-dark-muted">
                    Name: panelName
                </div>
            </div>
            <ScrollBox maxHeight="100%">
                {/* Content Section */}
                <DropdownPanel
                    title="Content"
                    defaultOpen={true}
                    variant="ghost"
                    contentLayout="list"
                    className="border-b border-accent-dark-neutral/50"
                >
                    <div className="p-2">
                        <PropertyRow label="Children">
                            <div className="max-h-32 overflow-y-auto border border-accent-dark-neutral rounded p-1">
                                <div className="flex items-center p-1 hover:bg-accent-dark-neutral/20">
                                    ◦ TitleOfPanel
                                </div>
                                <div className="flex items-center p-1 hover:bg-accent-dark-neutral/20">
                                    ◦ Button
                                </div>
                                <div className="flex items-center p-1 hover:bg-accent-dark-neutral/20">
                                    ◦ TabSet
                                </div>
                                <div className="flex items-center p-1 hover:bg-accent-dark-neutral/20">
                                    ◦ BottomBarPanel
                                </div>
                            </div>
                        </PropertyRow>

                        <PropertyRow label="Input Type">
                            <select className="w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1">
                                <option>Number</option>
                                <option>Text</option>
                                <option>Boolean</option>
                            </select>
                        </PropertyRow>

                        <PropertyRow label="Format">
                            <select className="w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1">
                                <option>Value Box</option>
                                <option>Slider</option>
                            </select>
                        </PropertyRow>

                        <PropertyRow label="Size">
                            <div className="flex gap-1">
                                <Input
                                    value="2"
                                    className="w-14 bg-bg-dark-darker"
                                    prefix={{ content: "W" }}
                                />
                                <Input
                                    value="1"
                                    className="w-14 bg-bg-dark-darker"
                                    prefix={{ content: "H" }}
                                />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="Default Value">
                            <div className="flex gap-1">
                                <Input
                                    value="0.00"
                                    className="w-full bg-bg-dark-darker"
                                />
                            </div>
                        </PropertyRow>

                        <PropertyRow label="Range">
                            <div className="flex gap-1 items-center">
                                <Input
                                    value="0.00"
                                    className="w-14 bg-bg-dark-darker"
                                />
                                <span className="text-font-dark-muted">to</span>
                                <Input
                                    value="1.00"
                                    className="w-14 bg-bg-dark-darker"
                                />
                            </div>
                        </PropertyRow>

                        <PropertyRow
                            label="Description"
                            className="items-start"
                        >
                            <div className="flex flex-col gap-1">
                                <textarea
                                    className="w-full h-20 bg-bg-dark-darker border border-accent-dark-neutral rounded p-1 text-sm"
                                    defaultValue="You can place a bunch of text in this box and it can then be used for docs, tooltips, or other purposes."
                                />
                                <div className="text-xs text-right text-font-dark-muted cursor-pointer hover:text-font-dark">
                                    Help
                                </div>
                            </div>
                        </PropertyRow>

                        <PropertyRow label="Unit Type">
                            <select className="w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1">
                                <option>Degrees °</option>
                                <option>Pixels px</option>
                                <option>Percentage %</option>
                            </select>
                        </PropertyRow>
                    </div>
                </DropdownPanel>

                {/* Layout & Style Section */}
                <DropdownPanel
                    title="Layout & Style"
                    defaultOpen={true}
                    variant="ghost"
                    contentLayout="list"
                    className="border-b border-accent-dark-neutral/50"
                >
                    <div className="p-2">
                        <PropertyRow label="Position">
                            <div className="flex flex-col gap-2">
                                <ButtonStrip
                                    items={[
                                        {
                                            id: "left",
                                            icon: <AlignLeftIcon size={16} />,
                                            tooltip: "Align Left",
                                        },
                                        {
                                            id: "center",
                                            icon: <AlignCenterIcon size={16} />,
                                            tooltip: "Align Center",
                                        },
                                        {
                                            id: "right",
                                            icon: <AlignRightIcon size={16} />,
                                            tooltip: "Align Right",
                                        },
                                        {
                                            id: "justify",
                                            icon: (
                                                <AlignJustifyIcon size={16} />
                                            ),
                                            tooltip: "Justify",
                                        },
                                    ]}
                                    selectionMode="single"
                                    defaultSelected={["center"]}
                                    className="bg-bg-dark-darker border border-accent-dark-neutral rounded p-1"
                                />
                                <div className="grid grid-cols-2 gap-1">
                                    <Input
                                        value=""
                                        className="bg-bg-dark-darker"
                                        prefix={{ content: "X" }}
                                    />
                                    <Input
                                        value="60"
                                        className="bg-bg-dark-darker"
                                        prefix={{ content: "Y" }}
                                    />
                                </div>
                            </div>
                        </PropertyRow>

                        <PropertyRow label="Size">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-end">
                                    <span className="text-xs text-font-dark-muted mr-1">
                                        auto
                                    </span>
                                    <input type="checkbox" className="mr-2" />
                                    <span className="text-xs text-font-dark-muted mr-1">
                                        px
                                    </span>
                                    <select className="bg-bg-dark-darker border border-accent-dark-neutral rounded text-xs p-0.5">
                                        <option>px</option>
                                        <option>%</option>
                                        <option>em</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                    <Input
                                        value=""
                                        className="bg-bg-dark-darker"
                                        prefix={{ content: "W" }}
                                    />
                                    <Input
                                        value="110"
                                        className="bg-bg-dark-darker"
                                        prefix={{ content: "H" }}
                                    />
                                </div>
                            </div>
                        </PropertyRow>

                        <PropertyRow label="Style">
                            <select className="w-full bg-bg-dark-darker border border-accent-dark-neutral rounded p-1">
                                <option>Simple Panel</option>
                                <option>Elevated Panel</option>
                                <option>Custom</option>
                            </select>
                        </PropertyRow>

                        <PropertyRow label="Overrides">
                            <button className="w-full text-left bg-bg-dark-darker border border-accent-dark-neutral rounded p-1 text-font-dark-muted">
                                ◢
                            </button>
                        </PropertyRow>
                    </div>
                </DropdownPanel>

                {/* Events & Actions Section */}
                <DropdownPanel
                    title="Events & Actions"
                    defaultOpen={true}
                    variant="ghost"
                    contentLayout="list"
                >
                    <div className="p-2">
                        <div className="mb-2">
                            <div className="flex items-center text-font-dark p-1 bg-bg-dark-darker border border-accent-dark-neutral rounded mb-1">
                                <span className="text-sm">◦ onHover</span>
                            </div>
                            <div className="flex items-center text-font-dark-muted text-sm p-1 ml-4 border-l border-accent-dark-neutral">
                                ▸ ShowTooltip(description)
                            </div>
                        </div>

                        <div className="mb-2">
                            <div className="flex items-center text-font-dark p-1 bg-bg-dark-darker border border-accent-dark-neutral rounded mb-1">
                                <span className="text-sm">◦ onClick</span>
                            </div>
                            <div className="flex items-center text-font-dark-muted text-sm p-1 ml-4 border-l border-accent-dark-neutral">
                                ▸ No handlers defined
                            </div>
                        </div>

                        <button className="w-full p-2 bg-bg-dark-darker border border-accent-dark-neutral rounded text-center text-font-dark-muted hover:text-font-dark">
                            Add Event + Handler
                        </button>
                    </div>
                </DropdownPanel>
            </ScrollBox>
        </div>
    );
};

const DropdownPanelExamples = () => {
    return (
        <div className="flex flex-row space-x-6">
            <ComponentPaletteExample />
            <ComponentPaletteWithTabs />
            <PropertyPanelExample />
        </div>
    );
};

export default DropdownPanelExamples;
