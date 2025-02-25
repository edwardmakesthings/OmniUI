import {
    PANEL_ICONS,
    PANEL_IDS,
    PANEL_TOOLTIPS,
    PanelName,
    usePanelVisibility,
} from "@/store/uiStore";
import { IconButton, IconButtonProps } from "../../atoms/IconButton";
import { EntityId } from "@/core/types/EntityTypes";
import { GearIcon, LogoIcon } from "../../icons";
import { cn } from "@/lib/utils";
import { backgroundStyles } from "@/components/base/style/compositions";
import { combineComputedStyles } from "@/components/base/style/utils";
import { defaultState } from "@/components/base/interactive/types";
import { useState } from "react";
import { DropdownButton, Modal } from "../../atoms";

const ICON_COLUMN_PANELS: EntityId[] = [
    PANEL_IDS.COMPONENT_PALETTE,
    PANEL_IDS.LAYOUT_HIERARCHY,
    PANEL_IDS.THEME_MANAGER,
] as const;

// Base configuration for all icon buttons in the column
const baseIconButtonProps: Partial<IconButtonProps> = {
    iconSize: 28,
    containerSize: "md",
    iconProps: { strokeWidth: 1.4 },
} as const;
console.log(
    combineComputedStyles(backgroundStyles.solid.accentBright, defaultState)
);
// Specific configurations for different button types
const buttonConfigs = {
    logo: {
        ...baseIconButtonProps,
        icon: LogoIcon,
        tooltip: "OmniUI",
        variant: "bright",
        // className: combineComputedStyles(
        //     backgroundStyles.solid.accentBright,
        //     defaultState
        // ),
    },
    panel: (
        panelName: PanelName,
        isVisible: boolean,
        onClick: () => void
    ): IconButtonProps => ({
        ...baseIconButtonProps,
        icon: PANEL_ICONS[panelName],
        tooltip: PANEL_TOOLTIPS[panelName],
        selected: isVisible,
        onClick,
        variant: "default",
    }),
    settings: {
        ...baseIconButtonProps,
        icon: GearIcon,
        tooltip: "Settings",
        isSelected: false,
        variant: "default",
        className: cn(baseIconButtonProps.className, "mt-auto"),
    },
} as const;

/**
 * IconColumn component - Renders the vertical strip of icons for navigation
 * Uses individual IconButtons for different interaction patterns
 */
export const IconColumn: React.FC = () => {
    // State for modals
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    return (
        <div className="fixed top-0 left-0 bottom-0 z-50 h-screen bg-bg-dark flex flex-col border-r border-accent-dark-bright">
            {/* Logo button at the top opening a modal */}
            <div className="p-1 border-b border-accent-dark-neutral">
                <IconButton
                    icon={
                        <LogoIcon
                            {...baseIconButtonProps}
                            className="text-accent-dark-bright"
                        />
                    }
                    tooltip="Project Menu"
                    variant="ghost"
                    onClick={() => setShowProjectModal(true)}
                />
            </div>

            {/* Panel toggle buttons */}
            {ICON_COLUMN_PANELS.map((id) => {
                // Find the panel name by ID
                const panelName = (Object.keys(PANEL_IDS) as PanelName[]).find(
                    (key) => PANEL_IDS[key] === id
                );

                if (!panelName) return null;

                const { isVisible, toggle } = usePanelVisibility(panelName);
                const Icon = PANEL_ICONS[panelName];

                return (
                    <IconButton
                        key={id}
                        icon={<Icon {...baseIconButtonProps} />}
                        tooltip={PANEL_TOOLTIPS[panelName]}
                        selected={isVisible}
                        onClick={toggle}
                        variant="default"
                    />
                );
            })}

            {/* Settings button at the bottom */}
            <div className="p-1 border-t border-accent-dark-neutral mt-auto">
                <IconButton
                    icon={<GearIcon size={24} />}
                    tooltip="Settings"
                    variant="default"
                    onClick={() => setShowSettingsModal(true)}
                />
            </div>

            {/* Project Modal */}
            <Modal
                open={showProjectModal}
                onClose={() => setShowProjectModal(false)}
                title="Project Options"
                width={500}
                footer={
                    <div className="flex justify-end">
                        <button
                            className="px-3 py-1 text-font-dark hover:text-font-light"
                            onClick={() => setShowProjectModal(false)}
                        >
                            Close
                        </button>
                    </div>
                }
            >
                <div className="p-4">
                    <h3 className="text-lg font-medium mb-4">
                        Project Management
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-2 bg-bg-dark-darker hover:bg-accent-dark-neutral/20 border border-accent-dark-neutral rounded">
                            New Project
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-bg-dark-darker hover:bg-accent-dark-neutral/20 border border-accent-dark-neutral rounded">
                            Open Project
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-bg-dark-darker hover:bg-accent-dark-neutral/20 border border-accent-dark-neutral rounded">
                            Save Project
                        </button>
                        <button className="w-full text-left px-4 py-2 bg-accent-dark-bright hover:bg-accent-dark-bright-hover text-font-dark rounded">
                            Export
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Settings Modal */}
            <Modal
                open={showSettingsModal}
                onClose={() => setShowSettingsModal(false)}
                title="Application Settings"
                width={600}
                footer={
                    <div className="flex justify-end gap-2">
                        <button
                            className="px-3 py-1 text-font-dark hover:text-font-light"
                            onClick={() => setShowSettingsModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-3 py-1 bg-accent-dark-bright hover:bg-accent-dark-bright-hover text-font-dark rounded"
                            onClick={() => setShowSettingsModal(false)}
                        >
                            Save Settings
                        </button>
                    </div>
                }
            >
                <div className="p-4">
                    <h3 className="text-lg font-medium mb-4">
                        Application Settings
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span>Dark Mode</span>
                            <input type="checkbox" defaultChecked />
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Auto Save</span>
                            <input type="checkbox" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Show Grid</span>
                            <input type="checkbox" defaultChecked />
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Grid Size</span>
                            <select className="bg-bg-dark-darker border border-accent-dark-neutral rounded p-1">
                                <option>10px</option>
                                <option>20px</option>
                                <option>40px</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default IconColumn;
