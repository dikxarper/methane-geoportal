import { useState } from "react";
import { Box, Button, Flex, Popover, Portal, Text } from "@chakra-ui/react";
import { CalendarDays, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AppCalendar } from "../../components/ui/AppCalendar";
import { ui } from "../../theme/tokens";
import type { SatelliteKind } from "./plumeDisplay";
import type { DateMode, PlumeFiltersController } from "./usePlumeFilters";

interface PlumeTimelineFiltersProps {
    filters: PlumeFiltersController;
}

type DateField = "single" | "from" | "to";

const SATELLITES: { key: SatelliteKind; label: string }[] = [
    { key: "sentinel2", label: "Sentinel-2" },
    { key: "landsat", label: "Landsat" },
    { key: "emit", label: "EMIT" },
    { key: "tanager", label: "Tanager" },
];

export function PlumeTimelineFilters({ filters }: PlumeTimelineFiltersProps) {
    const { t } = useTranslation();
    const [openCalendar, setOpenCalendar] = useState<DateField | null>(null);

    const setCalendarValue = (field: DateField, date: string) => {
        if (field === "single") {
            filters.setSingleDate(date);
        } else if (field === "from") {
            filters.setDateFrom(date);

            if (filters.dateTo && date > filters.dateTo) {
                filters.setDateTo("");
            }
        } else {
            filters.setDateTo(date);

            if (filters.dateFrom && date < filters.dateFrom) {
                filters.setDateFrom("");
            }
        }

        setOpenCalendar(null);
    };

    const dateField = (
        field: DateField,
        label: string,
        value: string,
        onChange: (date: string) => void,
    ) => (
        <Box flex="1" minWidth="0">
            <Text mb="4px" fontSize="10px" color={ui.colors.textMuted}>
                {label}
            </Text>

            <Flex gap="3px" align="center">
                <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    width="100%"
                    height="30px"
                    px="6px"
                    gap="4px"
                    minWidth="0"
                    justifyContent="flex-start"
                    bg={ui.colors.panel}
                    color={value ? ui.colors.text : ui.colors.textMuted}
                    borderColor={ui.colors.borderLight}
                    fontSize="10px"
                    fontWeight="400"
                    aria-expanded={openCalendar === field}
                    onClick={() => setOpenCalendar((current) => (current === field ? null : field))}
                >
                    <CalendarDays size={12} />
                    <Text truncate>{value || t("pointSources.filters.chooseDate")}</Text>
                </Button>

                {value && (
                    <Button
                        type="button"
                        variant="plain"
                        size="xs"
                        minW="18px"
                        h="24px"
                        px="0"
                        color={ui.colors.textMuted}
                        aria-label={t("pointSources.filters.clearDate")}
                        onClick={() => onChange("")}
                    >
                        <X size={12} />
                    </Button>
                )}
            </Flex>
        </Box>
    );

    const calendarValue =
        openCalendar === "single"
            ? filters.singleDate
            : openCalendar === "from"
              ? filters.dateFrom
              : filters.dateTo;

    return (
        <Box
            p="10px"
            border="1px solid"
            borderColor={ui.colors.borderLight}
            bg={ui.colors.panelDark}
            borderRadius={ui.radius.md}
        >
            <Flex direction="column" gap="12px">
                <Box>
                    <Text fontSize="11px" fontWeight="600" mb="6px">
                        {t("pointSources.filters.satellites")}
                    </Text>

                    <Flex gap="5px" wrap="wrap">
                        {SATELLITES.map((satellite) => {
                            const active = filters.satellites.includes(satellite.key);

                            return (
                                <Button
                                    key={satellite.key}
                                    type="button"
                                    variant="plain"
                                    size="xs"
                                    height="27px"
                                    px="7px"
                                    gap="4px"
                                    fontSize="10px"
                                    border="1px solid"
                                    borderRadius={ui.radius.sm}
                                    borderColor={
                                        active ? ui.colors.borderActive : ui.colors.borderLight
                                    }
                                    bg={active ? ui.colors.controlActive : ui.colors.panel}
                                    color={ui.colors.text}
                                    aria-pressed={active}
                                    onClick={() => filters.toggleSatellite(satellite.key)}
                                    _hover={{ bg: ui.colors.buttonHover }}
                                >
                                    {active && <Check size={11} />}
                                    {satellite.label}
                                </Button>
                            );
                        })}
                    </Flex>
                </Box>

                <Box>
                    <Text fontSize="11px" fontWeight="600" mb="6px">
                        {t("pointSources.filters.date")}
                    </Text>

                    <Flex gap="5px" mb="8px">
                        {(["single", "range"] as const).map((mode: DateMode) => (
                            <Button
                                key={mode}
                                type="button"
                                variant="plain"
                                flex="1"
                                size="xs"
                                h="28px"
                                fontSize="10px"
                                fontWeight={filters.dateMode === mode ? "600" : "400"}
                                color={ui.colors.text}
                                border="1px solid"
                                borderColor={
                                    filters.dateMode === mode
                                        ? ui.colors.borderActive
                                        : ui.colors.borderLight
                                }
                                bg={
                                    filters.dateMode === mode
                                        ? ui.colors.controlActive
                                        : ui.colors.panel
                                }
                                onClick={() => {
                                    filters.setDateMode(mode);
                                    setOpenCalendar(null);
                                }}
                            >
                                {t(`pointSources.filters.${mode}`)}
                            </Button>
                        ))}
                    </Flex>

                    <Popover.Root
                        open={openCalendar !== null}
                        onOpenChange={({ open }) => {
                            if (!open) setOpenCalendar(null);
                        }}
                        positioning={{
                            placement: "left-start",
                            strategy: "fixed",
                            offset: { mainAxis: 12 },
                        }}
                        lazyMount
                        unmountOnExit
                        autoFocus={false}
                    >
                        <Popover.Anchor asChild>
                            <Box>
                                {filters.dateMode === "single" ? (
                                    dateField(
                                        "single",
                                        t("pointSources.filters.date"),
                                        filters.singleDate,
                                        filters.setSingleDate,
                                    )
                                ) : (
                                    <Flex gap="6px">
                                        {dateField(
                                            "from",
                                            t("pointSources.filters.from"),
                                            filters.dateFrom,
                                            filters.setDateFrom,
                                        )}

                                        {dateField(
                                            "to",
                                            t("pointSources.filters.to"),
                                            filters.dateTo,
                                            filters.setDateTo,
                                        )}
                                    </Flex>
                                )}
                            </Box>
                        </Popover.Anchor>

                        <Portal>
                            <Popover.Positioner zIndex={1600}>
                                <Popover.Content
                                    width="294px"
                                    maxW="calc(100vw - 20px)"
                                    p="0"
                                    bg={ui.colors.panelDark}
                                    borderColor={ui.colors.borderLight}
                                    borderRadius={ui.radius.md}
                                    boxShadow="0 8px 24px rgba(0, 0, 0, 0.25)"
                                >
                                    {openCalendar !== null && (
                                        <AppCalendar
                                            key={`${openCalendar}:${filters.satellites.join(",")}`}
                                            value={calendarValue}
                                            minDate={filters.minDate}
                                            maxDate={filters.maxDate}
                                            availableDates={
                                                openCalendar === "single"
                                                    ? filters.availableDates
                                                    : undefined
                                            }
                                            restrictNavigationToAvailableDates={
                                                openCalendar === "single"
                                            }
                                            onChange={(date) =>
                                                setCalendarValue(openCalendar, date)
                                            }
                                        />
                                    )}
                                </Popover.Content>
                            </Popover.Positioner>
                        </Portal>
                    </Popover.Root>

                    {filters.invalidDates && (
                        <Text mt="6px" fontSize="10px" color="red.400">
                            {t("pointSources.filters.invalidRange")}
                        </Text>
                    )}
                </Box>

                <Flex justify="flex-end">
                    <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        height="26px"
                        fontSize="10px"
                        color={ui.colors.textMuted}
                        onClick={() => {
                            filters.reset();
                            setOpenCalendar(null);
                        }}
                    >
                        {t("pointSources.filters.reset")}
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}
