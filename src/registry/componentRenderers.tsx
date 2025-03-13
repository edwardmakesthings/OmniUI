import {
    Panel,
    ScrollBox,
    PushButton,
    Input,
    DropdownButton,
    Tabs,
} from "@/components/ui/atoms";
import { ComponentTypeValues } from "@/core/types/ComponentTypes";
import {
    ComponentRenderer,
    ComponentRenderProps,
    useComponentRegistry,
} from "./componentRegistry";
import {
    ButtonIcon,
    InputIcon,
    LabelIcon,
    PanelIcon,
    WidgetIcon,
} from "@/components/ui";
import { IconProps } from "@/lib/icons/types";

// Map component types to icons
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
 * Panel component renderer
 * Renders a Panel component with proper children handling
 */
export const PanelRenderer: ComponentRenderer = ({
    instance,
    children,
    widgetId,
    actionHandler,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Check if this panel has any children
    const hasChildren = Array.isArray(children) && children.length > 0;

    // Default panel size for empty panels
    const defaultPanelStyle = !hasChildren
        ? {
              minWidth: "200px",
              minHeight: "100px",
          }
        : {};

    return (
        <Panel
            header={
                instance.overrides?.content?.properties?.title?.value ||
                instance.label ||
                "Panel"
            }
            variant={instance.overrides?.style?.variant || "default"}
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
            onClick={(e) => {
                if (onSelect && e.currentTarget === e.target) {
                    e.stopPropagation();
                    onSelect(instance.id);
                }
            }}
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
                        {instance.overrides?.content?.properties?.placeholder
                            ?.value ||
                            (isEditMode
                                ? "Drop components here"
                                : "Empty panel")}
                    </div>
                )}
            </div>
        </Panel>
    );
};

/**
 * ScrollBox component renderer
 * Renders a ScrollBox component with proper children handling
 */
export const ScrollBoxRenderer: ComponentRenderer = ({
    instance,
    children,
    widgetId,
    actionHandler,
    isEditMode,
    isSelected,
    onSelect,
}) => {
    // Check if this scrollbox has any children
    const hasChildren = Array.isArray(children) && children.length > 0;

    // Default scrollbox size
    const defaultStyle = !hasChildren
        ? {
              minWidth: "200px",
              minHeight: "100px",
              maxHeight:
                  instance.overrides?.content?.properties?.maxHeight?.value ||
                  "300px",
          }
        : {
              maxHeight:
                  instance.overrides?.content?.properties?.maxHeight?.value ||
                  "300px",
          };

    return (
        <ScrollBox
            variant={instance.overrides?.style?.variant || "default"}
            maxHeight={
                instance.overrides?.content?.properties?.maxHeight?.value ||
                "300px"
            }
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
            onClick={(e) => {
                if (onSelect && e.currentTarget === e.target) {
                    e.stopPropagation();
                    onSelect(instance.id);
                }
            }}
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
                    {instance.overrides?.content?.properties?.placeholder
                        ?.value ||
                        (isEditMode
                            ? "Drop scrollable content here"
                            : "Scrollable content area")}
                </div>
            )}
        </ScrollBox>
    );
};

/**
 * PushButton component renderer
 */
export const PushButtonRenderer: ComponentRenderer = ({
    instance,
    actionHandler,
    widgetId,
    isEditMode,
    isSelected,
    onSelect,
}) => (
    <PushButton
        variant={instance.overrides?.style?.variant || "default"}
        onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling

            // Handle selection
            if (isEditMode && onSelect) {
                onSelect(instance.id);
                return;
            }

            // Handle button click actions if specified
            if (actionHandler && instance.actionBindings) {
                const targetAction = instance.actionBindings.action;
                const targetId = instance.actionBindings.targetWidgetId;

                if (targetAction && targetId) {
                    actionHandler(targetAction, targetId);
                }
            }
        }}
        data-component-id={instance.id}
        data-component-type="PushButton"
        data-edit-mode={isEditMode ? "true" : "false"}
        data-selected={isSelected ? "true" : "false"}
        data-instance-id={instance.id}
        className={isSelected ? "selected-component" : ""}
    >
        {instance.overrides?.content?.properties?.text?.value ||
            instance.label ||
            "Button"}
    </PushButton>
);

