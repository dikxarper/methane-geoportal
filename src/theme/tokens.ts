export const ui = {
    colors: {
        sidebar: "var(--ui-sidebar)",
        panel: "var(--ui-panel)",
        panelDark: "var(--ui-panel-dark)",

        border: "var(--ui-border)",
        borderLight: "var(--ui-border-light)",
        borderActive: "var(--ui-border-active)",

        text: "var(--ui-text)",
        textMuted: "var(--ui-text-muted)",
        textDisabled: "var(--ui-text-disabled)",

        buttonHover: "var(--ui-button-hover)",
        accent: "var(--ui-accent)",

        control: "var(--ui-control)",
        controlHover: "var(--ui-control-hover)",
        controlActive: "var(--ui-control-active)",
        controlText: "var(--ui-control-text)",
        controlBorder: "var(--ui-control-border)",

        menu: "var(--ui-menu)",
        menuHover: "var(--ui-menu-hover)",
        menuText: "var(--ui-menu-text)",
    },

    sizes: {
        sidebarWidth: "400px",
        navigationWidth: "48px",
        headerHeight: "58px",
        navigationButton: "32px",
        mapControlButton: "34px",
    },

    radius: {
        sm: "4px",
        md: "6px",
        lg: "8px",
    },

    spacing: {
        panelX: "10px",
        panelY: "18px",
    },
} as const;
