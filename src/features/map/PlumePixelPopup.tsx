import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { AppPopup } from "../../components/ui/AppPopup";
import { ui } from "../../theme/tokens";
import { getSatelliteName } from "../point-sources/plumeDisplay";
import type { PlumeObservation } from "../point-sources/types";

interface PlumePixelPopupProps {
    plume: PlumeObservation;
    lon: number;
    lat: number;
    value: number | null;
    unit: string | null;
    loading: boolean;
    error: boolean;
    onClose: () => void;
}

export function PlumePixelPopup({
    plume,
    lon,
    lat,
    value,
    unit,
    loading,
    error,
    onClose,
}: PlumePixelPopupProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage?.startsWith("en") ? "en-US" : "ru-RU";

    // Для Tanager единица известна из настроенной шкалы.
    // Для Orbio и EMIT единицу показываем только при наличии её в API.
    const displayUnit = plume.source === "tanager" ? "ppm·m" : unit;

    return (
        <AppPopup
            width="226px"
            title={t("map.plumePixel.title")}
            subtitle={`${getSatelliteName(plume)}${
                plume.observedAt ? ` · ${plume.observedAt.slice(0, 10)}` : ""
            }`}
            onClose={onClose}
        >
            {loading ? (
                <Flex align="center" gap="7px">
                    <Spinner size="xs" />
                    <Text fontSize="11px" color={ui.colors.textMuted}>
                        {t("map.pixel.loading")}
                    </Text>
                </Flex>
            ) : error ? (
                <Text fontSize="11px" color="red.400">
                    {t("map.pixel.loadError")}
                </Text>
            ) : value === null ? (
                <Text fontSize="11px" color={ui.colors.textMuted}>
                    {t("map.pixel.noData")}
                </Text>
            ) : (
                <Flex align="baseline" gap="5px" wrap="wrap">
                    <Text fontSize="18px" fontWeight="700">
                        {new Intl.NumberFormat(locale, {
                            maximumFractionDigits: 3,
                        }).format(value)}
                    </Text>

                    {displayUnit && (
                        <Text fontSize="11px" color={ui.colors.textMuted}>
                            {displayUnit}
                        </Text>
                    )}
                </Flex>
            )}

            <Box mt="9px" pt="7px" borderTop="1px solid" borderColor={ui.colors.controlBorder}>
                <Text fontSize="9px" color={ui.colors.textMuted}>
                    {t("map.plumePixel.coordinates")}
                </Text>

                <Text mt="2px" fontSize="10px" fontVariantNumeric="tabular-nums">
                    {lat.toFixed(5)}, {lon.toFixed(5)}
                </Text>
            </Box>
        </AppPopup>
    );
}
