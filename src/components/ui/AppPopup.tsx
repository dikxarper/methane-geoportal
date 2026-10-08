import { Box, IconButton, Text } from "@chakra-ui/react";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";

interface AppPopupProps {
    title: ReactNode;
    subtitle?: ReactNode;
    children: ReactNode;
    onClose: () => void;
    width?: string;
}

export function AppPopup({ title, subtitle, children, onClose, width = "176px" }: AppPopupProps) {
    const { t } = useTranslation();

    return (
        <Box
            width={width}
            p="10px"
            bg={ui.colors.control}
            color={ui.colors.controlText}
            border="1px solid"
            borderColor={ui.colors.controlBorder}
            borderRadius="8px"
            boxShadow="0 6px 20px rgba(0, 0, 0, 0.25)"
        >
            <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap="6px">
                <Box minWidth="0">
                    <Text fontSize="11px" fontWeight="600">
                        {title}
                    </Text>

                    {subtitle && (
                    <Text mt="1px" fontSize="9px" color={ui.colors.textMuted}>
                            {subtitle}
                        </Text>
                    )}
                </Box>

                <IconButton
                    aria-label={t("common.close")}
                    variant="ghost"
                    size="xs"
                    minW="22px"
                    w="22px"
                    h="22px"
                    color={ui.colors.controlText}
                    _hover={{
                        bg: ui.colors.controlHover,
                    }}
                    onClick={onClose}
                >
                    <X size={13} />
                </IconButton>
            </Box>

            <Box mt="8px" pt="8px" borderTop="1px solid" borderColor={ui.colors.controlBorder}>
                {children}
            </Box>
        </Box>
    );
}
