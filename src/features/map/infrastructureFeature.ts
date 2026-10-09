import type OlMap from "ol/Map";
import type { Pixel } from "ol/pixel";
import type VectorTileLayer from "ol/layer/VectorTile";
import type VectorTileSource from "ol/source/VectorTile";

import { OIL_GAS_CATEGORIES } from "../infrastructure/config";

export type InfrastructureKind = "facility" | "landfill";

export interface InfrastructureSelection {
    kind: InfrastructureKind;
    properties: Record<string, unknown>;
}

const VALID_CATEGORIES = new Set<string>(OIL_GAS_CATEGORIES.map(({ id }) => id));

function getKind(layerId: unknown): InfrastructureKind | null {
    if (layerId === "infrastructure-oil-gas") {
        return "facility";
    }

    if (layerId === "infrastructure-landfills") {
        return "landfill";
    }

    // Трубопроводы не открывают popup.
    return null;
}

function isFeatureEligible(
    kind: InfrastructureKind,
    properties: Record<string, unknown>,
    layer: VectorTileLayer<VectorTileSource>,
): boolean {
    if (kind === "landfill") {
        return properties.fclass === "landfill";
    }

    const category = properties.category;

    if (typeof category !== "string" || !VALID_CATEGORIES.has(category)) {
        return false;
    }

    const selected = layer.get("visibleCategories") as string[] | undefined;

    return !selected || selected.includes(category);
}

export async function pickInfrastructureFeature(
    map: OlMap,
    pixel: Pixel,
): Promise<InfrastructureSelection | null> {
    const layers = map
        .getLayers()
        .getArray()
        .filter(
            (layer) => layer.getVisible() && getKind(layer.get("layerId")) !== null,
        ) as VectorTileLayer<VectorTileSource>[];

    const synchronous = map.forEachFeatureAtPixel(
        pixel,
        (feature, baseLayer) => {
            const kind = getKind(baseLayer?.get("layerId"));

            if (!kind || !baseLayer) {
                return undefined;
            }

            const layer = baseLayer as VectorTileLayer<VectorTileSource>;
            const properties = feature.getProperties();

            return isFeatureEligible(kind, properties, layer) ? { kind, properties } : undefined;
        },
        {
            hitTolerance: 8,
            layerFilter: (layer) => layer.getVisible() && getKind(layer.get("layerId")) !== null,
        },
    );

    if (synchronous) {
        return synchronous;
    }

    // Резервный поиск через API отрисованных VectorTileLayer.
    for (const layer of [...layers].reverse()) {
        const kind = getKind(layer.get("layerId"));

        if (!kind) {
            continue;
        }

        try {
            const features = await layer.getFeatures(pixel);

            for (const feature of features) {
                const properties = feature.getProperties();

                if (isFeatureEligible(kind, properties, layer)) {
                    return { kind, properties };
                }
            }
        } catch {
            // Тайлы могли ещё не завершить загрузку.
        }
    }

    return null;
}
