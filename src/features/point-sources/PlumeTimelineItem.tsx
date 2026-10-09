import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import { Check, MapPin, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";
import {
    formatCompact,
    getEmissionRate,
    getEmissionUncertainty,
    getSatelliteName,
} from "./plumeDisplay";
import type { PlumeObservation } from "./types";

interface PlumeTimelineItemProps {
    observation: PlumeObservation;
    selected: boolean;
    onClick: () => void;
}

function getDateParts(value: string | null, locale: string) {
    const empty = { dayMonth: "—", year: "—", time: "—", zone: "" };
    if (!value) return empty;

    let normalized = value.trim();
    let isUtc = false;

    if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized)) {
        const parsed = new Date(normalized.replace(" ", "T"));

        if (!Number.isNaN(parsed.getTime())) {
            normalized = parsed.toISOString();
            isUtc = true;
        }
    }

    const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);

    if (!match) return empty;

    const [, year, month, day, hours, minutes, seconds] = match;
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

    if (Number.isNaN(date.getTime())) return empty;

    const monthLabel = new Intl.DateTimeFormat(locale, {
        month: "short",
        timeZone: "UTC",
    })
        .format(date)
        .replace(".", "")
        .toUpperCase();

    return {
        dayMonth: `${day} ${monthLabel}`,
        year,
        time: hours && minutes ? `${hours}:${minutes}${seconds ? `:${seconds}` : ""}` : "—",
        zone: hours && isUtc ? "UTC" : "",
    };
}

export function PlumeTimelineItem({ observation, selected, onClick }: PlumeTimelineItemProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage?.startsWith("en") ? "en-US" : "ru-RU";

    const date = getDateParts(observation.observedAt, locale);

    const orbioMidnightPlaceholder =
        observation.source === "orbio" &&
        /[T ]00:00(?::00)?(?:\.0+)?(?:Z|[+-]00:?00)?$/i.test(observation.observedAt?.trim() ?? "");

    const displayTime = orbioMidnightPlaceholder ? "—" : date.time;
    const displayZone = orbioMidnightPlaceholder ? "" : date.zone;

    const sourceName = getSatelliteName(observation);
    const rate = getEmissionRate(observation);
    const uncertainty = getEmissionUncertainty(observation);

    const uncertaintyText = uncertainty
        ? uncertainty.low === uncertainty.high
            ? `±${formatCompact(uncertainty.low, locale)}`
            : `−${formatCompact(uncertainty.low, locale)}/+${formatCompact(uncertainty.high, locale)}`
        : null;

    return (
        <Box
            width="100%"
            border="1px solid"
            borderColor={selected ? ui.colors.borderActive : ui.colors.borderLight}
            borderRadius={ui.radius.md}
            bg={selected ? ui.colors.panelDark : ui.colors.panel}
            overflow="hidden"
        >
            <Button
                type="button"
                variant="plain"
                width="100%"
                height="auto"
                minHeight="54px"
                px="8px"
                py="8px"
                bg="transparent"
                color={ui.colors.text}
                borderRadius="0"
                textAlign="left"
                aria-pressed={selected}
                onClick={onClick}
                _hover={{ bg: ui.colors.buttonHover }}
                _active={{ bg: "transparent" }}
                _pressed={{ bg: "transparent", color: ui.colors.text }}
                _focusVisible={{
                    outline: "2px solid",
                    outlineColor: ui.colors.borderActive,
                    outlineOffset: "-2px",
                }}
            >
                <Grid
                    width="100%"
                    templateColumns="62px 65px minmax(0, 1fr) 14px"
                    alignItems="center"
                    gap="6px"
                >
                    <Box
                        minWidth="0"
                        pr="5px"
                        borderRight="1px solid"
                        borderColor={ui.colors.borderLight}
                    >
                        <Text fontSize="11px" fontWeight="700" whiteSpace="nowrap">
                            {date.dayMonth}
                        </Text>
                        <Text fontSize="10px" color={ui.colors.textMuted}>
                            {date.year}
                        </Text>
                    </Box>

                    <Box
                        minWidth="0"
                        pr="5px"
                        borderRight="1px solid"
                        borderColor={ui.colors.borderLight}
                    >
                        <Text fontSize="10px" fontWeight="600" whiteSpace="nowrap">
                            {displayTime}
                        </Text>
                        <Text fontSize="10px" color={ui.colors.textMuted}>
                            {displayZone || " "}
                        </Text>
                    </Box>

                    <Box minWidth="0">
                        {rate !== null ? (
                            <>
                                <Flex align="baseline" gap="4px">
                                    <Text
                                        fontSize="12px"
                                        fontWeight="600"
                                        whiteSpace="nowrap"
                                        lineHeight="1.2"
                                    >
                                        {formatCompact(rate, locale)}
                                    </Text>
                                    <Text
                                        fontSize="9px"
                                        color={ui.colors.textMuted}
                                        whiteSpace="nowrap"
                                    >
                                        {t("pointSources.units.kgPerHour")}
                                    </Text>
                                </Flex>

                                {uncertaintyText && (
                                    <Text
                                        mt="2px"
                                        fontSize="9px"
                                        lineHeight="1.2"
                                        color={ui.colors.textMuted}
                                    >
                                        {uncertaintyText}
                                    </Text>
                                )}
                            </>
                        ) : observation.properties.hide_emission === true ? (
                            <Text fontSize="10px" fontWeight="600" lineHeight="1.3">
                                {t("pointSources.timeline.emissionHidden")}
                            </Text>
                        ) : (
                            <Flex gap="4px" align="center">
                                <TriangleAlert size={11} />
                                <Text fontSize="10px" fontWeight="600" lineHeight="1.3">
                                    {t("pointSources.timeline.notQuantified")}
                                </Text>
                            </Flex>
                        )}

                        <Text
                            mt="3px"
                            fontSize="10px"
                            fontWeight="600"
                            lineHeight="1.2"
                            color={ui.colors.text}
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            title={sourceName}
                        >
                            {sourceName}
                        </Text>
                    </Box>

                    {selected ? <Check size={14} /> : <MapPin size={13} />}
                </Grid>
            </Button>
        </Box>
    );
}
