import {
    Children,
    cloneElement,
    ComponentType,
    isValidElement,
    ReactNode,
} from "react";

export type IconProps = {
    className?: string;
    size?: number;
    strokeWidth?: number;
    viewBoxSize?: number;
    "aria-label"?: string;
};

type IconContent = string | ReactNode;

type IconCreationOptions = {
    defaultSize?: number;
    defaultViewBoxSize?: number;
    /* The following options are for convenient complex icon customization */
    setStrokeColor?: boolean;
    strokeLinecap?: "round" | "butt" | "square" | "inherit" | undefined;
    strokeLinejoin?: "round" | "inherit" | "miter" | "bevel" | undefined;
    setFillColor?: boolean;
    /* Optional hard-set fill and stroke colors */
    fill?: string;
    stroke?: string;
};

type IconContentGroup = [IconContent, IconCreationOptions];

/**
 * Type guard to check if an element is an icon component
 */
const isIconComponent = (type: any): type is ComponentType<IconProps> => {
    return typeof type === "function" && "displayName" in type;
};

/**
 * Type guard to check if the input is a content group array
 */
const isContentGroupArray = (content: any): content is IconContentGroup[] => {
    return (
        Array.isArray(content) &&
        content.length > 0 &&
        Array.isArray(content[0]) &&
        content[0].length === 2
    );
};

/**
 * Recursively applies props to all icon components in the content
 *
 * @param content - The React content to process
 * @param props - The props to apply
 * @param scale - The current scale factor
 * @returns Modified React content with updated props
 */
const applyIconProps = (
    content: ReactNode,
    props: IconProps,
    scale: number
): ReactNode => {
    return Children.map(content, (child) => {
        if (!isValidElement(child)) return child;

        const elementType = child.type;

        // Create base props object
        const newProps: Record<string, any> = { ...child.props };

        // Handle SVG elements
        if (
            typeof elementType === "string" &&
            ["path", "circle", "rect", "line"].includes(elementType)
        ) {
            if (props.strokeWidth !== undefined) {
                newProps.strokeWidth = props.strokeWidth / scale;
            }
        }

        // Handle nested icon components
        if (isIconComponent(elementType)) {
            // Only spread defined props
            if (props.className !== undefined)
                newProps.className = props.className;
            if (props.size !== undefined) newProps.size = props.size;
            if (props.strokeWidth !== undefined)
                newProps.strokeWidth = props.strokeWidth;
            if (props.viewBoxSize !== undefined)
                newProps.viewBoxSize = props.viewBoxSize;
            if (props["aria-label"] !== undefined)
                newProps["aria-label"] = props["aria-label"];
        }

        // Recursively process children if they exist
        if (child.props.children) {
            newProps.children = applyIconProps(
                child.props.children,
                props,
                scale
            );
        }

        return cloneElement(child, newProps);
    });
};

/**
 * Creates a React component for an icon based on the provided content.
 * The content can be a string representing SVG path data, a ReactNode
 * for custom SVG elements, or an array of content groups, each with their
 * own styling options.
 *
 * The function defaults are meant to work with tabler icons.
 *
 * @param {IconContent | IconContentGroup[]} content - Icon content or array of content groups with styling options
 * @param {IconCreationOptions} [options] - Default options for the icon
 * @returns {React.FC<IconProps>} A React functional component
 */
