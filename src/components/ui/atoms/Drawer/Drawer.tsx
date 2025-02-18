import { ReactNode, useCallback, useEffect, useState } from "react";
import { AbstractInteractiveBase } from "@/components/base/interactive/AbstractInteractiveBase";
import { DivProps } from "@/components/base/interactive/types";
import drawerPreset, {
    DrawerVariant,
} from "@/components/base/style/presets/drawer";
import { cn } from "@/lib/utils";

export interface DrawerProps
    extends Omit<DivProps<"overlay" | "content">, "as"> {
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
    contentClassName?: string;
    overlayClassName?: string;
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
    contentClassName,
    overlayClassName,
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

    const handleTransitionEnd = () => {
        if (!open) {
            setMounted(false);
        }
    };

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

    // Calculate size styles based on variant
    const getSizeStyle = (): React.CSSProperties => {
        switch (variant) {
            case "left":
            case "right":
                return { width };
            case "top":
            case "bottom":
                return { height };
            default:
                return {};
        }
    };

    // Calculate transform based on variant
    const getTransform = (): string => {
        if (open) return "translate(0, 0)";

        switch (variant) {
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
            overlay: {
                base: overlayClassName,
            },
        },
    };

    if (!mounted) return null;

    return (
        <div
            className="fixed inset-0 z-50"
            aria-hidden={!open}
            onTransitionEnd={handleTransitionEnd}
        >
            {/* Overlay/Backdrop */}
            {showOverlay && (
                <div
                    className={cn(
                        "overlay",
                        open ? "opacity-100" : "opacity-0"
                    )}
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <AbstractInteractiveBase
                as="div"
                role="dialog"
                aria-modal="true"
                stylePreset={drawerPreset}
                styleProps={finalStyleProps}
                style={{
                    ...getSizeStyle(),
                    transform: getTransform(),
                }}
                {...props}
            >
                <div className="content">{children}</div>
            </AbstractInteractiveBase>
        </div>
    );
};

export default Drawer;
