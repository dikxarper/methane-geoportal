import type { PlumeObservation } from "../point-sources/types";

interface PlumeLegendConfig {
    colors: readonly string[];
    min: number | null;
    max: number | null;
    units: string | null;
}

const TANAGER_LEGEND: PlumeLegendConfig = {
    units: "ppm·m",
    min: 0,
    max: 6000,
    colors: ["#30123B", "#4685FA", "#1AE4B6", "#A4FC3C", "#FABA39", "#E4450A", "#7A0403"],
};

const ORBIO_LEGEND: PlumeLegendConfig = {
    units: null,
    min: null,
    max: null,
    colors: ["#0D0887", "#6A00A8", "#B12A90", "#E16462", "#FCA636", "#F0F921"],
};

export function getPlumeLegend(plume: PlumeObservation): PlumeLegendConfig | null {
    switch (plume.source) {
        case "tanager":
            return TANAGER_LEGEND;
        case "orbio":
            return ORBIO_LEGEND;
        case "emit":
            return null;
    }
}
