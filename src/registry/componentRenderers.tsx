import {
    Panel,
    ScrollBox,
    PushButton,
    Input,
    DropdownButton,
    Tabs,
} from "@/components/ui/atoms";
import {
    ButtonIcon,
    InputIcon,
    LabelIcon,
    PanelIcon,
    WidgetIcon,
} from "@/components/ui";
import { IconProps } from "@/lib/icons/types";
import { ComponentInstance } from "@/core/base/ComponentInstance";
import { ComponentRenderer, useComponentRegistry } from "./componentRegistry";
import { useMemo } from "react";
import { ComponentTypeValues } from "@/core";

/**
 * Map component types to icons for visual representation
 */
export const componentIconMap: Record<string, React.FC<IconProps>> = {
    Widget: WidgetIcon,
    Panel: PanelIcon,
    ScrollBox: PanelIcon,
    PushButton: ButtonIcon,
    Input: InputIcon,
    Label: LabelIcon,
};

export const DefaultComponentIcon = PanelIcon;

/**
 * Type-safe property accessor for component instance properties
 * Handles potential undefined values and provides type safety
 */
const componentProperty = {
    /**
     * Gets a string property with a fallback value
     */
    getString: (
        instance: ComponentInstance,
        path: string[],
        fallback: string
    ): string => {
        try {
            let current: any = instance;
            for (const key of path) {
                if (current === undefined || current === null) return fallback;
                current = current[key];
            }
            return typeof current === "string" ? current : fallback;
        } catch (e) {
            return fallback;
        }
    },

    /**
     * Gets a boolean property with a fallback value
     */
    getBoolean: (
        instance: ComponentInstance,
        path: string[],
        fallback: boolean
    ): boolean => {
        try {
            let current: any = instance;
            for (const key of path) {
                if (current === undefined || current === null) return fallback;
                current = current[key];
            }
            return typeof current === "boolean" ? current : fallback;
        } catch (e) {
            return fallback;
        }
    },

    /**
     * Gets a property value safely with generic type
     */
    getValue: function <TValue>(
        instance: ComponentInstance,
        path: string[],
        fallback: TValue
    ): TValue {
        try {
            let current: any = instance;
            for (const key of path) {
                if (current === undefined || current === null) return fallback;
                current = current[key];
            }
            return current !== undefined && current !== null
                ? current
                : fallback;
        } catch (e) {
            return fallback;
        }
    },

    /**
     * Common property paths as constants
     */
    paths: {
        title: ["overrides", "content", "properties", "title", "value"],
        text: ["overrides", "content", "properties", "text", "value"],
        placeholder: [
            "overrides",
            "content",
            "properties",
            "placeholder",
            "value",
        ],
        defaultValue: [
            "overrides",
            "content",
            "properties",
            "defaultValue",
            "value",
        ],
        variant: ["overrides", "style", "variant"],
        showHeader: [
            "overrides",
            "content",
            "properties",
            "showHeader",
            "value",
        ],
        maxHeight: ["overrides", "content", "properties", "maxHeight", "value"],
        action: ["actionBindings", "action"],
        targetWidgetId: ["actionBindings", "targetWidgetId"],
    },
};

/**
 * Panel Renderer
 */
