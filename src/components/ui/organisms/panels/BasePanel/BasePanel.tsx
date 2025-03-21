import { PanelConfig, PanelPositionValues } from "@/core/types/UI";
import { PanelName, usePanelConfig } from "@/store/uiStore";
import { ProjectHeader } from "@/components/ui/atoms";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BasePanelProps extends Partial<PanelConfig> {
    /** Panel identifier matching PANEL_IDS in uiStore */
    panelName: PanelName;
    /** Panel content */
    children?: ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Panel component for displaying tool panels and sidebars
 * Simplified version that works within a PanelContainer
 * @component
 * @path src/components/ui/organisms/panels/BasePanel/BasePanel.tsx
 */
const BasePanel = ({
    // Store identifier
    panelName,
    // Panel configuration (optional, falls back to store)
    position,
    isFloating,
    isVisible,
    // Component props
    children,
    className = "",
}: BasePanelProps) => {
    // Get panel configuration from store
    const storeConfig = usePanelConfig(panelName);

    // Merge store config with props, preferring props when provided
    const config: PanelConfig = {
        ...storeConfig,
        position: position ?? storeConfig.position,
        isFloating: isFloating ?? storeConfig.isFloating,
        isVisible: isVisible ?? storeConfig.isVisible,
    };

    if (!config.isVisible) return null;

    const baseClasses = "bg-bg-dark text-font-dark flex flex-col w-full h-full";

    return (
        <div
            className={cn(baseClasses, className)}
            data-panel-name={panelName}
            data-panel-position={config.position}
        >
            {/* Add project header if left panel */}
            {config.position === PanelPositionValues.Left && <ProjectHeader />}

            {/* Panel content */}
            {children}
        </div>
    );
};

export default BasePanel;
