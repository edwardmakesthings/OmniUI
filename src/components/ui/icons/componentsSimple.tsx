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

export const LabelIcon = createIconComponent(
    <>
        <path d="M.7 18.71 5.38 5.07h2.3L3.64 16.79h5.82l-.62 1.92H.69Z" />
        <path d="m15.48 6.58-1.55 4.5c.43-.38.89-.7 1.37-.92a3.4 3.4 0 0 1 1.44-.33c.76 0 1.31.18 1.66.56.34.37.5.9.5 1.58a8 8 0 0 1-.5 2.4c-.3.88-.7 1.66-1.2 2.35a5.96 5.96 0 0 1-1.72 1.62c-.65.4-1.35.6-2.1.6-.96 0-1.6-.37-1.9-1.08l-.4.85h-1.6l4.17-12.13h1.83Zm-2.07 10.95c.62 0 1.2-.26 1.7-.76.53-.51.97-1.3 1.35-2.4.38-1.1.5-1.9.36-2.4-.14-.48-.5-.73-1.07-.73-.4 0-.8.13-1.2.37-.4.25-.77.54-1.1.87l-1.4 4.05a1.33 1.33 0 0 0 1.36 1Z" />
        <path d="m23.67 6.58-3.37 9.77c-.13.4-.1.68.08.85.18.16.47.25.86.25a6.21 6.21 0 0 0 1.47-.28l.02 1.27a6.51 6.51 0 0 1-2.4.5c-.86 0-1.46-.26-1.77-.75-.31-.49-.33-1.16-.03-2l3.33-9.6h1.8Z" />
    </>,
    { setFillColor: true }
);

export const DrawerIcon = createIconComponent([
    [
        <>
            <path d="M20.18 2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16Z" />
        </>,
        { setStrokeColor: true, strokeLinecap: "round" },
    ],
    [
        <>
            <path d="M10.54 2v20H4.2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h6.34ZM8.7 4.85H4.05a.5.5 0 0 0 0 1H8.7a.5.5 0 0 0 0-1Zm-1 5H4.05a.5.5 0 0 0 0 1H7.7a.5.5 0 0 0 0-1Zm0 5.01H4.05a.5.5 0 0 0 0 1H7.7a.5.5 0 0 0 0-1Z" />
        </>,
        { setFillColor: true },
    ],
]);

export const DropdownIcon = createIconComponent(
    <>
        <path d="M18.18 2a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-12a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h12Zm-6 15.34 6.18-9.68H6l6.18 9.68Z" />
    </>,
    {
        setFillColor: true,
    }
);

export const ModalIcon = createIconComponent(
    <>
        <path d="M21.2 7.55a2 2 0 0 1 2 2v5.94a2 2 0 0 1-2 2H3.16a2 2 0 0 1-2-2V9.55a2 2 0 0 1 2-2h18.06ZM4.86 11.19h5.95a.5.5 0 0 0 0-1H4.85a.5.5 0 0 0 0 1Zm0 3.67h11.39a.5.5 0 0 0 0-1H4.84a.5.5 0 0 0 0 1Z" />
    </>,
    {
        setStrokeColor: true,
        strokeLinecap: "round",
    }
);

export const ListViewIcon = createIconComponent([
    [
        <>
            <path d="M20 2.52a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-16a2 2 0 0 1 2-2h16Z" />
            <path d="M4.94 7.86h14.43" />
        </>,
        { setStrokeColor: true, strokeLinecap: "round" },
    ],
    [
        <>
            <path d="M22 12.04v8.56a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8.56h20ZM4.94 17.82h14.43a.5.5 0 0 0 0-1H4.94a.5.5 0 0 0 0 1Z" />
        </>,
        { setFillColor: true },
    ],
]);

export const TreeViewIcon = createIconComponent(
    <>
        <circle cx="18.26" cy="12.04" r="2.25" />
        <circle cx="6.09" cy="5.15" r="2.25" />
        <circle cx="18.26" cy="19.89" r="2.25" />
        <path d="M6.09 7.86v4.18h9.47m-9.47 0v5.85a2 2 0 0 0 2 2h7.47" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const Icon = createIconComponent(<></>, {
    setStrokeColor: true,
    strokeLinecap: "round",
});
