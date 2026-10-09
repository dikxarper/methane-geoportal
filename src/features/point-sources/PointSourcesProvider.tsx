import { useCallback, useState, type ReactNode } from "react";

import { useStoredState } from "../../hooks/useStoredState";
import type { PlumeGroup } from "../../api/plumePoints";
import { PointSourcesContext } from "./pointSourcesContext";
import type { PlumeObservation } from "./types";

export function PointSourcesProvider({ children }: { children: ReactNode }) {
    const [enabled, setEnabled] = useStoredState("point-enabled", false);

    const [opacity, setOpacity] = useStoredState("point-opacity", 100);

    const [selectedGroup, setSelectedGroup] = useStoredState<PlumeGroup | null>(
        "selected-group",
        null,
    );

    const [selectedPlume, setSelectedPlume] = useStoredState<PlumeObservation | null>(
        "selected-plume",
        null,
    );

    const [detailsOpen, setDetailsOpen] = useStoredState("details-open", false);

    const [focusRequest, setFocusRequest] = useState(0);

    const selectGroup = useCallback(
        (group: PlumeGroup) => {
            if (selectedGroup?.id !== group.id) {
                setSelectedPlume(null);
            }

            setSelectedGroup(group);
            setDetailsOpen(true);

            setFocusRequest((current) => current + 1);
        },
        [selectedGroup?.id, setSelectedGroup, setSelectedPlume, setDetailsOpen],
    );

    const selectPlume = useCallback(
        (plume: PlumeObservation) => {
            setSelectedPlume((current) => (current?.key === plume.key ? null : plume));
        },
        [setSelectedPlume],
    );

    const closeDetails = useCallback(() => {
        setDetailsOpen(false);
        setSelectedPlume(null);
    }, [setDetailsOpen, setSelectedPlume]);

    return (
        <PointSourcesContext.Provider
            value={{
                enabled,
                setEnabled,

                opacity,
                setOpacity,

                selectedGroup,
                selectGroup,
                focusRequest,

                selectedPlume,
                selectPlume,

                detailsOpen,
                closeDetails,
            }}
        >
            {children}
        </PointSourcesContext.Provider>
    );
}
