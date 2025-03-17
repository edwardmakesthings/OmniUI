// import { BaseInteractor } from "@/components/base/interactive";
// import { RenderElementProps } from "@/components/base/interactive/types";
// import componentPreset from "@/components/base/style/presets/component";
// import { ReactNode } from "react";

// export interface ComponentProps {
//     // Group props by category
//     // Content props
//     children?: ReactNode;

//     // Behavior props
//     value?: string;
//     onChange?: (value: string) => void;

//     // Style props
//     variant?: ComponentVariant;
//     className?: string;

//     // Pass remaining props to BaseInteractor
//     [key: string]: any;
// }

// export const Component = ({
//     // Content props
//     children,

//     // Behavior props
//     value,
//     onChange,

//     // Style props
//     variant = "default",
//     className,

//     ...props
// }: ComponentProps) => {
//     // Component logic here

//     // Rendering function for BaseInteractor
//     const renderComponent = ({
//         elementProps,
//         state,
//         computedStyle,
//     }: RenderElementProps) => (
//         <element {...elementProps} className={computedStyle.root}>
//             {children}
//         </element>
//     );

//     return (
//         <BaseInteractor
//             as="element-type"
//             stylePreset={componentPreset}
//             styleProps={{
//                 variant,
//                 elements: {
//                     root: { base: className },
//                     // other elements as needed
//                 },
//             }}
//             renderElement={renderComponent}
//             {...props}
//         />
//     );
// };
