import { createContext } from "react";
import type Map from "ol/Map";

import type { BaseMapId } from "./config";

export type LegendStyle = "blocks" | "gradient";

export interface S5PLayerOptions {
    uid: string | null;
    date: string | null;
    visible: boolean;
    opacity: number;
    legendStyle: LegendStyle;
}

export interface MethaneAnnualLayerOptions {
    uid: string | null;
    year: number | null;
    visible: boolean;
    opacity: number;
    legendStyle: LegendStyle;
}

export interface AdministrativeLayersOptions {
    countryVisible: boolean;
    countryOpacity: number;
    regionsVisible: boolean;
    regionsOpacity: number;
    districtsVisible: boolean;
    districtsOpacity: number;
}

export type ActiveMethaneLayer = "daily" | "annual" | null;

export interface MapController {
    registerMap: (map: Map | null) => void;

    zoomIn: () => void;
    zoomOut: () => void;
    resetView: () => void;

    baseMap: BaseMapId;
    setBaseMap: (id: BaseMapId) => void;

    updateS5PLayer: (options: S5PLayerOptions) => void;
    getS5PLayerState: () => S5PLayerOptions;

    updateMethaneAnnualLayer: (options: MethaneAnnualLayerOptions) => void;
    getMethaneAnnualLayerState: () => MethaneAnnualLayerOptions;

    activeMethaneLayer: ActiveMethaneLayer;
    activeLegendStyle: LegendStyle;

    updateAdministrativeLayers: (options: AdministrativeLayersOptions) => void;
}

export const MapContext = createContext<MapController | null>(null);
