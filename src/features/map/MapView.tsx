import { useEffect, useRef, useState } from "react";
import { Box } from "@chakra-ui/react";

import type { Coordinate } from "ol/coordinate";
import type BaseLayer from "ol/layer/Base";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { defaults as defaultControls } from "ol/control";
import { getCenter } from "ol/extent";
import { fromLonLat, toLonLat, transformExtent } from "ol/proj";

import { getS5PPixelValue } from "../../api/s5p";
import { getMethaneAnnualPixelValue } from "../../api/methaneAnnual";
import { getPlumeMapGroups } from "../../api/plumeMapGroups";
import { getPlumeRasterValue } from "../../api/plumeRasterValue";

import type { PlumeObservation } from "../point-sources/types";
import { usePointSources } from "../point-sources/usePointSources";

import { createBaseLayers } from "./baseLayers";
import { mapConfig } from "./config";
import {
    createPlumeGroupLayers,
    handlePlumeGroupClick,
    type PlumeGroupLayers,
} from "./plumeGroupLayers";
import {
    createPlumeRasterLayer,
    createPlumeRasterSource,
    focusMapOnPlume,
    focusMapOnPoint,
} from "./plumeRasterLayer";
import { plumeCoversCoordinate } from "./plumePixelCoverage";
import { registerPlumeOpacityPreview } from "./plumeOpacityPreview";
import { pickInfrastructureFeature, type InfrastructureSelection } from "./infrastructureFeature";

import { S5PPixelPopup } from "./S5PPixelPopup";
import { PlumePixelPopup } from "./PlumePixelPopup";
import { InfrastructurePopup } from "./InfrastructurePopup";
import { useMapController } from "./useMapController";

const S5P_HIDE_ZOOM = 10;
const MAP_VIEW_STORAGE_KEY = "geoportal:v1:map-view";

interface MethanePopupState {
    kind: "methane";
    date: string | null;
    year: number | null;
    loading: boolean;
    value: number | null;
    error: boolean;
}

interface PlumePopupState {
    kind: "plume";
    plume: PlumeObservation;
    lon: number;
    lat: number;
    value: number | null;
    unit: string | null;
    loading: boolean;
    error: boolean;
}

interface InfrastructurePopupState {
    kind: "infrastructure";
    selection: InfrastructureSelection;
}

type PixelPopupState = MethanePopupState | PlumePopupState | InfrastructurePopupState;

function restoreMapView(view: View): void {
    try {
        const raw = window.localStorage.getItem(MAP_VIEW_STORAGE_KEY);
        if (!raw) return;

        const saved: unknown = JSON.parse(raw);

        if (!saved || typeof saved !== "object") return;

        const state = saved as {
            center?: unknown;
            zoom?: unknown;
        };

        if (
            !Array.isArray(state.center) ||
            state.center.length !== 2 ||
            !state.center.every((value) => typeof value === "number" && Number.isFinite(value)) ||
            typeof state.zoom !== "number" ||
            !Number.isFinite(state.zoom)
        ) {
            return;
        }

        view.setCenter(state.center as [number, number]);
        view.setZoom(Math.min(mapConfig.maxZoom, Math.max(view.getMinZoom(), state.zoom)));
    } catch {
        // Некорректное сохранённое состояние не должно ломать карту.
    }
}

