/**
 * Gets the numeric value of a CSS variable
 * @param variableName - The CSS variable name (with or without var(--)
 * @param fallbackValue - Fallback value if the variable can't be resolved
 * @returns The numeric value (stripped of units) or fallback
 */
export function getCSSVariableValue(variableName: string, fallbackValue: number): number {
    try {
        // Strip var() if present
        const cleanName = variableName.replace(/var\(|\)/g, '');
        // Ensure -- prefix
        const fullName = cleanName.startsWith('--') ? cleanName : `--${cleanName}`;

        const value = getComputedStyle(document.documentElement)
            .getPropertyValue(fullName)
            .trim();

        if (!value) return fallbackValue;

        // Convert to number, stripping units if present
        const numericValue = parseFloat(value);
        return isNaN(numericValue) ? fallbackValue : numericValue;
    } catch (e) {
        console.warn(`Failed to get CSS variable value for ${variableName}`, e);
        return fallbackValue;
    }
};