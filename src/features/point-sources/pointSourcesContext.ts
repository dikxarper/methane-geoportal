import { createContext } from "react";
import type { PlumeGroup } from "../../api/plumePoints";
import type { PlumeObservation } from "./types";

export interface PointSourcesController {
    enabled: boolean;
    setEnabled: (value: boolean) => void;
    opacity: number;
    setOpacity: (value: number) => void;

    selectedGroup: PlumeGroup | null;
    selectGroup: (group: PlumeGroup) => void;
    focusRequest: number;

    selectedPlume: PlumeObservation | null;
    selectPlume: (plume: PlumeObservation) => void;

    detailsOpen: boolean;
    closeDetails: () => void;
}

export const PointSourcesContext = createContext<PointSourcesController | null>(null);
