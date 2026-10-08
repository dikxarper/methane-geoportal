import { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import {
    getS5PDateBounds,
    getS5PRecordUid,
    getS5PRecordsForRange,
    normalizeS5PDate,
    type S5PRecord,
} from "../../api/s5p";
import {
    getMethaneAnnualRecordUid,
    getMethaneAnnualRecords,
    type MethaneAnnualRecord,
} from "../../api/methaneAnnual";

import { AppCalendar } from "../../components/ui/AppCalendar";
import { LayerCard } from "../../components/ui/LayerCard";
import { PanelHeader } from "../../components/ui/PanelHeader";
import { ui } from "../../theme/tokens";

import { useMapController } from "../map/useMapController";
import { areaFluxConfig } from "./config";

type AreaFluxError =
    | "areaFlux.sentinel5p.notFound"
    | "areaFlux.sentinel5p.loadError"
    | "areaFlux.sentinel5p.datesLoadError"
    | null;

type MethaneAnnualError = "areaFlux.annualMethane.loadError" | null;

function getMonthRange(date: string) {
    const [year, month] = date.split("-").map(Number);
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const monthString = String(month).padStart(2, "0");

    return {
        from: `${year}-${monthString}-01`,
        to: `${year}-${monthString}-${String(lastDay).padStart(2, "0")}`,
    };
}

function mergeRecords(current: S5PRecord[], incoming: S5PRecord[]) {
    const result = new Map<string, S5PRecord>();

    for (const record of [...current, ...incoming]) {
        const uid = getS5PRecordUid(record);

        const key =
            uid ?? `${record.id ?? "unknown"}-${normalizeS5PDate(record.date) ?? "unknown"}`;

        result.set(key, record);
    }

    return Array.from(result.values());
}

export function AreaFluxPanel() {
    const { t } = useTranslation();
    const { updateS5PLayer, updateMethaneAnnualLayer } = useMapController();

    const [enabled, setEnabled] = useState(true);
    const [opacity, setOpacity] = useState(100);

    const [records, setRecords] = useState<S5PRecord[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [minDate, setMinDate] = useState<string | null>(null);
    const [maxDate, setMaxDate] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [monthLoading, setMonthLoading] = useState(false);
    const [error, setError] = useState<AreaFluxError>(null);

    const [annualEnabled, setAnnualEnabled] = useState(false);
    const [annualOpacity, setAnnualOpacity] = useState(100);
    const [annualRecords, setAnnualRecords] = useState<MethaneAnnualRecord[]>([]);
    const [annualYear, setAnnualYear] = useState<number | null>(null);
    const [annualLoading, setAnnualLoading] = useState(true);
    const [annualError, setAnnualError] = useState<MethaneAnnualError>(null);

    useEffect(() => {
        let cancelled = false;

        async function initialize() {
            setLoading(true);
            setError(null);

            try {
                const bounds = await getS5PDateBounds();

                if (cancelled) {
                    return;
                }

                if (!bounds) {
                    setError("areaFlux.sentinel5p.notFound");
                    return;
                }

                const monthRange = getMonthRange(bounds.maxDate);

                const monthRecords = await getS5PRecordsForRange(monthRange.from, monthRange.to);

                if (cancelled) {
                    return;
                }

                setRecords(mergeRecords([bounds.minRecord, bounds.maxRecord], monthRecords));

                setMinDate(bounds.minDate);
                setMaxDate(bounds.maxDate);
                setSelectedDate(bounds.maxDate);
            } catch {
                if (!cancelled) {
                    setError("areaFlux.sentinel5p.loadError");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void initialize();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadAnnualRecords() {
            setAnnualLoading(true);
            setAnnualError(null);

            try {
                const data = await getMethaneAnnualRecords();
                const records = data
                    .filter((record): record is MethaneAnnualRecord & { year: number } =>
                        typeof record.year === "number",
                    )
                    .sort((first, second) => second.year - first.year);

                if (cancelled) {
                    return;
                }

                setAnnualRecords(records);
                setAnnualYear((current) =>
                    current !== null && records.some((record) => record.year === current)
                        ? current
                        : (records[0]?.year ?? null),
                );
            } catch {
                if (!cancelled) {
                    setAnnualError("areaFlux.annualMethane.loadError");
                }
            } finally {
                if (!cancelled) {
                    setAnnualLoading(false);
                }
            }
        }

        void loadAnnualRecords();

        return () => {
            cancelled = true;
        };
    }, []);

    const loadVisibleRange = useCallback(
        async (dateFrom: string, dateTo: string) => {
            if (!minDate || !maxDate) {
                return;
            }

            const from = dateFrom < minDate ? minDate : dateFrom;
            const to = dateTo > maxDate ? maxDate : dateTo;

            if (from > to) {
                return;
            }

            setMonthLoading(true);
            setError(null);

            try {
                const data = await getS5PRecordsForRange(from, to);

                setRecords((current) => mergeRecords(current, data));
            } catch {
                setError("areaFlux.sentinel5p.datesLoadError");
            } finally {
                setMonthLoading(false);
            }
        },
        [minDate, maxDate],
    );

    const availableDates = useMemo(() => {
        return Array.from(
            new Set(
                records
                    .map((record) => normalizeS5PDate(record.date))
                    .filter((date): date is string => date !== null),
            ),
        ).sort();
    }, [records]);

    const selectedRecord = useMemo(() => {
        if (!selectedDate) {
            return null;
        }

        return records.find((record) => normalizeS5PDate(record.date) === selectedDate) ?? null;
    }, [records, selectedDate]);

    const selectedUid = selectedRecord ? getS5PRecordUid(selectedRecord) : null;

    const selectedAnnualRecord = useMemo(
        () => annualRecords.find((record) => record.year === annualYear) ?? null,
        [annualRecords, annualYear],
    );

    const selectedAnnualUid = selectedAnnualRecord
        ? getMethaneAnnualRecordUid(selectedAnnualRecord)
        : null;

    const handleS5PEnabledChange = (value: boolean) => {
        setEnabled(value);

        if (value) {
            setAnnualEnabled(false);
        }
    };

    const handleAnnualEnabledChange = (value: boolean) => {
        setAnnualEnabled(value);

        if (value) {
            setEnabled(false);
        }
    };

    useEffect(() => {
        updateS5PLayer({
            uid: selectedUid,
            date: selectedDate,
            visible: enabled && Boolean(selectedUid),
            opacity: opacity / 100,
            legendStyle: areaFluxConfig.sentinel5p.legendStyle,
        });
    }, [selectedUid, selectedDate, enabled, opacity, updateS5PLayer]);

    useEffect(() => {
        updateMethaneAnnualLayer({
            uid: selectedAnnualUid,
            year: annualYear,
            visible: annualEnabled && Boolean(selectedAnnualUid),
            opacity: annualOpacity / 100,
            legendStyle: areaFluxConfig.annualMethane.legendStyle,
        });
    }, [
        annualEnabled,
        annualOpacity,
        annualYear,
        selectedAnnualUid,
        updateMethaneAnnualLayer,
    ]);

    return (
        <Box>
            <PanelHeader>{t("sidebar.areaFlux")}</PanelHeader>

            <Box mt="10px">
                <LayerCard
                    title={t("areaFlux.sentinel5p.title")}
                    description={t("areaFlux.sentinel5p.description")}
                    enabled={enabled}
                    onEnabledChange={handleS5PEnabledChange}
                    opacity={opacity}
                    onOpacityChange={setOpacity}
                >
                    <Box pt="12px" borderTop="1px solid" borderColor={ui.colors.border}>
                        <Text mb="8px" fontSize="12px" fontWeight="600" color={ui.colors.text}>
                            {t("areaFlux.sentinel5p.availableDates")}
                        </Text>

                        {loading && (
                            <Text fontSize="12px" color={ui.colors.textMuted}>
                                {t("areaFlux.sentinel5p.loading")}
                            </Text>
                        )}

                        {!loading && selectedDate && minDate && maxDate && (
                            <AppCalendar
                                availableDates={availableDates}
                                value={selectedDate}
                                minDate={minDate}
                                maxDate={maxDate}
                                onChange={setSelectedDate}
                                onVisibleRangeChange={loadVisibleRange}
                            />
                        )}

                        {monthLoading && (
                            <Text mt="8px" fontSize="11px" color={ui.colors.textMuted}>
                                {t("areaFlux.sentinel5p.loadingMonth")}
                            </Text>
                        )}

                        {error && (
                            <Text mt="8px" fontSize="11px" color="red.400">
                                {t(error)}
                            </Text>
                        )}
                    </Box>
                </LayerCard>
            </Box>

            <Box mt="10px">
                <LayerCard
                    title={t("areaFlux.annualMethane.title")}
                    description={t("areaFlux.annualMethane.description")}
                    enabled={annualEnabled}
                    onEnabledChange={handleAnnualEnabledChange}
                    opacity={annualOpacity}
                    onOpacityChange={setAnnualOpacity}
                >
                    {annualLoading && (
                        <Text fontSize="12px" color={ui.colors.textMuted}>
                            {t("areaFlux.annualMethane.loading")}
                        </Text>
                    )}

                    {!annualLoading && annualRecords.length > 0 && (
                        <Box>
                            <Text mb="8px" fontSize="12px" fontWeight="600" color={ui.colors.text}>
                                {t("areaFlux.annualMethane.year")}
                            </Text>

                            <select
                                value={annualYear ?? ""}
                                disabled={!annualEnabled}
                                onChange={(event) => setAnnualYear(Number(event.target.value))}
                                style={{
                                    width: "100%",
                                    height: "36px",
                                    padding: "0 10px",
                                    border: `1px solid ${ui.colors.borderLight}`,
                                    borderRadius: "6px",
                                    background: ui.colors.panelDark,
                                    color: ui.colors.text,
                                    opacity: annualEnabled ? 1 : 0.55,
                                }}
                            >
                                {annualRecords.map((record) => (
                                    <option key={record.year} value={record.year}>
                                        {record.year}
                                    </option>
                                ))}
                            </select>
                        </Box>
                    )}

                    {!annualLoading && annualRecords.length === 0 && !annualError && (
                        <Text fontSize="12px" color={ui.colors.textMuted}>
                            {t("areaFlux.annualMethane.notFound")}
                        </Text>
                    )}

                    {annualError && (
                        <Text fontSize="11px" color="red.400">
                            {t(annualError)}
                        </Text>
                    )}
                </LayerCard>
            </Box>
        </Box>
    );
}
