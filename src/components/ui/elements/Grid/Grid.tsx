// src/components/atoms/Grid/Grid.tsx
import { type CSSProperties, memo } from 'react';

export type GridMode = 'overlay' | 'contained';

export interface GridProps {
  /** Display mode of the grid.
   * - 'overlay': Fixed position covering entire viewport
   * - 'contained': Relative position within parent container
   * Default: 'overlay' */
  mode?: GridMode;
  /** Size of each grid cell in pixels. Default: 20 */
  cellSize?: number;
  /** Color of grid lines in any valid CSS color format. Default: #E5E7EB */
  color?: string;
  /** Line thickness in pixels. Default: 1 */
  thickness?: number;
  /** Controls grid visibility. Default: true */
  visible?: boolean;
  /** Optional CSS class name to override default styles */
  className?: string;
  /** Z-index for the grid. Default: 50 */
  zIndex?: number;
}

/**
 * Grid component that renders a line grid either as a fullscreen overlay
 * or contained within its parent element.
 *
 * @example
 * ```tsx
 * // Full screen overlay
 * <Grid mode="overlay" />
 *
 * // Contained within parent
 * <div className="relative w-96 h-96">
 *   <Grid mode="contained" />
 *   <div>Your content here</div>
 * </div>
 *
 * // Custom configuration
 * <Grid
 *   mode="overlay"
 *   cellSize={40}
 *   color="#CBD5E1"
 *   thickness={2}
 *   visible={showGrid}
 *   zIndex={100}
 * />
 * ```
 */
export const Grid = memo(function Grid({
  mode = 'contained',
  cellSize = 20,
  color = 'rgba(225,225,225,0.05)',
  thickness = 1,
  visible = true,
  className = '',
  zIndex = 50,
}: GridProps) {
  if (!visible) return null;

  const gridStyle: CSSProperties = {
    backgroundImage: `
      linear-gradient(to right, ${color} ${thickness}px, transparent ${thickness}px),
      linear-gradient(to bottom, ${color} ${thickness}px, transparent ${thickness}px)
    `,
    backgroundSize: `${cellSize}px ${cellSize}px`,
    zIndex,
  };

  // Base classes that apply to both modes
  const baseClasses = 'pointer-events-none select-none';

  // Position classes based on mode
  const positionClasses = mode === 'overlay'
    ? 'fixed inset-0'
    : 'absolute inset-0';

  return (
    <div
      className={`${baseClasses} ${positionClasses} ${className}`.trim()}
      data-testid="grid-overlay"
      data-grid-mode={mode}
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={gridStyle}
        aria-hidden="true"
      />
    </div>
  );
});

// Barrel export
export default Grid;