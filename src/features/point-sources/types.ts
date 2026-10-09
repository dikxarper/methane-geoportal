export type PlumeSource = "emit" | "tanager" | "orbio";

export interface PlumeGeometry {
    type: string;
    coordinates: unknown;
}

export interface PlumeObservation {
    key: string;
    id: string;
    uid: string | null;
    source: PlumeSource;
    observedAt: string | null;
    geometry: PlumeGeometry | null;
    bounds: [number, number, number, number] | null;
    properties: Record<string, unknown>;
}

export interface PlumeObservationsResult {
    items: PlumeObservation[];
    failedSources: PlumeSource[];
    truncatedSources: PlumeSource[];
}
