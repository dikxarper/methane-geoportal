import { apiRequest } from "./client";
import type {
    PlumeGeometry,
    PlumeObservation,
    PlumeObservationsResult,
    PlumeSource,
} from "../features/point-sources/types";

const SOURCES = ["emit", "tanager", "orbio"] as const;
const SOURCE_LIMIT = 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getFeatures(payload: unknown): unknown[] {
    if (Array.isArray(payload)) return payload;
    if (!isRecord(payload)) return [];

    if (payload.type === "Feature") return [payload];

    if (Array.isArray(payload.features)) {
        return payload.features;
    }

    if ("data" in payload) {
        return getFeatures(payload.data);
    }

    if ("results" in payload) {
        return getFeatures(payload.results);
    }

    return [];
}

function readString(value: unknown): string | null {
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return null;
}

function readGeometry(value: unknown): PlumeGeometry | null {
    let geometry: unknown = value;

    if (typeof geometry === "string") {
        try {
            geometry = JSON.parse(geometry) as unknown;
        } catch {
            return null;
        }
    }

    if (!isRecord(geometry)) return null;
    if (typeof geometry.type !== "string" || !("coordinates" in geometry)) return null;

    return {
        type: geometry.type,
        coordinates: geometry.coordinates,
    };
}

function readBounds(value: unknown): [number, number, number, number] | null {
    if (!Array.isArray(value) || value.length !== 4) return null;
    if (!value.every((item) => typeof item === "number" && Number.isFinite(item))) {
        return null;
    }

    const [west, south, east, north] = value as number[];
    if (west > east || south > north) return null;

    return [west, south, east, north];
}

function normalizeObservation(
    raw: unknown,
    source: PlumeSource,
    index: number,
): PlumeObservation | null {
    if (!isRecord(raw)) return null;

    const isFeature = raw.type === "Feature";
    const properties = isFeature ? (isRecord(raw.properties) ? raw.properties : {}) : raw;

    const id = readString(properties.id ?? raw.id ?? properties.uid) ?? `row-${index}`;
    const uid = readString(properties.uid);

    const observedAt = readString(
        source === "emit"
            ? (properties.observed_at ?? properties.date)
            : source === "tanager"
              ? (properties.scene_timestamp ?? properties.observed_at)
              : (properties.date ?? properties.observed_at),
    );

    const geometry = readGeometry(raw.geometry ?? properties.geometry_json ?? properties.geometry);

    const bounds = readBounds(properties.plume_bounds ?? raw.bbox);

    return {
        key: `${source}:${id}`,
        id,
        uid,
        source,
        observedAt,
        geometry,
        bounds,
        properties,
    };
}

async function getSourceObservations(
    source: PlumeSource,
    plumePointId: string,
    signal?: AbortSignal,
) {
    const params = new URLSearchParams({
        plume_point_id: plumePointId,
        limit: String(SOURCE_LIMIT),
        offset: "0",
    });

    const payload = await apiRequest<unknown>(`/${source}/filter?${params}`, { signal });
    const features = getFeatures(payload);

    return {
        source,
        truncated: features.length >= SOURCE_LIMIT,
        items: features
            .map((feature, index) => normalizeObservation(feature, source, index))
            .filter((item): item is PlumeObservation => item !== null),
    };
}

export async function getPlumeObservations(
    plumePointId: string,
    signal?: AbortSignal,
): Promise<PlumeObservationsResult> {
    const responses = await Promise.allSettled(
        SOURCES.map((source) => getSourceObservations(source, plumePointId, signal)),
    );

    const items: PlumeObservation[] = [];
    const failedSources: PlumeSource[] = [];
    const truncatedSources: PlumeSource[] = [];

    responses.forEach((response, index) => {
        if (response.status === "rejected") {
            failedSources.push(SOURCES[index]);
            return;
        }

        items.push(...response.value.items);

        if (response.value.truncated) {
            truncatedSources.push(response.value.source);
        }
    });

    items.sort((a, b) => {
        const dateComparison = (b.observedAt ?? "").localeCompare(a.observedAt ?? "");
        return dateComparison || a.key.localeCompare(b.key);
    });

    return { items, failedSources, truncatedSources };
}
