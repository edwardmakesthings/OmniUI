import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
} from "react";

// Define theme types your application supports
export type ThemeType = "dark" | "light" | "darkGold";

// Theme configuration interface
interface ThemeConfig {
    name: ThemeType;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        accent: string;
        // Add other theme properties as needed
    };
    // Other theme properties like spacing, typography, etc.
}

// Define available themes
const themes: Record<ThemeType, ThemeConfig> = {
    dark: {
        name: "dark",
        colors: {
            primary: "#415855",
            secondary: "#396055",
            background: "#242424",
            text: "#e0e0e0",
            accent: "#64A573",
        },
    },
    light: {
        name: "light",
        colors: {
            primary: "#64A573",
            secondary: "#396055",
            background: "#f0f0f0",
            text: "#242424",
            accent: "#415855",
        },
    },
    darkGold: {
        name: "darkGold",
        colors: {
            primary: "#FABC62",
            secondary: "#D4A14B",
            background: "#242424",
            text: "#e0e0e0",
            accent: "#FABC62",
        },
    },
};

interface ThemeContextType {
    currentTheme: ThemeConfig;
    setTheme: (theme: ThemeType) => void;
    availableThemes: ThemeType[];
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
    undefined
);

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: ThemeType;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = "dark",
}) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(
        themes[defaultTheme]
    );

    const setTheme = (theme: ThemeType) => {
        setCurrentTheme(themes[theme]);
        localStorage.setItem("preferredTheme", theme);

        // Apply theme to document root for CSS variables
        applyThemeToCssVars(themes[theme]);
    };

    // Apply theme to CSS variables
    const applyThemeToCssVars = (theme: ThemeConfig) => {
        const root = document.documentElement;

        // Apply color variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Apply other theme properties as needed
    };

    // Load theme from localStorage on initial render
    useEffect(() => {
        const savedTheme = localStorage.getItem("preferredTheme") as ThemeType;
        if (savedTheme && themes[savedTheme]) {
            setTheme(savedTheme);
        } else {
            setTheme(defaultTheme);
        }
    }, [defaultTheme]);

    return (
        <ThemeContext.Provider
            value={{
                currentTheme,
                setTheme,
                availableThemes: Object.keys(themes) as ThemeType[],
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
