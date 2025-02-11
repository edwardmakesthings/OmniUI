import { BaseDefinition } from './BaseDefinition';
import { ComponentConfig } from './ComponentConfig';
import { EntityId } from '../types/EntityTypes';

/**
 * Instance of a component in a layout
 */
export interface ComponentInstance extends BaseDefinition {
    definitionId: EntityId;
    overrides: Partial<ComponentConfig>;
    state: ComponentInstanceState;
    internalBindings: Record<string, BindingConfig>;
    externalBindings: Record<string, ExternalBindingConfig>;
    // validateBindings(): BindingValidationResult;
}

export interface ComponentInstanceState {
    isHovered: boolean;
    isFocused: boolean;
    isPressed: boolean;
    isActive: boolean;
    isDisabled: boolean;
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