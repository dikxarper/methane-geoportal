import { Box, Flex } from "@chakra-ui/react";

import { ui } from "../../theme/tokens";
import { BrandLogo } from "../../components/ui/BrandLogo";

export function SidebarHeader() {
    return (
        <Flex
            height={ui.sizes.headerHeight}
            minHeight={ui.sizes.headerHeight}
            align="center"
            justify="space-between"
            px="12px"
            borderBottom="1px solid"
            borderColor={ui.colors.border}
        >
            <Flex align="center" gap="8px">
                <BrandLogo variant="full" height="26px" />
            </Flex>

            <Box
                px="12px"
                py="8px"
                border="1px solid"
                borderColor={ui.colors.borderLight}
                borderRadius={ui.radius.md}
                bg={ui.colors.panelDark}
                fontSize="12px"
                fontWeight="600"
            >
                О нас
            </Box>
        </Flex>
    );
}
