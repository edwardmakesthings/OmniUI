// src/registry/ComponentRenderers.ts
import { Fragment } from "react";
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

/**
 * Component renderers for all supported component types
 * Moved from componentResolver.tsx into a centralized registry
 */

// Panel component renderer
export const PanelRenderer: ComponentRenderer = ({
    instance,
    children,
    widgetId,
    actionHandler,
    isEditMode,
    isSelected,
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

    // Adjust padding based on whether there are children
    const contentPadding = hasChildren ? "p-0" : "p-4";

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
            style={defaultPanelStyle}
            className={`w-full ${isSelected ? "selected-component" : ""}`}
        >
            <div className={contentPadding}>
                {hasChildren ? (
                    // Important: Make sure children are visible and properly formatted
                    <div className="panel-children-container w-full p-2">
                        {/* Map through children to ensure they're all displayed */}
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

// ScrollBox component renderer
export const ScrollBoxRenderer: ComponentRenderer = ({
    instance,
    children,
    widgetId,
    actionHandler,
    isEditMode,
    isSelected,
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
            style={defaultStyle}
            className={`relative ${isSelected ? "selected-component" : ""}`}
        >
            {hasChildren ? (
                <div className="scrollbox-children-container p-2">
                    {children}
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

// PushButton component renderer
export const PushButtonRenderer: ComponentRenderer = ({
    instance,
    actionHandler,
    widgetId,
    isEditMode,
    isSelected,
}) => (
    <PushButton
        variant={instance.overrides?.style?.variant || "default"}
        onClick={() => {
            // Handle button click actions if specified in the component
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
        className={isSelected ? "selected-component" : ""}
    >
        {instance.overrides?.content?.properties?.text?.value ||
            instance.label ||
            "Button"}
    </PushButton>
);

// Input component renderer
export const InputRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
}) => (
    <Input
        variant={instance.overrides?.style?.variant || "default"}
        placeholder={
            instance.overrides?.content?.properties?.placeholder?.value ||
            "Enter text..."
        }
        defaultValue={
            instance.overrides?.content?.properties?.defaultValue?.value || ""
        }
        data-component-id={instance.id}
        data-component-type="Input"
        data-edit-mode={isEditMode ? "true" : "false"}
        data-selected={isSelected ? "true" : "false"}
        className={isSelected ? "selected-component" : ""}
    />
);

// DropdownButton component renderer
export const DropdownButtonRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
}) => (
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
        className={isSelected ? "selected-component" : ""}
    />
);

// Tabs component renderer
export const TabsRenderer: ComponentRenderer = ({
    instance,
    children,
    isEditMode,
    isSelected,
}) => (
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
        className={isSelected ? "selected-component" : ""}
    >
        {children}
    </Tabs>
);

// Label component renderer
export const LabelRenderer: ComponentRenderer = ({
    instance,
    isEditMode,
    isSelected,
}) => (
    <div
        className={`p-2 ${instance.overrides?.style?.className || ""} ${
            isSelected ? "selected-component" : ""
        }`}
        data-component-id={instance.id}
        data-component-type="Label"
        data-edit-mode={isEditMode ? "true" : "false"}
        data-selected={isSelected ? "true" : "false"}
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
        ComponentTypeValues.DropdownButton,
        DropdownButtonRenderer
    );
    registry.registerRenderer(ComponentTypeValues.Tabs, TabsRenderer);
    registry.registerRenderer(ComponentTypeValues.Label, LabelRenderer);

    console.log("Registered component renderers");
}

/**
 * Public render function that uses the registry to render any component
 */
export function renderComponent(
    instance: any,
    props: Omit<ComponentRenderProps, "instance">
) {
    if (!instance) return <Fragment />;

    const registry = useComponentRegistry.getState();
    return registry.renderComponent(instance, props);
}

/**
 * Public render function that renders a component and its children
 */
export function renderComponentHierarchy(
    instance: any,
    widgetId: any,
    props: Omit<ComponentRenderProps, "instance" | "widgetId">
) {
    if (!instance || !widgetId) return <Fragment />;

    const registry = useComponentRegistry.getState();
    return registry.renderComponentHierarchy(instance, widgetId, props);
}
