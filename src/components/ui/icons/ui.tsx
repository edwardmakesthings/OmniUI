// Basic UI icons
import { createIconComponent } from "@/lib/icons";

export const CaretDownIcon = createIconComponent(
    <>
        <path d="M6 9l6 6l6 -6" />
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

export const LogoIcon = createIconComponent(
    <>
        <path d="M19 4a3 3 0 0 1 3 3v10a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3zm-9 4h-4a1 1 0 1 0 0 2h1v5a1 1 0 0 0 .883 .993l.117 .007a1 1 0 0 0 1 -1v-5h1a1 1 0 0 0 .993 -.883l.007 -.117a1 1 0 0 0 -1 -1m8 1c0 -.99 -1.283 -1.378 -1.832 -.555l-1.168 1.752l-1.168 -1.752c-.549 -.823 -1.832 -.434 -1.832 .555v6a1 1 0 0 0 1 1l.117 -.007a1 1 0 0 0 .883 -.993v-2.697l.168 .252l.08 .104a1 1 0 0 0 1.584 -.104l.168 -.253v2.698a1 1 0 0 0 2 0z" />
    </>,
    { setFillColor: true }
);

export const MoonIcon = createIconComponent(
    <>
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);
