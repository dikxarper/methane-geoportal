import { apiRequest, getApiUrl } from "./client";

export interface S5PRecord {
    id?: number;
    uid?: string;
    uuid?: string;
    date?: string;
    product_name?: string;
    rescale_min?: number;
    rescale_max?: number;
    render_mode?: string;
    bidx?: string;
    min_value?: string;
    max_value?: string;
    avg_value?: string;
    median_value?: string;
    [key: string]: unknown;
}

interface S5PFilterParams {
    date?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    sortDir?: "asc" | "desc";
    limit?: number;
    offset?: number;
}

export interface S5PDateBounds {
    minDate: string;
    maxDate: string;
    minRecord: S5PRecord;
    maxRecord: S5PRecord;
}

export interface S5PPixelResult {
    value: number | null;
    raw: unknown;
}

const rangeCache = new Map<string, Promise<S5PRecord[]>>();

function extractRecords(payload: unknown): S5PRecord[] {
    if (Array.isArray(payload)) {
        return payload as S5PRecord[];
    }

    if (typeof payload !== "object" || payload === null) {
        return [];
    }

    const object = payload as Record<string, unknown>;

    if (Array.isArray(object.data)) {
        return object.data as S5PRecord[];
    }

    return [];
}

function toNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }

    if (typeof value === "string" && value.trim() !== "") {
        const parsed = Number(value);

        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }

    return null;
}

function extractPixelValue(payload: unknown): number | null {
    const directValue = toNumber(payload);

    if (directValue !== null) {
        return directValue;
    }

    if (typeof payload !== "object" || payload === null) {
        return null;
    }

    const object = payload as Record<string, unknown>;

    const value = toNumber(object.value);

    if (value !== null) {
        return value;
    }

    if (typeof object.data === "object" && object.data !== null) {
        const data = object.data as Record<string, unknown>;

        return toNumber(data.value);
    }

    return null;
}

export function normalizeS5PDate(value: unknown): string | null {
    if (typeof value !== "string") {
        return null;
    }

    const date = value.trim().slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return null;
    }

    return date;
}

export async function getS5PRecords(params: S5PFilterParams = {}): Promise<S5PRecord[]> {
    const search = new URLSearchParams();

    search.set("product_name", "s5p_ch4");

    if (params.date) {
        search.set("date", params.date);
    }

    if (params.dateFrom) {
        search.set("date_from", params.dateFrom);
    }

    if (params.dateTo) {
        search.set("date_to", params.dateTo);
    }

    if (params.sortBy) {
        search.set("sort_by", params.sortBy);
    }

    if (params.sortDir) {
        search.set("sort_dir", params.sortDir);
    }

    if (params.limit !== undefined) {
        search.set("limit", String(params.limit));
    }

    if (params.offset !== undefined) {
        search.set("offset", String(params.offset));
    }

    const payload = await apiRequest<unknown>(`/s5p/filter?${search.toString()}`);

    return extractRecords(payload);
}

export async function getS5PDateBounds(): Promise<S5PDateBounds | null> {
    const [oldestRecords, newestRecords] = await Promise.all([
        getS5PRecords({
            sortBy: "date",
            sortDir: "asc",
            limit: 1,
            offset: 0,
        }),
        getS5PRecords({
            sortBy: "date",
            sortDir: "desc",
            limit: 1,
            offset: 0,
        }),
    ]);

    const minRecord = oldestRecords[0];
    const maxRecord = newestRecords[0];

    if (!minRecord || !maxRecord) {
        return null;
    }

    const minDate = normalizeS5PDate(minRecord.date);
    const maxDate = normalizeS5PDate(maxRecord.date);

    if (!minDate || !maxDate) {
        return null;
    }

    return {
        minDate,
        maxDate,
        minRecord,
        maxRecord,
    };
}

export function getS5PRecordsForRange(dateFrom: string, dateTo: string) {
    const cacheKey = `${dateFrom}:${dateTo}`;
    const cached = rangeCache.get(cacheKey);

    if (cached) {
        return cached;
    }

    const request = getS5PRecords({
        dateFrom,
        dateTo,
        sortBy: "date",
        sortDir: "asc",
        limit: 100,
        offset: 0,
    }).catch((error) => {
        rangeCache.delete(cacheKey);
        throw error;
    });

    rangeCache.set(cacheKey, request);

    return request;
}

export async function getS5PPixelValue(
    uid: string,
    lon: number,
    lat: number,
    signal?: AbortSignal,
): Promise<S5PPixelResult> {
    const search = new URLSearchParams({
        uid,
        lon: String(lon),
        lat: String(lat),
    });

    const payload = await apiRequest<unknown>(`/raster-value/s5p?${search.toString()}`, {
        signal,
    });

    return {
        value: extractPixelValue(payload),
        raw: payload,
    };
}

export function getS5PRecordUid(record: S5PRecord): string | null {
    if (typeof record.uid === "string" && record.uid.length > 0) {
        return record.uid;
    }

    if (typeof record.uuid === "string" && record.uuid.length > 0) {
        return record.uuid;
    }

    return null;
}

export function getS5PTileUrl(uid: string) {
    return `${getApiUrl()}/raster-tiles/s5p/` + `${encodeURIComponent(uid)}/{z}/{x}/{y}.png`;
}
