// src/core/index.ts
import { initializeComponentSystem } from '../registry';
import { useDragDrop, useDraggable, useDroppable, useDragAndDrop } from './drag-drop/DragDropManager';
import { useComponentPanelDrag, useWidgetDropTarget, useComponentDragDrop } from './drag-drop/widgetHooks';

/**
 * Initialize all core systems
 */
export function initializeCoreSystem() {
    // Initialize component registry and renderer system
    initializeComponentSystem();

    console.log('Core system initialized');
}

// Export component system
export {
    useComponents,

    // Also re-export from registry
    renderComponent,
    renderComponentHierarchy
} from '../registry';

// Export drag-drop system
export {
    useDragDrop,
    useDraggable,
    useDroppable,
    useDragAndDrop,

    // Widget-specific hooks
    useComponentPanelDrag,
    useWidgetDropTarget,
    useComponentDragDrop
};

// Export types
export type {
    ComponentRenderProps,
    ComponentRenderer
} from '../registry/componentRegistry';

export type {
    DragSource,
    DropTarget,
    DropIndicator
} from './drag-drop/DragDropManager';