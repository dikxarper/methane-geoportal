import { apiRequest } from "./client";

export interface PlumeGroup {
    id: string;
    observations: number | null;
    coordinates: [number, number] | null;
    firstObservedAt: string | null;
    lastObservedAt: string | null;
}

export interface PlumeGroupPage {
    items: PlumeGroup[];
    hasNext: boolean;
}

interface GeoJsonGeometry {
    type: string;
    coordinates?: unknown;
}

interface GeoJsonFeature {
    id?: string | number;
    type: "Feature";
    properties?: Record<string, unknown> | null;
    geometry?: GeoJsonGeometry | null;
}

const PAGE_SIZE = 5;

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getFeatures(payload: unknown): GeoJsonFeature[] {
    if (!isObject(payload)) {
        return [];
    }

    if (payload.type === "FeatureCollection" && Array.isArray(payload.features)) {
        return payload.features as GeoJsonFeature[];
    }

    if ("data" in payload) {
        const data = payload.data;

        if (Array.isArray(data)) {
            return data as GeoJsonFeature[];
        }

        return getFeatures(data);
    }

    return Array.isArray(payload.features) ? (payload.features as GeoJsonFeature[]) : [];
}

function readDate(value: unknown): string | null {
    return typeof value === "string" && value.length > 0 ? value : null;
}

function readCoordinates(geometry: GeoJsonGeometry | null | undefined): [number, number] | null {
    if (!geometry?.coordinates) {
        return null;
    }

    let minLon = Infinity;
    let minLat = Infinity;
    let maxLon = -Infinity;
    let maxLat = -Infinity;

    function visit(value: unknown): void {
        if (!Array.isArray(value)) {
            return;
        }

        if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
            const [lon, lat] = value;

            if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
                return;
            }

            if (Math.abs(lon) > 180 || Math.abs(lat) > 90) {
                return;
            }

            minLon = Math.min(minLon, lon);
            minLat = Math.min(minLat, lat);
            maxLon = Math.max(maxLon, lon);
            maxLat = Math.max(maxLat, lat);

            return;
        }

        for (const item of value) {
            visit(item);
        }
    }

    visit(geometry.coordinates);

    if (!Number.isFinite(minLon) || !Number.isFinite(minLat)) {
        return null;
    }

    return [(minLon + maxLon) / 2, (minLat + maxLat) / 2];
}

function normalizeGroup(feature: GeoJsonFeature): PlumeGroup | null {
    if (!isObject(feature)) {
        return null;
    }

    const props = isObject(feature.properties) ? feature.properties : {};
    const rawId = props.id ?? feature.id;

    if (typeof rawId !== "string" && typeof rawId !== "number") {
        return null;
    }

    const rawObservations = props.observations;

    const observations =
        typeof rawObservations === "number" && Number.isFinite(rawObservations)
            ? rawObservations
            : typeof rawObservations === "string" &&
                rawObservations.trim() !== "" &&
                Number.isFinite(Number(rawObservations))
              ? Number(rawObservations)
              : null;

    return {
        id: String(rawId),
        observations,
        coordinates: readCoordinates(feature.geometry),
        firstObservedAt: readDate(props.first_observed_at),
        lastObservedAt: readDate(props.last_observed_at),
    };
}

export async function getPlumeGroupsPage(
    page: number,
    signal?: AbortSignal,
): Promise<PlumeGroupPage> {
    const params = new URLSearchParams({
        limit: String(PAGE_SIZE + 1),
        offset: String(page * PAGE_SIZE),
        sort_by: "observations",
        sort_dir: "desc",
    });

    const payload = await apiRequest<unknown>(`/plume-points/filter?${params.toString()}`, {
        signal,
    });

    const features = getFeatures(payload);

    return {
        items: features
            .slice(0, PAGE_SIZE)
            .map(normalizeGroup)
            .filter((group): group is PlumeGroup => group !== null),
        hasNext: features.length > PAGE_SIZE,
    };
}
