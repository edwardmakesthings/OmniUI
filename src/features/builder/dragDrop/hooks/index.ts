// src/features/builder/dragDrop/hooks/index.ts

export * from './useComponentDrag';
export * from './useWidgetDrop';

import componentDragHooks from './useComponentDrag';

export default {
    ...componentDragHooks
};