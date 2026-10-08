import { Box, Flex } from "@chakra-ui/react";

import type { ReactNode } from "react";

import { TopControls } from "../components/ui/TopControls";
import { ui } from "../theme/tokens";

export function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <Box width="100vw" minHeight="100vh" bg={ui.colors.panelDark} position="relative">
            <Box position="absolute" top="12px" right="12px" zIndex={20}>
                <TopControls />
            </Box>

            <Flex minHeight="100vh" align="center" justify="center" px="20px" py="60px">
                {children}
            </Flex>
        </Box>
    );
}
