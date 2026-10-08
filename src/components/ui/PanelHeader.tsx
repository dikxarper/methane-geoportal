import type { ReactNode } from "react";
import { Flex, Text } from "@chakra-ui/react";

import { ui } from "../../theme/tokens";

interface PanelHeaderProps {
    children: ReactNode;
}

export function PanelHeader({ children }: PanelHeaderProps) {
    return (
        <Flex
            height="36px"
            align="center"
            px="10px"
            bg={ui.colors.panel}
            border="1px solid"
            borderColor={ui.colors.borderLight}
            borderRadius={ui.radius.md}
        >
            <Text fontSize="14px" fontWeight="700">
                {children}
            </Text>
        </Flex>
    );
}
