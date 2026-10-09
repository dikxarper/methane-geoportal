import { apiRequest } from "./client";
import type { PlumeGroup } from "./plumePoints";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function featureArray(payload: unknown): unknown[] {
    if (Array.isArray(payload)) return payload;
    if (!isRecord(payload)) return [];

    if (Array.isArray(payload.features)) return payload.features;
    if ("data" in payload) return featureArray(payload.data);

    return [];
}

function coordinateCenter(geometry: unknown): [number, number] | null {
    if (typeof geometry === "string") {
        try {
            geometry = JSON.parse(geometry) as unknown;
        } catch {
            return null;
        }
    }

    if (!isRecord(geometry) || !Array.isArray(geometry.coordinates)) return null;

    const bbox = [Infinity, Infinity, -Infinity, -Infinity];

    const visit = (value: unknown): void => {
        if (!Array.isArray(value)) return;

        if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
            const [lon, lat] = value;

            if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;
            if (Math.abs(lon) > 180 || Math.abs(lat) > 90) return;

            bbox[0] = Math.min(bbox[0], lon);
            bbox[1] = Math.min(bbox[1], lat);
            bbox[2] = Math.max(bbox[2], lon);
            bbox[3] = Math.max(bbox[3], lat);
            return;
        }

        value.forEach(visit);
    };

    visit(geometry.coordinates);

    if (!Number.isFinite(bbox[0])) return null;

    return [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
}

function normalizeGroup(value: unknown): PlumeGroup | null {
    if (!isRecord(value)) return null;

    const props = isRecord(value.properties) ? value.properties : value;
    const id = props.id ?? value.id;

    if (typeof id !== "number" && typeof id !== "string") return null;

    const coordinates = coordinateCenter(value.geometry ?? props.geometry);
    if (!coordinates) return null;

    const count = Number(props.observations);
    const date = (item: unknown) => (typeof item === "string" ? item : null);

    return {
        id: String(id),
        observations: props.observations != null && Number.isFinite(count) ? count : null,
        coordinates,
        firstObservedAt: date(props.first_observed_at),
        lastObservedAt: date(props.last_observed_at),
    };
}

export async function getPlumeMapGroups(signal?: AbortSignal): Promise<PlumeGroup[]> {
    const payload = await apiRequest<unknown>("/plume-points", { signal });
    const raw = featureArray(payload);

    if (!Array.isArray(payload) && raw.length === 0) {
        throw new Error("Unexpected plume-points GeoJSON response");
    }

    const groups = new Map<string, PlumeGroup>();

    raw.forEach((item) => {
        const group = normalizeGroup(item);
        if (group) groups.set(group.id, group);
    });

    return [...groups.values()];
}
