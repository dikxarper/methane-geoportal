import { apiRequest } from "./client";
import type { PlumeGroup } from "./plumePoints";

interface PlumeGroupPage {
    items: PlumeGroup[];
    rawCount: number;
    hasMore: boolean;
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractRows(payload: unknown): unknown[] {
    if (Array.isArray(payload)) return payload;
    if (!isObject(payload)) return [];

    if (Array.isArray(payload.features)) return payload.features;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.results)) return payload.results;

    if (payload.data) return extractRows(payload.data);

    return [];
}

function extractTotal(payload: unknown): number | null {
    if (!isObject(payload)) return null;

    const candidates: unknown[] = [
        payload.total,
        isObject(payload.meta) ? payload.meta.total : null,
        isObject(payload.pagination) ? payload.pagination.total : null,
        isObject(payload.data) ? payload.data.total : null,
    ];

    for (const value of candidates) {
        if (typeof value === "number" && Number.isFinite(value)) return value;
        if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
            return Number(value);
        }
    }

    return null;
}

function readCenter(geometry: unknown): [number, number] | null {
    if (typeof geometry === "string") {
        try {
            geometry = JSON.parse(geometry) as unknown;
        } catch {
            return null;
        }
    }

    if (!isObject(geometry) || !Array.isArray(geometry.coordinates)) return null;

    const extent = [Infinity, Infinity, -Infinity, -Infinity];

    const visit = (value: unknown): void => {
        if (!Array.isArray(value)) return;

        if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
            const [lon, lat] = value;

            if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;
            if (Math.abs(lon) > 180 || Math.abs(lat) > 90) return;

            extent[0] = Math.min(extent[0], lon);
            extent[1] = Math.min(extent[1], lat);
            extent[2] = Math.max(extent[2], lon);
            extent[3] = Math.max(extent[3], lat);
            return;
        }

        value.forEach(visit);
    };

    visit(geometry.coordinates);

    if (!Number.isFinite(extent[0])) return null;

    return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
}

function normalizeGroup(feature: unknown): PlumeGroup | null {
    if (!isObject(feature)) return null;

    const props = isObject(feature.properties) ? feature.properties : feature;
    const id = props.id ?? feature.id;

    if (typeof id !== "number" && typeof id !== "string") return null;

    const coordinates = readCenter(feature.geometry ?? props.geometry);
    if (!coordinates) return null;

    const count = Number(props.observations);

    return {
        id: String(id),
        coordinates,
        observations: props.observations != null && Number.isFinite(count) ? count : null,
        firstObservedAt:
            typeof props.first_observed_at === "string" ? props.first_observed_at : null,
        lastObservedAt: typeof props.last_observed_at === "string" ? props.last_observed_at : null,
    };
}

export async function getPlumeGroupPage(
    limit: number,
    offset: number,
    signal?: AbortSignal,
): Promise<PlumeGroupPage> {
    const query = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
        sort_by: "observations",
        sort_dir: "desc",
    });

    const payload = await apiRequest<unknown>(`/plume-points/filter?${query.toString()}`, {
        signal,
    });

    const rows = extractRows(payload);
    const total = extractTotal(payload);

    const groups = new Map<string, PlumeGroup>();

    for (const row of rows) {
        const group = normalizeGroup(row);
        if (group) groups.set(group.id, group);
    }

    return {
        items: [...groups.values()],
        rawCount: rows.length,
        hasMore: rows.length === limit && (total === null || offset + rows.length < total),
    };
}
