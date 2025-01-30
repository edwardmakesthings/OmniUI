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
    convert(vector: MeasurementVector, targetUnit: UnitType, context?: ConversionContext): MeasurementVector {
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
    add(a: MeasurementVector, b: MeasurementVector, context?: ConversionContext): MeasurementVector {
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
    uniform(value: number, unit: UnitType): Position {
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
    convert(position: Position, targetUnit: UnitType, context?: ConversionContext): Position {
        return MeasurementVectorUtils.convert(position, targetUnit, context) as Position;
    },

    /**
     * Adds two positions together to create a new position.
     * @param a The first position to add
     * @param b The second position to add
     * @param context Optional context for unit conversions
     * @returns A new position object with coordinates equal to the sum of the input positions
     */
    add(a: Position, b: Position, context?: ConversionContext): Position {
        return MeasurementVectorUtils.add(a, b, context) as Position;
    }
};

/**
 * Represents dimensions in 2D space
 */
export interface Size extends MeasurementVector {
    width: Measurement;
    height: Measurement;
}

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
    uniform(value: number, unit: UnitType): Size {
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
    convert(size: Size, targetUnit: UnitType, context?: ConversionContext): Size {
        return MeasurementVectorUtils.convert(size, targetUnit, context) as Size;
    },

    /**
     * Adds two sizes together to create a new size.
     * @param a The first size to add
     * @param b The second size to add
     * @param context Optional context for unit conversions
     * @returns A new size object with dimensions equal to the sum of the input sizes
     */
    add(a: Size, b: Size, context?: ConversionContext): Size {
        return MeasurementVectorUtils.add(a, b, context) as Size;
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
    fits(size: Size, container: Size, context?: ConversionContext): boolean {
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
    area(size: Size, context?: ConversionContext): number {
        const pixelSize = this.convert(size, 'px', context);
        return pixelSize.width.value * pixelSize.height.value;
    }
};