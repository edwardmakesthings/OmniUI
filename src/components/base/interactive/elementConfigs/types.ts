import { HTMLAttributes, ReactNode } from "react";
import { ElementHandlers, ElementType } from "@/components/base/interactive/types";
import { BaseInteractorProps, BaseState } from "@/components/base/interactive/types";
import { StyleVariants } from "@/components/base/style/types";
import { BehaviorDefinition } from "@/components/base/interactive/behaviors/types";

/**
 * Configuration interface for element rendering and behavior
 * Used to define how different HTML elements should behave in the BaseInteractor
 */
export interface ElementConfig<T extends HTMLElement> {
    /**
     * Get props to apply to the rendered element
     * @param baseProps The props passed to the BaseInteractor
     * @param handlers Event handlers for the element
     * @param state Current state of the element
     */
    getProps: (
        baseProps: Omit<BaseInteractorProps, "as">,
        handlers: ElementHandlers<T>,
        state: BaseState
    ) => HTMLAttributes<T>;

    /**
     * Render the element with the generated props and styles
     * @param props HTML attributes to apply
     * @param styles Computed styles for different parts of the component
     * @param children Child content to render
     */
    render: (
        props: HTMLAttributes<T>,
        styles: Record<string, string>,
        children?: ReactNode
    ) => JSX.Element;

    /**
     * Get default styles for the element
     * @param elements Style element names to generate styles for
     */
    getDefaultStyles?: (elements: string[]) => StyleVariants<string>;

    /**
     * Default behavior to apply if none is provided in props
     */
    defaultBehavior?: BehaviorDefinition<BaseState>;

    /**
     * List of behavior names that are compatible with this element
     */
    supportedBehaviors?: string[];
}

/**
 * Map of element types to their configurations
 */
export type ElementConfigurations = {
    [K in ElementType]: ElementConfig<any>;
};