import { useContext } from "react";
import { PointSourcesContext } from "./pointSourcesContext";

export function usePointSources() {
    const context = useContext(PointSourcesContext);

    if (!context) {
        throw new Error("usePointSources must be used inside PointSourcesProvider");
    }

    return context;
}
