import { Box, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";
import { getSatelliteName } from "./plumeDisplay";
import { PlumeMetadata } from "./PlumeMetadata";
import type { PlumeObservation } from "./types";

interface PlumeDetailsViewProps {
    observation: PlumeObservation | null;
}

export function PlumeDetailsView({ observation }: PlumeDetailsViewProps) {
    const { t } = useTranslation();

    if (!observation) {
        return (
            <Text fontSize="11px" color={ui.colors.textMuted} py="12px">
                {t("pointSources.details.selectPlume")}
            </Text>
        );
    }

    return (
        <Box
            border="1px solid"
            borderColor={ui.colors.borderLight}
            borderRadius={ui.radius.md}
            bg={ui.colors.panel}
            p="10px"
        >
            <Text fontSize="12px" fontWeight="700">
                {getSatelliteName(observation)}
            </Text>

            {observation.observedAt && (
                <Text mt="3px" fontSize="10px" color={ui.colors.textMuted}>
                    {observation.observedAt.replace("T", " ").replace(/Z$/, " UTC")}
                </Text>
            )}

            <PlumeMetadata observation={observation} />
        </Box>
    );
}
