export const OIL_GAS_CATEGORIES = [
    {
        id: "NATURAL GAS FLARING DETECTIONS",
        labelKey: "infrastructure.categories.flaring",
        color: "#F59E44",
    },
    {
        id: "OFFSHORE PLATFORMS",
        labelKey: "infrastructure.categories.offshore",
        color: "#4E97DF",
    },
    {
        id: "CRUDE OIL REFINERIES",
        labelKey: "infrastructure.categories.refineries",
        color: "#E2C054",
    },
    {
        id: "PETROLEUM TERMINALS",
        labelKey: "infrastructure.categories.terminals",
        color: "#9D83DC",
    },
    {
        id: "GATHERING AND PROCESSING",
        labelKey: "infrastructure.categories.processing",
        color: "#31A797",
    },
    {
        id: "LNG FACILITIES",
        labelKey: "infrastructure.categories.lng",
        color: "#D8679A",
    },
] as const;

export type OilGasCategory = (typeof OIL_GAS_CATEGORIES)[number]["id"];

export const PIPELINE_COLOR = "#ED8347";
export const LANDFILL_COLOR = "#AE88DC";
