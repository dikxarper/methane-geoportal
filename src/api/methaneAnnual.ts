import { apiRequest, getApiUrl } from "./client";

export interface MethaneAnnualRecord {
    id?: number;
    uid?: string;
    uuid?: string;
    year?: number;
    source?: string;
    algorithm?: string;
    [key: string]: unknown;
}

export interface MethaneAnnualPixelResult {
    value: number | null;
    raw: unknown;
}

function extractRecords(payload: unknown): MethaneAnnualRecord[] {
    if (Array.isArray(payload)) {
        return payload as MethaneAnnualRecord[];
    }

    if (typeof payload !== "object" || payload === null) {
        return [];
    }

    const object = payload as Record<string, unknown>;

    return Array.isArray(object.data) ? (object.data as MethaneAnnualRecord[]) : [];
}

export async function getMethaneAnnualRecords() {
    const payload = await apiRequest<unknown>(
        "/methane-annual/filter?sort_by=year&sort_dir=desc&limit=100",
    );

    return extractRecords(payload);
}

export function getMethaneAnnualRecordUid(record: MethaneAnnualRecord): string | null {
    if (typeof record.uid === "string" && record.uid.length > 0) {
        return record.uid;
    }

    return typeof record.uuid === "string" && record.uuid.length > 0 ? record.uuid : null;
}

export function getMethaneAnnualTileUrl(uid: string) {
    return `${getApiUrl()}/raster-tiles/methane-annual/${encodeURIComponent(uid)}/{z}/{x}/{y}.png`;
}

function toNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);

        return Number.isFinite(parsed) ? parsed : null;
    }

    return null;
}

function extractPixelValue(payload: unknown): number | null {
    const directValue = toNumber(payload);

    if (directValue !== null || typeof payload !== "object" || payload === null) {
        return directValue;
    }

    const object = payload as Record<string, unknown>;

    return toNumber(object.value) ??
        (typeof object.data === "object" && object.data !== null
            ? toNumber((object.data as Record<string, unknown>).value)
            : null);
}

export async function getMethaneAnnualPixelValue(
    uid: string,
    lon: number,
    lat: number,
    signal?: AbortSignal,
): Promise<MethaneAnnualPixelResult> {
    const search = new URLSearchParams({
        uid,
        lon: String(lon),
        lat: String(lat),
    });
    const raw = await apiRequest<unknown>(`/raster-value/methane-annual?${search.toString()}`, {
        signal,
    });

    return { value: extractPixelValue(raw), raw };
}
