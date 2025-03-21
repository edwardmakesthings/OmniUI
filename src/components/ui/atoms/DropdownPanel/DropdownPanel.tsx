import {
    ComponentType,
    ReactNode,
    useCallback,
    useState,
    isValidElement,
    Children,
    AriaAttributes,
} from "react";
import { BaseInteractor } from "@/components/base/interactive/BaseInteractor";
import {
    DivProps,
    RenderElementProps,
} from "@/components/base/interactive/types";
import { IconProps } from "@/lib/icons/types";
import { cn } from "@/lib/utils";
import dropdownPanelPreset from "@/components/base/style/presets/dropdownPanel";
import { SearchBar } from "@/components/ui/molecules/SearchBar";
import { CaretDownIcon } from "@/components/ui/icons";
import { ScrollBox } from "@/components/ui/atoms/ScrollBox";
import { Panel } from "../Panel";

export interface DropdownPanelProps
    extends Omit<DivProps<"header" | "content">, "as" | "title"> {
    // Content
    title: ReactNode;
    children: ReactNode;
    icon?: ComponentType<IconProps>;
    description?: string;

    // State
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (isOpen: boolean) => void;

    // Configuration
    variant?: "default" | "ghost";
    searchable?: boolean;
    contentLayout?: "grid" | "list";
    maxHeight?: number | string;

    // Style customization
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
}

export const DropdownPanel = ({
    // Content props
    title,
    children,
    icon: Icon,
    description,

    // State props
    defaultOpen = false,
    open: controlledOpen,
    onOpenChange,

    // Config props
    variant = "default",
    searchable = false,
    contentLayout = "list",
    maxHeight = 0,

    // Style props
    className,
    headerClassName,
    contentClassName,
    ...props
}: DropdownPanelProps) => {
    // Internal open state for uncontrolled mode
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [searchQuery, setSearchQuery] = useState("");

    // Use controlled state if provided, otherwise use internal
    const isOpen = controlledOpen ?? internalOpen;

    // Handle header click
    const handleToggle = useCallback(() => {
        const newOpen = !isOpen;
        if (controlledOpen === undefined) {
            setInternalOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    }, [isOpen, controlledOpen, onOpenChange]);

    // Filter content based on search
    const renderContent = () => {
        if (!searchable || !searchQuery) {
            return children;
        }

        // Basic filtering - can be enhanced based on needs
        return Children.map(children, (child) => {
            if (
                isValidElement(child) &&
                typeof child.props.children === "string" &&
                child.props.children
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            ) {
                return child;
            }
            return null;
        });
    };

    // Render function for the panel
    const renderDropdownPanel = ({
        elementProps,
        state: _state,
        computedStyle,
    }: RenderElementProps) => {
        const ariaAttributes: AriaAttributes & { role?: string } = {
            role: "button",
            "aria-expanded": isOpen,
            "aria-controls": `${elementProps.id}-content`,
        };

        return (
            <div {...elementProps} className={computedStyle.root}>
                {/* Header */}
                <div
                    className={cn(computedStyle.header, "cursor-pointer")}
                    onClick={handleToggle}
                    {...ariaAttributes}
                >
                    <div className="flex items-center gap-2">
                        {Icon && <Icon size={16} />}
                        <span className="flex-grow">{title}</span>
                        <CaretDownIcon
                            size={16}
                            className={cn(
                                "transition-transform duration-200",
                                !isOpen && "rotate-90"
                            )}
                        />
                    </div>
                    {description && (
                        <div className="text-sm text-font-dark-muted mt-1">
                            {description}
                        </div>
                    )}
                </div>

                {/* Content */}
                {isOpen && (
                    <div
                        id={`${elementProps.id}-content`}
                        className={computedStyle.content}
                    >
                        {searchable && (
                            <div className="mb-2">
                                <SearchBar
                                    value={searchQuery}
                                    onChange={setSearchQuery}
                                    placeholder="Search..."
                                />
                            </div>
                        )}
                        {maxHeight !== 0 ? (
                            <ScrollBox
                                maxHeight={maxHeight}
                                variant={
                                    variant === "default" ? "inset" : "ghost"
                                }
                            >
                                <div
                                    className={cn(
                                        contentLayout === "grid"
                                            ? "grid grid-cols-2 gap-2"
                                            : "flex flex-col gap-1"
                                    )}
                                >
                                    {renderContent()}
                                </div>
                            </ScrollBox>
                        ) : (
                            <Panel
                                variant={
                                    variant === "default" ? "inset" : "ghost"
                                }
                            >
                                <div
                                    className={cn(
                                        contentLayout === "grid"
                                            ? "grid grid-cols-2 gap-2"
                                            : "flex flex-col gap-1"
                                    )}
                                >
                                    {renderContent()}
                                </div>
                            </Panel>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <BaseInteractor
            as="div"
            stylePreset={dropdownPanelPreset}
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
            state={{ isActive: isOpen }}
            renderElement={renderDropdownPanel}
            {...props}
        />
    );
};

export default DropdownPanel;
