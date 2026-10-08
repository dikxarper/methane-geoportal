import { useContext } from "react";

import { AppThemeContext } from "../theme/appThemeContext";

export function useAppTheme() {
    const context = useContext(AppThemeContext);

    if (!context) {
        throw new Error("useAppTheme must be used inside AppThemeProvider");
    }

    return context;
}

export type { AppTheme } from "../theme/appThemeContext";
