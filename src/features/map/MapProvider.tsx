import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import TileLayer from "ol/layer/Tile";
import type Map from "ol/Map";
import { transformExtent } from "ol/proj";
import XYZ from "ol/source/XYZ";

import { getS5PTileUrl } from "../../api/s5p";
import { getMethaneAnnualTileUrl } from "../../api/methaneAnnual";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useStoredState } from "../../hooks/useStoredState";

import { mapConfig, type BaseMapId } from "./config";
import {
    createAdministrativeBoundaryLayers,
    type AdministrativeBoundaryLayers,
} from "./adminBoundaries";
import {
    createInfrastructureMapLayers,
    type InfrastructureMapLayers,
} from "./infrastructureLayers";

import {
    MapContext,
    type ActiveMethaneLayer,
    type AdministrativeLayersOptions,
    type InfrastructureLayersOptions,
    type LegendStyle,
    type MethaneAnnualLayerOptions,
    type S5PLayerOptions,
} from "./mapContext";

const DEFAULT_S5P_OPTIONS: S5PLayerOptions = {
    uid: null,
    date: null,
    visible: false,
    opacity: 1,
    legendStyle: "gradient",
};

const DEFAULT_METHANE_ANNUAL_OPTIONS: MethaneAnnualLayerOptions = {
    uid: null,
    year: null,
    visible: false,
    opacity: 1,
    legendStyle: "gradient",
};

const DEFAULT_ADMINISTRATIVE_LAYERS_OPTIONS: AdministrativeLayersOptions = {
    countryVisible: false,
    countryOpacity: 1,
    regionsVisible: false,
    regionsOpacity: 1,
    districtsVisible: false,
    districtsOpacity: 1,
};

const DEFAULT_INFRASTRUCTURE_OPTIONS: InfrastructureLayersOptions = {
    oilGasInfrastructure: false,
    oilGasPipelines: false,
    landfills: false,
};

