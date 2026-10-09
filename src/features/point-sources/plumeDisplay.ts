import type { PlumeObservation } from "./types";

export type SatelliteKind = "sentinel2" | "landsat" | "emit" | "tanager";

export function getSatelliteKind(plume: PlumeObservation): SatelliteKind | null {
    if (plume.source === "emit") return "emit";
    if (plume.source === "tanager") return "tanager";

    const satellite = String(plume.properties.satellite ?? "").toLowerCase();

    if (/sentinel[\s_-]*2/.test(satellite)) return "sentinel2";
    if (/landsat/.test(satellite)) return "landsat";

    return null;
}

export function getSatelliteName(plume: PlumeObservation): string {
    const kind = getSatelliteKind(plume);

    if (kind === "emit") return "EMIT";
    if (kind === "tanager") return "Tanager";

    if (kind === "sentinel2") {
        const satellite = String(plume.properties.satellite ?? "");
        const variant = satellite.match(/sentinel[\s_-]*2[\s_-]*([ab])\b/i);

        return variant ? `Sentinel-2${variant[1].toUpperCase()}` : "Sentinel-2";
    }

    if (kind === "landsat") {
        const fields = [
            plume.properties.satellite,
            plume.properties.spacecraft_id,
            plume.properties.platform,
            plume.properties.mission,
            plume.properties.landsat_number,
            plume.properties.scene_id,
        ];

        for (const field of fields) {
            if (typeof field !== "string" && typeof field !== "number") continue;

            if (typeof field === "number" && field >= 4 && field <= 9) {
                return `Landsat ${field}`;
            }

            const text = String(field);
            const match = text.match(/landsat[\s_-]*(\d{1,2})\b/i);

            if (match) return `Landsat ${Number(match[1])}`;

            const product = text.match(/(?:^|[^A-Z0-9])(?:LC|LE|LT)0([4-9])(?:[^A-Z0-9]|$)/i);

            if (product) return `Landsat ${product[1]}`;
        }

        return "Landsat";
    }

    return typeof plume.properties.satellite === "string" && plume.properties.satellite.trim()
        ? plume.properties.satellite
        : "—";
}

function readNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;

    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
        return Number(value);
    }

    return null;
}

export function getEmissionRate(plume: PlumeObservation): number | null {
    if (plume.source === "orbio") {
        return readNumber(plume.properties.q_kg_hr);
    }

    if (plume.source === "tanager" && plume.properties.hide_emission !== true) {
        return readNumber(plume.properties.emission_auto);
    }

    return null;
}

export function getEmissionUncertainty(
    plume: PlumeObservation,
): { low: number; high: number } | null {
    const rate = getEmissionRate(plume);
    if (rate === null) return null;

    if (plume.source === "tanager") {
        const uncertainty = readNumber(plume.properties.emission_uncertainty_auto);

        return uncertainty === null ? null : { low: uncertainty, high: uncertainty };
    }

    if (plume.source === "orbio") {
        const low = readNumber(plume.properties.q_low_kg_hr);
        const high = readNumber(plume.properties.q_high_kg_hr);

        if (low !== null && high !== null) {
            return {
                low: Math.max(0, rate - low),
                high: Math.max(0, high - rate),
            };
        }
    }

    return null;
}

export function getObservationDate(plume: PlumeObservation): string | null {
    const date = plume.observedAt?.slice(0, 10);

    return date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

export function formatCompact(value: number, locale: string): string {
    const compact = Math.abs(value) >= 1000;

    const formatted = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1,
    }).format(compact ? value / 1000 : value);

    return compact ? `${formatted}K` : formatted;
}
