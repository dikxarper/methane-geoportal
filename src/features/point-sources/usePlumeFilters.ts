import { useMemo } from "react";

import { useStoredState } from "../../hooks/useStoredState";
import type { PlumeObservation } from "./types";
import {
    getEmissionRate,
    getObservationDate,
    getSatelliteKind,
    type SatelliteKind,
} from "./plumeDisplay";

export type PlumeSort = "newest" | "oldest" | "emissionDesc" | "emissionAsc";

export type DateMode = "single" | "range";

const DATE_MIN = "1900-01-01";
const DATE_MAX = "2100-12-31";

export function usePlumeFilters(items: PlumeObservation[], groupId: string) {
    const [sort, setSort] = useStoredState<PlumeSort>(`group-${groupId}-sort`, "newest");

    const [satellites, setSatellites] = useStoredState<SatelliteKind[]>(
        `group-${groupId}-satellites`,
        [],
    );

    const [dateMode, setDateMode] = useStoredState<DateMode>(`group-${groupId}-dateMode`, "single");

    const [singleDate, setSingleDate] = useStoredState(`group-${groupId}-singleDate`, "");

    const [dateFrom, setDateFrom] = useStoredState(`group-${groupId}-dateFrom`, "");

    const [dateTo, setDateTo] = useStoredState(`group-${groupId}-dateTo`, "");

    const invalidDates = dateMode === "range" && Boolean(dateFrom && dateTo && dateFrom > dateTo);

    const activeCount =
        Number(satellites.length > 0) +
        Number(dateMode === "single" ? Boolean(singleDate) : Boolean(dateFrom || dateTo));

    const availableDates = useMemo(
        () =>
            [
                ...new Set(
                    items
                        .filter((item) => {
                            const satellite = getSatelliteKind(item);

                            return (
                                satellites.length === 0 ||
                                (satellite !== null && satellites.includes(satellite))
                            );
                        })
                        .map(getObservationDate)
                        .filter((date): date is string => date !== null),
                ),
            ].sort(),
        [items, satellites],
    );

    const filteredItems = useMemo(() => {
        if (invalidDates) return [];

        return items
            .filter((item) => {
                const satellite = getSatelliteKind(item);

                if (satellites.length && (!satellite || !satellites.includes(satellite))) {
                    return false;
                }

                const date = getObservationDate(item);

                if (dateMode === "single" && singleDate && date !== singleDate) {
                    return false;
                }

                if (dateMode === "range") {
                    if (dateFrom && (!date || date < dateFrom)) {
                        return false;
                    }

                    if (dateTo && (!date || date > dateTo)) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => {
                if (sort === "emissionDesc" || sort === "emissionAsc") {
                    const left = getEmissionRate(a);
                    const right = getEmissionRate(b);

                    if (left === null && right !== null) return 1;
                    if (left !== null && right === null) return -1;

                    if (left !== null && right !== null && left !== right) {
                        return sort === "emissionDesc" ? right - left : left - right;
                    }
                }

                const diff = (a.observedAt ?? "").localeCompare(b.observedAt ?? "");

                return (sort === "oldest" ? diff : -diff) || a.key.localeCompare(b.key);
            });
    }, [items, satellites, dateMode, singleDate, dateFrom, dateTo, sort, invalidDates]);

    const toggleSatellite = (satellite: SatelliteKind) => {
        setSatellites((current) =>
            current.includes(satellite)
                ? current.filter((item) => item !== satellite)
                : [...current, satellite],
        );
    };

    const reset = () => {
        setSatellites([]);
        setDateMode("single");
        setSingleDate("");
        setDateFrom("");
        setDateTo("");
    };

    return {
        sort,
        setSort,
        satellites,
        toggleSatellite,
        dateMode,
        setDateMode,
        singleDate,
        setSingleDate,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        availableDates,
        minDate: DATE_MIN,
        maxDate: DATE_MAX,
        invalidDates,
        activeCount,
        filteredItems,
        reset,
    };
}

export type PlumeFiltersController = ReturnType<typeof usePlumeFilters>;