export const createIconComponent = (
    content: IconContent | IconContentGroup[],
    options: IconCreationOptions = {}
) => {
    const {
        defaultSize = 24,
        defaultViewBoxSize = 24,
        setStrokeColor = false,
        strokeLinecap = "",
        strokeLinejoin = "",
        setFillColor = false,
        fill = "",
        stroke = "",
    } = options;

    const IconComponent = ({
        className = "",
        size = defaultSize,
        viewBoxSize = defaultViewBoxSize,
        strokeWidth = 2,
        "aria-label": ariaLabel,
    }: IconProps) => {
        // Calculate scale factor if viewBox size differs from default
        const scale = viewBoxSize / defaultViewBoxSize;

        const props = {
            className,
            size,
            viewBoxSize,
            strokeWidth,
            "aria-label": ariaLabel,
        };

        // Handle array of content groups
        if (isContentGroupArray(content)) {
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`inline-block ${className}`}
                    aria-label={ariaLabel}
                >
                    {content.map(([groupContent, groupOptions], index) => {
                        const {
                            setStrokeColor:
                                groupSetStrokeColor = setStrokeColor,
                            strokeLinecap: groupStrokeLinecap = strokeLinecap,
                            strokeLinejoin:
                                groupStrokeLinejoin = strokeLinejoin,
                            setFillColor: groupSetFillColor = setFillColor,
                            fill: groupFill = fill,
                            stroke: groupStroke = stroke,
                        } = groupOptions;

                        const processedGroupContent =
                            typeof groupContent === "string" ? (
                                <path
                                    d={groupContent}
                                    stroke={groupStroke || "currentColor"}
                                    strokeWidth={strokeWidth / scale}
                                    strokeLinecap={
                                        groupStrokeLinecap || "round"
                                    }
                                    strokeLinejoin={
                                        groupStrokeLinejoin || "round"
                                    }
                                    fill={
                                        groupFill ||
                                        (groupSetFillColor
                                            ? "currentColor"
                                            : "none")
                                    }
                                />
                            ) : (
                                applyIconProps(groupContent, props, scale)
                            );

                        return (
                            <g
                                key={index}
                                transform={
                                    scale !== 1 ? `scale(${scale})` : undefined
                                }
                                {...(groupSetStrokeColor && {
                                    stroke: groupStroke || "currentColor",
                                })}
                                {...(groupStrokeLinecap !== "" && {
                                    strokeLinecap: groupStrokeLinecap,
                                })}
                                {...(groupStrokeLinejoin !== "" && {
                                    strokeLinejoin: groupStrokeLinejoin,
                                })}
                                {...(groupSetFillColor && {
                                    fill: groupFill || "currentColor",
                                })}
                            >
                                {processedGroupContent}
                            </g>
                        );
                    })}
                </svg>
            );
        }

        // Process single content
        const processedContent =
            typeof content === "string" ? (
                <path
                    d={content}
                    stroke={stroke || "currentColor"}
                    strokeWidth={strokeWidth / scale}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill={fill || (setFillColor ? "currentColor" : "none")}
                />
            ) : (
                applyIconProps(content, props, scale)
            );

        return (
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`inline-block ${className}`}
                aria-label={ariaLabel}
            >
                <g
                    transform={scale !== 1 ? `scale(${scale})` : undefined}
                    {...(setStrokeColor && {
                        stroke: stroke || "currentColor",
                    })}
                    {...(strokeLinecap !== "" && { strokeLinecap })}
                    {...(strokeLinejoin !== "" && { strokeLinejoin })}
                    {...(setFillColor && { fill: fill || "currentColor" })}
                >
                    {processedContent}
                </g>
            </svg>
        );
    };

    IconComponent.displayName = "Icon";
    return IconComponent;
};

/**
 * Utility function to create multi-part icons with different fill/stroke settings for each part
 *
 * @param parts - Array of content and options pairs
 * @returns Icon component with multiple styled parts
 */
export const createMultiPartIcon = (
    parts: IconContentGroup[],
    defaultOptions: IconCreationOptions = {}
) => {
    return createIconComponent(parts, defaultOptions);
};

/*
// Examples of usage:

// Simple path usage
export const CaretDownIcon = createIconComponent("M3 6L8 11L13 6");

// Complex SVG usage
export const EditIcon = createIconComponent(
    <>
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"
        />
        <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3l8.385-8.415z"
        />
    </>
);

// Multi-part icon with different styling for each part
export const GearIcon = createMultiPartIcon([
    [
        <>
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        </>,
        { setStrokeColor: true, strokeLinecap: "round" }
    ],
    [
        <>
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
        </>,
        { setStrokeColor: true, strokeLinecap: "round", setFillColor: true }
    ]
]);

// Icon with custom fill and stroke
export const CustomIcon = createIconComponent(
    "M3 6L8 11L13 6",
    { fill: "#FF5500", stroke: "#0055FF" }
);
*/
