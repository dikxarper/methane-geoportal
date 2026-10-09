import { useEffect, useRef, useState } from "react";
import { Box, Button, Flex, IconButton, NativeSelect, Text, Collapsible } from "@chakra-ui/react";
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getPlumeObservations } from "../../api/plumeObservations";
import { ui } from "../../theme/tokens";
import type { PlumeObservationsResult, PlumeSource, PlumeObservation } from "./types";

import { PlumeTimeline } from "./PlumeTimeline";
import { PlumeTimelineFilters } from "./PlumeTimelineFilters";
import { PlumeDetailsView } from "./PlumeDetailsView";
import { PlumeTrendChart } from "./PlumeTrendChart";
import { getObservationDate } from "./plumeDisplay";
import { usePlumeFilters, type PlumeSort } from "./usePlumeFilters";
import { usePointSources } from "./usePointSources";

type PanelTab = "timeline" | "details";

interface LoadState {
    key: string;
    result: PlumeObservationsResult | null;
    error: boolean;
}

interface GroupContentProps {
    items: PlumeObservation[];
    selectedPlume: PlumeObservation | null;
    onSelect: (plume: PlumeObservation) => void;
}

const observationCache = new Map<string, PlumeObservationsResult>();

const SORT_OPTIONS: PlumeSort[] = ["newest", "oldest", "emissionDesc", "emissionAsc"];

