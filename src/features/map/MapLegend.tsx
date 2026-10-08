import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";

import { useMapController } from "./useMapController";

const LEGENDS = {
    daily: [
        { value: 1800, color: "#000000" },
        { value: 1826, color: "#00204d" },
        { value: 1851, color: "#00a2ff" },
        { value: 1877, color: "#00ffcc" },
        { value: 1903, color: "#7cff00" },
        { value: 1929, color: "#ffff00" },
        { value: 1954, color: "#ff8000" },
        { value: 1980, color: "#ff0000" },
    ],
    annual: [
        { value: 1680, color: "#000000" },
        { value: 1755, color: "#007FFF" },
        { value: 1830, color: "#00FFFF" },
        { value: 1905, color: "#FFFF00" },
        { value: 1980, color: "#FF0000" },
    ],
} as const;

export function MapLegend() {
    const { t } = useTranslation();
    const { activeLegendStyle, activeMethaneLayer } = useMapController();

    if (!activeMethaneLayer) {
        return null;
    }

    const stops = LEGENDS[activeMethaneLayer];
    const title =
        activeMethaneLayer === "daily"
            ? t("areaFlux.sentinel5p.title")
            : t("areaFlux.annualMethane.title");

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
            <Text mb="7px" fontSize="11px" fontWeight="600">
                {title}
            </Text>

            <Text mb="4px" fontSize="10px" color={ui.colors.textMuted}>
                CH₄, ppbv
            </Text>

            {activeLegendStyle === "blocks" ? (
                <Flex height="10px" overflow="hidden" borderRadius="3px">
                    {stops.map((stop) => (
                        <Box key={`${stop.value}-${stop.color}`} flex="1" bg={stop.color} />
                    ))}
                </Flex>
            ) : (
                <Box
                    height="10px"
                    borderRadius="3px"
                    bg={`linear-gradient(to right, ${stops
                        .map((stop, index) => {
                            const offset = (index / (stops.length - 1)) * 100;

                            return `${stop.color} ${offset}%`;
                        })
                        .join(", ")})`}
                />
            )}

            <Flex mt="4px" justify="space-between" gap="2px">
                {stops.map((stop) => (
                    <Text key={stop.value} fontSize="9px" color={ui.colors.textMuted}>
                        {stop.value}
                    </Text>
                ))}
            </Flex>
        </Box>
    );
}
