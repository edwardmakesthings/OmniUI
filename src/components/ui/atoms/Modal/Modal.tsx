import {
    AriaAttributes,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";
import { AbstractInteractiveBase } from "@/components/base/interactive/AbstractInteractiveBase";
import {
    DivProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import modalPreset, {
    ModalVariant,
} from "@/components/base/style/presets/modal";
import { cn } from "@/lib/utils";

export interface ModalProps
    extends Omit<
        DivProps<"backdrop" | "header" | "content" | "footer">,
        "as" | "title"
    > {
    // Content
    children?: ReactNode;
    title?: ReactNode;
    footer?: ReactNode;

    // Control
    open?: boolean;
    onClose?: () => void;

    // Configuration
    variant?: ModalVariant;
    width?: number | string;
    maxHeight?: number | string;
    closeOnBackdropClick?: boolean;
    closeOnEscape?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
    showBackdrop?: boolean;

    // Style overrides
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    footerClassName?: string;
    backdropClassName?: string;
}

export const Modal = ({
    // Content
    children,
    title,
    footer,

    // Control
    open = false,
    onClose,

    // Configuration
    variant = "default",
    width = 500,
    maxHeight = "85vh",
    closeOnBackdropClick = true,
    closeOnEscape = true,
    showHeader = !!title,
    showFooter = !!footer,
    showBackdrop = true,

    // Style
    className,
    headerClassName,
    contentClassName,
    footerClassName,
    backdropClassName,
    styleProps,

    ...props
}: ModalProps) => {
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

    // Handle backdrop click
    const handleBackdropClick = useCallback(() => {
        if (closeOnBackdropClick) {
            onClose?.();
        }
    }, [closeOnBackdropClick, onClose]);

    // ARIA attributes
    const ariaAttributes: AriaAttributes = {
        "aria-hidden": !open,
    };

    // Render function for the modal
    const renderModal = ({
        elementProps,
        state,
        computedStyle,
    }: RenderElementProps) => {
        // Get container ID for ARIA
        const componentId =
            (elementProps as any)?.["data-component-id"] || "modal";
        const headerId = `${componentId}-header`;
        const contentId = `${componentId}-content`;

        return (
            <div
                className={computedStyle.container}
                onTransitionEnd={() => !open && setMounted(false)}
                {...ariaAttributes}
            >
                {/* Backdrop */}
                {showBackdrop && (
                    <div
                        className={cn(
                            computedStyle.backdrop,
                            open ? "opacity-100" : "opacity-0",
                            backdropClassName
                        )}
                        onClick={handleBackdropClick}
                        aria-hidden="true"
                    />
                )}

                {/* Modal */}
                <div
                    {...elementProps}
                    id={componentId}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={showHeader ? headerId : undefined}
                    aria-describedby={contentId}
                    className={computedStyle.root}
                    style={{
                        width,
                        maxHeight,
                    }}
                >
                    {/* Header */}
                    {showHeader && (
                        <div id={headerId} className={computedStyle.header}>
                            {title}
                        </div>
                    )}

                    {/* Content */}
                    <div id={contentId} className={computedStyle.content}>
                        {children}
                    </div>

                    {/* Footer */}
                    {showFooter && (
                        <div className={computedStyle.footer}>{footer}</div>
                    )}
                </div>
            </div>
        );
    };

    if (!mounted) return null;

    return (
        <AbstractInteractiveBase
            as="div"
            stylePreset={modalPreset}
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
                    footer: {
                        base: footerClassName,
                    },
                    backdrop: {
                        base: backdropClassName,
                    },
                },
            }}
            renderElement={renderModal}
            {...props}
        />
    );
};

export default Modal;
