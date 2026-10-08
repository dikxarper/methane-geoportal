import type { LucideIcon } from "lucide-react";
import { Flex, Text } from "@chakra-ui/react";

import { ui } from "../../theme/tokens";

interface EmptyPanelStateProps {
    icon: LucideIcon;
    text: string;
}

export function EmptyPanelState({ icon: Icon, text }: EmptyPanelStateProps) {
    return (
        <Flex
            mt="12px"
            height="120px"
            align="center"
            justify="center"
            border="1px dashed"
            borderColor={ui.colors.borderLight}
            borderRadius={ui.radius.md}
            color={ui.colors.textMuted}
        >
            <Flex direction="column" align="center" gap="8px">
                <Icon size={20} />

                <Text fontSize="13px">{text}</Text>
            </Flex>
        </Flex>
    );
}
