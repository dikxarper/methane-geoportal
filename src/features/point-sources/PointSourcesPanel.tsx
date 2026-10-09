import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LayerCard } from "../../components/ui/LayerCard";
import { PanelHeader } from "../../components/ui/PanelHeader";
import { PlumeGroupList } from "./PlumeGroupList";
import { usePointSources } from "./usePointSources";
import { previewPlumeOpacity } from "../map/plumeOpacityPreview";

export function PointSourcesPanel() {
    const { t } = useTranslation();
    const { enabled, setEnabled, opacity, setOpacity } = usePointSources();

    return (
        <Box>
            <PanelHeader>{t("pointSources.title")}</PanelHeader>

            <Box mt="12px">
                <LayerCard
                    title={t("pointSources.groups")}
                    description={t("pointSources.description")}
                    enabled={enabled}
                    onEnabledChange={setEnabled}
                    opacity={opacity}
                    onOpacityChange={setOpacity}
                    onOpacityPreview={previewPlumeOpacity}
                >
                    <PlumeGroupList />
                </LayerCard>
            </Box>
        </Box>
    );
}
