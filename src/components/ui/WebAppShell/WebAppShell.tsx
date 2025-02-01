import React from 'react';
import { usePanelConfig } from '../../../store/uiStore';
import { Panel } from '../Panel';

/**
 * Main application shell that manages the layout and positioning of panels
 * @component
 */
const WebAppShell: React.FC = () => {
    const componentPaletteConfig = usePanelConfig('COMPONENT_PALETTE');
    const propertyEditorConfig = usePanelConfig('PROPERTY_EDITOR');
    const layoutHierarchyConfig = usePanelConfig('LAYOUT_HIERARCHY');

    return (
        <div className="w-full h-screen bg-zinc-700 flex flex-col">
            <div className="flex-1 flex">
                {/* Left Panel Group */}
                <div className="flex flex-col">
                    <Panel {...componentPaletteConfig}>
                        Component Palette
                    </Panel>
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1">
                    Canvas Area
                </div>

                {/* Right Panel Group */}
                <div className="flex flex-col">
                    <Panel {...propertyEditorConfig}>
                        Property Editor
                    </Panel>
                </div>
            </div>

            {/* Bottom Panel */}
            {layoutHierarchyConfig.isVisible && (
                <Panel {...layoutHierarchyConfig}>
                    Layout Hierarchy
                </Panel>
            )}
        </div>
    );
};

export default WebAppShell;