export function MapProvider({ children }: { children: ReactNode }) {
    const mapRef = useRef<Map | null>(null);

    const s5pLayerRef = useRef<TileLayer<XYZ> | null>(null);
    const s5pOptionsRef = useRef<S5PLayerOptions>(DEFAULT_S5P_OPTIONS);

    const methaneAnnualLayerRef = useRef<TileLayer<XYZ> | null>(null);
    const methaneAnnualOptionsRef = useRef<MethaneAnnualLayerOptions>(
        DEFAULT_METHANE_ANNUAL_OPTIONS,
    );

    const administrativeLayersRef = useRef<AdministrativeBoundaryLayers | null>(null);

    const administrativeLayersRequestRef = useRef<Promise<AdministrativeBoundaryLayers> | null>(
        null,
    );

    const administrativeOptionsRef = useRef<AdministrativeLayersOptions>(
        DEFAULT_ADMINISTRATIVE_LAYERS_OPTIONS,
    );

    const infrastructureLayersRef = useRef<InfrastructureMapLayers | null>(null);

    const infrastructureOptionsRef = useRef<InfrastructureLayersOptions>(
        DEFAULT_INFRASTRUCTURE_OPTIONS,
    );

    const { theme } = useAppTheme();

    const [baseMap, setBaseMapState] = useStoredState<BaseMapId>("base-map", "custom");

    const [activeMethaneLayer, setActiveMethaneLayer] = useState<ActiveMethaneLayer>(null);

    const [activeLegendStyle, setActiveLegendStyle] = useState<LegendStyle>("gradient");

    const baseMapRef = useRef(baseMap);
    const themeRef = useRef(theme);

    useEffect(() => {
        baseMapRef.current = baseMap;
    }, [baseMap]);

    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    const applyBaseMapVisibility = useCallback(
        (map: Map, selectedBaseMap: BaseMapId, currentTheme: "light" | "dark") => {
            map.getLayers().forEach((layer) => {
                const layerBaseMapId = layer.get("baseMapId") as BaseMapId | undefined;

                if (!layerBaseMapId) return;

                if (selectedBaseMap !== "custom") {
                    layer.setVisible(layerBaseMapId === selectedBaseMap);
                    return;
                }

                if (layerBaseMapId !== "custom") {
                    layer.setVisible(false);
                    return;
                }

                const layerTheme = layer.get("baseMapTheme") as "light" | "dark" | undefined;

                layer.setVisible(layerTheme === currentTheme);
            });
        },
        [],
    );

    const applyS5PLayer = useCallback((map: Map, options: S5PLayerOptions) => {
        const { uid, visible, opacity } = options;

        if (!uid) {
            if (s5pLayerRef.current?.getVisible()) {
                s5pLayerRef.current.setVisible(false);
            }

            return;
        }

        const normalizedOpacity = Math.max(0, Math.min(1, opacity));

        let layer = s5pLayerRef.current;

        if (!layer) {
            layer = new TileLayer({
                source: new XYZ({
                    url: getS5PTileUrl(uid),
                }),
                visible,
                opacity: normalizedOpacity,
                zIndex: 100,
                properties: {
                    layerId: "sentinel-5p",
                    s5pUid: uid,
                },
            });

            s5pLayerRef.current = layer;
            map.addLayer(layer);
            return;
        }

        if (layer.get("s5pUid") !== uid) {
            layer.setSource(
                new XYZ({
                    url: getS5PTileUrl(uid),
                }),
            );

            layer.set("s5pUid", uid);
        }

        if (layer.getVisible() !== visible) {
            layer.setVisible(visible);
        }

        if (layer.getOpacity() !== normalizedOpacity) {
            layer.setOpacity(normalizedOpacity);
        }
    }, []);

    const applyMethaneAnnualLayer = useCallback((map: Map, options: MethaneAnnualLayerOptions) => {
        const { uid, visible, opacity } = options;

        if (!uid) {
            methaneAnnualLayerRef.current?.setVisible(false);
            return;
        }

        const normalizedOpacity = Math.max(0, Math.min(1, opacity));

        let layer = methaneAnnualLayerRef.current;

        if (!layer) {
            layer = new TileLayer({
                source: new XYZ({
                    url: getMethaneAnnualTileUrl(uid),
                }),
                visible,
                opacity: normalizedOpacity,
                zIndex: 90,
                properties: {
                    layerId: "methane-annual",
                    methaneAnnualUid: uid,
                },
            });

            methaneAnnualLayerRef.current = layer;
            map.addLayer(layer);
            return;
        }

        if (layer.get("methaneAnnualUid") !== uid) {
            layer.setSource(
                new XYZ({
                    url: getMethaneAnnualTileUrl(uid),
                }),
            );
            layer.set("methaneAnnualUid", uid);
        }

        layer.setVisible(visible);
        layer.setOpacity(normalizedOpacity);
    }, []);

    const applyAdministrativeLayers = useCallback(
        (map: Map, options: AdministrativeLayersOptions) => {
            const apply = (
                layers: AdministrativeBoundaryLayers,
                layerOptions: AdministrativeLayersOptions,
            ) => {
                layers.country.setVisible(layerOptions.countryVisible);
                layers.country.setOpacity(Math.max(0, Math.min(1, layerOptions.countryOpacity)));

                layers.regions.setVisible(layerOptions.regionsVisible);
                layers.regions.setOpacity(Math.max(0, Math.min(1, layerOptions.regionsOpacity)));

                layers.districts.setVisible(layerOptions.districtsVisible);
                layers.districts.setOpacity(
                    Math.max(0, Math.min(1, layerOptions.districtsOpacity)),
                );
            };

            if (administrativeLayersRef.current) {
                apply(administrativeLayersRef.current, options);
                return;
            }

            if (!options.countryVisible && !options.regionsVisible && !options.districtsVisible) {
                return;
            }

            administrativeLayersRequestRef.current ??= createAdministrativeBoundaryLayers();

            void administrativeLayersRequestRef.current
                .then((layers) => {
                    if (mapRef.current !== map || administrativeLayersRef.current) {
                        return;
                    }

                    administrativeLayersRef.current = layers;

                    map.addLayer(layers.districts);
                    map.addLayer(layers.regions);
                    map.addLayer(layers.country);

                    apply(layers, administrativeOptionsRef.current);
                })
                .catch(() => {
                    administrativeLayersRequestRef.current = null;
                });
        },
        [],
    );

    const applyInfrastructureLayers = useCallback(
        (map: Map, options: InfrastructureLayersOptions) => {
            let layers = infrastructureLayersRef.current;

            if (!layers) {
                const hasEnabledLayers =
                    options.oilGasInfrastructure || options.oilGasPipelines || options.landfills;

                if (!hasEnabledLayers) return;

                layers = createInfrastructureMapLayers();
                infrastructureLayersRef.current = layers;

                map.addLayer(layers.oilGasInfrastructure);
                map.addLayer(layers.oilGasPipelines);
                map.addLayer(layers.landfills);
            }

            layers.setOilGasCategories(options.oilGasCategories);

            layers.oilGasInfrastructure.setVisible(options.oilGasInfrastructure);

            layers.oilGasPipelines.setVisible(options.oilGasPipelines);

            layers.landfills.setVisible(options.landfills);
        },
        [],
    );

    const registerMap = useCallback(
        (map: Map | null) => {
            mapRef.current = map;

            if (!map) {
                s5pLayerRef.current = null;
                methaneAnnualLayerRef.current = null;
                administrativeLayersRef.current = null;
                infrastructureLayersRef.current = null;
                return;
            }

            applyBaseMapVisibility(map, baseMapRef.current, themeRef.current);

            applyS5PLayer(map, s5pOptionsRef.current);

            applyMethaneAnnualLayer(map, methaneAnnualOptionsRef.current);

            applyAdministrativeLayers(map, administrativeOptionsRef.current);

            applyInfrastructureLayers(map, infrastructureOptionsRef.current);
        },
        [
            applyAdministrativeLayers,
            applyInfrastructureLayers,
            applyBaseMapVisibility,
            applyMethaneAnnualLayer,
            applyS5PLayer,
        ],
    );

    useEffect(() => {
        const map = mapRef.current;

        if (!map) return;

        applyBaseMapVisibility(map, baseMap, theme);
    }, [baseMap, theme, applyBaseMapVisibility]);

    const zoomIn = useCallback(() => {
        const view = mapRef.current?.getView();

        if (!view) return;

        const zoom = view.getZoom() ?? mapConfig.minZoom;

        view.animate({
            zoom: Math.min(zoom + 1, mapConfig.maxZoom),
            duration: 150,
        });
    }, []);

    const zoomOut = useCallback(() => {
        const view = mapRef.current?.getView();

        if (!view) return;

        const zoom = view.getZoom() ?? mapConfig.minZoom;

        view.animate({
            zoom: Math.max(zoom - 1, mapConfig.minZoom),
            duration: 150,
        });
    }, []);

    const resetView = useCallback(() => {
        const map = mapRef.current;
        const view = map?.getView();
        const size = map?.getSize();

        if (!view || !size) return;

        const homeExtent = transformExtent(
            mapConfig.home.extent,
            "EPSG:4326",
            view.getProjection(),
        );

        view.fit(homeExtent, {
            size,
            duration: 400,
        });
    }, []);

    const setBaseMap = useCallback(
        (id: BaseMapId) => {
            setBaseMapState(id);
        },
        [setBaseMapState],
    );

    const updateS5PLayer = useCallback(
        (options: S5PLayerOptions) => {
            s5pOptionsRef.current = options;

            setActiveMethaneLayer((current) =>
                options.visible ? "daily" : current === "daily" ? null : current,
            );

            if (options.visible) {
                setActiveLegendStyle(options.legendStyle);
            }

            const map = mapRef.current;

            if (map) {
                applyS5PLayer(map, options);
            }
        },
        [applyS5PLayer],
    );

    const getS5PLayerState = useCallback(() => s5pOptionsRef.current, []);

    const updateMethaneAnnualLayer = useCallback(
        (options: MethaneAnnualLayerOptions) => {
            methaneAnnualOptionsRef.current = options;

            setActiveMethaneLayer((current) =>
                options.visible ? "annual" : current === "annual" ? null : current,
            );

            if (options.visible) {
                setActiveLegendStyle(options.legendStyle);
            }

            if (mapRef.current) {
                applyMethaneAnnualLayer(mapRef.current, options);
            }
        },
        [applyMethaneAnnualLayer],
    );

    const getMethaneAnnualLayerState = useCallback(() => methaneAnnualOptionsRef.current, []);

    const updateAdministrativeLayers = useCallback(
        (options: AdministrativeLayersOptions) => {
            administrativeOptionsRef.current = options;

            if (mapRef.current) {
                applyAdministrativeLayers(mapRef.current, options);
            }
        },
        [applyAdministrativeLayers],
    );

    const updateInfrastructureLayers = useCallback(
        (options: InfrastructureLayersOptions) => {
            infrastructureOptionsRef.current = options;

            if (mapRef.current) {
                applyInfrastructureLayers(mapRef.current, options);
            }
        },
        [applyInfrastructureLayers],
    );

    return (
        <MapContext.Provider
            value={{
                registerMap,

                zoomIn,
                zoomOut,
                resetView,

                baseMap,
                setBaseMap,

                updateS5PLayer,
                getS5PLayerState,

                updateMethaneAnnualLayer,
                getMethaneAnnualLayerState,

                activeMethaneLayer,
                activeLegendStyle,

                updateAdministrativeLayers,
                updateInfrastructureLayers,
            }}
        >
            {children}
        </MapContext.Provider>
    );
}
