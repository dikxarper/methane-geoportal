import { useMemo, useState } from "react";
import { Box, Button, Flex, Text, Portal, Tooltip } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";
import type { PlumeObservation } from "./types";

import { buildPlumeTrend, type TrendMode, type TrendPoint } from "./plumeTrendData";
import { formatTrendValue, type TrendScaleMode } from "./plumeTrendScale";
import { PlumeTrendPlot } from "./PlumeTrendPlot";

interface PlumeTrendChartProps {
    items: PlumeObservation[];
    selectedSatellites?: string[];
    onSelectMonth: (dateFrom: string, dateTo: string) => void;
    onSelectObservation: (observation: PlumeObservation) => void;
}

const EMPTY_SATELLITES: string[] = [];
const DAYS_PER_PAGE = 24;

export function PlumeTrendChart({
    items,
    selectedSatellites = EMPTY_SATELLITES,
    onSelectMonth,
    onSelectObservation,
}: PlumeTrendChartProps) {
    const { t, i18n } = useTranslation();

    const locale = i18n.resolvedLanguage?.startsWith("en") ? "en-US" : "ru-RU";

    const [mode, setMode] = useState<TrendMode>("period");
    const [scale, setScale] = useState<TrendScaleMode>("linear");
    const [daysBack, setDaysBack] = useState(0);

    const trend = useMemo(
        () => buildPlumeTrend(items, selectedSatellites, mode, locale),
        [items, selectedSatellites, mode, locale],
    );

    const length = trend.points.length;
    const maxBack = Math.max(0, length - DAYS_PER_PAGE);
    const offset = Math.min(daysBack, maxBack);

    const start = mode === "days" ? Math.max(0, length - DAYS_PER_PAGE - offset) : 0;

    const end = mode === "days" ? Math.min(length, start + DAYS_PER_PAGE) : length;

    const visiblePoints = useMemo(() => trend.points.slice(start, end), [trend.points, start, end]);

    const activate = (point: TrendPoint) => {
        if (point.count === 1 && point.observation) {
            onSelectObservation(point.observation);
        } else {
            onSelectMonth(point.from, point.to);
        }
    };

    const unit = t("pointSources.units.kgPerHour");

    const periodLabel =
        trend.period === "quarter"
            ? t("pointSources.chart.periodQuarter")
            : t("pointSources.chart.periodMonth");

    return (
        <Box
            px="10px"
            pt="8px"
            pb="9px"
            border="1px solid"
            borderColor={ui.colors.border}
            borderRadius={ui.radius.md}
            bg={ui.colors.panel}
        >
            <Flex align="center" justify="space-between" gap="8px">
                <Text fontSize="10px" color={ui.colors.textMuted}>
                    {t("pointSources.chart.subtitle")}
                </Text>

                <Flex gap="4px" flexShrink={0}>
                    {(["period", "days"] as const).map((value) => (
                        <Button
                            key={value}
                            type="button"
                            size="xs"
                            variant="plain"
                            height="25px"
                            px="7px"
                            fontSize="10px"
                            fontWeight={mode === value ? "600" : "400"}
                            color={ui.colors.text}
                            border="1px solid"
                            borderColor={
                                mode === value ? ui.colors.borderActive : ui.colors.borderLight
                            }
                            bg={mode === value ? ui.colors.controlActive : ui.colors.panelDark}
                            _hover={{ bg: ui.colors.buttonHover }}
                            onClick={() => setMode(value)}
                        >
                            {t(`pointSources.chart.${value}Mode`)}
                        </Button>
                    ))}
                </Flex>
            </Flex>

            <Flex mt="11px" gap="10px" align="flex-start">
                <Box flex="1.3" minW="0">
                    <Flex align="baseline" gap="4px">
                        <Text fontSize="20px" lineHeight="1" fontWeight="700" whiteSpace="nowrap">
                            {trend.stats.average === null
                                ? "—"
                                : formatTrendValue(trend.stats.average, locale)}
                        </Text>

                        <Text fontSize="10px" color={ui.colors.textMuted} whiteSpace="nowrap">
                            {unit}
                        </Text>
                    </Flex>

                    <Text mt="5px" lineHeight="1.2" fontSize="10px" color={ui.colors.textMuted}>
                        {t("pointSources.chart.averageEmission")}
                    </Text>
                </Box>

                <Box flex="1" minW="0">
                    <Text fontSize="20px" lineHeight="1" fontWeight="700">
                        {trend.stats.quantifiedCount}
                    </Text>

                    <Text mt="5px" lineHeight="1.2" fontSize="10px" color={ui.colors.textMuted}>
                        {t("pointSources.chart.quantifiedPlumes")}
                    </Text>
                </Box>

                <Box flex="1" minW="0">
                    <Text fontSize="20px" lineHeight="1" fontWeight="700">
                        {trend.stats.observedDays}
                    </Text>

                    <Text mt="5px" lineHeight="1.2" fontSize="10px" color={ui.colors.textMuted}>
                        {t("pointSources.chart.observedDays")}
                    </Text>
                </Box>
            </Flex>

            <Flex mt="10px" align="center" justify="space-between" gap="8px">
                <Text fontSize="10px" color={ui.colors.textMuted}>
                    {mode === "period" ? periodLabel : t("pointSources.chart.daysMode")}
                </Text>

                <Flex align="center" gap="4px">
                    {(["linear", "log"] as const).map((value) => {
                        const active = scale === value;

                        return (
                            <Tooltip.Root
                                key={value}
                                openDelay={300}
                                positioning={{ placement: "top" }}
                            >
                                <Tooltip.Trigger asChild>
                                    <Button
                                        type="button"
                                        variant="plain"
                                        size="xs"
                                        height="25px"
                                        px="7px"
                                        fontSize="10px"
                                        fontWeight={active ? "600" : "400"}
                                        color={ui.colors.text}
                                        border="1px solid"
                                        borderColor={
                                            active ? ui.colors.borderActive : ui.colors.borderLight
                                        }
                                        bg={active ? ui.colors.controlActive : ui.colors.panelDark}
                                        _hover={{ bg: ui.colors.buttonHover }}
                                        onClick={() => setScale(value)}
                                    >
                                        {t(
                                            `pointSources.chart.scale${
                                                value === "log" ? "Log" : "Linear"
                                            }`,
                                        )}
                                    </Button>
                                </Tooltip.Trigger>

                                <Portal>
                                    <Tooltip.Positioner>
                                        <Tooltip.Content>
                                            {t(
                                                value === "linear"
                                                    ? "pointSources.chart.scaleLinearHint"
                                                    : "pointSources.chart.scaleLogHint",
                                            )}
                                        </Tooltip.Content>
                                    </Tooltip.Positioner>
                                </Portal>
                            </Tooltip.Root>
                        );
                    })}
                </Flex>
            </Flex>

            <PlumeTrendPlot
                key={`${mode}:${start}:${end}`}
                points={visiblePoints}
                mode={mode}
                period={trend.period}
                scale={scale}
                locale={locale}
                onSelect={activate}
            />

            {mode === "days" && length > 0 && (
                <>
                    {length > DAYS_PER_PAGE && (
                        <Flex align="center" justify="space-between" mt="3px">
                            <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                disabled={start === 0}
                                onClick={() =>
                                    setDaysBack((current) =>
                                        Math.min(current + DAYS_PER_PAGE, maxBack),
                                    )
                                }
                            >
                                <ChevronLeft size={13} />
                                {t("pointSources.chart.earlier")}
                            </Button>

                            <Text fontSize="10px" color={ui.colors.textMuted}>
                                {start + 1}–{end} / {length}
                            </Text>

                            <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                disabled={end === length}
                                onClick={() =>
                                    setDaysBack((current) => Math.max(0, current - DAYS_PER_PAGE))
                                }
                            >
                                {t("pointSources.chart.later")}
                                <ChevronRight size={13} />
                            </Button>
                        </Flex>
                    )}

                    <Text mt="4px" fontSize="9px" color={ui.colors.textMuted}>
                        {t("pointSources.chart.discreteAxisHint")}
                    </Text>
                </>
            )}
        </Box>
    );
}
