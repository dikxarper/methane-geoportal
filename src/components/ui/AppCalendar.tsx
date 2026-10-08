import { Box, DatePicker, Flex, Grid, IconButton, Text } from "@chakra-ui/react";
import { parseDate } from "@internationalized/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";

interface AppCalendarProps {
    value: string;
    minDate: string;
    maxDate: string;
    availableDates?: string[];
    onChange: (date: string) => void;
    onVisibleRangeChange?: (dateFrom: string, dateTo: string) => void;
}

export function AppCalendar({
    value,
    minDate,
    maxDate,
    availableDates,
    onChange,
    onVisibleRangeChange,
}: AppCalendarProps) {
    const { t, i18n } = useTranslation();

    const locale = i18n.resolvedLanguage?.startsWith("en") ? "en-US" : "ru-RU";

    const availableDateSet = availableDates ? new Set(availableDates) : null;

    const weekdays = [
        t("calendar.weekdays.mon"),
        t("calendar.weekdays.tue"),
        t("calendar.weekdays.wed"),
        t("calendar.weekdays.thu"),
        t("calendar.weekdays.fri"),
        t("calendar.weekdays.sat"),
        t("calendar.weekdays.sun"),
    ];

    return (
        <Box
            width="100%"
            overflow="hidden"
            border="1px solid"
            borderColor={ui.colors.borderLight}
            borderRadius={ui.radius.md}
            bg={ui.colors.panelDark}
            p="8px"
            css={{
                "& [data-part='content']": {
                    width: "100%",
                },

                "& [data-part='view']": {
                    width: "100%",
                },

                "& [data-part='table']": {
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0 2px",
                },

                "& [data-part='table-head']": {
                    display: "none",
                },

                "& [data-part='table-row']": {
                    height: "32px",
                },

                "& [data-part='table-cell']": {
                    padding: 0,
                    textAlign: "center",
                },

                "& [data-part='table-cell-trigger']": {
                    width: "32px",
                    height: "32px",
                    margin: "0 auto",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: ui.colors.text,
                    background: "transparent",
                    transition: "background 0.15s ease, color 0.15s ease",
                },

                "& [data-part='table-cell-trigger']:hover:not([data-disabled]):not([data-selected])":
                    {
                        background: "rgba(127, 127, 127, 0.16)",
                    },

                "& [data-part='table-cell-trigger'][data-selected]": {
                    background: ui.colors.accent,
                    color: "#ffffff",
                    fontWeight: 600,
                },

                "& [data-part='table-cell-trigger'][data-disabled]": {
                    color: ui.colors.textDisabled,
                    opacity: 0.4,
                    cursor: "default",
                },
            }}
        >
            <DatePicker.Root
                inline
                size="sm"
                locale={locale}
                startOfWeek={1}
                fixedWeeks
                min={parseDate(minDate)}
                max={parseDate(maxDate)}
                value={[parseDate(value)]}
                defaultFocusedValue={parseDate(value)}
                isDateUnavailable={(date) => {
                    if (!availableDateSet) {
                        return false;
                    }

                    return !availableDateSet.has(date.toString());
                }}
                onValueChange={(details) => {
                    const selected = details.value[0];

                    if (!selected) {
                        return;
                    }

                    const date = selected.toString();

                    if (availableDateSet && !availableDateSet.has(date)) {
                        return;
                    }

                    onChange(date);
                }}
                onVisibleRangeChange={(details) => {
                    if (!onVisibleRangeChange) {
                        return;
                    }

                    const { start, end } = details.visibleRange;

                    onVisibleRangeChange(start.toString(), end.toString());
                }}
            >
                <DatePicker.View view="day">
                    <Flex align="center" gap="6px" mb="8px">
                        <DatePicker.PrevTrigger asChild>
                            <IconButton
                                aria-label={t("calendar.previousMonth")}
                                size="xs"
                                variant="ghost"
                                minW="26px"
                                w="26px"
                                h="26px"
                                borderRadius="6px"
                                color={ui.colors.textMuted}
                                _hover={{
                                    bg: "rgba(127, 127, 127, 0.14)",
                                    color: ui.colors.text,
                                }}
                            >
                                <ChevronLeft size={15} />
                            </IconButton>
                        </DatePicker.PrevTrigger>

                        <DatePicker.MonthSelect
                            flex="1"
                            height="30px"
                            px="8px"
                            border="1px solid"
                            borderColor={ui.colors.borderLight}
                            borderRadius="6px"
                            bg={ui.colors.panel}
                            color={ui.colors.text}
                            fontSize="12px"
                            textTransform="capitalize"
                        />

                        <DatePicker.YearSelect
                            width="68px"
                            height="30px"
                            px="8px"
                            border="1px solid"
                            borderColor={ui.colors.borderLight}
                            borderRadius="6px"
                            bg={ui.colors.panel}
                            color={ui.colors.text}
                            fontSize="12px"
                        />

                        <DatePicker.NextTrigger asChild>
                            <IconButton
                                aria-label={t("calendar.nextMonth")}
                                size="xs"
                                variant="ghost"
                                minW="26px"
                                w="26px"
                                h="26px"
                                borderRadius="6px"
                                color={ui.colors.textMuted}
                                _hover={{
                                    bg: "rgba(127, 127, 127, 0.14)",
                                    color: ui.colors.text,
                                }}
                            >
                                <ChevronRight size={15} />
                            </IconButton>
                        </DatePicker.NextTrigger>
                    </Flex>

                    <Grid
                        templateColumns="repeat(7, 1fr)"
                        alignItems="center"
                        height="24px"
                        mb="2px"
                    >
                        {weekdays.map((weekday) => (
                            <Text
                                key={weekday}
                                textAlign="center"
                                fontSize="10px"
                                fontWeight="500"
                                color={ui.colors.textMuted}
                            >
                                {weekday}
                            </Text>
                        ))}
                    </Grid>

                    <DatePicker.DayTable />
                </DatePicker.View>
            </DatePicker.Root>
        </Box>
    );
}
