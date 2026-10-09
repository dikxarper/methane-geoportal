import { Box, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { AppPopup } from "../../components/ui/AppPopup";
import { ui } from "../../theme/tokens";
import { OIL_GAS_CATEGORIES } from "../infrastructure/config";
import type { InfrastructureSelection } from "./infrastructureFeature";

interface InfrastructurePopupProps {
    selection: InfrastructureSelection;
    onClose: () => void;
}

function readText(value: unknown): string | null {
    if (typeof value === "string") {
        return value.trim() || null;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }

    return null;
}

export function InfrastructurePopup({ selection, onClose }: InfrastructurePopupProps) {
    const { t } = useTranslation();

    const properties = selection.properties;

    const category = OIL_GAS_CATEGORIES.find((item) => item.id === properties.category);

    const typeName =
        selection.kind === "facility"
            ? category
                ? t(category.labelKey)
                : t("infrastructure.layers.oilGasInfrastructure")
            : selection.kind === "pipeline"
              ? t("infrastructure.layers.oilGasPipelines")
              : t("infrastructure.layers.landfills");

    const name = readText(properties.fac_name) ?? readText(properties.fac_type) ?? typeName;

    const fields: Array<{ label: string; value: string | null }> =
        selection.kind === "landfill"
            ? [
                  {
                      label: "OSM ID",
                      value: readText(properties.osm_id),
                  },
              ]
            : [
                  {
                      label: t("infrastructure.popup.operator"),
                      value: readText(properties.operator),
                  },
                  {
                      label: t("infrastructure.popup.country"),
                      value: readText(properties.country),
                  },
                  {
                      label: t("infrastructure.popup.region"),
                      value: readText(properties.state_prov),
                  },
                  {
                      label: t("infrastructure.popup.status"),
                      value: readText(properties.fac_status),
                  },
                  {
                      label: t("infrastructure.popup.date"),
                      value: readText(properties.src_date),
                  },
                  {
                      label: "OGIM ID",
                      value: readText(properties.ogim_id),
                  },
              ];

    return (
        <AppPopup width="268px" title={name} subtitle={typeName} onClose={onClose}>
            <Box display="flex" flexDirection="column" gap="7px">
                {fields
                    .filter((field) => field.value !== null)
                    .map((field) => (
                        <Flex
                            key={field.label}
                            justify="space-between"
                            align="flex-start"
                            gap="12px"
                        >
                            <Text fontSize="10px" color={ui.colors.textMuted}>
                                {field.label}
                            </Text>

                            <Text
                                fontSize="10px"
                                textAlign="right"
                                maxWidth="60%"
                                overflowWrap="anywhere"
                            >
                                {field.value}
                            </Text>
                        </Flex>
                    ))}
            </Box>
        </AppPopup>
    );
}
