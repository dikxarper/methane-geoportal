import MVT from "ol/format/MVT";
import VectorTileLayer from "ol/layer/VectorTile";
import VectorTileSource from "ol/source/VectorTile";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";

import {
    LANDFILL_COLOR,
    OIL_GAS_CATEGORIES,
    PIPELINE_COLOR,
    type OilGasCategory,
} from "../infrastructure/config";

const API_BASE_URL = (
    import.meta.env.VITE_INFRASTRUCTURE_API_URL || "https://data-api.igmass.kz/api"
).replace(/\/$/, "");

type MvtLayer = VectorTileLayer<VectorTileSource>;

export interface InfrastructureMapLayers {
    oilGasInfrastructure: MvtLayer;
    oilGasPipelines: MvtLayer;
    landfills: MvtLayer;

    setOilGasCategories: (selection?: Partial<Record<OilGasCategory, boolean>>) => void;
}

function source(path: string): VectorTileSource {
    return new VectorTileSource({
        format: new MVT(),
        url: `${API_BASE_URL}/vector-tiles/${path}/{z}/{x}/{y}`,
        wrapX: false,
    });
}

export function createInfrastructureMapLayers(): InfrastructureMapLayers {
    const categoryStyles = new Map<string, Style>(
        OIL_GAS_CATEGORIES.map(({ id, color }): [string, Style] => [
            id,
            new Style({
                image: new CircleStyle({
                    radius: 5,
                    fill: new Fill({ color }),
                    stroke: new Stroke({
                        color: "#FFFFFF",
                        width: 1.5,
                    }),
                }),
            }),
        ]),
    );

    let visibleCategories: Set<string> | null = null;

    const oilGasInfrastructure = new VectorTileLayer({
        source: source("oil-gas-infrastructure"),
        visible: false,
        zIndex: 145,
        properties: {
            layerId: "infrastructure-oil-gas",
        },

        style: (feature) => {
            const geometry = feature.getGeometry()?.getType();

            if (geometry !== "Point" && geometry !== "MultiPoint") {
                return undefined;
            }

            const category = feature.get("category");

            if (typeof category !== "string") {
                return undefined;
            }

            if (visibleCategories && !visibleCategories.has(category)) {
                return undefined;
            }

            return categoryStyles.get(category);
        },
    });

    const pipelineStyle = new Style({
        stroke: new Stroke({
            color: PIPELINE_COLOR,
            width: 1.7,
        }),
    });

    const oilGasPipelines = new VectorTileLayer({
        source: source("oil-gas-pipelines"),
        visible: false,
        zIndex: 146,
        properties: {
            layerId: "infrastructure-pipelines",
        },

        style: (feature) => {
            const geometry = feature.getGeometry()?.getType();

            return geometry === "LineString" || geometry === "MultiLineString"
                ? pipelineStyle
                : undefined;
        },
    });

    const landfillStyle = new Style({
        fill: new Fill({
            color: "rgba(174, 136, 220, 0.20)",
        }),
        stroke: new Stroke({
            color: LANDFILL_COLOR,
            width: 1.8,
        }),
    });

    const landfills = new VectorTileLayer({
        source: source("landfills"),
        visible: false,
        zIndex: 147,
        properties: {
            layerId: "infrastructure-landfills",
        },

        style: (feature) => {
            const geometry = feature.getGeometry()?.getType();
            const landfill = feature.get("fclass") === "landfill";

            return landfill && (geometry === "Polygon" || geometry === "MultiPolygon")
                ? landfillStyle
                : undefined;
        },
    });

    return {
        oilGasInfrastructure,
        oilGasPipelines,
        landfills,

        setOilGasCategories(selection) {
            // Если фильтр не передан, сохраняем
            // совместимость со старым общим переключателем.
            visibleCategories = selection
                ? new Set(
                      OIL_GAS_CATEGORIES.filter(({ id }) => selection[id] === true).map(
                          ({ id }) => id,
                      ),
                  )
                : null;

            // Перерисовываем существующий слой.
            // MVT-источник и тайлы не пересоздаются.
            oilGasInfrastructure.changed();
        },
    };
}
