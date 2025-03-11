import { ComponentDefinition } from "@/core/base/ComponentDefinition";
import { composeStyles } from "@/components/base/style/utils";
import {
    backgroundStyles,
    textStyles,
    transitionStyles,
} from "@/components/base/style/compositions";
import { cn } from "@/lib/utils";

// Component icon mapping
import {
    CompPanelIcon,
    CompScrollBoxIcon,
    CompPushButtonIcon,
    CompMenuDropdownIcon,
} from "@/components/ui/icons";
import { useComponentPanelDrag } from "@/core";

export interface ComponentThumbnailProps {
    component: ComponentDefinition;
    onDragStart?: (
        e: React.DragEvent<HTMLDivElement>,
        component: ComponentDefinition
    ) => void;
    isUserComponent?: boolean;
    className?: string;
}

export const ComponentThumbnail = ({
    component,
    onDragStart,
    isUserComponent = false,
    className,
}: ComponentThumbnailProps) => {
    // Get appropriate icon based on component type
    const IconComponent = getComponentIcon(component.type);

    const { dragProps, isDragging } = useComponentPanelDrag(
        component.id,
        component.type,
        component.label
    );

    // Handle drag start
    // const handleDragStart = (e: React.DragEvent) => {
    //     e.currentTarget.setAttribute("draggable", "true");

    //     // Call custom handler if provided
    //     if (onDragStart) {
    //         onDragStart(e, component);
    //     }
    // };

    const thumbnailStyles = composeStyles(
        backgroundStyles.solid.dark,
        textStyles.default.base,
        transitionStyles.colors,
        "cursor-grab border border-accent-dark-neutral rounded hover:border-accent-dark-bright"
    );

    return (
        <div
            {...dragProps}
            className={cn(
                thumbnailStyles,
                className,
                `component-thumbnail ${isDragging ? "dragging" : ""}`
            )}
            data-component-id={component.id}
            data-component-type={component.type}
        >
            <div className="p-2 flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center">
                    <IconComponent size={32} />
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
};

// Helper to get icon component based on component type
function getComponentIcon(type: string) {
    switch (type) {
        case "Panel":
            return CompPanelIcon;
        case "ScrollBox":
            return CompScrollBoxIcon;
        case "Button":
            return CompPushButtonIcon;
        case "TextInput":
            return CompPushButtonIcon; // Use a different icon when available
        case "Label":
            return CompPushButtonIcon; // Use a different icon when available
        default:
            return CompPushButtonIcon;
    }
}

export default ComponentThumbnail;
