import {
    AriaAttributes,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    DivProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import drawerPreset, {
    DrawerVariant,
} from "@/components/base/style/presets/drawer";
import { cn } from "@/lib/utils";

export interface DrawerProps
    extends Omit<DivProps<"container" | "overlay" | "content">, "as"> {
    // Content
    children?: ReactNode;

    // Control
    open?: boolean;
    onClose?: () => void;

    // Configuration
    variant?: DrawerVariant;
    width?: number | string;
    height?: number | string;
    closeOnOverlayClick?: boolean;
    closeOnEscape?: boolean;
    showOverlay?: boolean;

    // Style overrides
    className?: string;
    containerClassName?: string;
    overlayClassName?: string;
    contentClassName?: string;
}

export const Drawer = ({
    // Content
    children,

    // Control
    open = false,
    onClose,

    // Configuration
    variant = "left",
    width = 320,
    height = 320,
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showOverlay = true,

    // Style
    className,
    containerClassName,
    overlayClassName,
    contentClassName,
    styleProps,

    ...props
}: DrawerProps) => {
    // Internal mount state to handle animations
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (open) {
            setMounted(true);
        }
    }, [open]);

    // Handle escape key
    useEffect(() => {
        if (!open || !closeOnEscape) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose?.();
            }
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [open, closeOnEscape, onClose]);

    // Handle overlay click
    const handleOverlayClick = useCallback(() => {
        if (closeOnOverlayClick) {
            onClose?.();
        }
    }, [closeOnOverlayClick, onClose]);

    // Calculate transform based on variant and state
    const getTransform = (): string => {
        if (open) return "translate(0, 0)";

        switch (variant.split("-")[0]) {
            case "left":
                return "translateX(-100%)";
            case "right":
                return "translateX(100%)";
            case "top":
                return "translateY(-100%)";
            case "bottom":
                return "translateY(100%)";
            default:
                return "translate(0, 0)";
        }
    };

    // Render function for the drawer
    const renderDrawer = ({
        elementProps,
        state: _state,
        computedStyle,
    }: RenderElementProps) => {
        // Get container ID for ARIA
        const componentId =
            (elementProps as any)?.["data-component-id"] || "drawer";

        // ARIA attributes
        const ariaAttributes: AriaAttributes = {
            "aria-hidden": !open,
        };

        return (
            <div
                className={computedStyle.container}
                onTransitionEnd={() => !open && setMounted(false)}
                {...ariaAttributes}
            >
                {/* Overlay */}
                {showOverlay && (
                    <div
                        className={cn(
                            computedStyle.overlay,
                            open ? "opacity-100" : "opacity-0",
                            overlayClassName
                        )}
                        onClick={handleOverlayClick}
                        aria-hidden="true"
                    />
                )}

                {/* Drawer */}
                <div
                    {...elementProps}
                    id={componentId}
                    role="dialog"
                    aria-modal="true"
                    className={computedStyle.root}
                    style={{
                        ...(variant.includes("left") ||
                        variant.includes("right")
                            ? { width }
                            : { height }),
                        transform: getTransform(),
                    }}
                >
                    {children}
                </div>
            </div>
        );
    };

    if (!mounted) return null;

    return (
        <BaseInteractor
            as="div"
            stylePreset={drawerPreset}
            styleProps={{
                variant,
                elements: {
                    root: {
                        base: className,
                    },
                    container: {
                        base: containerClassName,
                    },
                    overlay: {
                        base: overlayClassName,
                    },
                    content: {
                        base: contentClassName,
                    },
                },
            }}
            renderElement={renderDrawer}
            {...props}
        />
    );
};

export default Drawer;
