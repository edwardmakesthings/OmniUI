import { Children, cloneElement, ComponentType, isValidElement, ReactNode } from "react";

export type IconProps = {
    className?: string;
    size?: number;
    strokeWidth?: number;
    viewBoxSize?: number;
    'aria-label'?: string;
};

type IconContent = string | ReactNode;

type IconCreationOptions = {
    defaultSize?: number;
    defaultViewBoxSize?: number;
    /* The following options are for convenient complex icon customization */
    setStrokeColor?: boolean;
    strokeLinecap?: string;
    strokeLinejoin?: string;
    setFillColor?: boolean;
};

/**
 * Type guard to check if an element is an icon component
 */
const isIconComponent = (type: any): type is ComponentType<IconProps> => {
    return typeof type === 'function' && 'displayName' in type;
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
    return Children.map(content, child => {
        if (!isValidElement(child)) return child;

        const elementType = child.type;

        // Create base props object
        const newProps: Record<string, any> = { ...child.props };

        // Handle SVG elements
        if (typeof elementType === 'string' &&
            ['path', 'circle', 'rect', 'line'].includes(elementType)) {
            if (props.strokeWidth !== undefined) {
                newProps.strokeWidth = props.strokeWidth / scale;
            }
        }

        // Handle nested icon components
        if (isIconComponent(elementType)) {
            // Only spread defined props
            if (props.className !== undefined) newProps.className = props.className;
            if (props.size !== undefined) newProps.size = props.size;
            if (props.strokeWidth !== undefined) newProps.strokeWidth = props.strokeWidth;
            if (props.viewBoxSize !== undefined) newProps.viewBoxSize = props.viewBoxSize;
            if (props['aria-label'] !== undefined) newProps['aria-label'] = props['aria-label'];
        }

        // Recursively process children if they exist
        if (child.props.children) {
            newProps.children = applyIconProps(child.props.children, props, scale);
        }

        return cloneElement(child, newProps);
    });
};

/**
 * Creates a React component for an icon based on the provided content.
 * The content can be a string representing SVG path data or a ReactNode
 * for custom SVG elements. The resulting component accepts standard icon
 * properties such as className, size, and aria-label.
 *
 * The function defaults are meant to work with tabler icons.
 *
 * @param {IconContent} content - The SVG path data or ReactNode to define the icon's appearance.
 * @param {IconCreationOptions} options - Options for default size and viewBox size
 * @returns {React.FC<IconProps>} A React functional component.
 */
export const createIconComponent = (
    content: IconContent,
    options: IconCreationOptions = {}
) => {
    const { defaultSize = 24,
        defaultViewBoxSize = 24,
        setStrokeColor = false,
        strokeLinecap = '',
        strokeLinejoin = '',
        setFillColor = false
    } = options;

    const IconComponent = ({
        className = '',
        size = defaultSize,
        viewBoxSize = defaultViewBoxSize,
        strokeWidth = 2,
        'aria-label': ariaLabel
    }: IconProps) => {
        // Calculate scale factor if viewBox size differs from default
        const scale = viewBoxSize / defaultViewBoxSize;

        const props = {
            className,
            size,
            viewBoxSize,
            strokeWidth,
            'aria-label': ariaLabel
        };

        const processedContent = typeof content === 'string'
            ? (
                <path
                    d={content}
                    stroke="currentColor"
                    strokeWidth={strokeWidth / scale}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )
            : applyIconProps(content, props, scale);

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
                <g transform={scale !== 1 ? `scale(${scale})` : undefined}
                {...setStrokeColor && { stroke: 'currentColor' }}
                {...strokeLinecap !== '' && { strokeLinecap }}
                {...strokeLinejoin !== '' && { strokeLinejoin }}
                {...setFillColor && { fill: 'currentColor' }}
                >
                    {processedContent}
                </g>
            </svg >
        );
    };

    IconComponent.displayName = 'Icon';
    return IconComponent;
};

/*
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

// Usage at creation
export const CaretDownIcon = createIconComponent(
    "M3 6L8 11L13 6",
    { defaultSize: 16, defaultViewBoxSize: 16 }
);
*/