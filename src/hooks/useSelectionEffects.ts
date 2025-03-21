/**
 * @file src/hooks/useSelectionEffects.ts
 * Hook for handling DOM updates related to selection state.
 * This hook moves DOM manipulations out of stores and into React components.
 */

import eventBus from '@/core/eventBus/eventBus';
import { EntityId } from '@/core/types/EntityTypes';
import { useUIStore } from '@/store/uiStore';
import { useEffect } from 'react';
import { useComponentSelection } from './useComponentSelection';

/**
 * Options for selection effects
 */
interface SelectionEffectsOptions {
    /**
     * The CSS class to apply to selected elements
     * @default 'selected-component'
     */
    selectedClass?: string;

    /**
     * The data attribute to use for identifying components in DOM
     * @default 'data-component-id'
     */
    componentAttr?: string;

    /**
     * The data attribute to set on selected elements
     * @default 'data-selected'
     */
    selectedAttr?: string;
}

/**
 * Hook that handles DOM updates when selection changes.
 * This ensures the UI correctly reflects selected components.
 *
 * @param options - Configuration options for selection effects
 */
export function useSelectionEffects(options: SelectionEffectsOptions = {}) {
    const {
        selectedClass = 'selected-component',
        componentAttr = 'data-component-id',
        selectedAttr = 'data-selected'
    } = options;

    // Get selection state from UI store
    const {
        selectedComponentId,
        previousComponentId,
    } = useUIStore(state => ({
        selectedComponentId: state.selectedComponentId,
        previousComponentId: state.previousComponentId,
    }));

    // Update DOM when selection changes
    useEffect(() => {
        // Function to update DOM selection state
        const updateDomSelection = (
            newComponentId: EntityId | null,
            oldComponentId: EntityId | null
        ) => {
            try {
                // Remove selection from previously selected component
                if (oldComponentId) {
                    const previousElements = document.querySelectorAll(
                        `[${componentAttr}="${oldComponentId}"]`
                    );

                    previousElements.forEach(el => {
                        el.classList.remove(selectedClass);
                        el.setAttribute(selectedAttr, 'false');
                    });
                }

                // Add selection to newly selected component
                if (newComponentId) {
                    const newElements = document.querySelectorAll(
                        `[${componentAttr}="${newComponentId}"]`
                    );

                    newElements.forEach(el => {
                        el.classList.add(selectedClass);
                        el.setAttribute(selectedAttr, 'true');
                    });
                }
            } catch (e) {
                console.error('Error updating DOM selection:', e);
            }
        };

        // Update DOM with current selection state
        updateDomSelection(selectedComponentId, previousComponentId);
    }, [selectedComponentId, previousComponentId, selectedClass, componentAttr, selectedAttr]);
}

/**
 * Hook that sets up keyboard shortcuts for selection operations
 */
export function useSelectionKeyboardShortcuts() {
    const {
        selectedComponentId,
        selectedWidgetId,
        deselect,
        deleteSelected
    } = useComponentSelection();

    // Set up keyboard event handlers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only process if target is not an input element
            if (
                document.activeElement?.tagName === 'INPUT' ||
                document.activeElement?.tagName === 'TEXTAREA'
            ) {
                return;
            }

            // ESC - Deselect all
            if (e.key === 'Escape') {
                deselect();

                // Publish deselection event
                if (selectedWidgetId) {
                    eventBus.publish("component:deselected", {
                        widgetId: selectedWidgetId
                    });
                }
            }

            // Delete/Backspace - Delete selected component
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentId) {
                // Store IDs before deletion
                const compId = selectedComponentId;
                const widgetId = selectedWidgetId;

                // Delete component
                deleteSelected();

                // Publish deletion event if IDs exist
                if (compId && widgetId) {
                    eventBus.publish("component:deleted", {
                        componentId: compId,
                        widgetId: widgetId
                    });
                }
            }
        };

        // Add and remove event listener
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedComponentId, selectedWidgetId, deselect, deleteSelected]);
}

/**
 * Custom hook that combines selection effects and keyboard shortcuts
 */
export function useSelectionManager(options?: SelectionEffectsOptions) {
    // Apply DOM selection effects
    useSelectionEffects(options);

    // Set up keyboard shortcuts
    useSelectionKeyboardShortcuts();
}