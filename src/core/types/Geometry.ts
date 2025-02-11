import { Measurement, MeasurementUtils, UnitType, ConversionContext } from "./Measurement";

/**
 * Base interface for vectorized measurements
 */
export interface MeasurementVector {
    [key: string]: Measurement;
}

/**
 * Base utilities for handling vector measurements
 */
export const MeasurementVectorUtils = {
    /**
     * Applies a function to each measurement in a vector
     * @param vector The measurement vector to transform
     * @param operation The operation to apply to each measurement
     * @returns A new vector with transformed measurements
     */
    transform(
        vector: MeasurementVector,
        operation: (measurement: Measurement) => Measurement
    ): MeasurementVector {
        const result: MeasurementVector = {};
        for (const key in vector) {
            result[key] = operation(vector[key]);
        }
        return result;
    },

    /**
     * Converts a measurement vector to a target unit
     * @param vector The measurement vector to convert
     * @param targetUnit The unit to convert to
     * @param context Optional context for unit conversions
     * @returns The converted measurement vector
     */
    convert(
        vector: MeasurementVector,
        targetUnit: UnitType = 'px',
        context?: ConversionContext
    ): MeasurementVector {
        return this.transform(vector, measurement =>
            MeasurementUtils.convert(measurement, targetUnit, context)
        );
    },

    /**
     * Combines two measurement vectors into a new one by applying an operation to matching keys
     * @param a The first measurement vector
     * @param b The second measurement vector
     * @param operation The operation to apply to each pair of measurements
     * @returns A new measurement vector with the results of the operation
     */
    combine(
        a: MeasurementVector,
        b: MeasurementVector,
        operation: (a: Measurement, b: Measurement) => Measurement
    ): MeasurementVector {
        const result: MeasurementVector = {};
        for (const key in a) {
            result[key] = operation(a[key], b[key]);
        }
        return result;
    },

    /**
     * Adds two measurement vectors together. The result is always in pixels.
     * If the vectors are in different units, they are first converted to pixels.
     * @param a The first measurement vector
     * @param b The second measurement vector
     * @param context Optional context for unit conversions
     * @returns The sum of the two measurement vectors in pixels
     */
    add(
        a: MeasurementVector,
        b: MeasurementVector,
        context?: ConversionContext
    ): MeasurementVector {
        const aPixels = this.convert(a, 'px', context);
        const bPixels = this.convert(b, 'px', context);

        return this.combine(aPixels, bPixels, (aMeasure, bMeasure) =>
            MeasurementUtils.create(aMeasure.value + bMeasure.value, 'px'));
    }
};

/**
 * Represents a position in 2D space
 */
export interface Position extends MeasurementVector {
    x: Measurement;
    y: Measurement;
}

/**
 * Represents a flexible size input value that can be converted to a Position object.
 * - number: treated as pixels
 * - Measurement: creates uniform size using the measurement
 * - Position: used directly
 * - null/undefined: allows for optional values
 */
export type PositionValue = number | Measurement | Position | undefined | null;

/**
 * Position-specific utilities that extend vector utils
 */
