import {
    Panel,
    ScrollBox,
    PushButton,
    Input,
    DropdownButton,
    Tabs,
    Drawer,
    Modal,
    DropdownPanel,
    TreeView,
    ListView,
    DropdownSelect,
} from "@/components/ui/atoms";
import {
    ButtonIcon,
    IconButton,
    InputIcon,
    LabelIcon,
    PanelIcon,
    WidgetIcon,
    DrawerIcon,
    DropdownIcon,
    TreeViewIcon,
    ListViewIcon,
    TabsIcon,
    ModalIcon,
    CompPanelIcon,
    CompScrollBoxIcon,
    CompPushButtonIcon,
    CompDrawerIcon,
    CompModalIcon,
    CompMenuDropdownIcon,
    CompTabsIcon,
    CompTreeViewIcon,
    CompListViewIcon,
    CompIconButtonIcon,
    CompDropdownPanelIcon,
    CompSelectDropdownIcon,
    CompLabelIcon,
    CompInputIcon,
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
    Panel: CompPanelIcon,
    ScrollBox: CompScrollBoxIcon,
    PushButton: CompPushButtonIcon,
    IconButton: CompIconButtonIcon,
    Input: CompInputIcon,
    Label: CompLabelIcon,
    Drawer: CompDrawerIcon,
    Modal: CompModalIcon,
    DropdownButton: CompMenuDropdownIcon,
    DropdownSelect: CompSelectDropdownIcon,
    DropdownPanel: CompDropdownPanelIcon,
    Tabs: CompTabsIcon,
    TreeView: CompTreeViewIcon,
    ListView: CompListViewIcon,
};

export const DefaultComponentIcon = PanelIcon;

/**
 * Map component types to layout hierarchy icons for visual representation
 */
