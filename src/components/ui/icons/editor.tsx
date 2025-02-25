// Text and content editing icons
import { createIconComponent } from "@/lib/icons";

export const ItalicIcon = createIconComponent(
    <>
        <path d="M11 5l6 0" />
        <path d="M7 19l6 0" />
        <path d="M14 5l-4 14" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const BoldIcon = createIconComponent(
    <>
        <path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z" />
        <path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const UnderlineIcon = createIconComponent(
    <>
        <path d="M7 5v5a5 5 0 0 0 10 0v-5" />
        <path d="M5 19h14" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const AlignLeftIcon = createIconComponent(
    <>
        <path d="M4 6l16 0" />
        <path d="M4 12l10 0" />
        <path d="M4 18l14 0" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const AlignCenterIcon = createIconComponent(
    <>
        <path d="M4 6l16 0" />
        <path d="M9 12l6 0" />
        <path d="M4 18l16 0" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const AlignRightIcon = createIconComponent(
    <>
        <path d="M4 6l16 0" />
        <path d="M10 12l6 0" />
        <path d="M4 18l16 0" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const AlignJustifyIcon = createIconComponent(
    <>
        <path d="M4 6l16 0" />
        <path d="M4 12l16 0" />
        <path d="M4 18l16 0" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);