export const PositionUtils = {
    /**
     * Creates a new position object with the given measurements
     * @param x The measurement for the x-coordinate
     * @param y The measurement for the y-coordinate
     * @returns A new Position object with the given measurements
     */
    create(x: Measurement, y: Measurement): Position {
        return { x, y };
    },

    /**
     * Creates a position object with both x and y coordinates set to the given value and unit.
     * @param value The numeric value to set for both x and y coordinates
     * @param unit The unit to use for both x and y coordinates
     * @returns A Position object with both x and y measurements set to the given value
     */
    uniform(value: number, unit: UnitType = 'px'): Position {
        const measurement = MeasurementUtils.create(value, unit);
        return { x: measurement, y: measurement };
    },

    /**
     * Creates a position object with both x and y coordinates set to zero.
     */
    zero(): Position {
        return this.uniform(0, 'px');
    },

    /**
     * Converts a position object to a specified unit.
     * @param position The position object to convert.
     * @param targetUnit The unit to convert the position to.
     * @param context Optional context for unit conversions.
     * @returns A new position object with coordinates converted to the target unit.
     */
    convert(
        position: Position,
        targetUnit: UnitType = 'px',
        context?: ConversionContext
    ): Position {
        return MeasurementVectorUtils.convert(position, targetUnit, context) as Position;
    },

    /**
     * Adds two positions together to create a new position.
     * @param a The first position to add
     * @param b The second position to add
     * @param context Optional context for unit conversions
     * @returns A new position object with coordinates equal to the sum of the input positions
     */
    add(
        a: Position,
        b: Position,
        context?: ConversionContext
    ): Position {
        return MeasurementVectorUtils.add(a, b, context) as Position;
    },

    /**
     * Compares two positions to determine if they are equal.
     * @param a The first position to compare
     * @param b The second position to compare
     * @param context Optional context for unit conversions
     * @returns True if the two positions are equal, false otherwise.
     */
    equals(
        a: Position,
        b: Position,
        context?: ConversionContext
    ): boolean {
        const aPixels = this.convert(a, 'px', context);
        const bPixels = this.convert(b, 'px', context);

        return Math.abs(aPixels.x.value - bPixels.x.value) < Number.EPSILON &&
            Math.abs(aPixels.y.value - bPixels.y.value) < Number.EPSILON;
    },

    /**
     * Creates a Position object from a given value. If the value is undefined or null,
     * it returns a default Position. If the value is a number, it treats it as a position in pixels.
     * If the value is a Measurement, it creates a uniform Position with x and y set
     * to the measurement's value and unit. If the value is already a Position, it returns it.
     *
     * @param value The input value which can be a number, Measurement, or Position
     * @param defaultValue The default Position to return if the input value is null or undefined
     * @returns A Position object derived from the input value or the default Position
     */
    fromValue(
        value: PositionValue,
        defaultValue: Position
    ): Position {
        // If the value is undefined or null, return the default value
        if (!value) return defaultValue;

        // If the value is a number, treat it as pixels
        if (typeof value === 'number') {
            return this.uniform(value, 'px');
        }

        // If the value is a measurement, create a uniform position
        if ('unit' in value && 'value' in value) {
            return this.uniform((value as Measurement).value, (value as Measurement).unit);
        }

        // If the value is a position, return it
        return value;
    },
};

/**
 * Represents dimensions in 2D space
 */
export interface Size extends MeasurementVector {
    width: Measurement;
    height: Measurement;
}

/**
 * Represents a flexible size input value that can be converted to a Size object.
 * - number: treated as pixels
 * - Measurement: creates uniform size using the measurement
 * - Size: used directly
 * - null/undefined: allows for optional values
 */
export type SizeValue = number | Measurement | Size | undefined | null;

/**
 * Size-specific utilities that extend vector utils
 */
