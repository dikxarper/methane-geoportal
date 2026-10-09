import { Box, Button, Text } from "@chakra-ui/react";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ui } from "../../../theme/tokens";
import { baseMaps, type BaseMapId } from "../config";

interface BaseMapMenuProps {
    value: BaseMapId;
    onChange: (value: BaseMapId) => void;
}

export function BaseMapMenu({ value, onChange }: BaseMapMenuProps) {
    const { t } = useTranslation();

    return (
        <Box
            position="absolute"
            right="42px"
            top="0"
            width="164px"
            overflow="hidden"
            bg={ui.colors.menu}
            border="1px solid"
            borderColor={ui.colors.controlBorder}
            borderRadius={ui.radius.md}
            boxShadow="0 6px 20px rgba(0, 0, 0, 0.24)"
        >
            {baseMaps.map((baseMap) => {
                const active = baseMap.id === value;

                return (
                    <Button
                        key={baseMap.id}
                        type="button"
                        width="100%"
                        minHeight="34px"
                        height="34px"
                        px="10px"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap="8px"
                        borderRadius="0"
                        bg={active ? ui.colors.menuHover : "transparent"}
                        color={ui.colors.menuText}
                        _hover={{
                            bg: ui.colors.menuHover,
                        }}
                        onClick={() => {
                            onChange(baseMap.id);
                        }}
                    >
                        <Text fontSize="12px" fontWeight={active ? "600" : "500"}>
                            {t(`map.basemaps.${baseMap.id}`)}
                        </Text>

                        {active && <Check size={14} />}
                    </Button>
                );
            })}
        </Box>
    );
}
