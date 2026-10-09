import { Box, Flex } from "@chakra-ui/react";

import { AreaFluxPanel } from "../../features/area-flux/AreaFluxPanel";
import { AdminLayersPanel } from "../../features/admin-layers/AdminLayersPanel";
import { InfrastructurePanel } from "../../features/infrastructure/InfrastructurePanel";
import { PointSourcesPanel } from "../../features/point-sources/PointSourcesPanel";
import { useStoredState } from "../../hooks/useStoredState";
import { ui } from "../../theme/tokens";

import { SidebarHeader } from "./SidebarHeader";
import { SidebarNavigation, type SidebarTab } from "./SidebarNavigation";

export function Sidebar() {
    const [activeTab, setActiveTab] = useStoredState<SidebarTab>("sidebar-tab", "area");

    return (
        <Flex
            width={ui.sizes.sidebarWidth}
            minWidth={ui.sizes.sidebarWidth}
            height="100vh"
            bg={ui.colors.sidebar}
            color={ui.colors.text}
            borderRight="1px solid"
            borderColor={ui.colors.border}
            direction="column"
        >
            <SidebarHeader />

            <Flex flex="1" minHeight="0">
                <SidebarNavigation activeTab={activeTab} onChange={setActiveTab} />

                <Box
                    flex="1"
                    minWidth="0"
                    overflowY="auto"
                    px={ui.spacing.panelX}
                    py={ui.spacing.panelY}
                    css={{
                        scrollbarGutter: "stable",
                    }}
                >
                    <Box display={activeTab === "area" ? "block" : "none"}>
                        <AreaFluxPanel />
                    </Box>

                    <Box display={activeTab === "point" ? "block" : "none"}>
                        <PointSourcesPanel />
                    </Box>

                    <Box display={activeTab === "infrastructure" ? "block" : "none"}>
                        <InfrastructurePanel />
                    </Box>

                    <Box display={activeTab === "admin" ? "block" : "none"}>
                        <AdminLayersPanel />
                    </Box>
                </Box>
            </Flex>
        </Flex>
    );
}