export const SizeUtils = {
    /**
     * Creates a new size object with the given measurements
     * @param width The measurement for the width
     * @param height The measurement for the height
     * @returns A new Size object with the given measurements
     */
    create(width: Measurement, height: Measurement): Size {
        return { width, height };
    },

    /**
     * Creates a size object with both width and height set to the given value and unit.
     * @param value The numeric value to set for both width and height
     * @param unit The unit to use for both width and height
     * @returns A Size object with both width and height measurements set to the given value
     */
    uniform(value: number, unit: UnitType = 'px'): Size {
        const measurement = MeasurementUtils.create(value, unit);
        return { width: measurement, height: measurement };
    },

    /**
     * Converts a size object to a specified unit.
     * @param size The size object to convert.
     * @param targetUnit The unit to convert the size to.
     * @param context Optional context for unit conversions.
     * @returns A new size object with dimensions converted to the target unit.
     */
    convert(
        size: Size,
        targetUnit: UnitType = 'px',
        context?: ConversionContext
    ): Size {
        return MeasurementVectorUtils.convert(size, targetUnit, context) as Size;
    },

    /**
     * Adds two sizes together to create a new size.
     * @param a The first size to add
     * @param b The second size to add
     * @param context Optional context for unit conversions
     * @returns A new size object with dimensions equal to the sum of the input sizes
     */
    add(
        a: Size,
        b: Size,
        context?: ConversionContext
    ): Size {
        return MeasurementVectorUtils.add(a, b, context) as Size;
    },

    /**
     * Compares two sizes to determine if they are equal.
     * @param a The first size to compare
     * @param b The second size to compare
     * @param context Optional context for unit conversions
     * @returns True if the two sizes are equal, false otherwise.
     */
    equals(
        a: Size,
        b: Size,
        context?: ConversionContext
    ): boolean {
        const aPixels = this.convert(a, 'px', context);
        const bPixels = this.convert(b, 'px', context);

        return Math.abs(aPixels.width.value - bPixels.width.value) < Number.EPSILON &&
            Math.abs(aPixels.height.value - bPixels.height.value) < Number.EPSILON;
    },

    /**
     * Creates a Size object from a SizeValue input.
     * - If given a number, creates a uniform Size in pixels
     * - If given a Measurement, creates a uniform Size with that measurement
     * - If given a Size, returns it directly
     * - If given null/undefined, returns the default value
     *
     * @param value The input value to convert to a Size
     * @param defaultValue The Size to return if value is null/undefined
     * @returns A Size object representing the input value
     *
     * @example
     * // From number (pixels)
     * SizeUtils.fromValue(42, defaultSize) // { width: 42px, height: 42px }
     *
     * // From measurement
     * SizeUtils.fromValue(MeasurementUtils.create(3, 'rem'), defaultSize)
     *
     * // From existing Size
     * SizeUtils.fromValue(existingSize, defaultSize)
     *
     * // Handling undefined
     * SizeUtils.fromValue(undefined, defaultSize) // returns defaultSize
     */
    fromValue(
        value: SizeValue,
        defaultValue: Size
    ): Size {
        // If the value is undefined or null, return the default value
        if (!value) return defaultValue;

        // If the value is a number, treat it as pixels
        if (typeof value === 'number') {
            return this.uniform(value, 'px');
        }

        // If the value is a measurement, create a uniform size
        if ('unit' in value && 'value' in value) {
            return this.uniform((value as Measurement).value, (value as Measurement).unit);
        }

        // If the value is a size, return it
        return value;
    },

    /**
     * Converts a SizeValue to a Size based on presets.
     * @param value The input value which can be a string (preset key), number (pixels), Measurement, or Size
     * @param presets The presets object
     * @param dimension The dimension of the preset to retrieve (e.g. 'width' or 'height')
     * @param defaultPreset The default preset key if no value is provided
     * @returns A Size object derived from the input value or the default preset
     *
     * @example
     * // From preset key
     * SizeUtils.fromPreset('lg', { lg: { width: 100, height: 200 } }, 'width', 'md')
     *
     * // From number (pixels)
     * SizeUtils.fromPreset(42, { lg: { width: 100, height: 200 } }, 'width', 'md')
     *
     * // From measurement
     * SizeUtils.fromPreset(MeasurementUtils.create(3, 'rem'), { lg: { width: 100, height: 200 } }, 'width', 'md')
     *
     * // From existing Size
     * SizeUtils.fromPreset(existingSize, { lg: { width: 100, height: 200 } }, 'width', 'md')
     *
     * // Handling undefined
     * SizeUtils.fromPreset(undefined, { lg: { width: 100, height: 200 } }, 'width', 'md') // returns default preset
     */
    fromPreset<T extends string>(
        value: T | SizeValue,
        presets: Record<string, Record<string, number | Measurement | Size>>,
        dimension: string,
        defaultPreset: T
    ): Size {
        // If no value is provided, return the preset dimension as a Size
        if (!value) {
            const presetValue = presets[defaultPreset][dimension];
            return this.fromValue(presetValue, this.minimum());
        }

        // If it's a preset key, convert that dimension to a Size
        if (typeof value === 'string') {
            const presetValue = presets[value in presets ? value : defaultPreset][dimension];
            return this.fromValue(presetValue, this.minimum());
        }

        // For non-preset values, treat as regular size value
        return this.fromValue(value, this.minimum());
    },

    /**
     * Creates a size object with minimum usable dimensions (1x1 pixels)
     * @returns A Size object with minimum dimensions
     */
    minimum(): Size {
        return this.uniform(1, 'px');
    },

    /**
     * Checks if one size fits within another
     * @param size The size to check
     * @param container The container size to check against
     * @param context Optional context for unit conversions
     * @returns True if size fits within container
     */
    fits(
        size: Size,
        container: Size,
        context?: ConversionContext
    ): boolean {
        const pixelSize = this.convert(size, 'px', context);
        const pixelContainer = this.convert(container, 'px', context);

        return pixelSize.width.value <= pixelContainer.width.value &&
            pixelSize.height.value <= pixelContainer.height.value;
    },

    /**
     * Calculates the area of the size in square pixels
     * @param size The size to calculate area for
     * @param context Optional context for unit conversions
     * @returns The area in square pixels
     */
    area(
        size: Size,
        context?: ConversionContext
    ): number {
        const pixelSize = this.convert(size, 'px', context);
        return pixelSize.width.value * pixelSize.height.value;
    }
};