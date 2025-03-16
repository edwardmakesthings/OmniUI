import { useEffect, useRef } from 'react';

/**
 * Hook to register the drag and drop CSS styles
 * This ensures the styles are loaded when needed and cleaned up when not needed
 *
 * @param styleId Optional ID for the style element (defaults to 'component-drag-drop-styles')
 * @returns boolean indicating if styles are loaded
 */
export function useDragDropStyles(styleId = 'component-drag-drop-styles'): boolean {
    const isLoadedRef = useRef(false);

    useEffect(() => {
        // If styles are already loaded, skip
        if (document.getElementById(styleId)) {
            isLoadedRef.current = true;
            return;
        }

        // Create and append the style element
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
      /* Component Drag & Drop Styles */

      /* Main component container */
      .component-container {
          position: relative;
          transition: all 0.15s ease;
          border-radius: 3px;
          margin-bottom: 8px;
          width: 100%;
      }

      /* Container highlighting when in edit mode */
      [data-edit-mode="true"] .component-container {
          position: relative;
      }

      /* Selection highlighting */
      .component-container.selected-component,
      [data-selected="true"] {
          outline: 2px solid #3b82f6 !important;
          z-index: 5 !important;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.3) !important;
      }

      /* Hover state */
      [data-edit-mode="true"] .component-container:hover {
          outline: 1px solid rgba(59, 130, 246, 0.3);
      }

      /* Dragging state */
      .component-container.dragging-component {
          opacity: 0.7 !important;
          cursor: grabbing !important;
          z-index: 1000 !important;
          transform: scale(1.02) !important;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
      }

      /* Drop target indicators - General */
      .component-container.drop-target {
          z-index: 10;
      }

      /* Drop position indicators using CSS transitions for smooth appearance/disappearance */
      .drop-indicator {
          position: absolute;
          pointer-events: none;
          z-index: 100;
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.2s ease, height 0.2s ease;
      }

      /* Before position indicator */
      .drop-indicator-before {
          top: -2px;
          left: 0;
          right: 0;
          height: 0;
          transform: scaleY(0);
      }

      /* After position indicator */
      .drop-indicator-after {
          bottom: -2px;
          left: 0;
          right: 0;
          height: 0;
          transform: scaleY(0);
      }

      /* Inside position indicator for containers */
      .drop-indicator-inside {
          inset: 0;
          border: 2px dashed transparent;
          background-color: transparent;
      }

      /* Active drop position indicators using data attributes */
      [data-drop-before="true"] .drop-indicator-before {
          opacity: 1;
          transform: scaleY(1);
          height: 4px;
          background-color: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
          border-radius: 2px;
      }

      [data-drop-after="true"] .drop-indicator-after {
          opacity: 1;
          transform: scaleY(1);
          height: 4px;
          background-color: #3b82f6;
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
          border-radius: 2px;
      }

      [data-drop-inside="true"] .drop-indicator-inside {
          opacity: 1;
          border: 2px dashed #3b82f6;
          background-color: rgba(59, 130, 246, 0.1);
          box-shadow: inset 0 0 8px rgba(59, 130, 246, 0.2);
      }

      /* Delete button visibility */
      .delete-button {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 20px;
          height: 20px;
          background-color: rgba(30, 30, 30, 0.7);
          color: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          cursor: pointer;
          opacity: 0;
          transition: all 0.2s ease;
          z-index: 50;
      }

      .component-container:hover .delete-button {
          opacity: 0.7;
      }

      .component-container.selected-component .delete-button,
      [data-selected="true"] .delete-button {
          opacity: 1 !important;
      }

      .delete-button:hover {
          opacity: 1 !important;
          background-color: #ef4444 !important;
          color: white !important;
      }

      /* Empty container styling */
      .component-container.empty-container {
          min-height: 80px !important;
          border: 2px dashed rgba(100, 100, 100, 0.3) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
      }

      .component-container.empty-container::after {
          content: "Drop components here";
          color: rgba(100, 100, 100, 0.7);
          font-size: 14px;
      }

      /* Container component styling */
      [data-widget-id][data-edit-mode="true"] [data-component-type="Panel"],
      [data-widget-id][data-edit-mode="true"] [data-component-type="ScrollBox"] {
          min-height: 80px;
          width: 100% !important;
      }

      /* Children containers */
      .panel-children-container,
      .scrollbox-children-container {
          position: relative;
          width: 100%;
          min-height: 40px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 8px;
          border-radius: 3px;
      }

      /* Nested component indicators */
      .component-container .component-container {
          position: relative;
          margin-left: 8px;
          border-left: 2px solid rgba(100, 165, 115, 0.3);
          padding-left: 8px;
      }

      /* Grab cursor for draggable items in edit mode */
      [data-edit-mode="true"] .component-container {
          cursor: grab;
      }

      /* Nested container drop highlight */
      [data-is-nested-container="true"].drop-highlight {
          background-color: rgba(59, 130, 246, 0.1);
          border: 2px dashed #3b82f6 !important;
          border-radius: 4px;
      }

      /* Component type specific styling */
      .component-type-panel,
      .component-type-scrollbox {
          padding: 2px;
      }

      .component-type-pushbutton,
      .component-type-input,
      .component-type-label,
      .component-type-dropdown {
          position: relative;
          padding: 4px;
          margin: 2px;
          border-radius: 3px;
      }

      /* Animation for drop indicators */
      @keyframes pulse {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
      }

      [data-drop-before="true"] .drop-indicator-before,
      [data-drop-after="true"] .drop-indicator-after,
      [data-drop-inside="true"] .drop-indicator-inside {
          animation: pulse 1.5s infinite;
      }
    `;

        document.head.appendChild(style);
        isLoadedRef.current = true;

        // Cleanup function
        return () => {
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                document.head.removeChild(styleElement);
                isLoadedRef.current = false;
            }
        };
    }, [styleId]);

    return isLoadedRef.current;
}

export default useDragDropStyles;