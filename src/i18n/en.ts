import type { Translation } from "./ru";

export const en = {
    common: {
        loading: "Loading...",
        noData: "No data",
        close: "Close",
        logout: "Log out",
        about: "About",
        opacity: "Opacity",
    },

    topControls: {
        switchToEnglish: "Switch to English",
        switchToRussian: "Switch to Russian",
        lightTheme: "Light theme",
        darkTheme: "Dark theme",
    },

    sidebar: {
        areaFlux: "Area fluxes",
        pointSources: "Point sources",
        infrastructure: "Infrastructure",
    },

    areaFlux: {
        sentinel5p: {
            title: "Sentinel-5P",
            description: "Daily Sentinel-5P methane data",
            availableDates: "Available dates",
            loading: "Loading Sentinel-5P data...",
            loadingMonth: "Loading month...",
            notFound: "Sentinel-5P data not found.",
            loadError: "Failed to load Sentinel-5P data.",
            datesLoadError: "Failed to load Sentinel-5P dates.",
        },
        annualMethane: {
            title: "Annual methane",
            description: "Annual Sentinel-5P methane average",
            year: "Year",
            loading: "Loading annual methane data...",
            notFound: "Annual methane data not found.",
            loadError: "Failed to load annual methane data.",
        },
    },

    calendar: {
        previousMonth: "Previous month",
        nextMonth: "Next month",

        weekdays: {
            mon: "Mon",
            tue: "Tue",
            wed: "Wed",
            thu: "Thu",
            fri: "Fri",
            sat: "Sat",
            sun: "Sun",
        },
    },

    map: {
        controls: {
            zoomIn: "Zoom in",
            zoomOut: "Zoom out",
            reset: "Reset view",
            layers: "Basemaps",
        },

        basemaps: {
            custom: "Custom",
            streets: "Streets",
            satellite: "Satellite",
        },

        pixel: {
            title: "Sentinel-5P",
            annualTitle: "Annual methane",
            methane: "XCH₄",
            unit: "ppb",
            loading: "Getting value...",
            noData: "No data",
            loadError: "Failed to get pixel value.",
            close: "Close",
        },
    },

    infrastructure: {
        title: "Infrastructure",
        oilGas: "Oil and gas",
        other: "Other",
    },

    adminLayers: {
        title: "Administrative layers",
        country: {
            title: "Kazakhstan border",
            description: "National administrative boundary",
        },
        regions: {
            title: "Regions",
            description: "Regional administrative boundaries",
        },
        districts: {
            title: "Districts",
            description: "District administrative boundaries",
        },
    },

    auth: {
        login: {
            title: "Sign in",
            description: "Sign in to access the platform.",
            email: "Email",
            password: "Password",
            submit: "Sign in",
            createAccount: "Create account",
            error: "Failed to sign in.",
        },

        register: {
            title: "Create account",
            description: "Request access to the methane monitoring map.",
            name: "Name",
            email: "Email",
            password: "Password",
            organization: "Organization",
            referralSource: "How did you hear about the website?",
            usageReason: "How will you use the website?",
            submit: "Create account",
            backToLogin: "Back to sign in",
            error: "Failed to create account.",
        },
    },
} satisfies Translation;
