import type { LucideIcon } from "lucide-react";
import { IconButton } from "@chakra-ui/react";

import { ui } from "../../theme/tokens";

interface SidebarIconButtonProps {
    icon: LucideIcon;
    label: string;

    active?: boolean;
    disabled?: boolean;

    onClick?: () => void;
}

export function SidebarIconButton({
    icon: Icon,
    label,
    active = false,
    disabled = false,
    onClick,
}: SidebarIconButtonProps) {
    return (
        <IconButton
            aria-label={label}
            title={disabled ? `${label} — недоступно` : label}
            disabled={disabled}
            onClick={onClick}
            width={ui.sizes.navigationButton}
            height={ui.sizes.navigationButton}
            minWidth={ui.sizes.navigationButton}
            borderRadius={ui.radius.sm}
            border="1px solid"
            borderColor={active ? ui.colors.borderActive : ui.colors.borderLight}
            bg={active ? ui.colors.buttonHover : "transparent"}
            color={disabled ? ui.colors.textDisabled : ui.colors.text}
            opacity={disabled ? 0.45 : 1}
            cursor={disabled ? "not-allowed" : "pointer"}
            _hover={{
                bg: disabled ? "transparent" : ui.colors.buttonHover,
            }}
        >
            <Icon size={16} strokeWidth={1.7} />
        </IconButton>
    );
}
