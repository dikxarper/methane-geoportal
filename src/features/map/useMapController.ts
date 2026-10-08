import { useContext } from "react";

import { MapContext } from "./mapContext";

export function useMapController() {
    const context = useContext(MapContext);

    if (!context) {
        throw new Error("useMapController must be used inside MapProvider");
    }

    return context;
}
