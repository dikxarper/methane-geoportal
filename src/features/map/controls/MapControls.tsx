import { useEffect, useRef, useState } from "react";

import { Box, Flex } from "@chakra-ui/react";

import { Focus, Layers3, Minus, Plus } from "lucide-react";

import { useTranslation } from "react-i18next";

import { MapControlButton } from "../../../components/ui/MapControlButton";

import { useMapController } from "../useMapController";

import { BaseMapMenu } from "./BaseMapMenu";

export function MapControls() {
    const { t } = useTranslation();

    const { zoomIn, zoomOut, resetView, baseMap, setBaseMap } = useMapController();

    const [baseMapMenuOpen, setBaseMapMenuOpen] = useState(false);

    const baseMapControlRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!baseMapMenuOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            const target = event.target as Node;

            if (baseMapControlRef.current?.contains(target)) {
                return;
            }

            setBaseMapMenuOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [baseMapMenuOpen]);

    const handleBaseMapChange = (id: Parameters<typeof setBaseMap>[0]) => {
        setBaseMap(id);

        setBaseMapMenuOpen(false);
    };

    return (
        <Flex direction="column" gap="5px" align="flex-end">
            <MapControlButton
                label={t("map.controls.zoomIn")}
                tooltip={t("map.controls.zoomIn")}
                onClick={zoomIn}
            >
                <Plus size={14} />
            </MapControlButton>

            <MapControlButton
                label={t("map.controls.zoomOut")}
                tooltip={t("map.controls.zoomOut")}
                onClick={zoomOut}
            >
                <Minus size={14} />
            </MapControlButton>

            <MapControlButton
                label={t("map.controls.reset")}
                tooltip={t("map.controls.reset")}
                onClick={resetView}
            >
                <Focus size={14} />
            </MapControlButton>

            <Box ref={baseMapControlRef} position="relative">
                <MapControlButton
                    label={t("map.controls.layers")}
                    tooltip={t("map.controls.layers")}
                    aria-expanded={baseMapMenuOpen}
                    onClick={() => {
                        setBaseMapMenuOpen((current) => !current);
                    }}
                >
                    <Layers3 size={14} />
                </MapControlButton>

                {baseMapMenuOpen && <BaseMapMenu value={baseMap} onChange={handleBaseMapChange} />}
            </Box>
        </Flex>
    );
}
