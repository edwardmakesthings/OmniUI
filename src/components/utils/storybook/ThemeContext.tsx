import React, { createContext, useContext, ReactNode } from "react";
import { StoryContext, Renderer } from "@storybook/types";

// Define theme type
export type Theme = "light" | "dark";

// Create the context with a default value
export const ThemeContext = createContext<Theme>("dark");

// Provider component to wrap sections of your app
interface ThemeProviderProps {
    theme: Theme;
    children: ReactNode;
}

export const ThemeProvider = ({ theme, children }: ThemeProviderProps) => (
    <ThemeContext.Provider value={theme}>
        <div className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {children}
        </div>
    </ThemeContext.Provider>
);

// Hook for consuming the theme context
export const useTheme = () => useContext(ThemeContext);

// Story decorator that sets up the theme provider
export const withThemeProvider = (
    Story: React.ComponentType,
    context: StoryContext<Renderer>
) => {
    const theme = (context.globals.theme as Theme) || "dark";
    return (
        <ThemeProvider theme={theme}>
            <Story />
        </ThemeProvider>
    );
};
