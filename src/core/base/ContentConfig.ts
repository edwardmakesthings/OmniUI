/**
 * Configuration for component content
 */
export interface ContentProperty {
    name: string;
    label?: string;
    inputType: string; // 'text', 'number', 'boolean', 'select', etc.
    format?: string;
    defaultValue: any;
    value?: any;
    required?: boolean;
    readOnly?: boolean;
    description?: string;
    range?: {
        min?: number;
        max?: number;
    };
    options?: Array<{
        label: string;
        value: any;
    }>;
}

export interface ContentConfig {
    properties: ContentProperty[];
}