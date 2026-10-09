import { useMemo, useState } from "react";
import {
    Box,
    Button,
    DatePicker,
    Flex,
    Grid,
    IconButton,
    NativeSelect,
    Text,
} from "@chakra-ui/react";
import { parseDate } from "@internationalized/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";

interface AppCalendarProps {
    value: string;
    minDate: string;
    maxDate: string;
    availableDates?: string[];
    restrictNavigationToAvailableDates?: boolean;
    onChange: (date: string) => void;
    onVisibleRangeChange?: (dateFrom: string, dateTo: string) => void;
}

function localToday(): string {
    const now = new Date();

    return [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, "0"),
        String(now.getDate()).padStart(2, "0"),
    ].join("-");
}

export function AppCalendar({
    value,
    minDate,
    maxDate,
    availableDates,
    restrictNavigationToAvailableDates = false,
    onChange,
    onVisibleRangeChange,
}: AppCalendarProps) {
    const { t, i18n } = useTranslation();
    const locale = i18n.resolvedLanguage?.startsWith("en") ? "en-US" : "ru-RU";
    const today = localToday();

    const validDates = useMemo(
        () =>
            [...new Set(availableDates ?? [])]
                .filter(
                    (date) =>
                        /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= minDate && date <= maxDate,
                )
                .sort(),
        [availableDates, minDate, maxDate],
    );

    const availableDateSet = useMemo(
        () => (availableDates ? new Set(validDates) : null),
        [availableDates, validDates],
    );

    const availableMonths = useMemo(
        () => [...new Set(validDates.map((date) => date.slice(0, 7)))],
        [validDates],
    );

    const availableMonthSet = useMemo(() => new Set(availableMonths), [availableMonths]);

    const availableYears = useMemo(
        () => [...new Set(validDates.map((date) => Number(date.slice(0, 4))))],
        [validDates],
    );

    const availableYearSet = useMemo(() => new Set(availableYears), [availableYears]);

    const restrict = restrictNavigationToAvailableDates && availableDates !== undefined;

    const initialFocus =
        value && (!restrict || availableDateSet?.has(value))
            ? value
            : (validDates[validDates.length - 1] ?? today);

    const [focusedDate, setFocusedDate] = useState(initialFocus);

    const focusedMonth = focusedDate.slice(0, 7);
    const focusedYear = Number(focusedDate.slice(0, 4));
    const focusedMonthNumber = Number(focusedDate.slice(5, 7));
    const availableMonthIndex = availableMonths.indexOf(focusedMonth);

    const navigateAvailable = (direction: -1 | 1) => {
        const targetMonth = availableMonths[availableMonthIndex + direction];
        if (!targetMonth) return;

        const firstDay = validDates.find((date) => date.startsWith(targetMonth));
        if (firstDay) setFocusedDate(firstDay);
    };

    const focusAvailableMonth = (year: number, month: number) => {
        const prefix = `${year}-${String(month).padStart(2, "0")}`;
        const date = validDates.find((item) => item.startsWith(prefix));

        if (date) setFocusedDate(date);
    };

    const focusAvailableYear = (year: number) => {
        const months = availableMonths.filter((month) => month.startsWith(`${year}-`));

        if (!months.length) return;

        const wantedMonth = `${year}-${String(focusedMonthNumber).padStart(2, "0")}`;
        const nextMonth = months.includes(wantedMonth) ? wantedMonth : months[0];

        const date = validDates.find((item) => item.startsWith(nextMonth));
        if (date) setFocusedDate(date);
    };

    const todayAllowed =
        today >= minDate && today <= maxDate && (!availableDateSet || availableDateSet.has(today));

    const weekdays = [
        t("calendar.weekdays.mon"),
        t("calendar.weekdays.tue"),
        t("calendar.weekdays.wed"),
        t("calendar.weekdays.thu"),
        t("calendar.weekdays.fri"),
        t("calendar.weekdays.sat"),
        t("calendar.weekdays.sun"),
    ];

    const monthNames = useMemo(
        () =>
            Array.from({ length: 12 }, (_, index) =>
                new Intl.DateTimeFormat(locale, {
                    month: "long",
                    timeZone: "UTC",
                }).format(new Date(Date.UTC(2020, index, 1))),
            ),
        [locale],
    );

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
                "& [data-part='content']": { width: "100%" },
                "& [data-part='view']": { width: "100%" },
                "& [data-part='table']": {
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0 2px",
                },
                "& [data-part='table-head']": { display: "none" },
                "& [data-part='table-row']": { height: "32px" },
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
                value={value ? [parseDate(value)] : []}
                defaultFocusedValue={parseDate(initialFocus)}
                focusedValue={restrict ? parseDate(focusedDate) : undefined}
                onFocusChange={
                    restrict
                        ? (details) => {
                              const next = details.focusedValue.toString();

                              if (availableMonthSet.has(next.slice(0, 7))) {
                                  setFocusedDate(next);
                              }
                          }
                        : undefined
                }
                isDateUnavailable={(date) =>
                    Boolean(availableDateSet && !availableDateSet.has(date.toString()))
                }
                onValueChange={(details) => {
                    const selected = details.value[0]?.toString();
                    if (!selected) return;

                    if (availableDateSet && !availableDateSet.has(selected)) return;

                    onChange(selected);
                }}
                onVisibleRangeChange={(details) => {
                    if (!onVisibleRangeChange) return;

                    const { start, end } = details.visibleRange;
                    onVisibleRangeChange(start.toString(), end.toString());
                }}
            >
                <DatePicker.View view="day">
                    <Flex align="center" gap="6px" mb="8px">
                        {restrict ? (
                            <IconButton
                                aria-label={t("calendar.previousMonth")}
                                size="xs"
                                variant="ghost"
                                minW="26px"
                                w="26px"
                                h="26px"
                                borderRadius="6px"
                                color={ui.colors.textMuted}
                                disabled={availableMonthIndex <= 0}
                                onClick={() => navigateAvailable(-1)}
                            >
                                <ChevronLeft size={15} />
                            </IconButton>
                        ) : (
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
                        )}

                        {restrict ? (
                            <>
                                <NativeSelect.Root size="xs" flex="1" minW="0">
                                    <NativeSelect.Field
                                        height="30px"
                                        fontSize="12px"
                                        bg={ui.colors.panel}
                                        color={ui.colors.text}
                                        borderColor={ui.colors.borderLight}
                                        value={String(focusedMonthNumber)}
                                        aria-label={locale === "ru-RU" ? "Месяц" : "Month"}
                                        onChange={(event) =>
                                            focusAvailableMonth(
                                                focusedYear,
                                                Number(event.target.value),
                                            )
                                        }
                                    >
                                        {monthNames.map((month, index) => {
                                            const monthNumber = index + 1;
                                            const code = `${focusedYear}-${String(monthNumber).padStart(2, "0")}`;

                                            return (
                                                <option
                                                    key={code}
                                                    value={monthNumber}
                                                    disabled={!availableMonthSet.has(code)}
                                                >
                                                    {month}
                                                </option>
                                            );
                                        })}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>

                                <NativeSelect.Root size="xs" width="79px" flexShrink={0}>
                                    <NativeSelect.Field
                                        height="30px"
                                        fontSize="12px"
                                        bg={ui.colors.panel}
                                        color={ui.colors.text}
                                        borderColor={ui.colors.borderLight}
                                        value={String(focusedYear)}
                                        aria-label={locale === "ru-RU" ? "Год" : "Year"}
                                        onChange={(event) =>
                                            focusAvailableYear(Number(event.target.value))
                                        }
                                    >
                                        {Array.from(
                                            {
                                                length: availableYears.length
                                                    ? availableYears[availableYears.length - 1] -
                                                      availableYears[0] +
                                                      1
                                                    : 1,
                                            },
                                            (_, index) =>
                                                availableYears.length
                                                    ? availableYears[0] + index
                                                    : focusedYear,
                                        ).map((year) => (
                                            <option
                                                key={year}
                                                value={year}
                                                disabled={!availableYearSet.has(year)}
                                            >
                                                {year}
                                            </option>
                                        ))}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}

                        {restrict ? (
                            <IconButton
                                aria-label={t("calendar.nextMonth")}
                                size="xs"
                                variant="ghost"
                                minW="26px"
                                w="26px"
                                h="26px"
                                borderRadius="6px"
                                color={ui.colors.textMuted}
                                disabled={
                                    availableMonthIndex < 0 ||
                                    availableMonthIndex >= availableMonths.length - 1
                                }
                                onClick={() => navigateAvailable(1)}
                            >
                                <ChevronRight size={15} />
                            </IconButton>
                        ) : (
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
                        )}
                    </Flex>

                    <Grid
                        templateColumns="repeat(7, 1fr)"
                        alignItems="center"
                        height="24px"
                        mb="2px"
                    >
                        {weekdays.map((weekday, index) => (
                            <Text
                                key={`${index}-${weekday}`}
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

            <Flex justify="flex-end" mt="6px">
                <Button
                    type="button"
                    size="xs"
                    variant="ghost"
                    height="26px"
                    color={ui.colors.textMuted}
                    fontSize="11px"
                    disabled={!todayAllowed}
                    onClick={() => {
                        if (restrict) setFocusedDate(today);
                        onChange(today);
                    }}
                >
                    {t("calendar.today")}
                </Button>
            </Flex>
        </Box>
    );
}
