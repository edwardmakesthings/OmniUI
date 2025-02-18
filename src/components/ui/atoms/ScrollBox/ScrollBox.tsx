import { ReactNode, useCallback, useRef } from "react";
import { AbstractInteractiveBase } from "@/components/base/interactive/AbstractInteractiveBase";
import { DivProps } from "@/components/base/interactive/types";
import scrollboxPreset, {
    ScrollBoxVariant,
} from "@/components/base/style/presets/scrollbox";

export interface ScrollBoxProps extends Omit<DivProps<"content">, "as"> {
    // Content
    children?: ReactNode;

    // Configuration
    variant?: ScrollBoxVariant;
    maxHeight?: number | string;

    // Scroll behavior
    scrollToTop?: boolean;
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;

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

    // Scroll behavior
    scrollToTop = false,
    onScroll,

    // Style
    className,
    contentClassName,
    styleProps,

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

    const finalStyleProps = {
        ...styleProps,
        variant,
        elements: {
            root: {
                base: className,
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
            stylePreset={scrollboxPreset}
            styleProps={finalStyleProps}
            {...props}
        >
            <div
                ref={contentRef}
                className="content"
                onScroll={onScroll}
                style={{ maxHeight }}
            >
                {children}
            </div>
        </AbstractInteractiveBase>
    );
};

export default ScrollBox;
