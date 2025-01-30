/**
 * Categories of units
 */
const UnitCategoryValues = {
    Length: 'length',
    Angle: 'angle'
} as const;

export type UnitCategory = typeof UnitCategoryValues[keyof typeof UnitCategoryValues];

/**
 * Definition of a unit type with its category and conversion info
 */
interface UnitDefinition {
    symbol: string;
    category: UnitCategory;
    // Base conversion rate to the standard unit for its category
    baseConversion: number;
    // Function to convert to base unit, if more complex than multiplication
    toBase?: (value: number, context?: ConversionContext) => number;
    // Function to convert from base unit, if more complex than division
    fromBase?: (value: number, context?: ConversionContext) => number;
}

/**
 * Context information needed for certain conversions
 */
export interface ConversionContext {
    containerSize?: number; // For percentage calculations
    rootFontSize?: number; // For rem calculations
}

/**
 * Definition of all available units
 */
export const UnitTypes = {
    // Length units
    Pixels: {
        symbol: 'px',
        category: UnitCategoryValues.Length,
        baseConversion: 1
    },
    Percent: {
        symbol: '%',
        category: UnitCategoryValues.Length,
        baseConversion: 1,
        toBase: (value: number, context?: ConversionContext) =>
            context?.containerSize ? (value / 100) * context.containerSize : 0,
        fromBase: (value: number, context?: ConversionContext) =>
            context?.containerSize ? (value / context.containerSize) * 100 : 0
    },
    Rem: {
        symbol: 'rem',
        category: UnitCategoryValues.Length,
        baseConversion: 16,
        toBase: (value: number, context?: ConversionContext) =>
            value * (context?.rootFontSize ?? 16),
        fromBase: (value: number, context?: ConversionContext) =>
            value / (context?.rootFontSize ?? 16)
    },

    // Angle units
    Degrees: {
        symbol: 'deg',
        category: UnitCategoryValues.Angle,
        baseConversion: 1
    },
    Radians: {
        symbol: 'rad',
        category: UnitCategoryValues.Angle,
        baseConversion: 180 / Math.PI,
        toBase: (value: number) => value * (180 / Math.PI),
        fromBase: (value: number) => value * (Math.PI / 180)
    }
} as const;

// Type for valid unit symbols
export type UnitType = typeof UnitTypes[keyof typeof UnitTypes]['symbol'];

/**
 * Check if a given string is a valid unit type
 */
export function isUnitType(value: string): value is UnitType {
    return Object.values(UnitTypes).map(def => def.symbol).includes(value as UnitType);
}

/**
 * Represents a measurement with a specific unit
 */
export interface Measurement {
    value: number;
    unit: UnitType;
}

/**
 * Utility functions for Measurement
 */
export const MeasurementUtils = {
    /**
     * Gets the UnitDefinition for a given unit symbol
     */
    getUnitDefinition(unit: UnitType): UnitDefinition {
        const definition = Object.values(UnitTypes).find(def => def.symbol === unit);
        if (!definition) { throw new Error(`Unknown unit type: ${unit}`); }
        return definition;
    },

    /**
     * Converts a measurement to a target unit
     */
    convert(
        measurement: Measurement,
        targetUnit: UnitType,
        context?: ConversionContext
    ): Measurement {
        const sourceDefinition = this.getUnitDefinition(measurement.unit);
        const targetDefinition = this.getUnitDefinition(targetUnit);

        if(sourceDefinition.category !== targetDefinition.category) {
            throw new Error(
                `Cannot convert from ${measurement.unit} to ${targetUnit}: ` +
                `incompatible unit categories`
            );
        }

        // Convert to base unit
        let baseValue = measurement.value;
        if (sourceDefinition.toBase) {
            baseValue = sourceDefinition.toBase(baseValue, context);
        } else {
            baseValue *= sourceDefinition.baseConversion;
        }

        // Convert from base unit
        let targetValue = baseValue;
        if (targetDefinition.fromBase) {
            targetValue = targetDefinition.fromBase(targetValue, context);
        } else {
            targetValue /= targetDefinition.baseConversion;
        }

        return {
            value: targetValue,
            unit: targetUnit
        };
    },

    /**
     * Creates a new measurement
     */
    create(value: number, unit: UnitType): Measurement {
        return { value, unit };
    }
}