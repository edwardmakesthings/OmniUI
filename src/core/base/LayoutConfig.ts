import { Position, Size } from '../types/Geometry';

/**
 * Configuration for component layout
 */
export interface LayoutConfig {
    position: Position;     // x,y coordinates
    size: Size;            // width, height
    gridPosition?: {       // Optional grid-based positioning
        row: number;
        col: number;
    };
}