export const layoutComponentIconMap: Record<string, React.FC<IconProps>> = {
    Widget: WidgetIcon,
    Panel: PanelIcon,
    ScrollBox: PanelIcon,
    PushButton: ButtonIcon,
    IconButton: ButtonIcon,
    Input: InputIcon,
    Label: LabelIcon,
    Drawer: DrawerIcon,
    Modal: ModalIcon,
    DropdownButton: DropdownIcon,
    DropdownSelect: DropdownIcon,
    DropdownPanel: DropdownIcon,
    Tabs: TabsIcon,
    TreeView: TreeViewIcon,
    ListView: ListViewIcon,
};

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
        icon: ["overrides", "content", "properties", "icon", "value"],
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
        width: ["overrides", "content", "properties", "width", "value"],
        height: ["overrides", "content", "properties", "height", "value"],
        open: ["overrides", "content", "properties", "open", "value"],
        closeOnOverlayClick: [
            "overrides",
            "content",
            "properties",
            "closeOnOverlayClick",
            "value",
        ],
        closeOnBackdropClick: [
            "overrides",
            "content",
            "properties",
            "closeOnBackdropClick",
            "value",
        ],
        closeOnEscape: [
            "overrides",
            "content",
            "properties",
            "closeOnEscape",
            "value",
        ],
        showOverlay: [
            "overrides",
            "content",
            "properties",
            "showOverlay",
            "value",
        ],
        showBackdrop: [
            "overrides",
            "content",
            "properties",
            "showBackdrop",
            "value",
        ],
        footer: ["overrides", "content", "properties", "footer", "value"],
        options: ["overrides", "content", "properties", "options", "value"],
        searchable: [
            "overrides",
            "content",
            "properties",
            "searchable",
            "value",
        ],
        contentLayout: [
            "overrides",
            "content",
            "properties",
            "contentLayout",
            "value",
        ],
        items: ["overrides", "content", "properties", "items", "value"],
        multiSelect: [
            "overrides",
            "content",
            "properties",
            "multiSelect",
            "value",
        ],
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
            className={`scrollbox-component w-full relative ${
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
 * Drawer Renderer
 */
export const DrawerRenderer: ComponentRenderer = ({
    instance,
    children,
    widgetId,
    actionHandler: _actionHandler,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get properties with fallbacks
    const open = componentProperty.getBoolean(
        instance,
        componentProperty.paths.open,
        false
    );
    const variant = componentProperty.getString(
        instance,
        componentProperty.paths.variant,
        "left"
    );
    const width = componentProperty.getString(
        instance,
        componentProperty.paths.width,
        "320px"
    );
    const height = componentProperty.getString(
        instance,
        componentProperty.paths.height,
        "320px"
    );
    const closeOnOverlayClick = componentProperty.getBoolean(
        instance,
        componentProperty.paths.closeOnOverlayClick,
        true
    );
    const closeOnEscape = componentProperty.getBoolean(
        instance,
        componentProperty.paths.closeOnEscape,
        true
    );
    const showOverlay = componentProperty.getBoolean(
        instance,
        componentProperty.paths.showOverlay,
        true
    );

    // Check if this drawer has any children
    const hasChildren = Boolean(
        children && (Array.isArray(children) ? children.length > 0 : true)
    );

    // Handle selection with proper event propagation
    const handleSelect = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (onSelect && e.currentTarget === e.target) {
            e.stopPropagation();
            onSelect(instance.id);
        }
    };

    return (
        <Drawer
            open={isEditMode ? true : open}
            onClose={() => {}} // No-op in edit mode
            variant={variant as any}
            width={width}
            height={height}
            closeOnOverlayClick={closeOnOverlayClick}
            closeOnEscape={closeOnEscape}
            showOverlay={showOverlay}
            data-component-id={instance.id}
            data-component-type="Drawer"
            data-widget-id={widgetId}
            data-has-children={hasChildren ? "true" : "false"}
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
            className={`drawer-component ${
                isSelected ? "selected-component" : ""
            }`}
            onClick={handleSelect}
        >
            {hasChildren ? (
                <div className="drawer-children-container p-4">
                    {Array.isArray(children)
                        ? children.map((child, index) => (
                              <div
                                  key={index}
                                  className="drawer-child-wrapper w-full mb-2"
                              >
                                  {child}
                              </div>
                          ))
                        : children}
                </div>
            ) : (
                <div className="text-center text-font-dark-muted text-sm p-4">
                    {isEditMode ? "Drop components here" : "Empty drawer"}
                </div>
            )}
        </Drawer>
    );
};

/**
 * Modal Renderer
 */
export const ModalRenderer: ComponentRenderer = ({
    instance,
    children,
    widgetId,
    actionHandler: _actionHandler,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get properties with fallbacks
    const open = componentProperty.getBoolean(
        instance,
        componentProperty.paths.open,
        false
    );
    const title = componentProperty.getString(
        instance,
        componentProperty.paths.title,
        instance.label || "Modal"
    );
    const variant = componentProperty.getString(
        instance,
        componentProperty.paths.variant,
        "default"
    );
    const width = componentProperty.getString(
        instance,
        componentProperty.paths.width,
        "500px"
    );
    const maxHeight = componentProperty.getString(
        instance,
        componentProperty.paths.maxHeight,
        "85vh"
    );
    const closeOnBackdropClick = componentProperty.getBoolean(
        instance,
        componentProperty.paths.closeOnBackdropClick,
        true
    );
    const closeOnEscape = componentProperty.getBoolean(
        instance,
        componentProperty.paths.closeOnEscape,
        true
    );
    const showBackdrop = componentProperty.getBoolean(
        instance,
        componentProperty.paths.showBackdrop,
        true
    );
    const footer = componentProperty.getString(
        instance,
        componentProperty.paths.footer,
        ""
    );

    // Check if this modal has any children
    const hasChildren = Boolean(
        children && (Array.isArray(children) ? children.length > 0 : true)
    );

    // Handle selection with proper event propagation
    const handleSelect = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (onSelect && e.currentTarget === e.target) {
            e.stopPropagation();
            onSelect(instance.id);
        }
    };

    return (
        <Modal
            open={isEditMode ? true : open}
            onClose={() => {}} // No-op in edit mode
            title={title}
            footer={footer || undefined}
            variant={variant as any}
            width={width}
            maxHeight={maxHeight}
            closeOnBackdropClick={closeOnBackdropClick}
            closeOnEscape={closeOnEscape}
            showBackdrop={showBackdrop}
            data-component-id={instance.id}
            data-component-type="Modal"
            data-widget-id={widgetId}
            data-has-children={hasChildren ? "true" : "false"}
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
            className={`modal-component ${
                isSelected ? "selected-component" : ""
            }`}
            onClick={handleSelect}
        >
            {hasChildren ? (
                <div className="modal-children-container">
                    {Array.isArray(children)
                        ? children.map((child, index) => (
                              <div
                                  key={index}
                                  className="modal-child-wrapper w-full mb-2"
                              >
                                  {child}
                              </div>
                          ))
                        : children}
                </div>
            ) : (
                <div className="text-center text-font-dark-muted text-sm">
                    {isEditMode
                        ? "Drop components here"
                        : "Empty modal content"}
                </div>
            )}
        </Modal>
    );
};

/**
 * DropdownPanel Renderer
 */
export const DropdownPanelRenderer: ComponentRenderer = ({
    instance,
    children,
    widgetId,
    actionHandler: _actionHandler,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get properties with fallbacks
    const title = componentProperty.getString(
        instance,
        componentProperty.paths.title,
        instance.label || "Dropdown Panel"
    );
    const variant = componentProperty.getString(
        instance,
        componentProperty.paths.variant,
        "default"
    );
    const searchable = componentProperty.getBoolean(
        instance,
        componentProperty.paths.searchable,
        false
    );
    const contentLayout = componentProperty.getString(
        instance,
        componentProperty.paths.contentLayout,
        "list"
    );
    const maxHeight = componentProperty.getString(
        instance,
        componentProperty.paths.maxHeight,
        "300px"
    );

    // Check if this panel has any children
    const hasChildren = Boolean(
        children && (Array.isArray(children) ? children.length > 0 : true)
    );

    // Handle selection with proper event propagation
    const handleSelect = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (onSelect && e.currentTarget === e.target) {
            e.stopPropagation();
            onSelect(instance.id);
        }
    };

    return (
        <DropdownPanel
            title={title}
            defaultOpen={isEditMode}
            variant={variant as any}
            searchable={searchable}
            contentLayout={contentLayout as any}
            maxHeight={maxHeight}
            data-component-id={instance.id}
            data-component-type="DropdownPanel"
            data-widget-id={widgetId}
            data-has-children={hasChildren ? "true" : "false"}
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
            className={`dropdown-panel-component ${
                isSelected ? "selected-component" : ""
            }`}
            onClick={handleSelect}
        >
            {hasChildren ? (
                Array.isArray(children) ? (
                    children.map((child, index) => (
                        <div
                            key={index}
                            className="dropdown-panel-child-wrapper"
                        >
                            {child}
                        </div>
                    ))
                ) : (
                    children
                )
            ) : (
                <div className="text-center text-font-dark-muted text-sm">
                    {isEditMode
                        ? "Drop components here"
                        : "Empty dropdown panel"}
                </div>
            )}
        </DropdownPanel>
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
 * IconButton Renderer
 */
export const IconButtonRenderer: ComponentRenderer = ({
    instance,
    actionHandler,
    widgetId: _widgetId,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get button properties with fallbacks
    const icon = componentProperty.getString(
        instance,
        componentProperty.paths.icon,
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
        <IconButton
            icon={icon}
            variant={variant}
            onClick={handleClick}
            data-component-id={instance.id}
            data-component-type="IconButton"
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
            className={isSelected ? "selected-component" : ""}
        />
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
        {
            id: "tab1",
            label: "Tab 1",
            content: "Tab 1 content",
            disabled: false,
        },
        {
            id: "tab2",
            label: "Tab 2",
            content: "Tab 2 content",
            disabled: false,
        },
    ];

    // Use a new path for tabs configuration
    const tabsPath = ["overrides", "content", "properties", "tabs", "value"];
    const tabsConfig = componentProperty.getValue(
        instance,
        tabsPath,
        defaultTabs
    );

    // Ensure tabs have the correct shape, handling ReactNode content
    const tabs = useMemo(() => {
        return tabsConfig.map((tab) => ({
            id: String(tab.id),
            label: tab.label,
            content: tab.content,
            disabled: Boolean(tab.disabled),
        }));
    }, [tabsConfig]);

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

    // Determine if the entire tabs component should be disabled
    const isDisabled = componentProperty.getBoolean(
        instance,
        ["overrides", "content", "properties", "disabled", "value"],
        false
    );

    // Map children to tabs if needed
    // Create a stable reference to the tab content
    const tabContent = useMemo(() => {
        // If component is disabled, ensure all tabs are disabled
        if (isDisabled) {
            return tabs.map((tab) => ({
                ...tab,
                disabled: true,
            }));
        }

        // If no children, use the default content from the tabs configuration
        if (!hasChildren) {
            return tabs;
        }

        // If children exist, we need to map them to tabs
        const childrenArray = Array.isArray(children) ? children : [children];

        // Distribute children across available tabs
        return tabs.map((tab, index) => ({
            ...tab,
            content:
                index < childrenArray.length
                    ? childrenArray[index]
                    : tab.content,
        }));
    }, [tabs, children, hasChildren, isDisabled]);

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
                disabled={isEditMode || isDisabled} // Disable tab interaction in edit mode or if explicitly disabled
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
 * TreeView Renderer
 */
export const TreeViewRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get properties with fallbacks
    const items = componentProperty.getValue(
        instance,
        componentProperty.paths.items,
        []
    );
    const multiSelect = componentProperty.getBoolean(
        instance,
        componentProperty.paths.multiSelect,
        false
    );
    const maxHeight = componentProperty.getString(
        instance,
        componentProperty.paths.maxHeight,
        "300px"
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
            className={`treeview-wrapper ${
                isSelected ? "selected-component" : ""
            }`}
            data-component-id={instance.id}
            data-component-type="TreeView"
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
        >
            <TreeView
                items={items}
                multiSelect={multiSelect}
                maxHeight={maxHeight}
                // disabled={isEditMode}
            />
        </div>
    );
};

/**
 * ListView Renderer
 */
export const ListViewRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get properties with fallbacks
    const items = componentProperty.getValue(
        instance,
        componentProperty.paths.items,
        []
    );
    const multiSelect = componentProperty.getBoolean(
        instance,
        componentProperty.paths.multiSelect,
        false
    );
    const maxHeight = componentProperty.getString(
        instance,
        componentProperty.paths.maxHeight,
        "300px"
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
            className={`listview-wrapper ${
                isSelected ? "selected-component" : ""
            }`}
            data-component-id={instance.id}
            data-component-type="ListView"
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
        >
            <ListView
                items={items}
                multiSelect={multiSelect}
                maxHeight={maxHeight}
                // renderItem={(item) => item.label || item.id}
            />
        </div>
    );
};

/**
 * DropdownSelect Renderer
 */
export const DropdownSelectRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Get dropdown properties with fallbacks
    const label = componentProperty.getString(
        instance,
        componentProperty.paths.text,
        instance.label || "Select"
    );
    const placeholder = componentProperty.getString(
        instance,
        componentProperty.paths.placeholder,
        "Select an option"
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

    // Use a specific path for options since it's a complex property
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

    // Get multiple selection property
    const multiple = componentProperty.getBoolean(
        instance,
        componentProperty.paths.multiSelect,
        false
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
            className={`dropdown-select-wrapper ${
                isSelected ? "selected-component" : ""
            }`}
            data-component-id={instance.id}
            data-component-type="DropdownSelect"
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
        >
            <DropdownSelect
                variant={variant as any}
                label={label}
                placeholder={placeholder}
                options={options}
                multiple={multiple}
                disabled={isEditMode} // Disable interaction in edit mode
            />
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
    registry.registerRenderer(
        ComponentTypeValues.IconButton,
        IconButtonRenderer
    );
    registry.registerRenderer(ComponentTypeValues.Input, InputRenderer);
    registry.registerRenderer(ComponentTypeValues.Label, LabelRenderer);
    registry.registerRenderer(ComponentTypeValues.Drawer, DrawerRenderer);
    registry.registerRenderer(ComponentTypeValues.Modal, ModalRenderer);
    registry.registerRenderer(
        ComponentTypeValues.DropdownPanel,
        DropdownPanelRenderer
    );
    registry.registerRenderer(ComponentTypeValues.Tabs, TabsRenderer);
    registry.registerRenderer(
        ComponentTypeValues.DropdownButton,
        DropdownButtonRenderer
    );
    registry.registerRenderer(
        ComponentTypeValues.DropdownSelect,
        DropdownSelectRenderer
    );
    registry.registerRenderer(ComponentTypeValues.TreeView, TreeViewRenderer);
    registry.registerRenderer(ComponentTypeValues.ListView, ListViewRenderer);

    // More renderers can be registered here...

    const renderers = Object.entries(registry.renderers).map(
        ([type, renderer]) => ({
            type,
            hasRenderer: !!renderer,
        })
    );

    console.log("Registered component renderers:", renderers);
}
