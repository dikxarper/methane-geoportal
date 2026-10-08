import { createContext } from "react";

export type AppTheme = "light" | "dark";

export interface AppThemeContextValue {
    theme: AppTheme;
    setTheme: (theme: AppTheme) => void;
    toggleTheme: () => void;
}

export const AppThemeContext = createContext<AppThemeContextValue | null>(null);
