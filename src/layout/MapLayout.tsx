import { Box, Flex } from "@chakra-ui/react";

import { TopControls } from "../components/ui/TopControls";

import { MapControls } from "../features/map/controls/MapControls";
import { MapView } from "../features/map/MapView";
import { MapLegend } from "../features/map/MapLegend";

import { Sidebar } from "./sidebar/Sidebar";

export function MapLayout() {
    return (
        <Flex width="100vw" height="100vh" overflow="hidden">
            <Sidebar />

            <Box position="relative" flex="1" minWidth="0">
                <MapView />

                <Box position="absolute" top="12px" right="12px" zIndex={20}>
                    <TopControls />
                </Box>

                <Box position="absolute" top="56px" right="12px" zIndex={20}>
                    <MapControls />
                </Box>

                <Box position="absolute" right="12px" bottom="12px" zIndex={20}>
                    <MapLegend />
                </Box>
            </Box>
        </Flex>
    );
}
