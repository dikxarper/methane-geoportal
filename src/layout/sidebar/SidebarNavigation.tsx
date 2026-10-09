import { Flex } from "@chakra-ui/react";
import { Cloud, Factory, MapPin, Map as MapIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

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
        labelKey: "sidebar.areaFlux",
        icon: Cloud,
        disabled: false,
    },
    {
        id: "point",
        labelKey: "sidebar.pointSources",
        icon: MapPin,
        disabled: false,
    },
    {
        id: "infrastructure",
        labelKey: "sidebar.infrastructure",
        icon: Factory,
        disabled: false,
    },
    {
        id: "admin",
        labelKey: "sidebar.admin",
        icon: MapIcon,
        disabled: true,
    },
] as const;

export function SidebarNavigation({ activeTab, onChange }: SidebarNavigationProps) {
    const { t } = useTranslation();

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
                        label={t(item.labelKey)}
                        active={activeTab === item.id}
                        disabled={item.disabled}
                        onClick={() => {
                            if (!item.disabled) {
                                onChange(item.id);
                            }
                        }}
                    />
                ))}
            </Flex>
        </Flex>
    );
}
