import { apiRequest } from "./client";
import type { PlumeSource } from "../features/point-sources/types";

export interface PlumeRasterPixelResult {
    value: number | null;
    unit: string | null;
    raw: unknown;
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;

    if (typeof value === "string" && value.trim()) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
}

function extractValue(payload: unknown): number | null {
    const direct = toNumber(payload);
    if (direct !== null) return direct;
    if (!isObject(payload)) return null;

    for (const key of ["value", "pixel_value", "raster_value"]) {
        const number = toNumber(payload[key]);
        if (number !== null) return number;
    }

    if (isObject(payload.data)) {
        return extractValue(payload.data);
    }

    if (isObject(payload.result)) {
        return extractValue(payload.result);
    }

    return null;
}

function extractUnit(payload: unknown): string | null {
    if (!isObject(payload)) return null;

    const value = payload.unit ?? payload.units;

    if (typeof value === "string" && value.trim()) {
        return value.trim();
    }

    return isObject(payload.data) ? extractUnit(payload.data) : null;
}

export async function getPlumeRasterValue(
    source: PlumeSource,
    uid: string,
    lon: number,
    lat: number,
    signal?: AbortSignal,
): Promise<PlumeRasterPixelResult> {
    const query = new URLSearchParams({
        uid,
        lon: String(lon),
        lat: String(lat),
    });

    const payload = await apiRequest<unknown>(`/raster-value/${source}?${query.toString()}`, {
        signal,
    });

    return {
        value: extractValue(payload),
        unit: extractUnit(payload),
        raw: payload,
    };
}
