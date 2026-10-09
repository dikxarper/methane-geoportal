import type Map from "ol/Map";
import type { Extent } from "ol/extent";
import { buffer, getHeight, getWidth } from "ol/extent";
import TileLayer from "ol/layer/Tile";
import { fromLonLat, transformExtent } from "ol/proj";
import XYZ from "ol/source/XYZ";

import { getApiUrl } from "../../api/client";
import type { PlumeObservation } from "../point-sources/types";

export function createPlumeRasterSource(plume: PlumeObservation): XYZ | null {
    if (!plume.uid) return null;

    const apiUrl = getApiUrl().replace(/\/$/, "");
    const url = `${apiUrl}/raster-tiles/${plume.source}/${encodeURIComponent(plume.uid)}/{z}/{x}/{y}.png`;

    return new XYZ({
        url,
        wrapX: false,
    });
}

export function createPlumeRasterLayer(plume: PlumeObservation): TileLayer<XYZ> | null {
    const source = createPlumeRasterSource(plume);
    if (!source) return null;

    return new TileLayer({
        source,
        visible: true,
        zIndex: 100,
        properties: {
            layerId: "selected-plume-raster",
            plumeKey: plume.key,
        },
    });
}

function validLonLat(lon: number, lat: number): boolean {
    return (
        Number.isFinite(lon) && Number.isFinite(lat) && Math.abs(lon) <= 180 && Math.abs(lat) <= 90
    );
}

function extentFromGeometry(coordinates: unknown): Extent | null {
    const extent: Extent = [Infinity, Infinity, -Infinity, -Infinity];

    const visit = (value: unknown): void => {
        if (!Array.isArray(value)) return;

        if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
            const [lon, lat] = value;
            if (!validLonLat(lon, lat)) return;

            extent[0] = Math.min(extent[0], lon);
            extent[1] = Math.min(extent[1], lat);
            extent[2] = Math.max(extent[2], lon);
            extent[3] = Math.max(extent[3], lat);
            return;
        }

        for (const item of value) {
            visit(item);
        }
    };

    visit(coordinates);

    return Number.isFinite(extent[0]) && Number.isFinite(extent[1]) ? extent : null;
}

function toNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
        return Number(value);
    }

    return null;
}

function getPlumeExtent(plume: PlumeObservation): Extent | null {
    if (
        plume.bounds &&
        validLonLat(plume.bounds[0], plume.bounds[1]) &&
        validLonLat(plume.bounds[2], plume.bounds[3]) &&
        plume.bounds[0] <= plume.bounds[2] &&
        plume.bounds[1] <= plume.bounds[3]
    ) {
        return plume.bounds;
    }

    const geometryExtent = plume.geometry ? extentFromGeometry(plume.geometry.coordinates) : null;

    if (geometryExtent) return geometryExtent;

    const { properties } = plume;

    const lon = toNumber(properties.plume_lon ?? properties.max_concentration_lon);
    const lat = toNumber(properties.plume_lat ?? properties.max_concentration_lat);

    return lon !== null && lat !== null && validLonLat(lon, lat) ? [lon, lat, lon, lat] : null;
}

export function focusMapOnPlume(map: Map, plume: PlumeObservation): boolean {
    const extent = getPlumeExtent(plume);
    const size = map.getSize();

    if (!extent || !size) return false;

    const projected = transformExtent(extent, "EPSG:4326", "EPSG:3857");

    const paddedExtent =
        getWidth(projected) < 500 && getHeight(projected) < 500
            ? buffer(projected, 350)
            : projected;

    const rightPadding = Math.min(360, Math.floor(size[0] * 0.4));

    map.getView().fit(paddedExtent, {
        size,
        padding: [60, rightPadding, 60, 50],
        maxZoom: 15,
        duration: 400,
    });

    return true;
}

export function focusMapOnPoint(map: Map, coordinates: [number, number]): void {
    const point = fromLonLat(coordinates);
    const extent: Extent = buffer([point[0], point[1], point[0], point[1]], 350);

    const size = map.getSize();
    if (!size) return;

    map.getView().fit(extent, {
        size,
        padding: [60, Math.min(360, Math.floor(size[0] * 0.4)), 60, 50],
        maxZoom: 15,
        duration: 400,
    });
}
