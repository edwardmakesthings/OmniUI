// Simple Component Icons - Used in the Layout Hierarchy panel
import { createIconComponent } from "@/lib/icons";

export const WidgetIcon = createIconComponent([
    [
        <>
            <path d="M20 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16Z" />
        </>,
        { setStrokeColor: true, strokeLinecap: "round" },
    ],
    [
        <>
            <path d="M20 2a2 2 0 0 1 2 2v2.7H2V4a2 2 0 0 1 2-2h16Z" />
        </>,
        { setFillColor: true },
    ],
]);

export const PanelIcon = createIconComponent(
    <>
        <path d="M20 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16Z" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const TabsIcon = createIconComponent(
    <>
        <path d="M20 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16Z" />
        <path d="M9.22 2H10a2 2 0 0 1 2 2v.7a2 2 0 0 0 2 2h8" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const InputIcon = createIconComponent([
    [
        <>
            <path d="M20 4.95a2 2 0 0 1 2 2v10.1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6.95a2 2 0 0 1 2-2h16Z" />
        </>,
        { setStrokeColor: true, strokeLinecap: "round" },
    ],
    [
        <>
            <path d="M6.73 14.87h1.64v1.64H6.73zm4.45 0h1.64v1.64h-1.64zm4.45 0h1.64v1.64h-1.64z" />
        </>,
        { setFillColor: true },
    ],
]);

export const ButtonIcon = createIconComponent(
    <>
        <path d="M18 2a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h12Zm-.27 10-5.87-5.87L6 12l5.87 5.87L17.73 12Z" />
    </>,
    { setFillColor: true }
);

export const ReferenceIcon = createIconComponent([
    [
        <>
            <path d="M20 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16Z" />
        </>,
        { setStrokeColor: true, strokeLinecap: "round" },
    ],
    [
        <>
            <path d="M17.57 15.43c0 .22-.09.44-.25.6l-1.31 1.3a.89.89 0 0 1-.6.23.85.85 0 0 1-.61-.24l-1.84-1.85a.87.87 0 0 1 .04-1.26c.3.3.55.65 1 .65.47 0 .86-.39.86-.86 0-.45-.35-.7-.65-1a.87.87 0 0 1 1.25-.04l1.86 1.86c.16.16.25.38.25.6Zm-6.27-6.3c0 .27-.11.48-.3.66-.3-.3-.54-.65-1-.65a.86.86 0 0 0-.86.86c0 .45.35.7.65 1a.84.84 0 0 1-.65.28.86.86 0 0 1-.6-.24L6.68 9.18a.85.85 0 0 1 0-1.2l1.31-1.31a.9.9 0 0 1 .6-.24c.23 0 .46.09.62.25l1.84 1.85c.16.16.25.38.25.6Zm7.99 6.3c0-.69-.26-1.33-.75-1.82l-1.86-1.86a2.58 2.58 0 0 0-3.68.04l-.79-.79a2.61 2.61 0 0 0 .05-3.68l-1.84-1.85a2.54 2.54 0 0 0-1.82-.76c-.68 0-1.33.26-1.81.75l-1.32 1.3a2.55 2.55 0 0 0 0 3.63l1.85 1.86a2.58 2.58 0 0 0 3.68-.04l.79.79a2.61 2.61 0 0 0-.05 3.68l1.84 1.85a2.55 2.55 0 0 0 3.63.02l1.32-1.3a2.6 2.6 0 0 0 .76-1.82Z" />
        </>,
        { setFillColor: true },
    ],
]);
