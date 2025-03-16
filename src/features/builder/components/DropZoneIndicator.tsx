import { ReactNode, CSSProperties, useEffect, useState, useRef } from "react";
import { DropPosition } from "@/features/builder/dragDrop/DropZone";
import { cn } from "@/lib/utils";

export interface DropZoneIndicatorProps {
    /**
     * The position where the indicator should appear
     */
    position: DropPosition | null;

    /**
     * Whether the drop zone is active
     */
    isActive?: boolean;

    /**
     * Whether the component is a container (determines if INSIDE is valid)
     */
    isContainer?: boolean;

    /**
     * Container element classname
     */
    className?: string;

    /**
     * Optional children to render inside the indicator (for INSIDE position)
     */
    children?: ReactNode;

    /**
     * Optional style overrides
     */
    style?: CSSProperties;
}

/**
 * Renders a visual indicator for drop zones during drag and drop operations.
 * Shows different indicators based on the drop position (before, after, inside).
 */
export const DropZoneIndicator = ({
    position,
    isActive = true,
    isContainer = false,
    className,
    children,
    style,
}: DropZoneIndicatorProps) => {
    const [visible, setVisible] = useState(false);
    const indicatorRef = useRef<HTMLDivElement>(null);

    // Animation control - slight delay to allow for smooth transition
    useEffect(() => {
        if (position && isActive) {
            // Small delay for a smoother appearance
            const timer = setTimeout(() => setVisible(true), 50);
            return () => clearTimeout(timer);
        } else {
            setVisible(false);
        }
    }, [position, isActive]);

    // No indicator when position is null or not active
    if (!position || !isActive) return null;

    // Show "inside" indicator only for containers
    if (position === DropPosition.INSIDE && !isContainer) return null;

    const baseClasses =
        "drop-indicator pointer-events-none absolute z-[100] transition-opacity duration-200";
    const animationClass = "animate-pulse";
    const opacityClass = visible ? "opacity-100" : "opacity-0";

    const getPositionClasses = () => {
        switch (position) {
            case DropPosition.BEFORE:
                return cn(
                    "drop-indicator-before",
                    "top-0 left-0 right-0 h-1 bg-blue-500",
                    "rounded-t-sm shadow-sm"
                );
            case DropPosition.AFTER:
                return cn(
                    "drop-indicator-after",
                    "bottom-0 left-0 right-0 h-1 bg-blue-500",
                    "rounded-b-sm shadow-sm"
                );
            case DropPosition.INSIDE:
                return cn(
                    "drop-indicator-inside",
                    "inset-0 border-2 border-dashed border-blue-500 bg-blue-500 bg-opacity-10",
                    "rounded-sm"
                );
            default:
                return "";
        }
    };

    const customStyle: CSSProperties = {
        // Position-specific styles
        ...(position === DropPosition.BEFORE && {
            height: "4px",
            boxShadow: "0 0 4px rgba(59, 130, 246, 0.5)",
        }),
        ...(position === DropPosition.AFTER && {
            height: "4px",
            boxShadow: "0 0 4px rgba(59, 130, 246, 0.5)",
        }),
        // Merge in any custom styles
        ...style,
    };

    return (
        <div
            ref={indicatorRef}
            className={cn(
                baseClasses,
                getPositionClasses(),
                animationClass,
                opacityClass,
                className
            )}
            style={customStyle}
            data-drop-position={position}
        >
            {position === DropPosition.INSIDE && children}
        </div>
    );
};

/**
 * Creates a comprehensive collection of drop zone indicators for components
 * that can be dropped in multiple positions.
 */
export const DropZoneIndicators = ({
    activePosition,
    isContainer,
    availablePositions = [DropPosition.BEFORE, DropPosition.AFTER],
}: {
    activePosition: DropPosition | null;
    isContainer?: boolean;
    availablePositions?: DropPosition[];
}) => {
    // Only show the active position indicator
    const positions = isContainer
        ? [...availablePositions, DropPosition.INSIDE]
        : availablePositions;

    return (
        <>
            {positions.map((position) => (
                <DropZoneIndicator
                    key={position}
                    position={activePosition === position ? position : null}
                    isContainer={isContainer}
                />
            ))}
        </>
    );
};

export default DropZoneIndicator;
