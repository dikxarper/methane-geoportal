import { Box, chakra } from "@chakra-ui/react";
import { ui } from "../../theme/tokens";

interface LayerToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export function LayerToggle({ checked, onChange, disabled = false }: LayerToggleProps) {
    return (
        <chakra.button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            position="relative"
            display="inline-flex"
            alignItems="center"
            flexShrink={0}
            width="38px"
            minWidth="38px"
            height="20px"
            minHeight="20px"
            m="0"
            p="0"
            appearance="none"
            border="none"
            borderRadius="full"
            outline="none"
            boxShadow="none"
            bg={checked ? ui.colors.accent : "#50586B"}
            opacity={disabled ? 0.45 : 1}
            cursor={disabled ? "not-allowed" : "pointer"}
            transition="background-color 150ms ease"
            _hover={{
                bg: disabled ? undefined : checked ? ui.colors.accent : "#606A7F",
            }}
            _focusVisible={{
                outline: "2px solid",
                outlineColor: ui.colors.accent,
                outlineOffset: "3px",
            }}
            onClick={() => onChange(!checked)}
        >
            <Box
                position="absolute"
                top="3px"
                left={checked ? "21px" : "3px"}
                width="14px"
                height="14px"
                borderRadius="full"
                bg="white"
                pointerEvents="none"
                transition="left 150ms ease"
            />
        </chakra.button>
    );
}
