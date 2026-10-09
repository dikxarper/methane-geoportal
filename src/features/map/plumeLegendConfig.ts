import type { PlumeObservation } from "../point-sources/types";

export interface PlumeLegendConfig {
    colors: readonly string[];
    min: number | null;
    max: number | null;
    maxLabel?: string;
    units: string | null;
    gas?: "CO₂" | "CH₄";
}

const CARBON_MAPPER_COLORS = [
    "#30123B",
    "#4685FA",
    "#1AE4B6",
    "#A4FC3C",
    "#FABA39",
    "#E4450A",
    "#7A0403",
] as const;

const TANAGER_CH4_LEGEND: PlumeLegendConfig = {
    gas: "CH₄",
    units: "ppm·m",
    min: 0,
    max: 6000,
    colors: CARBON_MAPPER_COLORS,
};

const CARBON_MAPPER_CO2_LEGEND: PlumeLegendConfig = {
    gas: "CO₂",
    units: "ppm·m",
    min: 0,
    max: 6000,
    maxLabel: "6K+",
    colors: CARBON_MAPPER_COLORS,
};

const ORBIO_LEGEND: PlumeLegendConfig = {
    units: null,
    min: null,
    max: null,
    colors: ["#0D0887", "#6A00A8", "#B12A90", "#E16462", "#FCA636", "#F0F921"],
};

function isTanagerCO2(plume: PlumeObservation): boolean {
    if (plume.source !== "tanager") {
        return false;
    }

    const properties = plume.properties;

    const fields = [
        properties.gas,
        properties.gas_type,
        properties.gasType,
        properties.species,
        properties.target_species,
        properties.molecule,
        properties.plume_type,
        properties.product_type,
        properties.target_gas,
    ];

    return fields.some(
        (value) =>
            typeof value === "string" &&
            /(^|[^a-z])(?:co2|co₂|carbon[\s_-]*dioxide)(?=$|[^a-z])/i.test(value),
    );
}

export function getPlumeLegend(plume: PlumeObservation): PlumeLegendConfig | null {
    switch (plume.source) {
        case "tanager":
            return isTanagerCO2(plume) ? CARBON_MAPPER_CO2_LEGEND : TANAGER_CH4_LEGEND;

        case "orbio":
            return ORBIO_LEGEND;

        case "emit":
            return null;
    }
}
