/**
 * Configuration for component styling
 */
export interface StyleConfig {
    classes: string[];
    overrides?: Record<string, any>;
    variant?: string;
    stylePreset?: any;
    theme?: string;
    customStyles?: {
        [key: string]: string | number;
    };
}