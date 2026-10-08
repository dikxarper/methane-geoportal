import { Box, Flex, Text } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";

import { ui } from "../../theme/tokens";
import { LayerToggle } from "./LayerToggle";

interface LayerListItemProps {
    label: string;
    icon: LucideIcon;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
}

export function LayerListItem({
    label,
    icon: Icon,
    enabled,
    onChange,
    disabled = false,
}: LayerListItemProps) {
    return (
        <Flex
            minHeight="40px"
            align="center"
            justify="space-between"
            gap="10px"
            px="9px"
            py="6px"
            borderBottom="1px solid"
            borderColor={ui.colors.border}
            opacity={disabled ? 0.5 : 1}
        >
            <Flex align="center" gap="8px" minWidth="0">
                <Flex
                    width="26px"
                    height="26px"
                    align="center"
                    justify="center"
                    flexShrink={0}
                    borderRadius={ui.radius.sm}
                    bg={ui.colors.panelDark}
                    color={ui.colors.textMuted}
                >
                    <Icon size={14} strokeWidth={1.7} />
                </Flex>

                <Box minWidth="0">
                    <Text fontSize="12px" lineHeight="1.35" color={ui.colors.text}>
                        {label}
                    </Text>
                </Box>
            </Flex>

            <LayerToggle checked={enabled} onChange={onChange} disabled={disabled} />
        </Flex>
    );
}
