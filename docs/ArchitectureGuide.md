# OmniUI Architecture Guide

This document provides a comprehensive overview of the OmniUI application architecture, highlighting the patterns, practices, and systems implemented in the recent refactoring.

## Core Architecture Overview

OmniUI uses a modular architecture based on Zustand stores with clear separation of concerns:

1. **UIStore** - UI configuration, panel management, and selection state
2. **ComponentStore** - Component definitions and instances
3. **WidgetStore** - Widgets (containers for components) and layout relationships
4. **Registry System** - Component registration and rendering
5. **Event System** - Cross-component communication
6. **Service Layer** - Cross-store operations

## Store Architecture

### UIStore (`src/store/uiStore.ts`)

**Responsibilities:**

-   UI configuration (panels, grids, toolbars)
-   Selection state management
-   Edit mode toggles
-   Panel visibility and configuration

**Key improvements:**

-   Consolidated selection logic from the deprecated selectionStore
-   Clean API for selection operations
-   Panel configuration management

**Usage example:**

```typescript
const { selectComponent, deselectAll, isComponentSelected } = useUIStore();

// Select a component
selectComponent(componentId, widgetId);

// Check if a component is selected
const isSelected = isComponentSelected(componentId);
```

### ComponentStore (`src/store/componentStore.ts`)

**Responsibilities:**

-   Component definitions (templates)
-   Component instances (concrete implementations)
-   Component state (hover, focus, etc.)
-   Component bindings (connections between components)

**Usage example:**

```typescript
const { createFromDefinition, getInstance } = useComponentStore();

// Create a component instance
const instance = createFromDefinition(definitionId, overrides);

// Get component instance
const componentInstance = getInstance(instanceId);
```

### WidgetStore (`src/store/widgetStore.ts`)

**Responsibilities:**

-   Widget management (containers of components)
-   Component hierarchy within widgets
-   Component positioning in layouts
-   Widget visibility and display types

**Usage example:**

```typescript
const { addComponentToWidget, removeComponent } = useWidgetStore();

// Add a component to a widget
const component = addComponentToWidget(
    widgetId,
    definitionId,
    instanceId,
    position
);

// Remove a component
removeComponent(widgetId, componentId);
```

## Registry System

The Component Registry System handles component registration, instantiation, and rendering.

### Architecture

**Key components:**

1. **componentRegistry.tsx** - Core registry functionality
2. **componentRenderers.tsx** - Component renderer implementations
3. **registryHooks.ts** - React hooks for consuming the registry

### Initialization Flow

```
initializeComponentSystem()
  ↓
initializeComponentRegistry()
  ↓
loadComponentRegistry()
  ↓
registerComponentRenderers()
```

### Type Safety Pattern

The registry uses a robust type system with clear interfaces:

```typescript
// Base render props
interface BaseRenderProps {
    widgetId?: EntityId;
    isEditMode?: boolean;
    isSelected?: boolean;
    actionHandler?: (action: string, targetId?: EntityId) => void;
}

// Props for single component rendering
interface ComponentRenderProps extends BaseRenderProps {
    instance: ComponentInstance;
    children?: ReactNode;
    onSelect?: (id: EntityId) => void;
    onDelete?: (id: EntityId) => void;
}

// Props for component hierarchy rendering
interface HierarchyRenderOptions extends BaseRenderProps {
    onSelect?: (id: EntityId, e?: MouseEvent) => void;
    onDelete?: (id: EntityId, e?: MouseEvent) => void;
    dragDropEnabled?: boolean;
}
```

### Component Property Access

The `componentProperty` helper provides type-safe access to component properties:

```typescript
// Safe property access
const title = componentProperty.getString(
    instance,
    componentProperty.paths.title,
    "Default Title"
);

// Common paths
componentProperty.paths.title; // ['overrides', 'content', 'properties', 'title', 'value']
```

### Usage Examples

```typescript
// Get the registry
const registry = useComponentRegistry();

// Register a renderer
registry.registerRenderer(ComponentTypeValues.Panel, PanelRenderer);

// Render a component
registry.renderComponent(instance, props);

// Render a component hierarchy
registry.renderComponentHierarchy(instanceId, widgetId, options);
```

## Event System

The Event System provides a centralized approach to cross-component communication.

### Architecture

-   **eventBus.ts** - Core event bus implementation
-   **widgetEvents.ts** - Widget-specific event helpers

