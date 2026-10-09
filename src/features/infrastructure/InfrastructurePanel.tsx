import { useState } from "react";
import { Box, Flex, Text, IconButton, Portal, Tooltip } from "@chakra-ui/react";
import { CircleHelp } from "lucide-react";
import { useTranslation } from "react-i18next";

import { LayerToggle } from "../../components/ui/LayerToggle";
import { PanelHeader } from "../../components/ui/PanelHeader";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { ui } from "../../theme/tokens";

import { useMapController } from "../map/useMapController";
import type { InfrastructureLayersOptions } from "../map/mapContext";

import { LANDFILL_COLOR, OIL_GAS_CATEGORIES, PIPELINE_COLOR, type OilGasCategory } from "./config";

type Shape = "point" | "line" | "polygon";

interface LayerRowProps {
    label: string;
    color: string;
    shape: Shape;
    checked: boolean;
    hint?: string;
    onChange: (checked: boolean) => void;
}

const INITIAL: InfrastructureLayersOptions = {
    oilGasInfrastructure: false,
    oilGasCategories: {},
    oilGasPipelines: false,
    landfills: false,
};

function LayerRow({ label, color, shape, checked, hint, onChange }: LayerRowProps) {
    return (
        <Flex
            minHeight="40px"
            align="center"
            justify="space-between"
            gap="10px"
            px="10px"
            py="6px"
            borderBottom="1px solid"
            borderColor={ui.colors.border}
        >
            <Flex align="center" gap="9px" minW="0">
                <Box
                    width="20px"
                    flexShrink={0}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                >
                    {shape === "point" ? (
                        <Box width="10px" height="10px" borderRadius="full" bg={color} />
                    ) : shape === "line" ? (
                        <Box width="18px" height="3px" borderRadius="full" bg={color} />
                    ) : (
                        <Box
                            width="16px"
                            height="12px"
                            bg="rgba(174, 136, 220, 0.20)"
                            border="2px solid"
                            borderColor={color}
                            borderRadius="2px"
                        />
                    )}
                </Box>

                <Flex align="center" gap="4px" minWidth="0">
                    <Text fontSize="12px" lineHeight="1.35" color={ui.colors.text}>
                        {label}
                    </Text>

                    {hint && (
                        <Tooltip.Root openDelay={200} positioning={{ placement: "top" }}>
                            <Tooltip.Trigger asChild>
                                <IconButton
                                    type="button"
                                    aria-label={hint}
                                    variant="plain"
                                    size="xs"
                                    minW="18px"
                                    w="18px"
                                    h="18px"
                                    p="0"
                                    flexShrink={0}
                                    color={ui.colors.textMuted}
                                    bg="transparent"
                                >
                                    <CircleHelp size={12} />
                                </IconButton>
                            </Tooltip.Trigger>

                            <Portal>
                                <Tooltip.Positioner>
                                    <Tooltip.Content>{hint}</Tooltip.Content>
                                </Tooltip.Positioner>
                            </Portal>
                        </Tooltip.Root>
                    )}
                </Flex>
            </Flex>

            <LayerToggle checked={checked} onChange={onChange} />
        </Flex>
    );
}

export function InfrastructurePanel() {
    const { t } = useTranslation();
    const { updateInfrastructureLayers } = useMapController();

    const [layers, setLayers] = useState<InfrastructureLayersOptions>(INITIAL);

    const update = (next: InfrastructureLayersOptions) => {
        setLayers(next);
        updateInfrastructureLayers(next);
    };

    const toggleCategory = (category: OilGasCategory, checked: boolean) => {
        const oilGasCategories = {
            ...layers.oilGasCategories,
            [category]: checked,
        };

        update({
            ...layers,
            oilGasCategories,
            oilGasInfrastructure: Object.values(oilGasCategories).some(Boolean),
        });
    };

    const toggleOther = (key: "oilGasPipelines" | "landfills", checked: boolean) => {
        update({
            ...layers,
            [key]: checked,
        });
    };

    return (
        <Box>
            <PanelHeader>{t("infrastructure.title")}</PanelHeader>

            <Box mt="12px">
                <SectionTitle>{t("infrastructure.oilGas")}</SectionTitle>

                <Box
                    overflow="hidden"
                    border="1px solid"
                    borderColor={ui.colors.border}
                    borderRadius={ui.radius.md}
                    bg={ui.colors.panel}
                >
                    {OIL_GAS_CATEGORIES.map((category) => (
                        <LayerRow
                            key={category.id}
                            label={t(category.labelKey)}
                            color={category.color}
                            shape="point"
                            checked={layers.oilGasCategories?.[category.id] === true}
                            hint={
                                category.id === "CRUDE OIL REFINERIES"
                                    ? t("infrastructure.hints.refineries")
                                    : category.id === "LNG FACILITIES"
                                      ? t("infrastructure.hints.lng")
                                      : undefined
                            }
                            onChange={(checked) => toggleCategory(category.id, checked)}
                        />
                    ))}

                    <LayerRow
                        label={t("infrastructure.layers.oilGasPipelines")}
                        color={PIPELINE_COLOR}
                        shape="line"
                        checked={layers.oilGasPipelines}
                        onChange={(checked) => toggleOther("oilGasPipelines", checked)}
                    />
                </Box>
            </Box>

            <Box mt="16px">
                <SectionTitle>{t("infrastructure.other")}</SectionTitle>

                <Box
                    overflow="hidden"
                    border="1px solid"
                    borderColor={ui.colors.border}
                    borderRadius={ui.radius.md}
                    bg={ui.colors.panel}
                >
                    <LayerRow
                        label={t("infrastructure.layers.landfills")}
                        color={LANDFILL_COLOR}
                        shape="polygon"
                        checked={layers.landfills}
                        hint={t("infrastructure.hints.landfills")}
                        onChange={(checked) => toggleOther("landfills", checked)}
                    />
                </Box>
            </Box>
        </Box>
    );
}