export const PanelRenderer: ComponentRenderer = ({
    instance,
    children,
    widgetId,
    actionHandler: _actionHandler,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Check if this panel has any children
    const hasChildren = Boolean(
        children && (Array.isArray(children) ? children.length > 0 : true)
    );

    // Get properties with fallbacks
    const title = componentProperty.getString(
        instance,
        componentProperty.paths.title,
        instance.label || "Panel"
    );
    const variant = componentProperty.getString(
        instance,
        componentProperty.paths.variant,
        "default"
    );
    const showHeader = componentProperty.getBoolean(
        instance,
        componentProperty.paths.showHeader,
        true
    );
    const placeholder = componentProperty.getString(
        instance,
        componentProperty.paths.placeholder,
        isEditMode ? "Drop components here" : "Empty panel"
    );

    // Default size for empty panels
    const defaultPanelStyle = !hasChildren
        ? {
              minWidth: "200px",
              minHeight: "100px",
          }
        : {};

    // Handle selection with proper event propagation
    const handleSelect = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (onSelect && e.currentTarget === e.target) {
            e.stopPropagation();
            onSelect(instance.id);
        }
    };

    return (
        <Panel
            header={showHeader ? title : undefined}
            variant={variant}
            data-component-id={instance.id}
            data-component-type="Panel"
            data-widget-id={widgetId}
            data-has-children={hasChildren ? "true" : "false"}
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
            style={defaultPanelStyle}
            className={`panel-component w-full ${
                isSelected ? "selected-component" : ""
            }`}
            onClick={handleSelect}
        >
            <div className={hasChildren ? "p-0" : "p-4"}>
                {hasChildren ? (
                    <div className="panel-children-container w-full">
                        {Array.isArray(children)
                            ? children.map((child, index) => (
                                  <div
                                      key={index}
                                      className="panel-child-wrapper w-full mb-2"
                                  >
                                      {child}
                                  </div>
                              ))
                            : children}
                    </div>
                ) : (
                    <div className="text-center text-font-dark-muted text-sm">
                        {placeholder}
                    </div>
                )}
            </div>
        </Panel>
    );
};

/**
 * ScrollBox Renderer
 */
export const ScrollBoxRenderer: ComponentRenderer = ({
    instance,
    children,
    widgetId,
    actionHandler: _actionHandler,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Check if this scrollbox has any children
    const hasChildren = Boolean(
        children && (Array.isArray(children) ? children.length > 0 : true)
    );

    // Get properties with fallbacks
    const variant = componentProperty.getString(
        instance,
        componentProperty.paths.variant,
        "default"
    );
    const maxHeight = componentProperty.getString(
        instance,
        componentProperty.paths.maxHeight,
        "300px"
    );
    const placeholder = componentProperty.getString(
        instance,
        componentProperty.paths.placeholder,
        isEditMode ? "Drop scrollable content here" : "Scrollable content area"
    );

    // Default scrollbox size
    const defaultStyle = !hasChildren
        ? {
              minWidth: "200px",
              minHeight: "100px",
              maxHeight,
          }
        : {
              maxHeight,
          };

    // Handle selection with proper event propagation
    const handleSelect = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (onSelect && e.currentTarget === e.target) {
            e.stopPropagation();
            onSelect(instance.id);
        }
    };

    return (
        <ScrollBox
            variant={variant}
            maxHeight={maxHeight}
            data-component-id={instance.id}
            data-component-type="ScrollBox"
            data-widget-id={widgetId}
            data-has-children={hasChildren ? "true" : "false"}
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
            style={defaultStyle}
            className={`scrollbox-component relative ${
                isSelected ? "selected-component" : ""
            }`}
            onClick={handleSelect}
        >
            {hasChildren ? (
                <div className="scrollbox-children-container">
                    {Array.isArray(children)
                        ? children.map((child, index) => (
                              <div
                                  key={index}
                                  className="scrollbox-child-wrapper w-full mb-2"
                              >
                                  {child}
                              </div>
                          ))
                        : children}
                </div>
            ) : (
                <div className="text-center text-font-dark-muted text-sm p-4">
                    {placeholder}
                </div>
            )}
        </ScrollBox>
    );
};

/**
 * PushButton Renderer
 */
