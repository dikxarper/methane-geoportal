import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";
import { getSatelliteName } from "../point-sources/plumeDisplay";
import type { PlumeObservation } from "../point-sources/types";
import { getPlumeLegend } from "./plumeLegendConfig";

interface PlumeLegendProps {
    plume: PlumeObservation;
}

export function PlumeLegend({ plume }: PlumeLegendProps) {
    const { t } = useTranslation();
    const legend = getPlumeLegend(plume);

    const gradient = legend
        ? `linear-gradient(to right, ${legend.colors
              .map((color, index) => `${color} ${(index / (legend.colors.length - 1)) * 100}%`)
              .join(", ")})`
        : undefined;

    return (
        <Box
            width="260px"
            p="10px"
            bg={ui.colors.control}
            color={ui.colors.controlText}
            border="1px solid"
            borderColor={ui.colors.controlBorder}
            borderRadius={ui.radius.md}
            boxShadow="0 2px 8px rgba(0, 0, 0, 0.2)"
        >
            <Text fontSize="11px" fontWeight="600">
                {t("map.plumeLegend.title")}
            </Text>

            <Text mt="3px" mb="9px" fontSize="10px" color={ui.colors.textMuted}>
                {getSatelliteName(plume)}
                {legend?.gas ? ` · ${legend.gas}` : ""}
                {plume.observedAt ? ` · ${plume.observedAt.slice(0, 10)}` : ""}
            </Text>

            {legend ? (
                <>
                    <Box width="100%" height="12px" bg={gradient} borderRadius="3px" />

                    {legend.min !== null && legend.max !== null ? (
                        <>
                            <Flex mt="6px" justify="space-between">
                                <Text fontSize="10px" color={ui.colors.textMuted}>
                                    {legend.min.toLocaleString()}
                                </Text>

                                <Text fontSize="10px" color={ui.colors.textMuted}>
                                    {legend.maxLabel ?? legend.max.toLocaleString()}
                                </Text>
                            </Flex>

                            {legend.units && (
                                <Text mt="4px" fontSize="10px" color={ui.colors.textMuted}>
                                    {legend.units}
                                </Text>
                            )}
                        </>
                    ) : (
                        <Text mt="6px" fontSize="10px" color={ui.colors.textMuted}>
                            {t("map.plumeLegend.paletteOnly")}
                        </Text>
                    )}
                </>
            ) : (
                <Text fontSize="10px" color={ui.colors.textMuted}>
                    {t("map.plumeLegend.unavailable")}
                </Text>
            )}
        </Box>
    );
}
