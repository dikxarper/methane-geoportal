import { Text } from "@chakra-ui/react";

import { ui } from "../../theme/tokens";

interface SectionTitleProps {
    children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
    return (
        <Text
            mb="8px"
            fontSize="12px"
            fontWeight="600"
            textTransform="uppercase"
            letterSpacing="0.04em"
            color={ui.colors.textMuted}
        >
            {children}
        </Text>
    );
}
