import { ReactNode, useCallback, useState } from "react";
import { AbstractInteractiveBase } from "@/components/base/interactive/AbstractInteractiveBase";
import { DivProps } from "@/components/base/interactive/types";
import tabsPreset, { TabsVariant } from "@/components/base/style/presets/tabs";
import { cn } from "@/lib/utils";

export interface TabItem {
    id: string;
    label: ReactNode;
    content: ReactNode;
    disabled?: boolean;
}

export interface TabsProps
    extends Omit<DivProps<"list" | "tab" | "panel">, "as"> {
    // Content
    tabs: TabItem[];

    // Configuration
    variant?: TabsVariant;
    defaultTab?: string;
    selectedTab?: string;
    onTabChange?: (tabId: string) => void;

    // Style overrides
    className?: string;
    listClassName?: string;
    tabClassName?: string;
    panelClassName?: string;
}

export const Tabs = ({
    // Content
    tabs,

    // Configuration
    variant = "default",
    defaultTab,
    selectedTab: controlledTab,
    onTabChange,

    // Style
    className,
    listClassName,
    tabClassName,
    panelClassName,
    styleProps,

    // Base props
    ...props
}: TabsProps) => {
    // State for uncontrolled usage
    const [selectedTabState, setSelectedTabState] = useState(
        defaultTab || (tabs[0]?.id ?? "")
    );

    // Use controlled value if provided, otherwise use internal state
    const selectedTab = controlledTab ?? selectedTabState;

    const handleTabChange = useCallback(
        (tabId: string) => {
            if (controlledTab === undefined) {
                setSelectedTabState(tabId);
            }
            onTabChange?.(tabId);
        },
        [controlledTab, onTabChange]
    );

    const finalStyleProps = {
        ...styleProps,
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
    };

    // Find active tab content
    const activeTab = tabs.find((tab) => tab.id === selectedTab);

    // Generate tab button props
    const getTabProps = (tab: TabItem) => {
        const isSelected = selectedTab === tab.id;
        const baseProps = {
            role: "tab" as const,
            className: cn("tab", isSelected && "selected"),
            disabled: tab.disabled,
            onClick: () => !tab.disabled && handleTabChange(tab.id),
        };

        // ARIA attributes
        const ariaProps = {
            "aria-selected": isSelected,
            "aria-controls": `panel-${tab.id}`,
            id: `tab-${tab.id}`,
            "aria-disabled": tab.disabled,
        };

        return { ...baseProps, ...ariaProps };
    };

    // Generate panel props
    const getPanelProps = (tab: TabItem) => ({
        role: "tabpanel" as const,
        className: "panel",
        id: `panel-${tab.id}`,
        "aria-labelledby": `tab-${tab.id}`,
    });

    return (
        <AbstractInteractiveBase
            as="div"
            role="tablist"
            stylePreset={tabsPreset}
            styleProps={finalStyleProps}
            {...props}
        >
            {/* Tab List */}
            <div className="list" role="tablist" aria-orientation="horizontal">
                {tabs.map((tab) => (
                    <button key={tab.id} {...getTabProps(tab)}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Active Tab Panel */}
            {activeTab && (
                <div {...getPanelProps(activeTab)}>{activeTab.content}</div>
            )}
        </AbstractInteractiveBase>
    );
};

export default Tabs;
