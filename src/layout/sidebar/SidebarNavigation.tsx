import { Box, Flex } from "@chakra-ui/react";
import { ChevronLeft, Cloud, Factory, MapPin, Map as MapIcon } from "lucide-react";

import { SidebarIconButton } from "../../components/ui/SidebarIconButton";
import { ui } from "../../theme/tokens";

export type SidebarTab = "area" | "point" | "infrastructure" | "admin";

interface SidebarNavigationProps {
    activeTab: SidebarTab;
    onChange: (tab: SidebarTab) => void;
}

const navigationItems = [
    {
        id: "area",
        label: "Площадные потоки",
        icon: Cloud,
    },
    {
        id: "point",
        label: "Точечные источники",
        icon: MapPin,
    },
    {
        id: "infrastructure",
        label: "Инфраструктура",
        icon: Factory,
    },
    {
        id: "admin",
        label: "Административные слои",
        icon: MapIcon,
    },
] satisfies Array<{
    id: SidebarTab;
    label: string;
    icon: typeof Cloud;
    disabled?: boolean;
}>;

export function SidebarNavigation({ activeTab, onChange }: SidebarNavigationProps) {
    return (
        <Flex
            width={ui.sizes.navigationWidth}
            minWidth={ui.sizes.navigationWidth}
            direction="column"
            align="center"
            borderRight="1px solid"
            borderColor={ui.colors.border}
            py="8px"
        >
            <Flex direction="column" gap="8px">
                {navigationItems.map((item) => (
                    <SidebarIconButton
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={activeTab === item.id}
                        onClick={() => onChange(item.id)}
                    />
                ))}
            </Flex>

            <Box flex="1" />

            <Box mb="1px">
                <SidebarIconButton icon={ChevronLeft} label="Свернуть панель" />
            </Box>
        </Flex>
    );
}
