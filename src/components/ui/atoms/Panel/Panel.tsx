import { ReactNode } from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    DivProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import panelPreset, {
    PanelVariant,
} from "@/components/base/style/presets/panel";
import { cn } from "@/lib/utils";

export interface PanelProps extends Omit<DivProps<"header" | "content">, "as"> {
    // Content
    header?: ReactNode;
    children?: ReactNode;

    // Configuration
    variant?: PanelVariant;
    showHeader?: boolean;

    // Style overrides
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
}

export const Panel = ({
    // Content
    header,
    children,

    // Configuration
    variant = "default",
    showHeader = !!header,

    // Style
    className,
    headerClassName,
    contentClassName,
    styleProps,

    // Base props
    ...props
}: PanelProps) => {
    // Render function for the panel
    const renderPanel = ({
        elementProps,
        state,
        computedStyle,
    }: RenderElementProps) => {
        // Get container ID for ARIA
        const componentId =
            (elementProps as any)?.["data-component-id"] || "panel";
        const headerId = `${componentId}-header`;
        const contentId = `${componentId}-content`;

        return (
            <div
                {...elementProps}
                id={componentId}
                role="region"
                aria-labelledby={showHeader ? headerId : undefined}
                className={computedStyle.root}
            >
                {/* Header - maintain spacing even when empty */}
                {showHeader && (
                    <div
                        id={headerId}
                        className={cn(
                            computedStyle.header,
                            !header && "invisible"
                        )}
                    >
                        {header}
                    </div>
                )}

                {/* Content */}
                <div id={contentId} className={computedStyle.content}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <BaseInteractor
            as="div"
            stylePreset={panelPreset}
            styleProps={{
                variant,
                elements: {
                    root: {
                        base: className,
                    },
                    header: {
                        base: headerClassName,
                    },
                    content: {
                        base: contentClassName,
                    },
                },
            }}
            renderElement={renderPanel}
            {...props}
        />
    );
};

export default Panel;
