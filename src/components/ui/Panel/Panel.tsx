import React from 'react';
import { PanelConfig, PanelPositionValues } from '../../../core/types/UI';
import { SizeUtils } from '../../../core/types/Geometry';
import { MeasurementUtils } from '../../../core/types/Measurement';

interface PanelProps extends PanelConfig {
    /** Additional CSS classes */
    className?: string;
    /** Panel content */
    children: React.ReactNode;
}

/**
 * Panel component for displaying tool panels and sidebars
 * @component
 */
const Panel: React.FC<PanelProps> = ({
    position,
    floatPosition,
    isFloating,
    size,
    floatSize,
    isVisible,
    className = '',
    children
}) => {
    if (!isVisible) return null;

    const baseClasses = 'bg-zinc-900 text-zinc-300 border-zinc-800 p-2';

    const positionClasses = {
        [PanelPositionValues.Left]: 'border-r-3',
        [PanelPositionValues.Right]: 'border-l-3',
        [PanelPositionValues.Bottom]: 'border-t-3'
    };

    // Convert measurements to pixels
    const pixelSize = MeasurementUtils.convert(size, 'px');
    const pixelFloatSize = floatSize
        ? SizeUtils.convert(floatSize, 'px')
        : undefined;

    const layoutStyle: React.CSSProperties = isFloating
        ? {
            position: 'absolute',
            left: floatPosition?.x.value,
            top: floatPosition?.y.value,
            width: pixelFloatSize?.width.value,
            height: pixelFloatSize?.height.value
        }
        : {
            position: 'relative',
            [position === PanelPositionValues.Bottom ? 'height' : 'width']: pixelSize.value
        };

    const stretchClass = position === PanelPositionValues.Bottom ? "w-full" : "h-full";

    return (
        <div
            className={`${baseClasses} ${positionClasses[position]} ${stretchClass} ${className}`}
            style={layoutStyle}
        >
            {children}
        </div>
    );
};

export default Panel;