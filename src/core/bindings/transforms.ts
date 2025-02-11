export type TransformFunction = (value: any) => any;

export const CommonTransforms = {
    // Boolean transforms
    invert: (value: boolean) => !value,
    toBool: (value: any) => Boolean(value),

    // String transforms
    toString: (value: any) => String(value),
    toLowerCase: (value: string) => value.toLowerCase(),
    toUpperCase: (value: string) => value.toUpperCase(),
    trim: (value: string) => value.trim(),

    // Number transforms
    toNumber: (value: string) => Number(value),
    round: (value: number) => Math.round(value),
    floor: (value: number) => Math.floor(value),
    ceil: (value: number) => Math.ceil(value),

    // Formatting transforms
    formatCurrency: (value: number) => `$${value.toFixed(2)}`,
    formatPercent: (value: number) => `${(value * 100).toFixed(1)}%`,
    formatDate: (value: Date | string) => new Date(value).toLocaleDateString(),

    // Array/Collection transforms
    length: (value: Array<any> | string) => value.length,
    isEmpty: (value: Array<any> | string) => value.length === 0,

    // Compound transforms
    isNonEmptyString: (value: string) => value.trim().length > 0,
    hasMinLength: (min: number) => (value: string) => value.length >= min,
    hasMaxLength: (max: number) => (value: string) => value.length <= max,
} as const;

// Type for referencing transform names
export type CommonTransformKey = keyof typeof CommonTransforms;