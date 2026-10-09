import type OlMap from "ol/Map";
import type { Pixel } from "ol/pixel";

export type InfrastructureKind = "facility" | "pipeline" | "landfill";

export interface InfrastructureSelection {
    kind: InfrastructureKind;
    properties: Record<string, unknown>;
}

const LAYER_IDS: Record<string, InfrastructureKind> = {
    "infrastructure-oil-gas": "facility",
    "infrastructure-pipelines": "pipeline",
    "infrastructure-landfills": "landfill",
};

export function pickInfrastructureFeature(
    map: OlMap,
    pixel: Pixel,
): InfrastructureSelection | null {
    const hit = map.forEachFeatureAtPixel(
        pixel,
        (feature, layer) => {
            const layerId = layer?.get("layerId");

            if (typeof layerId !== "string") return undefined;

            const kind = LAYER_IDS[layerId];
            if (!kind) return undefined;

            return {
                kind,
                properties: feature.getProperties(),
            };
        },
        {
            hitTolerance: 6,
            layerFilter: (layer) => {
                const id = layer.get("layerId");

                return (
                    typeof id === "string" && Object.prototype.hasOwnProperty.call(LAYER_IDS, id)
                );
            },
        },
    );

    return hit ?? null;
}
