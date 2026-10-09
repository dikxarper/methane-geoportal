import { useEffect, useRef, type CSSProperties } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { TopControls } from "../components/ui/TopControls";
import { MapControls } from "../features/map/controls/MapControls";
import { MapView } from "../features/map/MapView";
import { MapLegend } from "../features/map/MapLegend";
import { PlumeDetailsPanel } from "../features/point-sources/PlumeDetailsPanel";
import { usePointSources } from "../features/point-sources/usePointSources";
import { Sidebar } from "./sidebar/Sidebar";

const PANEL_WIDTH = "min(420px, calc(100% - 168px))";
const MOVED_RIGHT = "calc(min(420px, 100% - 168px) + 24px)";

export function MapLayout() {
    const { enabled, selectedGroup, detailsOpen } = usePointSources();

    const panelOpen = enabled && detailsOpen && selectedGroup !== null;
    const floatingRight = panelOpen ? MOVED_RIGHT : "12px";

    const shellRef = useRef<HTMLDivElement | null>(null);
    const legendRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const legend = legendRef.current;
        const shell = shellRef.current;

        if (!legend || !shell) return;

        const updateLegendHeight = () => {
            const height = Math.ceil(legend.getBoundingClientRect().height);

            shell.style.setProperty("--geo-legend-height", `${height}px`);
        };

        const observer = new ResizeObserver(updateLegendHeight);

        observer.observe(legend);
        updateLegendHeight();

        return () => observer.disconnect();
    }, []);

    return (
        <Flex width="100vw" height="100vh" overflow="hidden">
            <Sidebar />

            <Box
                ref={shellRef}
                className={panelOpen ? "geo-map-shell geo-map-shell--details" : "geo-map-shell"}
                style={
                    {
                        "--geo-floating-right": floatingRight,
                    } as CSSProperties
                }
                position="relative"
                flex="1"
                minWidth="0"
                minHeight="0"
            >
                <MapView />

                <Box
                    position="absolute"
                    top="12px"
                    right={floatingRight}
                    zIndex={20}
                    transition="right 260ms ease"
                >
                    <TopControls />
                </Box>

                <Box
                    position="absolute"
                    top="56px"
                    right={floatingRight}
                    zIndex={20}
                    transition="right 260ms ease"
                >
                    <MapControls />
                </Box>

                <Box
                    ref={legendRef}
                    position="absolute"
                    right={floatingRight}
                    bottom={panelOpen ? "12px" : "44px"}
                    zIndex={20}
                    maxWidth="calc(100% - 24px)"
                    transition="right 260ms ease, bottom 260ms ease"
                >
                    <MapLegend />
                </Box>

                {panelOpen && (
                    <Box
                        position="absolute"
                        top="12px"
                        right="12px"
                        bottom="12px"
                        width={PANEL_WIDTH}
                        minHeight="0"
                        zIndex={19}
                    >
                        <PlumeDetailsPanel />
                    </Box>
                )}
            </Box>
        </Flex>
    );
}
