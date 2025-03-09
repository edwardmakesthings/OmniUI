import { BaseDefinition } from './BaseDefinition';
import { ComponentConfig } from './ComponentConfig';
import { EntityId } from '../types/EntityTypes';
import { BaseState } from '@/components/base/interactive/types';
import { ComponentType } from '../types/ComponentTypes';

/**
 * Instance of a component in a layout
 */
export interface ComponentInstance extends BaseDefinition {
    definitionId: EntityId;
    type: ComponentType;
    overrides: Partial<ComponentConfig>;
    state: BaseState;
    internalBindings: Record<string, BindingConfig>;
    externalBindings: Record<string, ExternalBindingConfig>;
    // validateBindings(): BindingValidationResult;

    parentId?: EntityId;      // Parent container ID (null for root components)
    layoutId?: EntityId;      // Which layout container this instance belongs to
    layoutIndex?: number;     // Optional z-order within the layout

    constraints?: {
        rowSpan?: number;    // How many grid cells this component spans horizontally
        colSpan?: number;    // How many grid cells this component spans vertically
        rowAlign?: string;   // Alignment within the cell horizontally
        colAlign?: string;   // Alignment within the cell vertically
        margin?: {           // Margin around the component
            top?: number;
            right?: number;
            bottom?: number;
            left?: number;
        }
    };
}

export interface BindingConfig {
    conditions: Array<{
        sourceInstanceId: EntityId;
        sourceProperty: string;
        expectedValue?: any;
        transform?: (value: any) => any;
        // operator?: BindingOperator;
    }>;
    combineMode: 'all' | 'any' | 'none';
}

export interface ExternalBindingConfig {
    type: 'function' | 'state' | 'dataSource' | 'event' | 'permission';
    target: string;
    parameters?: Record<string, any>;
    transformBefore?: string;
    transformAfter?: string;
    fallbackValue?: any;
    errorHandler?: string;
}