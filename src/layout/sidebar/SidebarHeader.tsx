import { Flex } from "@chakra-ui/react";

import { BrandLogo } from "../../components/ui/BrandLogo";
import { ui } from "../../theme/tokens";
import { AboutDialog } from "./AboutDialog";

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
            <BrandLogo variant="full" height="26px" />

            <AboutDialog />
        </Flex>
    );
}
