// Simple Component Icons - Used in the Layout Hierarchy panel
import { createIconComponent } from "@/lib/icons";

export const ButtonIcon = createIconComponent(
    <>
        <path d="M18 5a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3z" />
    </>,
    { setFillColor: true }
);

export const PanelIcon = createIconComponent(
    <>
        <path d="M18 5a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3z" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const TabsIcon = createIconComponent(
    <>
        <path d="M18 5a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3z" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);
