import { ReactNode, useCallback, useEffect } from "react";
import { AbstractInteractiveBase } from "@/components/base/interactive/AbstractInteractiveBase";
import { DivProps } from "@/components/base/interactive/types";
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
            footer: {
                base: footerClassName,
            },
            backdrop: {
                base: backdropClassName,
            },
        },
    };

    if (!open) return null;

    return (
        <div aria-hidden={!open}>
            {/* Backdrop */}
            {showBackdrop && (
                <div
                    className={cn(
                        "backdrop",
                        open ? "opacity-100" : "opacity-0"
                    )}
                    onClick={handleBackdropClick}
                    aria-hidden="true"
                />
            )}

            {/* Modal */}
            <AbstractInteractiveBase
                as="div"
                role="dialog"
                aria-modal="true"
                stylePreset={modalPreset}
                styleProps={finalStyleProps}
                style={{
                    width,
                    maxHeight,
                }}
                {...props}
            >
                {/* Header */}
                {showHeader && <div className="header">{title}</div>}

                {/* Content */}
                <div className="content">{children}</div>

                {/* Footer */}
                {showFooter && <div className="footer">{footer}</div>}
            </AbstractInteractiveBase>
        </div>
    );
};

export default Modal;
