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
        admin: "Administrative layers",
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
        today: "Today",
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

        plumeLegend: {
            title: "Plume legend",
            paletteOnly: "Color scale",
            unavailable: "The EMIT color scale is not configured yet.",
        },

        plumePixel: {
            title: "Pixel value",
            coordinates: "Coordinates (latitude, longitude)",
        },
    },

    infrastructure: {
        title: "Infrastructure",
        oilGas: "Oil and gas",
        other: "Other",

        layers: {
            oilGasInfrastructure: "Oil and gas facilities",
            oilGasPipelines: "Oil and gas pipelines",
            landfills: "Landfills",
        },

        categories: {
            flaring: "Natural gas flaring",
            offshore: "Offshore platforms",
            refineries: "Crude oil refineries",
            terminals: "Petroleum terminals",
            processing: "Gathering and processing",
            lng: "LNG facilities",
        },

        hints: {
            refineries: "Crude oil refineries",
            lng: "Liquefied natural gas facilities",
            landfills: "Municipal solid waste landfills",
        },

        popup: {
            operator: "Operator",
            country: "Country",
            region: "Region",
            status: "Status",
            date: "Source date",
        },
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

    pointSources: {
        title: "Point sources",
        groups: "Plume groups",
        description: "Sources with repeated observations",
        group: "Source",
        observations: "Observations: {{count}}",
        unknownCount: "Observation count unavailable",
        page: "Page",
        previousPage: "Previous page",
        nextPage: "Next page",
        loadError: "Failed to load plume groups.",
        noGroups: "No plume groups found.",
        retry: "Retry",

        sources: {
            emit: "EMIT",
            tanager: "Tanager",
            orbio: "Orbio",
        },

        timeline: {
            title: "Observation timeline",
            newestFirst: "Newest first",
            oldestFirst: "Oldest first",
            notQuantified: "Not quantified",
            emissionHidden: "Not published",
            unknownSatellite: "Satellite unknown",
        },

        tabs: {
            timeline: "Timeline",
            details: "Plume details",
        },

        sort: {
            newest: "Newest first",
            oldest: "Oldest first",
            emissionDesc: "Highest emissions",
            emissionAsc: "Lowest emissions",
        },

        filters: {
            title: "Filters",
            sort: "Sort by",
            satellites: "Satellites",
            from: "From",
            to: "To",
            date: "Observation date",
            single: "Single date",
            range: "Date range",
            chooseDate: "Select",
            clearDate: "Clear date",
            reset: "Reset",
            found: "Found: {{count}}",
            noMatches: "No observations match the selected filters.",
        },

        details: {
            title: "Plume observations",
            observations: "Observations: {{count}}",
            loading: "Loading observations...",
            loadError: "Failed to load observations.",
            partialError: "Failed to load data from",
            noObservations: "No observations found.",
            limitWarning: "Loading limit reached for",
            yes: "Yes",
            no: "No",
            selectPlume: "Select a plume in the timeline to view its details.",
        },

        metadata: {
            plume_id: "Plume ID",
            observed_at: "Observation date",
            date: "Date",
            dcid: "DCID",
            orbit: "Orbit",
            scene_fids: "Scene FIDs",
            scene_id: "Scene ID",
            source_id: "Source ID",
            scene_timestamp: "Acquisition time",
            instrument: "Instrument",
            platform: "Platform",
            gas: "Gas",
            status: "Status",
            satellite: "Satellite",
            model: "Model",
            tile_name: "Tile",
            mgrs: "MGRS",
            gsd: "Ground sampling distance",
            off_nadir: "Off-nadir angle",
            max_plume_concentration: "Max concentration",
            concentration_uncertainty: "Concentration uncertainty",
            max_concentration_lat: "Maximum latitude",
            max_concentration_lon: "Maximum longitude",
            emission_auto: "Estimated emission",
            emission_uncertainty_auto: "Emission uncertainty",
            wind_speed_avg_auto: "Wind speed",
            wind_direction_avg_auto: "Wind direction",
            likelihood: "Likelihood",
            q_kg_hr: "Emission rate",
            q_low_kg_hr: "Lower estimate",
            q_high_kg_hr: "Upper estimate",
            plume_length_m: "Plume length",
            wind_speed_m_s: "Wind speed",
            plume_index: "Plume index",
        },

        units: {
            kgPerHour: "kg/h",
            meters: "m",
            metersPerSecond: "m/s",
        },

        chart: {
            title: "Emission trend",
            subtitle: "Average emissions in the group",
            monthly: "Monthly",
            observations: "Observations",
            averageEmission: "Average emission rate",
            quantifiedPlumes: "Quantified plumes",
            observedDays: "Observed days",
            empty: "No quantified observations found.",
            hint: "Click a point to open the timeline.",
            monthAverageCount: "Average from {{count}} observations",
            singleObservation: "Single observation",
            collapse: "Collapse chart",
            expand: "Show chart",
            periodMode: "Trend",
            daysMode: "By day",
            periodMonth: "Monthly averages",
            periodQuarter: "Quarterly averages",
            scaleLinear: "Linear",
            scaleLog: "Log",
            earlier: "Earlier",
            later: "Later",
            discreteAxisHint: "Days are evenly spaced; distances do not represent elapsed time.",

            help: {
                button: "How to read the chart",
                title: "Understanding the emission chart",

                averageTitle: "Average emission rate",
                averageText:
                    "The arithmetic mean of quantified methane emission observations. It does not represent a continuous average over the entire period.",

                countTitle: "Quantified plumes",
                countText:
                    "The number of observations with a numerical emission estimate. Unquantified observations are excluded.",

                daysTitle: "Observed days",
                daysText:
                    "The number of unique dates on which plumes were detected. Multiple plumes on the same date count as one day.",

                dynamicsTitle: "Trend",
                dynamicsText:
                    "Each point represents the average emission rate for a month or quarter. The aggregation period is selected automatically.",

                dailyTitle: "By day",
                dailyText:
                    "Each point represents one observation date. Points are evenly spaced for readability, so their distances do not represent elapsed time.",

                gapTitle: "Dashed lines",
                gapText:
                    "A dashed connection indicates a substantial gap without measurements. It does not imply continuous measurements between observations.",

                scaleTitle: "Scale",
                scaleText:
                    "A linear scale preserves proportional differences. A logarithmic scale helps reveal smaller emissions alongside large ones, using log(1 + x) to handle zero values.",

                clickTitle: "Clicking a point",
                clickText:
                    "When a period contains one quantified plume, it is selected on the map. Otherwise, the timeline is filtered to that period.",
            },

            scaleLinearHint: "Linear scale: distances are proportional to methane emission rates.",
            scaleLogHint:
                "Logarithmic log(1 + x) scale: helps distinguish small values alongside large ones.",
        },
    },
} satisfies Translation;
