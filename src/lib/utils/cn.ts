import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with Tailwind CSS classes
 * Uses clsx for conditional classes and twMerge for Tailwind-specific merging
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}