function GroupContent({ items, selectedPlume, onSelect }: GroupContentProps) {
    const { t } = useTranslation();

    const [tab, setTab] = useState<PanelTab>("timeline");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [chartExpanded, setChartExpanded] = useState(true);

    const filters = usePlumeFilters(items);
    const scrollRootRef = useRef<HTMLDivElement | null>(null);

    const timelineKey = [
        filters.sort,
        filters.satellites.join(","),
        filters.dateMode,
        filters.singleDate,
        filters.dateFrom,
        filters.dateTo,
    ].join("|");

    useEffect(() => {
        if (scrollRootRef.current) {
            scrollRootRef.current.scrollTop = 0;
        }
    }, [timelineKey]);

    const handleSelectMonth = (from: string, to: string) => {
        filters.setDateMode("range");
        filters.setSingleDate("");
        filters.setDateFrom(from);
        filters.setDateTo(to);

        setFiltersOpen(false);
        setTab("timeline");
    };

    const handleSelectObservation = (observation: PlumeObservation) => {
        const date = getObservationDate(observation);

        if (date) {
            filters.setDateMode("single");
            filters.setDateFrom("");
            filters.setDateTo("");
            filters.setSingleDate(date);
        }

        setFiltersOpen(false);
        setTab("timeline");

        if (selectedPlume?.key !== observation.key) {
            onSelect(observation);
        }
    };

    return (
        <Flex flex="1" minHeight="0" direction="column">
            {/* График и статистика */}
            <Box px="10px" pt="7px" flexShrink={0}>
                <Flex align="center" justify="space-between" mb="2px">
                    <Text fontSize="11px" fontWeight="700" color={ui.colors.text}>
                        {t("pointSources.chart.title")}
                    </Text>

                    <Flex align="center" gap="3px">
                        <Button
                            type="button"
                            variant="plain"
                            size="xs"
                            height="24px"
                            px="5px"
                            gap="4px"
                            fontSize="10px"
                            color={ui.colors.textMuted}
                            bg="transparent"
                            _hover={{
                                bg: ui.colors.controlHover,
                                color: ui.colors.text,
                            }}
                            onClick={() => setChartExpanded((value) => !value)}
                        >
                            {t(
                                chartExpanded
                                    ? "pointSources.chart.collapse"
                                    : "pointSources.chart.expand",
                            )}
                            {chartExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </Button>
                    </Flex>
                </Flex>

                {chartExpanded && (
                    <PlumeTrendChart
                        items={items}
                        selectedSatellites={filters.satellites}
                        onSelectMonth={handleSelectMonth}
                        onSelectObservation={handleSelectObservation}
                    />
                )}
            </Box>

            {/* Вкладки */}
            <Flex
                mx="10px"
                mt="10px"
                mb="7px"
                gap="4px"
                flexShrink={0}
                borderBottom="1px solid"
                borderColor={ui.colors.controlBorder}
            >
                {(["timeline", "details"] as const).map((id) => (
                    <Button
                        key={id}
                        type="button"
                        variant="plain"
                        flex="1"
                        height="32px"
                        bg="transparent"
                        color={tab === id ? ui.colors.text : ui.colors.textMuted}
                        borderRadius="0"
                        borderBottom="2px solid"
                        borderBottomColor={tab === id ? ui.colors.accent : "transparent"}
                        fontSize="11px"
                        fontWeight={tab === id ? "600" : "400"}
                        _hover={{ bg: ui.colors.controlHover }}
                        onClick={() => setTab(id)}
                    >
                        {t(`pointSources.tabs.${id}`)}
                    </Button>
                ))}
            </Flex>

            {/* Прокручивается только содержимое вкладки */}
            <Box
                ref={scrollRootRef}
                flex="1"
                minHeight="0"
                overflowY="auto"
                px="10px"
                pb="10px"
                css={{
                    scrollbarGutter: "stable",
                    overflowAnchor: "none",
                }}
            >
                {tab === "details" ? (
                    <PlumeDetailsView observation={selectedPlume} />
                ) : (
                    <Flex direction="column" gap="9px">
                        {/* Сортировка и фильтры */}
                        <Flex gap="6px" justify="space-between" align="center">
                            <NativeSelect.Root flex="1" size="xs" minWidth="0">
                                <NativeSelect.Field
                                    height="28px"
                                    fontSize="10px"
                                    fontWeight="400"
                                    bg={ui.colors.panel}
                                    color={ui.colors.text}
                                    borderColor={ui.colors.borderLight}
                                    value={filters.sort}
                                    onChange={(event) =>
                                        filters.setSort(event.target.value as PlumeSort)
                                    }
                                    aria-label={t("pointSources.filters.sort")}
                                >
                                    {SORT_OPTIONS.map((sort) => (
                                        <option key={sort} value={sort}>
                                            {t(`pointSources.sort.${sort}`)}
                                        </option>
                                    ))}
                                </NativeSelect.Field>

                                <NativeSelect.Indicator />
                            </NativeSelect.Root>

                            <Button
                                type="button"
                                variant="plain"
                                size="xs"
                                height="28px"
                                minW="90px"
                                px="7px"
                                gap="4px"
                                fontSize="10px"
                                fontWeight={filtersOpen ? "600" : "400"}
                                color={ui.colors.text}
                                border="1px solid"
                                borderColor={
                                    filtersOpen ? ui.colors.borderActive : ui.colors.borderLight
                                }
                                bg={filtersOpen ? ui.colors.controlActive : ui.colors.panel}
                                _hover={{
                                    bg: filtersOpen
                                        ? ui.colors.controlActive
                                        : ui.colors.buttonHover,
                                }}
                                aria-expanded={filtersOpen}
                                aria-pressed={filtersOpen}
                                onClick={() => setFiltersOpen((value) => !value)}
                            >
                                <SlidersHorizontal size={12} />

                                {t("pointSources.filters.title")}

                                {filters.activeCount > 0 ? ` (${filters.activeCount})` : ""}
                            </Button>
                        </Flex>

                        {filtersOpen && (
                            <Collapsible.Root open={filtersOpen}>
                                <Collapsible.Content>
                                    <PlumeTimelineFilters
                                        key={filtersOpen ? "open" : "closed"}
                                        filters={filters}
                                    />
                                </Collapsible.Content>
                            </Collapsible.Root>
                        )}

                        {/* Количество результатов */}
                        <Flex align="center" justify="space-between">
                            <Text fontSize="10px" color={ui.colors.textMuted}>
                                {t("pointSources.filters.found", {
                                    count: filters.filteredItems.length,
                                })}
                            </Text>
                        </Flex>

                        {/* Хронология */}
                        {filters.filteredItems.length > 0 ? (
                            <PlumeTimeline
                                key={timelineKey}
                                scrollRootRef={scrollRootRef}
                                items={filters.filteredItems}
                                selectedKey={selectedPlume?.key ?? null}
                                onSelect={(plume) => {
                                    if (selectedPlume?.key !== plume.key) {
                                        onSelect(plume);
                                    }
                                }}
                            />
                        ) : (
                            <Text fontSize="11px" color={ui.colors.textMuted} py="12px">
                                {items.length === 0
                                    ? t("pointSources.details.noObservations")
                                    : t("pointSources.filters.noMatches")}
                            </Text>
                        )}
                    </Flex>
                )}
            </Box>
        </Flex>
    );
}

export function PlumeDetailsPanel() {
    const { t } = useTranslation();

    const { enabled, selectedGroup, selectedPlume, selectPlume, detailsOpen, closeDetails } =
        usePointSources();

    const [state, setState] = useState<LoadState | null>(null);
    const [retry, setRetry] = useState(0);

    const groupId = enabled && detailsOpen ? (selectedGroup?.id ?? null) : null;

    const requestKey = groupId === null ? null : `${groupId}:${retry}`;

    const cached = groupId ? observationCache.get(groupId) : undefined;

    const current =
        state?.key === requestKey
            ? state
            : cached && requestKey
              ? {
                    key: requestKey,
                    result: cached,
                    error: false,
                }
              : null;

    useEffect(() => {
        if (!groupId || observationCache.has(groupId)) {
            return;
        }

        const controller = new AbortController();
        const key = `${groupId}:${retry}`;

        void getPlumeObservations(groupId, controller.signal)
            .then((response) => {
                if (controller.signal.aborted) return;

                observationCache.set(groupId, response);

                setState({
                    key,
                    result: response,
                    error: false,
                });
            })
            .catch((reason: unknown) => {
                if (controller.signal.aborted) return;

                console.error("[PlumeDetails] Failed to load observations:", reason);

                setState({
                    key,
                    result: null,
                    error: true,
                });
            });

        return () => controller.abort();
    }, [groupId, retry]);

    if (!groupId || !selectedGroup) {
        return null;
    }

    const result = current?.result;
    const loading = !current;
    const failedSources = result?.failedSources ?? [];

    const error = Boolean(current?.error) || failedSources.length === 3;

    const sourceNames = (sources: PlumeSource[]) =>
        sources.map((source) => t(`pointSources.sources.${source}`)).join(", ");

    const handleRetry = () => {
        observationCache.delete(groupId);
        setRetry((value) => value + 1);
    };

    return (
        <Box
            position="relative"
            width="100%"
            height="100%"
            minHeight="0"
            display="flex"
            flexDirection="column"
            bg={ui.colors.control}
            color={ui.colors.controlText}
            border="1px solid"
            borderColor={ui.colors.controlBorder}
            borderRadius={ui.radius.md}
            boxShadow="0 6px 20px rgba(0, 0, 0, 0.25)"
            overflow="hidden"
        >
            {/* Заголовок группировки */}
            <Flex
                px="12px"
                py="10px"
                flexShrink={0}
                align="flex-start"
                justify="space-between"
                gap="8px"
                borderBottom="1px solid"
                borderColor={ui.colors.controlBorder}
            >
                <Box minWidth="0">
                    <Text fontSize="13px" fontWeight="700">
                        {t("pointSources.details.title")}
                    </Text>

                    <Text mt="3px" fontSize="11px" color={ui.colors.textMuted}>
                        {t("pointSources.group")} #{selectedGroup.id}
                        {" · "}
                        {t("pointSources.details.observations", {
                            count: selectedGroup.observations ?? result?.items.length ?? 0,
                        })}
                    </Text>
                </Box>

                <IconButton
                    aria-label={t("common.close")}
                    size="xs"
                    variant="ghost"
                    minW="26px"
                    w="26px"
                    h="26px"
                    color={ui.colors.controlText}
                    _hover={{ bg: ui.colors.controlHover }}
                    onClick={closeDetails}
                >
                    <X size={15} />
                </IconButton>
            </Flex>

            {/* Загрузка и ошибки */}
            {loading ? (
                <Text px="10px" py="12px" fontSize="11px" color={ui.colors.textMuted}>
                    {t("pointSources.details.loading")}
                </Text>
            ) : error ? (
                <Box p="10px">
                    <Text fontSize="11px" color={ui.colors.textMuted}>
                        {t("pointSources.details.loadError")}
                    </Text>

                    <Button size="xs" variant="outline" mt="10px" onClick={handleRetry}>
                        {t("pointSources.retry")}
                    </Button>
                </Box>
            ) : (
                <Flex flex="1" minHeight="0" direction="column">
                    {failedSources.length > 0 && (
                        <Flex px="10px" py="6px" align="center" gap="6px">
                            <Text flex="1" fontSize="10px" color={ui.colors.textMuted}>
                                {t("pointSources.details.partialError")}:{" "}
                                {sourceNames(failedSources)}
                            </Text>

                            <Button size="xs" variant="ghost" height="23px" onClick={handleRetry}>
                                {t("pointSources.retry")}
                            </Button>
                        </Flex>
                    )}

                    {result && result.truncatedSources.length > 0 && (
                        <Text px="10px" fontSize="10px" color={ui.colors.textMuted}>
                            {t("pointSources.details.limitWarning")}:{" "}
                            {sourceNames(result.truncatedSources)}
                        </Text>
                    )}

                    <GroupContent
                        key={groupId}
                        items={result?.items ?? []}
                        selectedPlume={selectedPlume}
                        onSelect={selectPlume}
                    />
                </Flex>
            )}
        </Box>
    );
}
