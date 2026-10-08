import { useEffect, useRef, useState } from "react";

import { Box } from "@chakra-ui/react";

import type { Coordinate } from "ol/coordinate";
import Map from "ol/Map";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";
import View from "ol/View";

import { defaults as defaultControls } from "ol/control";
import { getCenter } from "ol/extent";
import { toLonLat, transformExtent } from "ol/proj";

import { getS5PPixelValue } from "../../api/s5p";
import { getMethaneAnnualPixelValue } from "../../api/methaneAnnual";

import { createBaseLayers } from "./baseLayers";
import { mapConfig } from "./config";
import { S5PPixelPopup } from "./S5PPixelPopup";
import { useMapController } from "./useMapController";

interface PixelPopupState {
    date: string | null;
    year: number | null;
    loading: boolean;
    value: number | null;
    error: boolean;
}

export function MapView() {
    const mapElementRef = useRef<HTMLDivElement | null>(null);
    const popupElementRef = useRef<HTMLDivElement | null>(null);
    const overlayRef = useRef<Overlay | null>(null);
    const requestRef = useRef<AbortController | null>(null);

    const { registerMap, getMethaneAnnualLayerState, getS5PLayerState } = useMapController();

    const [popup, setPopup] = useState<PixelPopupState | null>(null);

    useEffect(() => {
        if (!mapElementRef.current || !popupElementRef.current) {
            return;
        }

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

        const size = map.getSize();

        if (size) {
            const homeResolution = view.getResolutionForExtent(homeExtent, size);
            const homeZoom = view.getZoomForResolution(homeResolution);

            if (homeZoom !== undefined) {
                view.setMinZoom(homeZoom);
                view.setZoom(homeZoom);
            }
        }

        const overlay = new Overlay({
            element: popupElementRef.current,
            positioning: "bottom-center",
            offset: [0, -12],
            stopEvent: true,
        });

        overlayRef.current = overlay;

        map.addOverlay(overlay);
        registerMap(map);

        const inspectPixel = async (coordinate: Coordinate) => {
            const s5pLayer = getS5PLayerState();
            const annualLayer = getMethaneAnnualLayerState();
            const layer =
                s5pLayer.visible && s5pLayer.uid
                    ? { uid: s5pLayer.uid, date: s5pLayer.date, year: null, getValue: getS5PPixelValue }
                    : annualLayer.visible && annualLayer.uid
                      ? {
                            uid: annualLayer.uid,
                            date: null,
                            year: annualLayer.year,
                            getValue: getMethaneAnnualPixelValue,
                        }
                      : null;

            if (!layer) {
                requestRef.current?.abort();
                overlay.setPosition(undefined);
                setPopup(null);

                return;
            }

            requestRef.current?.abort();

            const controller = new AbortController();

            requestRef.current = controller;

            const [lon, lat] = toLonLat(coordinate);

            overlay.setPosition(coordinate);

            setPopup({
                date: layer.date,
                year: layer.year,
                loading: true,
                value: null,
                error: false,
            });

            try {
                const result = await layer.getValue(layer.uid, lon, lat, controller.signal);

                if (controller.signal.aborted) {
                    return;
                }

                setPopup({
                    date: layer.date,
                    year: layer.year,
                    loading: false,
                    value: result.value,
                    error: false,
                });
            } catch {
                if (controller.signal.aborted) {
                    return;
                }

                setPopup({
                    date: layer.date,
                    year: layer.year,
                    loading: false,
                    value: null,
                    error: true,
                });
            }
        };

        const clickKey = map.on("singleclick", (event) => {
            void inspectPixel(event.coordinate);
        });

        return () => {
            requestRef.current?.abort();

            unByKey(clickKey);

            map.removeOverlay(overlay);
            overlayRef.current = null;

            registerMap(null);

            map.setTarget(undefined);
        };
    }, [registerMap, getMethaneAnnualLayerState, getS5PLayerState]);

    const closePopup = () => {
        requestRef.current?.abort();

        overlayRef.current?.setPosition(undefined);

        setPopup(null);
    };

    return (
        <Box position="relative" width="100%" height="100%">
            <Box ref={mapElementRef} width="100%" height="100%" />

            <Box ref={popupElementRef} display={popup ? "block" : "none"}>
                {popup && (
                    <S5PPixelPopup
                        date={popup.date}
                        year={popup.year}
                        loading={popup.loading}
                        value={popup.value}
                        error={popup.error}
                        onClose={closePopup}
                    />
                )}
            </Box>
        </Box>
    );
}
