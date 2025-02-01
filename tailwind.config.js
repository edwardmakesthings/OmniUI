/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  safelist: [
    'bg-background-light',
    'text-secondary',
    'border-secondary-light',
    'border-r',
    'border-l',
    'border-t',
    'w-full',
    'h-full',
    'bg-secondary',
    'bg-primary-light',
    'text-red-500',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#106B59",
          light: "#64A573",
          dark: "#396055",
        },
        secondary: {
          DEFAULT: "#415855",
          light: "#64756E",
          dark: "#2A3B38",
        },
        background: {
          DEFAULT: "#333333",
          light: "#FAFAFA",
          dark: "#1A1A1A",
        },
      },
      spacing: {
        panel: {
          sm: "240px",
          md: "320px",
          lg: "400px",
        },
      },
    },
  },
  plugins: [],
};
