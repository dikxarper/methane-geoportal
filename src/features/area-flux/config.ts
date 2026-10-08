export const areaFluxConfig = {
    sentinel5p: {
        id: "sentinel-5p",
        legendStyle: "gradient",
        title: "Sentinel-5P",
        description: "Концентрация метана XCH₄",
    },

    annualMethane: {
        id: "methane-annual",
        legendStyle: "gradient",
    },

    years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026],
} as const;
