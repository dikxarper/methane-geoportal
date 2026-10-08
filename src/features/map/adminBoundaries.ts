import Feature from "ol/Feature";
import GeoJSON from "ol/format/GeoJSON";
import MultiPolygon from "ol/geom/MultiPolygon";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import polygonClipping, { type MultiPolygon as PolygonClippingMultiPolygon } from "polygon-clipping";

import { getDistricts, type DistrictFeature } from "../../api/districts";

type Coordinates = PolygonClippingMultiPolygon;

export interface AdministrativeBoundaryLayers {
    country: VectorLayer<VectorSource>;
    regions: VectorLayer<VectorSource>;
    districts: VectorLayer<VectorSource>;
}

function toMultiPolygonCoordinates(feature: DistrictFeature): Coordinates {
    return feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates as number[][][]] as Coordinates
        : (feature.geometry.coordinates as Coordinates);
}

function dissolve(features: DistrictFeature[]) {
    const [first, ...rest] = features.map(toMultiPolygonCoordinates);

    if (!first) {
        throw new Error("Cannot dissolve an empty feature collection");
    }

    const coordinates = polygonClipping.union(first, ...rest) as unknown as Coordinates;
    const geometry = new MultiPolygon(coordinates);

    geometry.transform("EPSG:4326", "EPSG:3857");

    return geometry;
}

function createVectorLayer(source: VectorSource, color: string, width: number, zIndex: number) {
    return new VectorLayer({
        source,
        style: new Style({
            fill: new Fill({ color: "rgba(0, 0, 0, 0)" }),
            stroke: new Stroke({ color, width }),
        }),
        visible: false,
        zIndex,
    });
}

export async function createAdministrativeBoundaryLayers(): Promise<AdministrativeBoundaryLayers> {
    const collection = await getDistricts();
    const format = new GeoJSON();
    const districtFeatures = format.readFeatures(collection, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
    });

    const districts = createVectorLayer(
        new VectorSource({ features: districtFeatures }),
        "#68d5ff",
        1,
        110,
    );

    const regionsByName = new Map<string, DistrictFeature[]>();

    for (const feature of collection.features) {
        const name = feature.properties.adm1_en ?? "Unknown region";
        const group = regionsByName.get(name) ?? [];

        group.push(feature);
        regionsByName.set(name, group);
    }

    const regionFeatures = Array.from(regionsByName, ([name, features]) => {
        const feature = new Feature({ geometry: dissolve(features) });

        feature.set("name", name);
        return feature;
    });
    const regions = createVectorLayer(
        new VectorSource({ features: regionFeatures }),
        "#ffd166",
        1.8,
        120,
    );

    const country = createVectorLayer(
        new VectorSource({ features: [new Feature({ geometry: dissolve(collection.features) })] }),
        "#ffffff",
        2.5,
        130,
    );

    return { country, regions, districts };
}