export const PushButtonRenderer: ComponentRenderer = ({
    instance,
    actionHandler,
    widgetId: _widgetId,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get button properties with fallbacks
    const text = componentProperty.getString(
        instance,
        componentProperty.paths.text,
        instance.label || "Button"
    );
    const variant = componentProperty.getString(
        instance,
        componentProperty.paths.variant,
        "default"
    );

    // Handle button click, including potential action
    const handleClick = (e: React.MouseEvent<Element, MouseEvent>) => {
        e.stopPropagation(); // Prevent event bubbling

        // Handle selection in edit mode
        if (isEditMode && onSelect) {
            onSelect(instance.id);
            return;
        }

        // Handle button click actions if handler and action binding provided
        if (actionHandler) {
            const targetAction = componentProperty.getString(
                instance,
                componentProperty.paths.action,
                ""
            );
            const targetId = componentProperty.getString(
                instance,
                componentProperty.paths.targetWidgetId,
                ""
            );

            if (targetAction && targetId) {
                actionHandler(targetAction, targetId as any);
            }
        }
    };

    return (
        <PushButton
            variant={variant}
            onClick={handleClick}
            data-component-id={instance.id}
            data-component-type="PushButton"
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
            className={isSelected ? "selected-component" : ""}
        >
            {text}
        </PushButton>
    );
};

/**
 * Input Renderer
 */
export const InputRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get input properties with fallbacks
    const placeholder = componentProperty.getString(
        instance,
        componentProperty.paths.placeholder,
        "Enter text..."
    );
    const defaultValue = componentProperty.getString(
        instance,
        componentProperty.paths.defaultValue,
        ""
    );
    const variant = componentProperty.getString(
        instance,
        componentProperty.paths.variant,
        "default"
    );

    // Handle selection with proper event propagation
    const handleSelect = (e: React.MouseEvent<Element, MouseEvent>) => {
        e.stopPropagation();
        if (isEditMode && onSelect) {
            onSelect(instance.id);
        }
    };

    return (
        <div
            onClick={handleSelect}
            className={`input-wrapper ${
                isSelected ? "selected-component" : ""
            }`}
        >
            <Input
                variant={variant}
                placeholder={placeholder}
                defaultValue={defaultValue}
                readOnly={isEditMode}
                data-component-id={instance.id}
                data-component-type="Input"
                data-edit-mode={isEditMode ? "true" : "false"}
                data-selected={isSelected ? "true" : "false"}
                data-instance-id={instance.id}
            />
        </div>
    );
};

/**
 * DropdownButton component renderer
 */
export const DropdownButtonRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get dropdown properties with fallbacks
    const label = componentProperty.getString(
        instance,
        componentProperty.paths.text,
        instance.label || "Dropdown"
    );
    const variant = componentProperty.getString(
        instance,
        componentProperty.paths.variant,
        "default"
    );

    // Safe options handling with fallback
    const defaultOptions = [
        { label: "Option 1", value: "1" },
        { label: "Option 2", value: "2" },
    ];

    // Use a new path for options since it's a complex property
    const optionsPath = [
        "overrides",
        "content",
        "properties",
        "options",
        "value",
    ];
    const options = componentProperty.getValue(
        instance,
        optionsPath,
        defaultOptions
    );

    // Handle selection with proper event typing
    const handleSelect = (e: React.MouseEvent<Element, MouseEvent>) => {
        e.stopPropagation();
        if (isEditMode && onSelect) {
            onSelect(instance.id);
        }
    };

    return (
        <div
            onClick={handleSelect}
            className={`dropdown-wrapper ${
                isSelected ? "selected-component" : ""
            }`}
            data-component-id={instance.id}
            data-component-type="DropdownButton"
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
        >
            <DropdownButton
                variant={variant}
                label={label}
                options={options}
                disabled={isEditMode} // Disable interaction in edit mode
                data-instance-id={instance.id}
            />
        </div>
    );
};

/**
 * Tabs component renderer
 */
