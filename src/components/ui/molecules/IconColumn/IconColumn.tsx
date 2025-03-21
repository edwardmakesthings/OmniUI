import {
    PANEL_ICONS,
    PANEL_IDS,
    PANEL_TOOLTIPS,
    PanelName,
    usePanelVisibility,
} from "@/store/uiStore";
import { IconButton } from "@/components/ui/atoms/IconButton";
import {
    ButtonStrip,
    ButtonStripItem,
} from "@/components/ui/molecules/ButtonStrip";
import { EntityId } from "@/core/types/EntityTypes";
import { GearIcon, LogoIcon } from "@/components/ui/icons";
import { useModal } from "@/contexts/ModalContext";

const ICON_COLUMN_PANELS: EntityId[] = [
    PANEL_IDS.COMPONENT_PALETTE,
    PANEL_IDS.LAYOUT_HIERARCHY,
    // PANEL_IDS.THEME_MANAGER,
] as const;

/**
 * IconColumn component - Renders the vertical strip of icons for navigation
 * Uses ButtonStrip for panels and individual IconButtons for logo and settings
 */
export const IconColumn: React.FC = () => {
    // Use modal context
    const { openModal } = useModal();

    // Get panel toggle functions
    const toggleFunctions = {} as Record<PanelName, () => void>;
    const visibilityStates = {} as Record<PanelName, boolean>;

    // Create panel items and collect visibility states
    const panelItems: ButtonStripItem[] = [];

    ICON_COLUMN_PANELS.forEach((id) => {
        // Find the panel name by ID
        const panelName = (Object.keys(PANEL_IDS) as PanelName[]).find(
            (key) => PANEL_IDS[key] === id
        ) as EntityId;

        if (!panelName) return;

        const { isVisible, toggle } = usePanelVisibility(
            panelName as PanelName
        );
        const Icon = PANEL_ICONS[panelName as PanelName];

        toggleFunctions[panelName as PanelName] = toggle;
        visibilityStates[panelName as PanelName] = isVisible;

        panelItems.push({
            id: panelName,
            icon: <Icon />,
            tooltip: PANEL_TOOLTIPS[panelName as PanelName],
            buttonProps: {
                selected: isVisible,
                variant: "default",
                iconSize: 28,
            },
        });
    });

    // Find active panel (if any)
    const activePanelName = Object.keys(visibilityStates).find(
        (panel) => visibilityStates[panel as PanelName]
    ) as PanelName | undefined;

    // Custom handler to ensure only one panel is visible
    const handlePanelSelection = (selectedIds: string[]) => {
        const newSelectedPanel = selectedIds[0] as PanelName | undefined;

        // Handle closing all panels
        if (!newSelectedPanel) {
            // If there was an active panel, close it
            if (activePanelName) {
                toggleFunctions[activePanelName]();
            }
            return;
        }

        // If selecting the already active panel, just close it
        if (newSelectedPanel === activePanelName) {
            toggleFunctions[activePanelName]();
            return;
        }

        // Otherwise, close the active panel and open the new one
        if (activePanelName) {
            toggleFunctions[activePanelName]();
        }

        // Open the newly selected panel
        toggleFunctions[newSelectedPanel]();
    };

    return (
        <div className="bg-bg-dark flex flex-col border-r border-accent-dark-bright">
            {/* Logo button at the top opening a modal */}
            <div className="border-b border-accent-dark-neutral">
                <IconButton
                    icon={<LogoIcon size={36} />}
                    tooltip="Project Menu"
                    variant="bright"
                    onClick={() => openModal("project")}
                    iconSize={40}
                />
            </div>

            {/* Panel toggle buttons as ButtonStrip */}
            <div className="flex-1">
                <ButtonStrip
                    items={panelItems}
                    orientation="vertical"
                    selectionMode="toggle"
                    selected={activePanelName ? [activePanelName] : []}
                    onSelectionChange={handlePanelSelection}
                    variant="default"
                    size="md"
                />
            </div>

            {/* Settings button at the bottom */}
            <div className="border-t border-accent-dark-neutral mt-auto">
                <IconButton
                    icon={<GearIcon />}
                    tooltip="Settings"
                    variant="default"
                    onClick={() => openModal("settings")}
                    iconSize={28}
                />
            </div>
        </div>
    );
};

export default IconColumn;
