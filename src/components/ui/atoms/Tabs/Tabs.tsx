import { AriaAttributes, ReactNode, useCallback, useState } from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    DivProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import tabsPreset, { TabsVariant } from "@/components/base/style/presets/tabs";
import { cn } from "@/lib/utils";

// Types
export interface TabItem {
    id: string;
    label: ReactNode;
    content: ReactNode;
    disabled?: boolean;
}

interface TabProps {
    // Content
    children: ReactNode;

    // Core props
    id: string;
    panelId: string;
    selected: boolean;
    disabled?: boolean;

    // Style
    variant?: TabsVariant;
    className?: string;

    // Handlers
    onClick: () => void;
}

export interface TabsProps
    extends Omit<DivProps<"list" | "tab" | "panel">, "as"> {
    // Content
    tabs: TabItem[];

    // Configuration
    variant?: TabsVariant;
    defaultTab?: string;
    selectedTab?: string;
    disabled?: boolean;
    onTabChange?: (tabId: string) => void;

    // Style overrides
    className?: string;
    listClassName?: string;
    tabClassName?: string;
    panelClassName?: string;
}

// Individual Tab Component
const Tab = ({
    // Content
    children,

    // Core props
    id,
    panelId,
    selected,
    disabled,

    // Style
    variant = "default",
    className,

    // Handlers
    onClick,
}: TabProps) => {
    // Render function for the tab
    const renderTab = ({
        elementProps,
        state,
        computedStyle,
    }: RenderElementProps) => {
        const ariaAttributes: AriaAttributes & { role?: string } = {
            role: "tab",
            "aria-selected": state.isSelected,
            "aria-disabled": state.isDisabled,
            "aria-controls": panelId,
        };

        return (
            <button
                {...elementProps}
                id={id}
                type="button"
                className={cn(computedStyle.tab, className)}
                onClick={onClick}
                disabled={state.isDisabled}
                {...ariaAttributes}
            >
                {children}
            </button>
        );
    };

    return (
        <BaseInteractor
            as="button"
            stylePreset={tabsPreset}
            styleProps={{
                variant,
                elements: {
                    root: {
                        base: className,
                    },
                },
            }}
            state={{
                isSelected: selected,
                isDisabled: disabled,
                isHovered: false,
                isPressed: false,
                isActive: false,
                isVisible: true,
                isEditable: false,
                isEditing: false,
            }}
            renderElement={renderTab}
        />
    );
};

// Tab Panel Component
interface TabPanelProps {
    // Content
    children: ReactNode;

    // Core props
    id: string;
    tabId: string;
    selected: boolean;

    // Style
    className?: string;
}

const TabPanel = ({
    children,
    id,
    tabId,
    selected,
    className,
}: TabPanelProps) => {
    if (!selected) return null;

    return (
        <div
            id={id}
            role="tabpanel"
            aria-labelledby={tabId}
            className={className}
            tabIndex={0}
        >
            {children}
        </div>
    );
};

// Main Tabs Component
export const Tabs = ({
    // Content
    tabs,

    // Configuration
    variant = "default",
    defaultTab,
    selectedTab: controlledTab,
    disabled: isDisabled,
    onTabChange,

    // Style
    className,
    listClassName,
    tabClassName,
    panelClassName,
    styleProps,

    ...props
}: TabsProps) => {
    // State for uncontrolled usage
    const [selectedTabState, setSelectedTabState] = useState(
        defaultTab || (tabs.length > 0 ? tabs[0].id : "")
    );

    // Use controlled value if provided, otherwise use internal state
    const selectedTab = controlledTab ?? selectedTabState;

    const handleTabChange = useCallback(
        (tabId: string) => {
            if (isDisabled) return; // Don't change tabs if disabled

            if (controlledTab === undefined) {
                setSelectedTabState(tabId);
            }
            onTabChange?.(tabId);
        },
        [controlledTab, onTabChange, isDisabled]
    );

    // Render function for the tab container
    const renderTabs = ({
        elementProps,
        state: _state,
        computedStyle,
    }: RenderElementProps) => {
        // Get container ID for ARIA
        const componentId =
            (elementProps as any)?.["data-component-id"] || "tabs";

        const ariaAttributes: AriaAttributes & { role?: string } = {
            role: "tablist",
            "aria-orientation": "horizontal",
            "aria-disabled": isDisabled ? "true" : "false",
        };

        return (
            <div
                {...elementProps}
                id={componentId}
                className={computedStyle.root}
                data-disabled={isDisabled ? "true" : "false"}
            >
                {/* Tab List */}
                <div
                    className={cn(computedStyle.list, listClassName)}
                    {...ariaAttributes}
                >
                    {tabs.map((tab) => {
                        const isSelected = selectedTab === tab.id;
                        const tabId = `${componentId}-tab-${tab.id}`;
                        const panelId = `${componentId}-panel-${tab.id}`;
                        const tabDisabled = isDisabled || tab.disabled;

                        return (
                            <Tab
                                key={tab.id}
                                id={tabId}
                                panelId={panelId}
                                selected={isSelected}
                                disabled={tabDisabled}
                                onClick={() =>
                                    !tabDisabled && handleTabChange(tab.id)
                                }
                                variant={variant}
                                className={tabClassName}
                            >
                                {tab.label}
                            </Tab>
                        );
                    })}
                </div>

                {/* Tab Panels */}
                {tabs.map((tab) => {
                    const isSelected = selectedTab === tab.id;
                    const tabId = `${componentId}-tab-${tab.id}`;
                    const panelId = `${componentId}-panel-${tab.id}`;

                    return (
                        <TabPanel
                            key={tab.id}
                            id={panelId}
                            tabId={tabId}
                            selected={isSelected}
                            className={cn(computedStyle.panel, panelClassName)}
                        >
                            {tab.content}
                        </TabPanel>
                    );
                })}
            </div>
        );
    };

    return (
        <BaseInteractor
            as="div"
            stylePreset={tabsPreset}
            styleProps={{
                variant,
                elements: {
                    root: {
                        base: className,
                    },
                    list: {
                        base: listClassName,
                    },
                    tab: {
                        base: tabClassName,
                    },
                    panel: {
                        base: panelClassName,
                    },
                },
            }}
            renderElement={renderTabs}
            {...props}
        />
    );
};

export default Tabs;
