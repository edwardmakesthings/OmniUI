import { PanelConfig, PanelPositionValues } from '@/core/types/UI';
import { SizeUtils } from '@/core/types/Geometry';
import { MeasurementUtils } from '@/core/types/Measurement';
import { PanelName, usePanelConfig } from '@/store/uiStore';

interface BasePanelProps extends PanelConfig {
    /** Panel identifier matching PANEL_IDS in uiStore */
    panelName: PanelName;
    /** Panel content */
    children: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Panel component for displaying tool panels and sidebars
 * @component
 */
const BasePanel = ({
    // Store identifier
    panelName,
    // Panel configuration (optional, falls back to store)
    position,
    floatPosition,
    isFloating,
    size,
    floatSize,
    isVisible,
    // Component props
    children,
    className = ''
}: BasePanelProps) => {
    // Get panel configuration from store
    const storeConfig = usePanelConfig(panelName);

    // Merge store config with props, preferring props when provided
    const config: PanelConfig = {
        ...storeConfig,
        position: position ?? storeConfig.position,
        floatPosition: floatPosition ?? storeConfig.floatPosition,
        isFloating: isFloating ?? storeConfig.isFloating,
        size: size ?? storeConfig.size,
        floatSize: floatSize ?? storeConfig.floatSize,
        isVisible: isVisible ?? storeConfig.isVisible
    };

    if (!config.isVisible) return null;

    const baseClasses = 'bg-bg-dark text-font-dark border-accent-dark-neutral p-2';

    const positionClasses = {
        [PanelPositionValues.Left]: 'border-r-3',
        [PanelPositionValues.Right]: 'border-l-3',
        [PanelPositionValues.Bottom]: 'border-t-3'
    };

    // Convert measurements to pixels
    const pixelSize = MeasurementUtils.convert(config.size, 'px');
    const pixelFloatSize = config.floatSize
        ? SizeUtils.convert(config.floatSize, 'px')
        : undefined;

    const layoutStyle: React.CSSProperties = config.isFloating
        ? {
            position: 'absolute',
            left: config.floatPosition?.x.value,
            top: config.floatPosition?.y.value,
            width: pixelFloatSize?.width.value,
            height: pixelFloatSize?.height.value
        }
        : {
            position: 'relative',
            [config.position === PanelPositionValues.Bottom ? 'height' : 'width']: pixelSize.value
        };

    const stretchClass = config.position === PanelPositionValues.Bottom ? "w-full" : "h-full";

    return (
        <div
            className={`${baseClasses} ${positionClasses[config.position]} ${stretchClass} ${className}`}
            style={layoutStyle}
        >
            {children}
        </div>
    );
};

export default BasePanel;