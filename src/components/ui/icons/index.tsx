import { createIconComponent } from "@/lib/icons";

// UI Icons

export const CaretDownIcon = createIconComponent(
    <>
        <path d="M6 9l6 6l6 -6" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const EditIcon = createIconComponent(
    <>
        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
        <path d="M13.5 6.5l4 4" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const LogoIcon = createIconComponent(
    <>
        <path d="M19 4a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3zm-9 4h-4a1 1 0 1 0 0 2h1v5a1 1 0 0 0 .883 .993l.117 .007a1 1 0 0 0 1 -1v-5h1a1 1 0 0 0 .993 -.883l.007 -.117a1 1 0 0 0 -1 -1m8 1c0 -.99 -1.283 -1.378 -1.832 -.555l-1.168 1.752l-1.168 -1.752c-.549 -.823 -1.832 -.434 -1.832 .555v6a1 1 0 0 0 1 1l.117 -.007a1 1 0 0 0 .883 -.993v-2.697l.168 .252l.08 .104a1 1 0 0 0 1.584 -.104l.168 -.253v2.698a1 1 0 0 0 2 0z" />
    </>,
    { setFillColor: true }
);

export const GearIcon = createIconComponent(
    <>
        <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const SearchIcon = createIconComponent(
    <>
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
        <path d="M21 21l-6 -6" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const XIcon = createIconComponent(
    <>
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const CheckIcon = createIconComponent(
    <>
        <path d="M5 12l5 5l10 -10" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const FilterIcon = createIconComponent(
    <>
        <path d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const FilterFilledIcon = createIconComponent(
    <>
        <path d="M20 3h-16a1 1 0 0 0 -1 1v2.227l.008 .223a3 3 0 0 0 .772 1.795l4.22 4.641v8.114a1 1 0 0 0 1.316 .949l6 -2l.108 -.043a1 1 0 0 0 .576 -.906v-6.586l4.121 -4.12a3 3 0 0 0 .879 -2.123v-2.171a1 1 0 0 0 -1 -1z" />
    </>,
    { setFillColor: true }
);
// Panel Icons

export const PropertyEditorIcon = createIconComponent(
    <>
        <path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M4 6l8 0" />
        <path d="M16 6l4 0" />
        <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M4 12l2 0" />
        <path d="M10 12l10 0" />
        <path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M4 18l11 0" />
        <path d="M19 18l1 0" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const ComponentsIcon = createIconComponent(
    <>
        <path d="M7 9.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
        <path d="M4.012 16.737a2 2 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
        <path d="M11 14h6" />
        <path d="M14 11v6" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const LayoutIcon = createIconComponent(
    <>
        <path d="M5 6h15" />
        <path d="M10 12h10" />
        <path d="M10 18h10" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const WidgetsIcon = createIconComponent(
    <>
        <path d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
        <path d="M4 13m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
        <path d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
        <path d="M14 15m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const ConnectionsIcon = createIconComponent(
    <>
        <path d="M5.931 6.936l1.275 4.249m5.607 5.609l4.251 1.275" />
        <path d="M11.683 12.317l5.759 -5.759" />
        <path d="M5.5 5.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
        <path d="M18.5 5.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
        <path d="M18.5 18.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0" />
        <path d="M8.5 15.5m-4.5 0a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const ThemeIcon = createIconComponent(
    <>
        <path d="M3 21v-4a4 4 0 1 1 4 4h-4" />
        <path d="M21 3a16 16 0 0 0 -12.8 10.2" />
        <path d="M21 3a16 16 0 0 1 -10.2 12.8" />
        <path d="M10.6 9a9 9 0 0 1 4.4 4.4" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const DevToolsIcon = createIconComponent(
    <>
        <path d="M9 9v-1a3 3 0 0 1 6 0v1" />
        <path d="M8 9h8a6 6 0 0 1 1 3v3a5 5 0 0 1 -10 0v-3a6 6 0 0 1 1 -3" />
        <path d="M3 13l4 0" />
        <path d="M17 13l4 0" />
        <path d="M12 20l0 -6" />
        <path d="M4 19l3.35 -2" />
        <path d="M20 19l-3.35 -2" />
        <path d="M4 7l3.75 2.4" />
        <path d="M20 7l-3.75 2.4" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);
