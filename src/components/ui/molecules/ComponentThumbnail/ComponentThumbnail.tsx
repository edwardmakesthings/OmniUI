import { ComponentDefinition } from "@/core/base/ComponentDefinition";
import { composeStyles } from "@/components/base/style/utils";
import {
    backgroundStyles,
    textStyles,
    transitionStyles,
} from "@/components/base/style/compositions";
import { cn } from "@/lib/utils";

// Component icon mapping
import { CompPanelIcon } from "@/components/ui/icons";
import { useComponentPanelDrag } from "@/features/builder/dragDrop/hooks/useComponentDrag";
import { componentIconMap } from "@/registry";

export interface ComponentThumbnailProps {
    component: ComponentDefinition;
    isUserComponent?: boolean;
    className?: string;
}

/**
 * A draggable thumbnail representing a component in the component palette
 */
export default function ComponentThumbnail({
    component,
    isUserComponent = false,
    className,
}: ComponentThumbnailProps) {
    // Get appropriate icon based on component type
    const IconComponent = componentIconMap[component.type] || CompPanelIcon;

    const { dragProps, isDragging } = useComponentPanelDrag(
        component.id,
        component.type,
        component.label || component.name
    );

    const thumbnailStyles = composeStyles(
        backgroundStyles.solid.dark,
        textStyles.default.base,
        transitionStyles.colors,
        "cursor-grab border border-accent-dark-neutral rounded hover:border-accent-dark-bright"
    );

    return (
        <div
            {...(dragProps as React.HTMLAttributes<HTMLDivElement>)}
            className={cn(
                thumbnailStyles,
                className,
                `component-thumbnail ${isDragging ? "dragging" : ""}`
            )}
            data-component-id={component.id}
            data-component-type={component.type}
            title={component.label}
        >
            <div className="p-1 flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center">
                    <IconComponent size={48} />
                </div>
                <div className="mt-1 text-sm text-center truncate w-full">
                    {component.label}
                </div>
                {isUserComponent && (
                    <div className="text-xs text-accent-dark-bright mt-0.5">
                        Custom
                    </div>
                )}
            </div>
        </div>
    );
}
