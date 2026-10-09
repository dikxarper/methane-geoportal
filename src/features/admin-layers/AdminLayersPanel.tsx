import { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { LayerCard } from "../../components/ui/LayerCard";
import { PanelHeader } from "../../components/ui/PanelHeader";
import { useStoredState } from "../../hooks/useStoredState";
import { useMapController } from "../map/useMapController";

export function AdminLayersPanel() {
    const { t } = useTranslation();
    const { updateAdministrativeLayers } = useMapController();

    const [countryVisible, setCountryVisible] = useStoredState("admin-countryVisible", false);
    const [countryOpacity, setCountryOpacity] = useStoredState("admin-countryOpacity", 100);

    const [regionsVisible, setRegionsVisible] = useStoredState("admin-regionsVisible", false);
    const [regionsOpacity, setRegionsOpacity] = useStoredState("admin-regionsOpacity", 100);

    const [districtsVisible, setDistrictsVisible] = useStoredState("admin-districtsVisible", false);
    const [districtsOpacity, setDistrictsOpacity] = useStoredState("admin-districtsOpacity", 100);

    useEffect(() => {
        updateAdministrativeLayers({
            countryVisible,
            countryOpacity: countryOpacity / 100,
            regionsVisible,
            regionsOpacity: regionsOpacity / 100,
            districtsVisible,
            districtsOpacity: districtsOpacity / 100,
        });
    }, [
        countryVisible,
        countryOpacity,
        regionsVisible,
        regionsOpacity,
        districtsVisible,
        districtsOpacity,
        updateAdministrativeLayers,
    ]);

    return (
        <Box>
            <PanelHeader>{t("adminLayers.title")}</PanelHeader>

            <Box mt="10px" display="flex" flexDirection="column" gap="10px">
                <LayerCard
                    title={t("adminLayers.country.title")}
                    description={t("adminLayers.country.description")}
                    enabled={countryVisible}
                    onEnabledChange={setCountryVisible}
                    opacity={countryOpacity}
                    onOpacityChange={setCountryOpacity}
                />

                <LayerCard
                    title={t("adminLayers.regions.title")}
                    description={t("adminLayers.regions.description")}
                    enabled={regionsVisible}
                    onEnabledChange={setRegionsVisible}
                    opacity={regionsOpacity}
                    onOpacityChange={setRegionsOpacity}
                />

                <LayerCard
                    title={t("adminLayers.districts.title")}
                    description={t("adminLayers.districts.description")}
                    enabled={districtsVisible}
                    onEnabledChange={setDistrictsVisible}
                    opacity={districtsOpacity}
                    onOpacityChange={setDistrictsOpacity}
                />
            </Box>
        </Box>
    );
}
