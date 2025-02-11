export class StoreError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'StoreError';
    }
}

export const StoreErrorCodes = {
    // Component Store
    INVALID_DEFINITION: 'INVALID_DEFINITION',
    DEFINITION_NOT_FOUND: 'DEFINITION_NOT_FOUND',
    INVALID_INSTANCE: 'INVALID_INSTANCE',
    INSTANCE_NOT_FOUND: 'INSTANCE_NOT_FOUND',
    BINDING_NOT_FOUND: 'BINDING_NOT_FOUND',

    // UI Store
    INVALID_PANEL_ID: 'INVALID_PANEL_ID',
    INVALID_GRID_SETTINGS: 'INVALID_GRID_SETTINGS',
    INVALID_COMPONENT_SELECTION: 'INVALID_COMPONENT_SELECTION'
} as const;

export type StoreErrorCode = typeof StoreErrorCodes[keyof typeof StoreErrorCodes];

/**
 * Checks if a given string value is a valid StoreErrorCode.
 *
 * @param {string} value - The string value to check.
 * @returns {boolean} - Returns true if the value is a valid StoreErrorCode, otherwise false.
 */
export function isStoreErrorCode(value: string): value is StoreErrorCode {
    return Object.values(StoreErrorCodes).includes(value as StoreErrorCode);
}