import type { ReactNode } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

import { ui } from "../../theme/tokens";
import { LayerToggle } from "./LayerToggle";
import { OpacitySlider } from "./OpacitySlider";

interface LayerCardProps {
    title: string;
    description?: string;
    enabled: boolean;
    onEnabledChange: (value: boolean) => void;
    opacity: number;
    onOpacityChange: (value: number) => void;
    onOpacityPreview?: (value: number) => void;
    children?: ReactNode;
}

export function LayerCard({
    title,
    description,
    enabled,
    onEnabledChange,
    opacity,
    onOpacityChange,
    onOpacityPreview,
    children,
}: LayerCardProps) {
    return (
        <Box
            border="1px solid"
            borderColor={ui.colors.border}
            borderRadius={ui.radius.md}
            bg={ui.colors.panel}
            overflow="hidden"
        >
            <Flex px="10px" py="10px" align="flex-start" justify="space-between" gap="10px">
                <Box minWidth="0">
                    <Text fontSize="13px" fontWeight="600">
                        {title}
                    </Text>

                    {description && (
                        <Text mt="3px" fontSize="11px" lineHeight="1.4" color={ui.colors.textMuted}>
                            {description}
                        </Text>
                    )}
                </Box>

                <LayerToggle checked={enabled} onChange={onEnabledChange} />
            </Flex>

            <Box px="10px" pb="10px">
                <OpacitySlider
                    value={opacity}
                    onChange={onOpacityChange}
                    onPreview={onOpacityPreview}
                    disabled={!enabled}
                />

                {children && <Box mt="12px">{children}</Box>}
            </Box>
        </Box>
    );
}
