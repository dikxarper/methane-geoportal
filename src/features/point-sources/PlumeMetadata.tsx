import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ui } from "../../theme/tokens";
import type { PlumeObservation, PlumeSource } from "./types";

interface PlumeMetadataProps {
    observation: PlumeObservation;
}

type MetadataUnit = "kgPerHour" | "meters" | "metersPerSecond";

interface MetadataField {
    key: string;
    unit?: MetadataUnit;
}

const METADATA_FIELDS: Record<PlumeSource, MetadataField[]> = {
    emit: [
        { key: "plume_id" },
        { key: "observed_at" },
        { key: "dcid" },
        { key: "orbit" },
        { key: "scene_fids" },
        { key: "max_plume_concentration" },
        { key: "concentration_uncertainty" },
        { key: "max_concentration_lat" },
        { key: "max_concentration_lon" },
    ],
    tanager: [
        { key: "plume_id" },
        { key: "scene_id" },
        { key: "source_id" },
        { key: "scene_timestamp" },
        { key: "instrument" },
        { key: "platform" },
        { key: "gas" },
        { key: "status" },
        { key: "gsd" },
        { key: "off_nadir" },
        { key: "emission_auto", unit: "kgPerHour" },
        { key: "emission_uncertainty_auto" },
        { key: "wind_speed_avg_auto", unit: "metersPerSecond" },
        { key: "wind_direction_avg_auto" },
    ],
    orbio: [
        { key: "date" },
        { key: "satellite" },
        { key: "model" },
        { key: "tile_name" },
        { key: "mgrs" },
        { key: "likelihood" },
        { key: "q_kg_hr", unit: "kgPerHour" },
        { key: "q_low_kg_hr", unit: "kgPerHour" },
        { key: "q_high_kg_hr", unit: "kgPerHour" },
        { key: "plume_length_m", unit: "meters" },
        { key: "wind_speed_m_s", unit: "metersPerSecond" },
        { key: "plume_index" },
    ],
};

function formatValue(value: unknown, locale: string, yes: string, no: string): string {
    if (typeof value === "boolean") return value ? yes : no;

    if (typeof value === "number") {
        return new Intl.NumberFormat(locale, {
            maximumFractionDigits: 3,
        }).format(value);
    }

    return String(value);
}

export function PlumeMetadata({ observation }: PlumeMetadataProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage?.startsWith("en") ? "en-US" : "ru-RU";
    const { properties, source } = observation;

    const fields = METADATA_FIELDS[source].filter((field) => {
        const value = properties[field.key];

        if (value === null || value === undefined || value === "") return false;

        if (
            source === "tanager" &&
            properties.hide_emission === true &&
            (field.key === "emission_auto" || field.key === "emission_uncertainty_auto")
        ) {
            return false;
        }

        return typeof value !== "object";
    });

    const rows = [
        { key: "id", label: "ID", value: observation.id, unit: undefined as string | undefined },
        ...(observation.uid
            ? [{ key: "uid", label: "UID", value: observation.uid, unit: undefined }]
            : []),
        ...fields.map((field) => ({
            key: field.key,
            label: t(`pointSources.metadata.${field.key}`),
            value: properties[field.key],
            unit: field.unit,
        })),
    ];

    return (
        <Box mt="8px" pt="8px" borderTop="1px solid" borderColor={ui.colors.borderLight}>
            <Flex direction="column" gap="7px">
                {rows.map((row) => (
                    <Flex key={row.key} align="flex-start" justify="space-between" gap="10px">
                        <Text
                            flexShrink={0}
                            width="42%"
                            fontSize="10px"
                            lineHeight="1.4"
                            color={ui.colors.textMuted}
                        >
                            {row.label}
                        </Text>

                        <Text
                            flex="1"
                            minWidth="0"
                            fontSize="10px"
                            lineHeight="1.4"
                            textAlign="right"
                            overflowWrap="anywhere"
                            color={ui.colors.text}
                        >
                            {formatValue(
                                row.value,
                                locale,
                                t("pointSources.details.yes"),
                                t("pointSources.details.no"),
                            )}
                            {row.unit ? ` ${t(`pointSources.units.${row.unit}`)}` : ""}
                        </Text>
                    </Flex>
                ))}
            </Flex>
        </Box>
    );
}