export function MapView() {
    const mapElementRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<Map | null>(null);

    const groupLayersRef = useRef<PlumeGroupLayers | null>(null);
    const groupsLoadedRef = useRef(false);
    const lastGroupFocusRef = useRef(0);

    const plumeRasterRef = useRef<TileLayer<XYZ> | null>(null);
    const selectedPlumeRef = useRef<PlumeObservation | null>(null);

    const popupElementRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<Overlay | null>(null);
    const requestRef = useRef<AbortController | null>(null);

    const selectedGroupIdRef = useRef<string | null>(null);
    const pointSourcesEnabledRef = useRef(false);
    const selectGroupRef = useRef<ReturnType<typeof usePointSources>["selectGroup"]>(
        () => undefined,
    );

    const { registerMap, setBaseMap, getMethaneAnnualLayerState, getS5PLayerState } =
        useMapController();

    const { enabled, opacity, selectedGroup, focusRequest, selectedPlume, selectGroup } =
        usePointSources();

    const [popup, setPopup] = useState<PixelPopupState | null>(null);

    useEffect(() => {
        selectGroupRef.current = selectGroup;
        selectedPlumeRef.current = selectedPlume;
        selectedGroupIdRef.current = selectedGroup?.id ?? null;
        pointSourcesEnabledRef.current = enabled;
    }, [selectGroup, selectedPlume, selectedGroup?.id, enabled]);

    useEffect(() => {
        if (!enabled || !selectedGroup?.id) return;

        setBaseMap("satellite");
    }, [enabled, selectedGroup?.id, setBaseMap]);

    useEffect(() => {
        if (!mapElementRef.current || !popupElementRef.current) return;

        const homeExtent = transformExtent(mapConfig.home.extent, "EPSG:4326", "EPSG:3857");

        const view = new View({
            center: getCenter(homeExtent),
            zoom: mapConfig.minZoom,
            maxZoom: mapConfig.maxZoom,
        });

        const map = new Map({
            target: mapElementRef.current,
            layers: createBaseLayers(),
            view,
            controls: defaultControls({
                zoom: false,
                rotate: false,
                attribution: true,
            }),
        });

        mapRef.current = map;

        const size = map.getSize();

        if (size) {
            const resolution = view.getResolutionForExtent(homeExtent, size);
            const homeZoom = view.getZoomForResolution(resolution);

            if (homeZoom !== undefined) {
                view.setMinZoom(homeZoom);
                view.setZoom(homeZoom);
            }
        }

        restoreMapView(view);

        const saveViewKey = map.on("moveend", () => {
            const center = view.getCenter();
            const zoom = view.getZoom();

            if (!center || zoom === undefined) return;

            try {
                window.localStorage.setItem(MAP_VIEW_STORAGE_KEY, JSON.stringify({ center, zoom }));
            } catch {
                // Ошибки browser storage игнорируем.
            }
        });

        const groupLayers = createPlumeGroupLayers();
        groupLayersRef.current = groupLayers;

        map.addLayer(groupLayers.polygons);
        map.addLayer(groupLayers.cluster);

        const overlay = new Overlay({
            element: popupElementRef.current,
            positioning: "bottom-center",
            offset: [0, -12],
            stopEvent: true,
        });

        overlayRef.current = overlay;
        map.addOverlay(overlay);
        registerMap(map);

        const clearPopup = () => {
            requestRef.current?.abort();
            overlay.setPosition(undefined);
            setPopup(null);
        };

        const inspectMethanePixel = async (coordinate: Coordinate) => {
            const s5pLayer = getS5PLayerState();
            const annualLayer = getMethaneAnnualLayerState();

            const layer =
                s5pLayer.visible && s5pLayer.uid
                    ? {
                          uid: s5pLayer.uid,
                          date: s5pLayer.date,
                          year: null,
                          getValue: getS5PPixelValue,
                      }
                    : annualLayer.visible && annualLayer.uid
                      ? {
                            uid: annualLayer.uid,
                            date: null,
                            year: annualLayer.year,
                            getValue: getMethaneAnnualPixelValue,
                        }
                      : null;

            if (!layer) {
                clearPopup();
                return;
            }

            requestRef.current?.abort();

            const controller = new AbortController();
            requestRef.current = controller;

            const [lon, lat] = toLonLat(coordinate);

            overlay.setPosition(coordinate);

            setPopup({
                kind: "methane",
                date: layer.date,
                year: layer.year,
                loading: true,
                value: null,
                error: false,
            });

            try {
                const result = await layer.getValue(layer.uid, lon, lat, controller.signal);

                if (controller.signal.aborted) return;

                setPopup({
                    kind: "methane",
                    date: layer.date,
                    year: layer.year,
                    loading: false,
                    value: result.value,
                    error: false,
                });
            } catch {
                if (controller.signal.aborted) return;

                setPopup({
                    kind: "methane",
                    date: layer.date,
                    year: layer.year,
                    loading: false,
                    value: null,
                    error: true,
                });
            }
        };

        const inspectPlumePixel = async (
            plume: PlumeObservation,
            coordinate: Coordinate,
            lon: number,
            lat: number,
        ) => {
            if (!plume.uid) return;

            requestRef.current?.abort();

            const controller = new AbortController();
            requestRef.current = controller;

            overlay.setPosition(coordinate);

            setPopup({
                kind: "plume",
                plume,
                lon,
                lat,
                value: null,
                unit: null,
                loading: true,
                error: false,
            });

            try {
                const result = await getPlumeRasterValue(
                    plume.source,
                    plume.uid,
                    lon,
                    lat,
                    controller.signal,
                );

                if (controller.signal.aborted) return;

                setPopup({
                    kind: "plume",
                    plume,
                    lon,
                    lat,
                    value: result.value,
                    unit: result.unit,
                    loading: false,
                    error: false,
                });
            } catch {
                if (controller.signal.aborted) return;

                setPopup({
                    kind: "plume",
                    plume,
                    lon,
                    lat,
                    value: null,
                    unit: null,
                    loading: false,
                    error: true,
                });
            }
        };

        let clickSequence = 0;

        const clickKey = map.on("singleclick", (event) => {
            const sequence = ++clickSequence;

            void (async () => {
                const plume = selectedPlumeRef.current;
                const raster = plumeRasterRef.current;
                const layers = groupLayersRef.current;

                const [lon, lat] = toLonLat(event.coordinate);

                // Сначала проверяем инфраструктуру.
                // Функция намеренно игнорирует трубопроводы.
                const infrastructure = await pickInfrastructureFeature(map, event.pixel);

                if (sequence !== clickSequence) return;

                if (infrastructure) {
                    requestRef.current?.abort();

                    overlay.setPosition(event.coordinate);

                    setPopup({
                        kind: "infrastructure",
                        selection: infrastructure,
                    });

                    return;
                }

                const rasterActive =
                    pointSourcesEnabledRef.current &&
                    Boolean(plume?.uid) &&
                    Boolean(raster?.getVisible()) &&
                    (raster?.getOpacity() ?? 0) > 0;

                if (rasterActive && plume && raster) {
                    const coverage = plumeCoversCoordinate(plume, lon, lat);

                    let hasRasterPixel = false;

                    try {
                        const data = raster.getData(event.pixel);

                        hasRasterPixel =
                            data !== null &&
                            !(data instanceof DataView) &&
                            data.length >= 4 &&
                            Number(data[3]) > 0;
                    } catch {
                        // При невозможности прочитать RGBA используем геометрию.
                    }

                    const hitSelectedGroupPolygon = layers
                        ? Boolean(
                              map.forEachFeatureAtPixel(
                                  event.pixel,
                                  (feature) => {
                                      const id = feature.get("id") ?? feature.getId();

                                      return (
                                          id != null && String(id) === selectedGroupIdRef.current
                                      );
                                  },
                                  {
                                      hitTolerance: 2,
                                      layerFilter: (layer) => layer === layers.polygons,
                                  },
                              ),
                          )
                        : false;

                    if (hasRasterPixel || coverage === true || hitSelectedGroupPolygon) {
                        void inspectPlumePixel(plume, event.coordinate, lon, lat);
                        return;
                    }
                }

                // Кластер либо полигон группировки.
                if (
                    layers &&
                    handlePlumeGroupClick(map, event.pixel, event.coordinate, layers, (group) => {
                        if (group.id !== selectedGroupIdRef.current) {
                            selectGroupRef.current(group);
                        }
                    })
                ) {
                    clearPopup();
                    return;
                }

                // При неизвестном охвате разрешаем серверу проверить пиксель.
                if (rasterActive && plume && plumeCoversCoordinate(plume, lon, lat) === null) {
                    void inspectPlumePixel(plume, event.coordinate, lon, lat);
                    return;
                }

                if (
                    pointSourcesEnabledRef.current &&
                    (map.getView().getZoom() ?? 0) >= S5P_HIDE_ZOOM
                ) {
                    clearPopup();
                    return;
                }

                void inspectMethanePixel(event.coordinate);
            })();
        });

        const pointerKey = map.on("pointermove", (event) => {
            if (event.dragging) return;

            const element = map.getTargetElement();
            if (!element) return;

            const layers = groupLayersRef.current;

            const hovered = map.hasFeatureAtPixel(event.pixel, {
                hitTolerance: 8,
                layerFilter: (layer) => {
                    if (!layer.getVisible()) return false;

                    const layerId = layer.get("layerId");

                    return (
                        layer === layers?.cluster ||
                        layer === layers?.polygons ||
                        layerId === "infrastructure-oil-gas" ||
                        layerId === "infrastructure-landfills"
                    );
                },
            });

            element.style.cursor = hovered ? "pointer" : "";
        });

        return () => {
            clickSequence += 1;
            requestRef.current?.abort();

            unByKey(saveViewKey);
            unByKey(clickKey);
            unByKey(pointerKey);

            map.removeOverlay(overlay);
            overlayRef.current = null;

            registerMap(null);

            groupLayersRef.current = null;
            groupsLoadedRef.current = false;
            plumeRasterRef.current = null;
            mapRef.current = null;

            map.setTarget(undefined);
        };
    }, [registerMap, getMethaneAnnualLayerState, getS5PLayerState]);

    // Скрытие S5P при увеличении масштаба, если включены точечные источники.
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const applyZoomLimit = (layer: BaseLayer) => {
            const layerId = layer.get("layerId");

            if (layerId !== "sentinel-5p" && layerId !== "methane-annual") {
                return;
            }

            const maxZoom = enabled ? S5P_HIDE_ZOOM : Infinity;

            if (layer.getMaxZoom() !== maxZoom) {
                layer.setMaxZoom(maxZoom);
            }
        };

        map.getLayers().forEach(applyZoomLimit);

        const key = map.getLayers().on("add", (event) => {
            applyZoomLimit(event.element);
        });

        return () => {
            unByKey(key);
        };
    }, [enabled]);

    useEffect(() => {
        groupLayersRef.current?.setEnabled(enabled, 100);
    }, [enabled]);

    // Группировки загружаются один раз.
    useEffect(() => {
        if (!enabled || groupsLoadedRef.current) return;

        const layers = groupLayersRef.current;
        if (!layers) return;

        const controller = new AbortController();

        void getPlumeMapGroups(controller.signal)
            .then((groups) => {
                if (controller.signal.aborted) return;

                layers.setGroups(groups);
                groupsLoadedRef.current = true;
            })
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    console.error("[PlumePoints] Failed to load cluster points:", error);
                }
            });

        return () => controller.abort();
    }, [enabled]);

    useEffect(() => {
        groupLayersRef.current?.setSelected(selectedGroup?.id ?? null);
    }, [selectedGroup?.id]);

    useEffect(() => {
        const map = mapRef.current;

        if (!map || !selectedGroup?.coordinates) return;
        if (lastGroupFocusRef.current === focusRequest) return;

        lastGroupFocusRef.current = focusRequest;

        map.getView().animate({
            center: fromLonLat(selectedGroup.coordinates),
            zoom: 12,
            duration: 400,
        });
    }, [selectedGroup, focusRequest]);

    // Растр выбранного наблюдения.
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        let layer = plumeRasterRef.current;

        if (!enabled || !selectedPlume?.uid) {
            layer?.setVisible(false);
            return;
        }

        if (!layer) {
            layer = createPlumeRasterLayer(selectedPlume);
            if (!layer) return;

            plumeRasterRef.current = layer;
            map.addLayer(layer);
        } else if (layer.get("plumeKey") !== selectedPlume.key) {
            const source = createPlumeRasterSource(selectedPlume);
            if (!source) return;

            layer.setSource(source);
            layer.set("plumeKey", selectedPlume.key);
        }

        layer.setZIndex(1000);
        layer.setOpacity(Math.max(0, Math.min(1, opacity / 100)));
        layer.setVisible(true);
    }, [enabled, opacity, selectedPlume]);

    // Слайдер прозрачности обновляет растр без рендеринга React.
    useEffect(() => {
        return registerPlumeOpacityPreview((value) => {
            const layer = plumeRasterRef.current;

            if (layer?.getVisible()) {
                layer.setOpacity(value / 100);
            }
        });
    }, []);

    useEffect(() => {
        const map = mapRef.current;

        if (!map || !enabled || !selectedPlume) return;

        const focused = focusMapOnPlume(map, selectedPlume);

        if (!focused && selectedGroup?.coordinates) {
            focusMapOnPoint(map, selectedGroup.coordinates);
        }
    }, [enabled, selectedPlume, selectedGroup?.coordinates]);

    useEffect(() => {
        requestRef.current?.abort();
        overlayRef.current?.setPosition(undefined);
    }, [selectedPlume?.key]);

    const closePopup = () => {
        requestRef.current?.abort();
        overlayRef.current?.setPosition(undefined);
        setPopup(null);
    };

    const visiblePopup =
        popup?.kind === "plume" && (!enabled || popup.plume.key !== selectedPlume?.key)
            ? null
            : popup;

    return (
        <Box position="relative" width="100%" height="100%">
            <Box ref={mapElementRef} width="100%" height="100%" />

            <Box ref={popupElementRef} display={visiblePopup ? "block" : "none"}>
                {visiblePopup?.kind === "methane" && (
                    <S5PPixelPopup
                        date={visiblePopup.date}
                        year={visiblePopup.year}
                        loading={visiblePopup.loading}
                        value={visiblePopup.value}
                        error={visiblePopup.error}
                        onClose={closePopup}
                    />
                )}

                {visiblePopup?.kind === "plume" && (
                    <PlumePixelPopup
                        plume={visiblePopup.plume}
                        lon={visiblePopup.lon}
                        lat={visiblePopup.lat}
                        value={visiblePopup.value}
                        unit={visiblePopup.unit}
                        loading={visiblePopup.loading}
                        error={visiblePopup.error}
                        onClose={closePopup}
                    />
                )}

                {visiblePopup?.kind === "infrastructure" && (
                    <InfrastructurePopup selection={visiblePopup.selection} onClose={closePopup} />
                )}
            </Box>
        </Box>
    );
}
