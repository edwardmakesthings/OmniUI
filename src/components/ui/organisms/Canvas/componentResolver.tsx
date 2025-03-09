import { ComponentInstance } from "@/core/base/ComponentInstance";
import { ComponentTypeValues } from "@/core/types/ComponentTypes";
import { EntityId } from "@/core/types/EntityTypes";
import { Fragment, ReactElement, ReactNode } from "react";
import {
    Panel,
    ScrollBox,
    PushButton,
    Input,
    DropdownButton,
    Tabs,
} from "@/components/ui/atoms";

// Component props interface
interface ComponentProps {
    instance: ComponentInstance;
    widgetId?: EntityId;
    actionHandler?: (action: string, targetId?: EntityId) => void;
}

const componentRenderers: Record<
    string,
    (props: ComponentProps) => ReactElement | null
> = {
    // Layout components
    Panel: ({ instance, children }) => (
        <Panel
            header={
                instance.overrides?.content?.properties?.title?.value ||
                instance.label ||
                "Panel"
            }
            variant={instance.overrides?.style?.variant || "default"}
        >
            {children || <div className="p-2">Panel content</div>}
        </Panel>
    ),

    ScrollBox: ({ instance, children }) => (
        <ScrollBox
            variant={instance.overrides?.style?.variant || "default"}
            className={instance.overrides?.style?.className}
        >
            {children || (
                <div className="p-2">
                    {instance.label || "Scrollable content"}
                </div>
            )}
        </ScrollBox>
    ),

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
        />
    ),

    DropdownButton: ({ instance }) => (
        <DropdownButton
            variant={instance.overrides?.style?.variant || "default"}
            items={
                instance.overrides?.content?.properties?.items?.value || [
                    { label: "Option 1", value: "1" },
                    { label: "Option 2", value: "2" },
                ]
            }
            defaultValue={
                instance.overrides?.content?.properties?.defaultValue?.value
            }
            onChange={() => {}}
        />
    ),

    Tabs: ({ instance, children }) => (
        <Tabs
            variant={instance.overrides?.style?.variant || "default"}
            tabs={
                instance.overrides?.content?.properties?.tabs?.value || [
                    { label: "Tab 1", content: "Tab 1 content" },
                    { label: "Tab 2", content: "Tab 2 content" },
                ]
            }
        >
            {children}
        </Tabs>
    ),

    // Display components
    Label: ({ instance }) => (
        <div className={`p-2 ${instance.overrides?.style?.className || ""}`}>
            {instance.overrides?.content?.properties?.text?.value ||
                instance.label ||
                "Label Text"}
        </div>
    ),
};

// Default fallback renderer for unknown component types
const defaultRenderer = ({ instance }: ComponentProps) => (
    <div className="p-2 border border-accent-dark-neutral rounded">
        <div className="text-xs mb-1 text-font-dark-muted">{instance.type}</div>
        <div>{instance.label || "Unknown Component"}</div>
    </div>
);

/**
 * Resolves a component instance to its React component representation
 */
export const resolveComponent = (
    instance: ComponentInstance,
    widgetId?: EntityId,
    actionHandler?: (action: string, targetId?: EntityId) => void,
    children?: ReactNode
): ReactElement => {
    // Get the renderer for this component type
    const renderer = componentRenderers[instance.type] || defaultRenderer;

    // Create props for the renderer
    const props: ComponentProps & { children?: ReactNode } = {
        instance,
        widgetId,
        actionHandler,
        children,
    };

    // Render the component with a key
    return <Fragment key={instance.id}>{renderer(props)}</Fragment>;
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
