import { getEmissionRate, getObservationDate, getSatelliteKind } from "./plumeDisplay";
import type { PlumeObservation } from "./types";

export type TrendMode = "period" | "days";
export type TrendPeriod = "month" | "quarter" | "day";

export interface TrendPoint {
    key: string;
    from: string;
    to: string;
    timestamp: number;
    value: number;
    count: number;
    label: string;
    observation: PlumeObservation | null;
}

export interface TrendStats {
    average: number | null;
    quantifiedCount: number;
    observedDays: number;
}

export interface TrendData {
    points: TrendPoint[];
    period: TrendPeriod;
    stats: TrendStats;
}

interface Measurement {
    date: string;
    value: number;
    observation: PlumeObservation;
}

interface Bucket {
    from: string;
    to: string;
    sum: number;
    count: number;
    observation: PlumeObservation | null;
}

export function toUtcTimestamp(date: string): number {
    return Date.parse(`${date}T00:00:00Z`);
}

function isValidDate(date: string | null): date is string {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return false;
    }

    const time = toUtcTimestamp(date);

    return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === date;
}

function monthDistance(a: string, b: string): number {
    return (
        (Number(b.slice(0, 4)) - Number(a.slice(0, 4))) * 12 +
        Number(b.slice(5, 7)) -
        Number(a.slice(5, 7))
    );
}

function getBucket(date: string, period: TrendPeriod): { key: string; from: string; to: string } {
    if (period === "day") {
        return { key: date, from: date, to: date };
    }

    const year = Number(date.slice(0, 4));
    const month = Number(date.slice(5, 7));

    if (period === "quarter") {
        const quarter = Math.floor((month - 1) / 3) + 1;
        const firstMonth = (quarter - 1) * 3 + 1;
        const lastMonth = firstMonth + 2;
        const lastDay = new Date(Date.UTC(year, lastMonth, 0)).getUTCDate();

        return {
            key: `${year}-Q${quarter}`,
            from: `${year}-${String(firstMonth).padStart(2, "0")}-01`,
            to: `${year}-${String(lastMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`,
        };
    }

    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

    return {
        key: date.slice(0, 7),
        from: `${date.slice(0, 7)}-01`,
        to: `${date.slice(0, 7)}-${String(lastDay).padStart(2, "0")}`,
    };
}

function formatBucketLabel(from: string, period: TrendPeriod, locale: string): string {
    if (period === "quarter") {
        const quarter = Math.floor((Number(from.slice(5, 7)) - 1) / 3) + 1;

        return locale.startsWith("ru")
            ? `${quarter}-й кв. ${from.slice(0, 4)}`
            : `Q${quarter} ${from.slice(0, 4)}`;
    }

    const date = new Date(toUtcTimestamp(from));

    return new Intl.DateTimeFormat(locale, {
        day: period === "day" ? "numeric" : undefined,
        month: period === "day" ? "short" : "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(date);
}

export function buildPlumeTrend(
    items: readonly PlumeObservation[],
    selectedSatellites: readonly string[],
    mode: TrendMode,
    locale: string,
): TrendData {
    const satellites = new Set(selectedSatellites);

    const observations = items.filter((item) => {
        if (satellites.size === 0) return true;

        const kind = getSatelliteKind(item);
        return kind !== null && satellites.has(kind);
    });

    const observedDates = new Set<string>();
    const measurements: Measurement[] = [];

    for (const observation of observations) {
        const date = getObservationDate(observation);
        if (!isValidDate(date)) continue;

        observedDates.add(date);

        const value = getEmissionRate(observation);

        if (value === null || !Number.isFinite(value) || value < 0) {
            continue;
        }

        measurements.push({ date, value, observation });
    }

    measurements.sort(
        (a, b) =>
            a.date.localeCompare(b.date) || a.observation.key.localeCompare(b.observation.key),
    );

    const sum = measurements.reduce((total, item) => total + item.value, 0);

    const stats: TrendStats = {
        average: measurements.length ? sum / measurements.length : null,
        quantifiedCount: measurements.length,
        observedDays: observedDates.size,
    };

    const months = measurements.length
        ? monthDistance(measurements[0].date, measurements[measurements.length - 1].date)
        : 0;

    const period: TrendPeriod = mode === "days" ? "day" : months >= 24 ? "quarter" : "month";

    const buckets = new Map<string, Bucket>();

    for (const item of measurements) {
        const { key, from, to } = getBucket(item.date, period);
        const bucket = buckets.get(key);

        if (bucket) {
            bucket.sum += item.value;
            bucket.count += 1;
            bucket.observation = null;
        } else {
            buckets.set(key, {
                from,
                to,
                sum: item.value,
                count: 1,
                observation: item.observation,
            });
        }
    }

    const points = [...buckets.entries()]
        .sort((a, b) => a[1].from.localeCompare(b[1].from))
        .map(([key, bucket]): TrendPoint => ({
            key,
            from: bucket.from,
            to: bucket.to,
            timestamp: (toUtcTimestamp(bucket.from) + toUtcTimestamp(bucket.to)) / 2,
            value: bucket.sum / bucket.count,
            count: bucket.count,
            label: formatBucketLabel(bucket.from, period, locale),
            observation: bucket.count === 1 ? bucket.observation : null,
        }));

    return { points, period, stats };
}
