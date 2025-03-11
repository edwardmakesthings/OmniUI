import { ComponentInstance } from "@/core/base/ComponentInstance";
import { ComponentTypeValues } from "@/core/types/ComponentTypes";
import { EntityId } from "@/core/types/EntityTypes";
import React, { Fragment, ReactElement, ReactNode } from "react";
import {
    Panel,
    ScrollBox,
    PushButton,
    Input,
    DropdownButton,
    Tabs,
} from "@/components/ui/atoms";
import { useWidgetStore, WidgetComponent } from "@/store/widgetStore";
import { useComponentStore } from "@/store/componentStore";

// Component props interface
interface ComponentProps {
    instance: ComponentInstance;
    widgetId?: EntityId;
    actionHandler?: (action: string, targetId?: EntityId) => void;
    children?: ReactNode;
}

export const componentRenderers: Record<
    string,
    (props: ComponentProps) => ReactElement | null
> = {
    // Layout components
    Panel: ({ instance, children, widgetId, actionHandler }) => {
        // Check if this panel has any children
        const hasChildren = Array.isArray(children) && children.length > 0;

        console.log(`Rendering Panel ${instance.id}`, {
            hasChildren,
            childrenCount: children
                ? Array.isArray(children)
                    ? children.length
                    : 1
                : 0,
        });

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
                style={defaultPanelStyle}
                className="w-full"
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
                            {instance.overrides?.content?.properties
                                ?.placeholder?.value || "Empty panel"}
                        </div>
                    )}
                </div>
            </Panel>
        );
    },

    ScrollBox: ({ instance, children, widgetId, actionHandler }) => {
        // Check if this scrollbox has any children
        const hasChildren = Array.isArray(children) && children.length > 0;

        // Default scrollbox size
        const defaultStyle = !hasChildren
            ? {
                  minWidth: "200px",
                  minHeight: "100px",
                  maxHeight:
                      instance.overrides?.content?.properties?.maxHeight
                          ?.value || "300px",
              }
            : {
                  maxHeight:
                      instance.overrides?.content?.properties?.maxHeight
                          ?.value || "300px",
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
                style={defaultStyle}
                className="relative"
            >
                {hasChildren ? (
                    <div className="scrollbox-children-container p-2">
                        {children}
                    </div>
                ) : (
                    <div className="text-center text-font-dark-muted text-sm p-4">
                        {instance.overrides?.content?.properties?.placeholder
                            ?.value || "Scrollable content area"}
                    </div>
                )}
            </ScrollBox>
        );
    },

    // Control components
    PushButton: ({ instance, actionHandler, widgetId }) => (
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
        >
            {instance.overrides?.content?.properties?.text?.value ||
                instance.label ||
                "Button"}
        </PushButton>
    ),

    Input: ({ instance }) => (
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
            data-component-id={instance.id}
            data-component-type="Input"
        />
    ),

    DropdownButton: ({ instance }) => (
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
        />
    ),

    Tabs: ({ instance, children }) => (
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
        >
            {children}
        </Tabs>
    ),

    // Display components
    Label: ({ instance }) => (
        <div
            className={`p-2 ${instance.overrides?.style?.className || ""}`}
            data-component-id={instance.id}
            data-component-type="Label"
        >
            {instance.overrides?.content?.properties?.text?.value ||
                instance.label ||
                "Label Text"}
        </div>
    ),
};

// Special edit mode renderers for containers that need to show their children directly
const editModeContainerRenderers = {
    Panel: ({ instance, children, widgetId, actionHandler }) => {
        return (
            <div className="edit-mode-container w-full h-full p-2 overflow-auto">
                <div className="text-xs text-font-dark-muted mb-2">
                    {instance.label || instance.type}
                </div>
                <div className="edit-child-container flex flex-col gap-2">
                    {children}
                </div>
            </div>
        );
    },
    ScrollBox: ({ instance, children, widgetId, actionHandler }) => {
        return (
            <div className="edit-mode-container w-full h-full p-2 overflow-auto">
                <div className="text-xs text-font-dark-muted mb-2">
                    {instance.label || instance.type}
                </div>
                <div className="edit-child-container flex flex-col gap-2">
                    {children}
                </div>
            </div>
        );
    },
};

