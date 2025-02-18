import { ReactNode } from "react";
import { AbstractInteractiveBase } from "@/components/base/interactive/AbstractInteractiveBase";
import { DivProps } from "@/components/base/interactive/types";
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
    const finalStyleProps = {
        ...styleProps,
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
    };

    return (
        <AbstractInteractiveBase
            as="div"
            role="region"
            stylePreset={panelPreset}
            styleProps={finalStyleProps}
            {...props}
        >
            {showHeader && (
                <div
                    className={cn(
                        "header",
                        !header && "invisible" // Keep spacing even when empty
                    )}
                >
                    {header}
                </div>
            )}
            <div className="content">{children}</div>
        </AbstractInteractiveBase>
    );
};

export default Panel;
