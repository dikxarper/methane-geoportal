import { Box } from "@chakra-ui/react";

import { ui } from "../../theme/tokens";

interface LayerToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export function LayerToggle({ checked, onChange, disabled = false }: LayerToggleProps) {
    return (
        <Box
            as="button"
            type="button"
            position="relative"
            width="38px"
            height="20px"
            minWidth="38px"
            borderRadius="999px"
            bg={checked ? ui.colors.accent : "#50586B"}
            opacity={disabled ? 0.45 : 1}
            cursor={disabled ? "not-allowed" : "pointer"}
            transition="background 0.15s ease"
            onClick={() => {
                if (!disabled) {
                    onChange(!checked);
                }
            }}
        >
            <Box
                position="absolute"
                top="3px"
                left={checked ? "21px" : "3px"}
                width="14px"
                height="14px"
                borderRadius="full"
                bg="white"
                transition="left 0.15s ease"
            />
        </Box>
    );
}
