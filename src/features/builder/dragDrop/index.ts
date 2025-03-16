// src/features/builder/dragDrop/index.ts

// Core functionality
export * from './DragDropCore';
export * from './DropZone';
export * from './ComponentDragDrop';

// Hooks
export * from './hooks';

// Named imports
import useDragDrop, {
    useDraggable,
    useDroppable,
    useDragAndDrop
} from './DragDropCore';

import dropZoneManager, {
    DropPosition,
} from './DropZone';

import ComponentDragDrop from './ComponentDragDrop';
import hooks from './hooks';

// Default combined export
export default {
    // Core store
    useDragDrop,
    useDraggable,
    useDroppable,
    useDragAndDrop,

    // Drop zone management
    dropZoneManager,
    DropPosition,

    // Component operations
    ComponentDragDrop,

    // All hooks
    hooks
};