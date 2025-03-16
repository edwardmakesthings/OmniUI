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
        <path d="M5 11.57a6.5 6.5 0 0 0 6.54 6.54c3.64 0 6.55-2.9 6.55-6.54a6.54 6.54 0 1 0-13.09 0Zm2.91 0c0-2 1.64-3.66 3.63-3.66 2 0 3.64 1.66 3.64 3.66a3.65 3.65 0 0 1-3.64 3.63 3.64 3.64 0 0 1-3.63-3.63Zm12.63 5.96c-.04.23.12.4.34.4h2.15c.18 0 .33-.15.35-.3l.8-5.62h.04l3.07 5.9c.06.11.2.2.31.2h.33c.1 0 .25-.09.3-.2l3.07-5.9h.04l.81 5.63c.02.14.19.29.35.29h2.15c.22 0 .38-.16.35-.4L32.93 5.29c-.02-.16-.19-.29-.33-.29h-.3c-.08 0-.25.07-.3.18l-4.23 7.87h-.03l-4.23-7.87c-.05-.1-.22-.18-.3-.18h-.3c-.14 0-.3.13-.33.3l-2.05 12.23ZM6.08 34.47c0 .18.17.35.35.35H8.6c.2 0 .34-.17.34-.35v-6.79h.02l7.2 7.23c.03.04.18.09.23.09h.3c.17 0 .34-.15.34-.33V22.42a.36.36 0 0 0-.35-.35H14.5c-.2 0-.35.16-.35.35v6.46h-.02l-7.26-7H6.4a.35.35 0 0 0-.35.34l.02 12.25Zm20.25.18c0 .19.16.35.34.35h2.19c.18 0 .34-.16.34-.35V22.6a.36.36 0 0 0-.34-.35h-2.19a.36.36 0 0 0-.34.35v12.05Z" />
    </>,
    { setFillColor: true, defaultViewBoxSize: 40 }
);

export const MoonIcon = createIconComponent(
    <>
        <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const StarIcon = createIconComponent(
    <>
        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const StarFilledIcon = createIconComponent(
    <>
        <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
    </>,
    { setFillColor: true }
);

export const BellIcon = createIconComponent(
    <>
        <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
        <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
    </>,
    { setStrokeColor: true, strokeLinecap: "round" }
);

export const BellFilledIcon = createIconComponent(
    <>
        <path d="M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z" />
        <path d="M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z" />
    </>,
    { setFillColor: true }
);
