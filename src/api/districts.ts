import { apiRequest } from "./client";

export interface DistrictFeature {
    type: "Feature";
    properties: {
        adm0_en?: string;
        adm1_en?: string;
        name_ru?: string;
        name_kz?: string;
        [key: string]: unknown;
    };
    geometry: {
        type: "Polygon" | "MultiPolygon";
        coordinates: number[][][] | number[][][][];
    };
}

export interface DistrictFeatureCollection {
    type: "FeatureCollection";
    features: DistrictFeature[];
}

export function getDistricts() {
    return apiRequest<DistrictFeatureCollection>("/district");
}