export const TabsRenderer: ComponentRenderer = ({
    instance,
    children,
    widgetId: _widgetId,
    actionHandler: _actionHandler,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get tabs properties with fallbacks
    const variant = componentProperty.getString(
        instance,
        componentProperty.paths.variant,
        "default"
    );

    // Default tabs configuration
    const defaultTabs = [
        { id: "tab1", label: "Tab 1", content: "Tab 1 content" },
        { id: "tab2", label: "Tab 2", content: "Tab 2 content" },
    ];

    // Use a new path for tabs configuration
    const tabsPath = ["overrides", "content", "properties", "tabs", "value"];
    const tabs = componentProperty.getValue(instance, tabsPath, defaultTabs);

    // Check if this tabs component has any children
    const hasChildren = Boolean(
        children && (Array.isArray(children) ? children.length > 0 : true)
    );

    // Handle tab selection with proper event typing
    const handleSelect = (e: React.MouseEvent<Element, MouseEvent>) => {
        e.stopPropagation();
        if (isEditMode && onSelect) {
            onSelect(instance.id);
        }
    };

    // Map children to tabs if needed
    // Create a stable reference to the tab content
    const tabContent = useMemo(() => {
        // If no children, use the default content from the tabs configuration
        if (!hasChildren) {
            return undefined;
        }

        // If children exist, we need to map them to tabs
        // This implementation depends on your Tabs component API
        if (Array.isArray(children)) {
            // Option 1: Distribute children across available tabs
            // Map each child to a tab based on index (cycling if needed)
            const tabsWithChildren = tabs.map((tab, index) => ({
                ...tab,
                content: children[index % children.length] || tab.content,
            }));
            return tabsWithChildren;
        }

        // If there's just a single child, put it in the first tab
        if (tabs.length > 0) {
            const tabsWithChild = [...tabs];
            tabsWithChild[0] = {
                ...tabsWithChild[0],
                content: children,
            };
            return tabsWithChild;
        }

        return undefined;
    }, [tabs, children, hasChildren]);

    return (
        <div
            onClick={handleSelect}
            className={`tabs-wrapper ${isSelected ? "selected-component" : ""}`}
            data-component-id={instance.id}
            data-component-type="Tabs"
            data-has-children={hasChildren ? "true" : "false"}
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
        >
            <Tabs
                variant={variant}
                tabs={tabContent || tabs}
                disabled={isEditMode} // Disable tab switching in edit mode
                data-instance-id={instance.id}
            >
                {/* Only render children here if your Tabs component expects children outside of the tabs prop */}
                {hasChildren && !tabContent && children}
            </Tabs>
        </div>
    );
};

/**
 * Label Renderer
 */
export const LabelRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get label properties with fallbacks
    const text = componentProperty.getString(
        instance,
        componentProperty.paths.text,
        instance.label || "Label Text"
    );
    const className = componentProperty.getString(
        instance,
        ["overrides", "style", "className"],
        ""
    );

    // Handle selection with proper event propagation
    const handleSelect = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isEditMode && onSelect) {
            onSelect(instance.id);
        }
    };

    return (
        <div
            className={`label-component ${className} ${
                isSelected ? "selected-component" : ""
            }`}
            data-component-id={instance.id}
            data-component-type="Label"
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
            onClick={handleSelect}
        >
            {text}
        </div>
    );
};

/**
 * Register all component renderers in the registry
 */
export function registerComponentRenderers() {
    const registry = useComponentRegistry.getState();

    // Register all component renderers
    registry.registerRenderer(ComponentTypeValues.Panel, PanelRenderer);
    registry.registerRenderer(ComponentTypeValues.ScrollBox, ScrollBoxRenderer);
    registry.registerRenderer(
        ComponentTypeValues.PushButton,
        PushButtonRenderer
    );
    registry.registerRenderer(ComponentTypeValues.Input, InputRenderer);
    registry.registerRenderer(ComponentTypeValues.Label, LabelRenderer);

    // More renderers can be registered here...

    const renderers = Object.entries(registry.renderers).map(
        ([type, renderer]) => ({
            type,
            hasRenderer: !!renderer,
        })
    );

    console.log("Registered component renderers:", renderers);
}
