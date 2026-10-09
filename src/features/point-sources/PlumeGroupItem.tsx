import { Button, Flex, Text } from "@chakra-ui/react";
import { ChevronRight, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PlumeGroup } from "../../api/plumePoints";
import { ui } from "../../theme/tokens";

interface PlumeGroupItemProps {
    group: PlumeGroup;
    selected: boolean;
    onClick: () => void;
}

export function PlumeGroupItem({ group, selected, onClick }: PlumeGroupItemProps) {
    const { t } = useTranslation();

    return (
        <Button
            type="button"
            variant="ghost"
            width="100%"
            height="auto"
            minHeight="44px"
            padding="8px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap="8px"
            border="1px solid"
            borderColor={selected ? ui.colors.borderActive : ui.colors.borderLight}
            borderRadius={ui.radius.md}
            bg={selected ? ui.colors.panelDark : ui.colors.panel}
            color={ui.colors.text}
            textAlign="left"
            _hover={{ bg: ui.colors.buttonHover }}
            onClick={onClick}
        >
            <Flex align="center" minWidth="0" gap="8px">
                <MapPin size={15} />

                <Flex minWidth="0" direction="column" gap="2px">
                    <Text fontSize="12px" fontWeight="600" truncate>
                        {t("pointSources.group")} #{group.id}
                    </Text>

                    <Text fontSize="10px" color={ui.colors.textMuted}>
                        {group.observations === null
                            ? t("pointSources.unknownCount")
                            : t("pointSources.observations", {
                                  count: group.observations,
                              })}
                    </Text>
                </Flex>
            </Flex>

            <ChevronRight size={15} />
        </Button>
    );
}