### Event Types

```typescript
type EventType =
    | "component:selected"
    | "component:deselected"
    | "component:added"
    | "component:deleted"
    | "component:moved"
    | "component:updated"
    | "component:reordered"
    | "hierarchy:changed"
    | "widget:updated"
    | "widget:selected"
    | "widget:deselected";
```

### Usage Examples

```typescript
// Publishing events
eventBus.publish("component:added", {
    widgetId,
    componentId,
    parentId,
});

// Subscribing to events
const subscriptionId = eventBus.subscribe("component:added", (event) => {
    // Handle event
});

// For widget-specific events
notifyWidgetChange(widgetId, "componentAdded", { componentId });
```

### React Hook Integration

```typescript
// Subscribe to events in a component
useEventSubscription("component:added", (event) => {
    // Update component state based on event
});
```

## Service Layer

The Service Layer orchestrates operations that span multiple stores.

### Architecture

-   **ComponentOperations.ts** - Operations for component manipulation
-   **builderService.ts** - Application-wide building operations

### Operation Result Pattern

```typescript
interface OperationResult<T = any> {
    success: boolean;
    data?: T;
    error?: Error;
}
```

### Usage Examples

```typescript
// Add a component
const result = addComponent(widgetId, definitionId, position, {
    autoSelect: true,
});

if (result.success) {
    // Use the new component
    const newComponentId = result.data;
} else {
    // Handle the error
    console.error(result.error);
}
```

## CSS Strategy

The CSS Strategy provides a consistent approach to styling components.

### Architecture

-   **component-styles.ts** - Core styles and utilities
-   **useComponentStyles.ts** - React hook for component styles

### Style Injection

```typescript
// Inject critical CSS
ensureComponentStyles();

// Compose class names
componentClassNames("base-class", { "conditional-class": condition });
```

## Best Practices

### Store Access

1. **Use the Builder Service** for operations involving multiple stores
2. **Use Hooks** for UI-related operations
3. **Keep Store Access Read-Only** in components when possible
4. **Access stores with getState()** when outside React components

### Type Safety

1. **Use the componentProperty helper** for accessing component instance properties
2. **Define clear interfaces** for component props
3. **Implement proper error boundaries** with OperationResult pattern
4. **Use proper event types** with React's MouseEvent<Element, MouseEvent>

### Event Handling

1. **Use eventBus for cross-component communication**
2. **Implement specific event payloads** for better debugging
3. **Keep DOM event handlers in components or hooks**
4. **Properly stop event propagation** when needed

### Component Rendering

1. **Use defined renderers** for component types
2. **Handle missing property gracefully** with fallbacks
3. **Separate rendering logic** from component definition
4. **Memoize complex rendering** for performance

## Migration Guide

### From Selection Store to UI Store

**Before:**

```typescript
const { selectedComponentId, selectComponent } = useSelectionStore();
```

**After:**

```typescript
const { selectedComponentId, selectComponent } = useUIStore();
```

### From Direct Property Access to Safe Access

**Before:**

```typescript
const title =
    instance.overrides?.content?.properties?.title?.value || "Default";
```

**After:**

```typescript
const title = componentProperty.getString(
    instance,
    componentProperty.paths.title,
    "Default"
);
```

### From DOM Events to EventBus

**Before:**

```typescript
document.dispatchEvent(
    new CustomEvent("component-added", {
        detail: { componentId },
    })
);

document.addEventListener("component-added", handleComponentAdded);
```

**After:**

```typescript
eventBus.publish("component:added", { componentId });

const subscriptionId = eventBus.subscribe(
    "component:added",
    handleComponentAdded
);
```

### From Direct Store Operations to Service Layer

**Before:**

```typescript
// Direct store interactions
const instance = componentStore.createFromDefinition(definitionId, {});
const component = widgetStore.addComponentToWidget(
    widgetId,
    definitionId,
    instance.id,
    position
);
uiStore.selectComponent(component.id, widgetId);
```

**After:**

```typescript
// Service layer handles the operation
const result = addComponent(widgetId, definitionId, position, {
    autoSelect: true,
});
```

## Future Directions

1. **Theme System** - For application-wide theming
2. **History Store** - For undo/redo functionality
3. **Persistence Service** - For saving/loading projects
4. **Analytics Integration** - For tracking user interactions
5. **Command Pattern** - For more structured operation history
6. **Plugin System** - For extending the platform
