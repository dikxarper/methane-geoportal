import { useCallback, useEffect, useState, type ReactNode } from "react";

import { AppThemeContext, type AppTheme } from "./appThemeContext";

const THEME_STORAGE_KEY = "theme";

function getInitialTheme(): AppTheme {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
    }

    return "dark";
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<AppTheme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const setTheme = useCallback((nextTheme: AppTheme) => {
        setThemeState(nextTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((current) => (current === "dark" ? "light" : "dark"));
    }, []);

    return (
        <AppThemeContext.Provider
            value={{
                theme,
                setTheme,
                toggleTheme,
            }}
        >
            {children}
        </AppThemeContext.Provider>
    );
}
