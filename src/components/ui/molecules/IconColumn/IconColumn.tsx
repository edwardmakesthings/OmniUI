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

const IconColumn = () => {
    return (
        <div className="h-full bg-bg-dark flex flex-col border-r border-accent-dark-bright">
            {/* Logo Button */}
            <IconButton {...buttonConfigs.logo} />

            {/* Panel Buttons */}
            {ICON_COLUMN_PANELS.map((id) => {
                // Find the panel name by ID
                const panelName = (Object.keys(PANEL_IDS) as PanelName[]).find(
                    (key) => PANEL_IDS[key] === id
                );

                if (!panelName) return null;

                const { isVisible, toggle } = usePanelVisibility(panelName);

                return (
                    <IconButton
                        key={id}
                        {...buttonConfigs.panel(panelName, isVisible, toggle)}
                    />
                );
            })}

            {/* Settings Button */}
            <IconButton {...buttonConfigs.settings} />
        </div>
    );
};

export default IconColumn;