/**
 * Input component renderer
 */
export const InputRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
    onSelect,
}) => (
    <div
        onClick={(e) => {
            e.stopPropagation();
            if (isEditMode && onSelect) {
                onSelect(instance.id);
            }
        }}
        className={`input-wrapper ${isSelected ? "selected-component" : ""}`}
    >
        <Input
            variant={instance.overrides?.style?.variant || "default"}
            placeholder={
                instance.overrides?.content?.properties?.placeholder?.value ||
                "Enter text..."
            }
            defaultValue={
                instance.overrides?.content?.properties?.defaultValue?.value ||
                ""
            }
            readOnly={isEditMode}
            data-component-id={instance.id}
            data-component-type="Input"
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
        />
    </div>
);

/**
 * DropdownButton component renderer
 */
export const DropdownButtonRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
    onSelect,
}) => (
    <div
        onClick={(e) => {
            e.stopPropagation();
            if (isEditMode && onSelect) {
                onSelect(instance.id);
            }
        }}
        className={`dropdown-wrapper ${isSelected ? "selected-component" : ""}`}
    >
        <DropdownButton
            variant={instance.overrides?.style?.variant || "default"}
            label={instance.label || "Dropdown"}
            options={
                instance.overrides?.content?.properties?.options?.value || [
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                ]
            }
            data-component-id={instance.id}
            data-component-type="DropdownButton"
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
        />
    </div>
);

/**
 * Tabs component renderer
 */
export const TabsRenderer: ComponentRenderer = ({
    instance,
    children,
    isEditMode,
    isSelected,
    onSelect,
}) => (
    <div
        onClick={(e) => {
            e.stopPropagation();
            if (isEditMode && onSelect) {
                onSelect(instance.id);
            }
        }}
        className={`tabs-wrapper ${isSelected ? "selected-component" : ""}`}
    >
        <Tabs
            variant={instance.overrides?.style?.variant || "default"}
            tabs={
                instance.overrides?.content?.properties?.tabs?.value || [
                    { id: "tab1", label: "Tab 1", content: "Tab 1 content" },
                    { id: "tab2", label: "Tab 2", content: "Tab 2 content" },
                ]
            }
            data-component-id={instance.id}
            data-component-type="Tabs"
            data-edit-mode={isEditMode ? "true" : "false"}
            data-selected={isSelected ? "true" : "false"}
            data-instance-id={instance.id}
        >
            {children}
        </Tabs>
    </div>
);

/**
 * Label component renderer
 */
export const LabelRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
    onSelect,
}) => (
    <div
        className={`label-component ${
            instance.overrides?.style?.className || ""
        } ${isSelected ? "selected-component" : ""}`}
        data-component-id={instance.id}
        data-component-type="Label"
        data-edit-mode={isEditMode ? "true" : "false"}
        data-selected={isSelected ? "true" : "false"}
        data-instance-id={instance.id}
        onClick={(e) => {
            e.stopPropagation();
            if (isEditMode && onSelect) {
                onSelect(instance.id);
            }
        }}
    >
        {instance.overrides?.content?.properties?.text?.value ||
            instance.label ||
            "Label Text"}
    </div>
);

/**
 * Register all component renderers with the registry
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
    registry.registerRenderer(
        ComponentTypeValues.Dropdown,
        DropdownButtonRenderer
    );
    registry.registerRenderer(ComponentTypeValues.Tabs, TabsRenderer);
    registry.registerRenderer(ComponentTypeValues.Label, LabelRenderer);

    // Verify registrations
    const renderers = Object.entries(registry.renderers).map(
        ([type, renderer]) => ({
            type,
            hasRenderer: !!renderer,
        })
    );

    console.log("Registered component renderers:", renderers);
}
