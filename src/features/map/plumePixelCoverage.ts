import type { PlumeObservation } from "../point-sources/types";

type Bounds = [number, number, number, number];

function readNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;

    if (typeof value === "string" && value.trim()) {
        const number = Number(value);
        return Number.isFinite(number) ? number : null;
    }

    return null;
}

function boundsFromCoordinates(coordinates: unknown): Bounds | null {
    const extent: Bounds = [Infinity, Infinity, -Infinity, -Infinity];

    const visit = (value: unknown): void => {
        if (!Array.isArray(value)) return;

        if (value.length >= 2) {
            const lon = readNumber(value[0]);
            const lat = readNumber(value[1]);

            if (lon !== null && lat !== null && Math.abs(lon) <= 180 && Math.abs(lat) <= 90) {
                extent[0] = Math.min(extent[0], lon);
                extent[1] = Math.min(extent[1], lat);
                extent[2] = Math.max(extent[2], lon);
                extent[3] = Math.max(extent[3], lat);
                return;
            }
        }

        value.forEach(visit);
    };

    visit(coordinates);

    if (!Number.isFinite(extent[0])) return null;
    if (extent[0] === extent[2] || extent[1] === extent[3]) return null;

    return extent;
}

/**
 * true  — координата внутри известного охвата шлейфа;
 * false — вне охвата;
 * null  — охват не известен.
 */
export function plumeCoversCoordinate(
    plume: PlumeObservation,
    lon: number,
    lat: number,
): boolean | null {
    const bounds = plume.bounds ?? boundsFromCoordinates(plume.geometry?.coordinates);

    if (!bounds) return null;

    return lon >= bounds[0] && lon <= bounds[2] && lat >= bounds[1] && lat <= bounds[3];
}
