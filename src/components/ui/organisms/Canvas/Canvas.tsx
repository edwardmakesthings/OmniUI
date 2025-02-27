import { useState, useRef } from "react";
import { Grid } from "@/components/ui/atoms/Grid";
import { useComponentStore } from "@/store/componentStore";
import { useUIStore } from "@/store/uiStore";

export const Canvas = () => {
    // State for canvas pan/zoom
    const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
    const canvasRef = useRef<HTMLDivElement>(null);
    const { gridSettings } = useUIStore();

    // Get component instances to render
    const instances = useComponentStore((state) =>
        Object.values(state.instances).filter((i) => i.parentId === "canvas")
    );

    const handleDrop = (e) => {
        // Implement component dropping logic
    };

    return (
        <div
            ref={canvasRef}
            className="relative flex-1 overflow-hidden bg-neutral-900"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
        >
            <div
                className="absolute transform transition-transform"
                style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
                }}
            >
                {/* Canvas content */}

                {/* Grid overlay */}
                <Grid
                    visible={gridSettings.showGrid}
                    cellSize={gridSettings.gridSize}
                    color="rgba(100, 100, 100, 0.2)"
                />
            </div>
        </div>
    );
};

export default Canvas;