// Default fallback renderer for unknown component types
export const defaultRenderer = ({ instance }: ComponentProps) => (
    <div className="p-2 border border-accent-dark-neutral rounded">
        <div className="text-xs mb-1 text-font-dark-muted">{instance.type}</div>
        <div>{instance.label || "Unknown Component"}</div>
    </div>
);

/**
 * Recursively renders a component and its children
 */
export const renderComponentHierarchy = (
    instance: ComponentInstance,
    widgetId: EntityId,
    actionHandler?: (action: string, targetId?: EntityId) => void
): ReactElement => {
    // Don't try to render if no instance
    if (!instance) {
        console.warn(
            "Attempted to render null/undefined component instance in hierarchy"
        );
        return <div className="text-red-500">Error: Missing component</div>;
    }

    // Get the renderer specifically for this component type
    const renderer = componentRenderers[instance.type] || defaultRenderer;

    // Get necessary stores
    const widgetStore = useWidgetStore.getState();
    const componentStore = useComponentStore.getState();
    const widget = widgetStore.getWidget(widgetId);

    if (!widget) {
        // If no widget context, just render the component alone
        return renderer({ instance, widgetId, actionHandler });
    }

    // Find the widget component that corresponds to this instance
    const widgetComponent = widget.components.find(
        (comp) => comp.instanceId === instance.id
    );

    if (!widgetComponent) {
        // If this instance is not in the widget, render it alone
        return renderer({ instance, widgetId, actionHandler });
    }

    // Find direct children of this component in the widget
    const childComponents = widget.components.filter(
        (comp) => comp.parentId === widgetComponent.id
    );

    if (childComponents.length === 0) {
        // No children, render component by itself
        return renderer({ instance, widgetId, actionHandler });
    }

    // Process direct children only (no grandchildren logic here)
    const childElements = childComponents
        .sort((a, b) => a.zIndex - b.zIndex) // Sort by z-index
        .map((childComp) => {
            try {
                // Get the instance for this child
                const childInstance = componentStore.getInstance(
                    childComp.instanceId
                );

                if (!childInstance) {
                    console.warn(
                        `Could not find instance for component ${childComp.id}`
                    );
                    return null;
                }

                // Recursively render child (it will handle its own children)
                return (
                    <div
                        key={childComp.id}
                        className="relative mb-2 panel-child-item w-full"
                        data-component-id={childComp.id}
                        data-component-type={childInstance.type}
                        data-instance-id={childInstance.id}
                    >
                        {/* Each recursive call handles one component and its direct children */}
                        {renderComponentHierarchy(
                            childInstance,
                            widgetId,
                            actionHandler
                        )}
                    </div>
                );
            } catch (error) {
                console.error(
                    `Error rendering child component ${childComp.id}:`,
                    error
                );
                return null;
            }
        })
        .filter(Boolean); // Remove any nulls from failed rendering

    // Finally, render this component with its processed children
    return renderer({
        instance,
        widgetId,
        actionHandler,
        children: childElements.length > 0 ? childElements : undefined,
    });
};

/**
 * Resolves a component instance to its React component representation
 */
export const resolveComponent = (
    instance: ComponentInstance,
    widgetId?: EntityId,
    actionHandler?: (action: string, targetId?: EntityId) => void
): ReactElement => {
    // Don't try to render if no instance
    if (!instance) {
        console.warn("Attempted to render null/undefined component instance");
        return <div className="text-red-500">Error: Missing component</div>;
    }

    // Debug the component type resolution
    console.log(
        `Resolving component type: ${instance.type} for instance ${instance.id}`
    );

    // Verify if we have a renderer for this type
    const hasRenderer = instance.type in componentRenderers;
    if (!hasRenderer) {
        console.warn(`No renderer found for component type: ${instance.type}`);
    }

    // If we have a widget ID, use the recursive hierarchy rendering
    if (widgetId) {
        return renderComponentHierarchy(instance, widgetId, actionHandler);
    }

    // If no widget context, just render the component directly
    const renderer = componentRenderers[instance.type] || defaultRenderer;
    return (
        <Fragment key={instance.id}>
            {renderer({ instance, widgetId, actionHandler })}
        </Fragment>
    );
};

/**
 * Register a new component renderer
 */
export const registerComponentRenderer = (
    componentType: string,
    renderer: (props: ComponentProps) => React.ReactElement | null
) => {
    componentRenderers[componentType] = renderer;
};
