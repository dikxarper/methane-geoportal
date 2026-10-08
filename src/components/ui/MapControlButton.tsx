import { IconButton, Portal, Tooltip, type IconButtonProps } from "@chakra-ui/react";

import { ui } from "../../theme/tokens";

interface MapControlButtonProps extends Omit<IconButtonProps, "aria-label"> {
    label: string;
    tooltip?: string;
    children: React.ReactNode;
}

export function MapControlButton({ label, tooltip, children, ...props }: MapControlButtonProps) {
    const button = (
        <IconButton
            aria-label={label}
            width={ui.sizes.mapControlButton}
            height={ui.sizes.mapControlButton}
            minWidth={ui.sizes.mapControlButton}
            bg={ui.colors.control}
            color={ui.colors.controlText}
            border="1px solid"
            borderColor={ui.colors.controlBorder}
            borderRadius={ui.radius.md}
            boxShadow="0 1px 4px rgba(0, 0, 0, 0.18)"
            _hover={{
                bg: ui.colors.controlHover,
            }}
            _active={{
                bg: ui.colors.controlActive,
            }}
            _disabled={{
                opacity: 0.45,
                cursor: "not-allowed",
            }}
            {...props}
        >
            {children}
        </IconButton>
    );

    if (!tooltip) {
        return button;
    }

    return (
        <Tooltip.Root
            openDelay={350}
            positioning={{
                placement: "left",
            }}
        >
            <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>

            <Portal>
                <Tooltip.Positioner>
                    <Tooltip.Content>{tooltip}</Tooltip.Content>
                </Tooltip.Positioner>
            </Portal>
        </Tooltip.Root>
    );
}
