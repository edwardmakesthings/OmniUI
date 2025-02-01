export class StoreError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'StoreError';
    }
}

// Common error codes
export const StoreErrorCodes = {
    // Component Store
    INVALID_DEFINITION: 'INVALID_DEFINITION',
    DEFINITION_NOT_FOUND: 'DEFINITION_NOT_FOUND',
    INVALID_INSTANCE: 'INVALID_INSTANCE',
    INSTANCE_NOT_FOUND: 'INSTANCE_NOT_FOUND',

    // UI Store
    INVALID_PANEL_ID: 'INVALID_PANEL_ID',
    INVALID_GRID_SETTINGS: 'INVALID_GRID_SETTINGS',
    INVALID_COMPONENT_SELECTION: 'INVALID_COMPONENT_SELECTION'
} as const;

export type StoreErrorCode = typeof StoreErrorCodes[keyof typeof StoreErrorCodes];