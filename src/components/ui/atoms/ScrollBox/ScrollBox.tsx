import { ReactNode, useCallback, useRef } from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    DivProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import scrollboxPreset, {
    ScrollBoxVariant,
} from "@/components/base/style/presets/scrollbox";
import { cn } from "@/lib/utils";

export interface ScrollBoxProps extends Omit<DivProps<"content">, "as"> {
    // Content
    children?: ReactNode;

    // Configuration
    variant?: ScrollBoxVariant;
    maxHeight?: number | string;
    scrollToTop?: boolean;

    // Handlers
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;

    // Scrollbar styling
    scrollbarStyle?: "dark" | "light" | "accent" | "invisible";
    scrollbarSize?: "normal" | "thin";

    // Style overrides
    className?: string;
    contentClassName?: string;
}

export const ScrollBox = ({
    // Content
    children,

    // Configuration
    variant = "default",
    maxHeight,

    scrollToTop = false,

    // Handlers
    onScroll,

    // Style
    className,
    contentClassName,
    styleProps,

    // Scrollbar styling
    scrollbarStyle = "dark",
    scrollbarSize = "normal",

    // Base props
    ...props
}: ScrollBoxProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    // Scroll to top when scrollToTop prop changes
    const scrollToTopHandler = useCallback(() => {
        if (contentRef.current && scrollToTop) {
            contentRef.current.scrollTop = 0;
        }
    }, [scrollToTop]);

    // Effect to handle scroll to top
    if (scrollToTop) {
        scrollToTopHandler();
    }

    // Build scrollbar class
    const scrollbarClass = cn(
        "scrollbar-custom",
        `scrollbar-${scrollbarStyle}`,
        scrollbarSize === "thin" && "scrollbar-thin"
    );

    // Render function for the scrollbox
    const renderScrollBox = ({
        elementProps,
        state: _state,
        computedStyle,
    }: RenderElementProps) => {
        // Get container ID for ARIA
        const componentId =
            (elementProps as any)?.["data-component-id"] || "scrollbox";
        const contentId = `${componentId}-content`;

        return (
            <div
                {...elementProps}
                id={componentId}
                role="region"
                className={computedStyle.root}
                style={{ maxHeight }}
            >
                <div
                    ref={contentRef}
                    id={contentId}
                    className={cn(
                        computedStyle.content,
                        scrollbarClass,
                        contentClassName
                    )}
                    onScroll={onScroll}
                    style={{ maxHeight }}
                >
                    {children}
                </div>
            </div>
        );
    };

    return (
        <BaseInteractor
            as="div"
            stylePreset={scrollboxPreset}
            styleProps={{
                variant,
                elements: {
                    root: {
                        base: className,
                    },
                    content: {
                        base: contentClassName,
                    },
                },
            }}
            renderElement={renderScrollBox}
            {...props}
        />
    );
};

export default ScrollBox;
