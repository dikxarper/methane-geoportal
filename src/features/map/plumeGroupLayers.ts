import Feature from "ol/Feature";
import type { Pixel } from "ol/pixel";
import type OlMap from "ol/Map";
import { boundingExtent, getCenter } from "ol/extent";
import MVT from "ol/format/MVT";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorTileLayer from "ol/layer/VectorTile";
import Cluster from "ol/source/Cluster";
import VectorSource from "ol/source/Vector";
import VectorTileSource from "ol/source/VectorTile";
import CircleStyle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import { fromLonLat, toLonLat } from "ol/proj";

import { getApiUrl } from "../../api/client";
import type { PlumeGroup } from "../../api/plumePoints";

const POLYGON_ZOOM = 11.99;
const CLUSTER_DISTANCE = 42;

function markerStyle(count: number, selected: boolean): Style {
    const radius = count >= 100 ? 23 : count >= 10 ? 20 : 16;

    return new Style({
        image: new CircleStyle({
            radius,
            fill: new Fill({ color: selected ? "#e58e17" : "#119e99" }),
            stroke: new Stroke({ color: "#ffffff", width: 2 }),
        }),
        text: new Text({
            text: String(count),
            font: "600 12px sans-serif",
            fill: new Fill({ color: "#ffffff" }),
        }),
    });
}

const polygonStyle = new Style({
    fill: new Fill({ color: "rgba(17, 158, 153, 0.15)" }),
    stroke: new Stroke({ color: "#119e99", width: 2 }),
});

const selectedPolygonStyle = new Style({
    fill: new Fill({ color: "rgba(229, 142, 23, 0.25)" }),
    stroke: new Stroke({ color: "#e58e17", width: 3 }),
});

export interface PlumeGroupLayers {
    cluster: VectorLayer<Cluster>;
    polygons: VectorTileLayer<VectorTileSource>;
    setGroups: (groups: PlumeGroup[]) => void;
    setSelected: (id: string | null) => void;
    getGroup: (id: string) => PlumeGroup | undefined;
    setEnabled: (enabled: boolean, opacity: number) => void;
}

export function createPlumeGroupLayers(): PlumeGroupLayers {
    const points = new VectorSource<Feature<Point>>({ wrapX: false });

    const clusterSource = new Cluster({
        distance: CLUSTER_DISTANCE,
        minDistance: 18,
        source: points,
    });

    const byId = new Map<string, PlumeGroup>();
    let selectedId: string | null = null;

    const styles = new Map<string, Style>();

    const cluster = new VectorLayer({
        source: clusterSource,
        zIndex: 155,
        maxZoom: POLYGON_ZOOM,
        visible: false,
        style: (feature) => {
            const members = feature.get("features") as Feature<Point>[] | undefined;
            if (!members?.length) return undefined;

            const selected = members.some((member) => member.getId() === selectedId);
            const key = `${members.length}:${selected}`;

            let style = styles.get(key);

            if (!style) {
                style = markerStyle(members.length, selected);
                styles.set(key, style);
            }

            return style;
        },
    });

    const polygons = new VectorTileLayer({
        source: new VectorTileSource({
            format: new MVT(),
            url: `${getApiUrl().replace(/\/$/, "")}/vector-tiles/plume-points/{z}/{x}/{y}`,
        }),
        visible: false,
        minZoom: POLYGON_ZOOM,
        zIndex: 155,
        style: (feature) => {
            const id = feature.get("id") ?? feature.getId();

            return id != null && String(id) === selectedId ? selectedPolygonStyle : polygonStyle;
        },
    });

    polygons.getSource()?.on("tileloaderror", (event) => {
        console.error("[PlumePoints] Polygon tile error:", event);
    });

    return {
        cluster,
        polygons,

        setGroups(groups) {
            byId.clear();

            const features: Feature<Point>[] = [];

            groups.forEach((group) => {
                if (!group.coordinates) return;

                byId.set(group.id, group);

                const feature = new Feature<Point>(new Point(fromLonLat(group.coordinates)));

                feature.setId(group.id);
                features.push(feature);
            });

            points.clear(true);
            points.addFeatures(features);
        },

        setSelected(id) {
            selectedId = id;
            cluster.changed();
            polygons.changed();
        },

        getGroup(id) {
            return byId.get(id);
        },

        setEnabled(enabled, opacity) {
            const value = Math.max(0, Math.min(1, opacity / 100));

            cluster.setVisible(enabled);
            polygons.setVisible(enabled);
            cluster.setOpacity(value);
            polygons.setOpacity(value);
        },
    };
}

/**
 * True означает, что клик обработан группировкой.
 * Pixel popup Sentinel-5P при таком клике не открываем.
 */
export function handlePlumeGroupClick(
    map: OlMap,
    pixel: Pixel,
    coordinate: number[],
    layers: PlumeGroupLayers,
    selectGroup: (group: PlumeGroup) => void,
): boolean {
    const hit = map.forEachFeatureAtPixel(pixel, (feature, layer) => ({ feature, layer }), {
        hitTolerance: 6,
        layerFilter: (layer) => layer === layers.cluster || layer === layers.polygons,
    });

    if (!hit) return false;

    if (hit.layer === layers.cluster) {
        const members = hit.feature.get("features") as Feature<Point>[] | undefined;

        if (!members?.length) return false;

        if (members.length === 1) {
            const id = members[0].getId();
            const group = id != null ? layers.getGroup(String(id)) : undefined;

            if (group) selectGroup(group);

            return Boolean(group);
        }

        const coords = members
            .map((member) => member.getGeometry()?.getCoordinates())
            .filter((value): value is number[] => Boolean(value));

        if (!coords.length) return false;

        const extent = boundingExtent(coords);
        const view = map.getView();
        const zoom = view.getZoom() ?? 3;

        if (zoom >= 10.5) {
            view.animate({
                center: getCenter(extent),
                zoom: 12.3,
                duration: 350,
            });
        } else {
            view.fit(extent, {
                size: map.getSize(),
                padding: [80, 80, 80, 80],
                maxZoom: Math.min(POLYGON_ZOOM, zoom + 2.5),
                duration: 350,
            });
        }

        return true;
    }

    const id = hit.feature.get("id") ?? hit.feature.getId();
    if (id == null) return false;

    const group = layers.getGroup(String(id));

    if (group) {
        selectGroup(group);
    } else {
        const props = hit.feature.getProperties();
        const count = Number(props.observations);
        const [lon, lat] = toLonLat(coordinate);

        selectGroup({
            id: String(id),
            observations: Number.isFinite(count) ? count : null,
            coordinates: [lon, lat],
            firstObservedAt:
                typeof props.first_observed_at === "string" ? props.first_observed_at : null,
            lastObservedAt:
                typeof props.last_observed_at === "string" ? props.last_observed_at : null,
        });
    }

    return true;
}
