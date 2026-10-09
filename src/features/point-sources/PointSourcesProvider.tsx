import { useCallback, useState, type ReactNode } from "react";
import type { PlumeGroup } from "../../api/plumePoints";
import { PointSourcesContext } from "./pointSourcesContext";
import type { PlumeObservation } from "./types";

export function PointSourcesProvider({ children }: { children: ReactNode }) {
    const [enabled, setEnabled] = useState(false);
    const [opacity, setOpacity] = useState(100);
    const [selectedGroup, setSelectedGroup] = useState<PlumeGroup | null>(null);
    const [focusRequest, setFocusRequest] = useState(0);

    const [selectedPlume, setSelectedPlume] = useState<PlumeObservation | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const selectGroup = useCallback(
        (group: PlumeGroup) => {
            if (selectedGroup?.id !== group.id) {
                setSelectedPlume(null);
            }

            setSelectedGroup(group);
            setDetailsOpen(true);
            setFocusRequest((current) => current + 1);
        },
        [selectedGroup?.id],
    );

    const selectPlume = useCallback((plume: PlumeObservation) => {
        setSelectedPlume((current) => (current?.key === plume.key ? null : plume));
    }, []);

    const closeDetails = useCallback(() => {
        setDetailsOpen(false);
        setSelectedPlume(null);
    }, []);

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
