import { useState } from "react";
import { Box } from "@chakra-ui/react";

import { LayerListItem } from "../../components/ui/LayerListItem";
import { PanelHeader } from "../../components/ui/PanelHeader";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { ui } from "../../theme/tokens";

import { infrastructureLayers, type InfrastructureLayerId } from "./config";

type LayerState = Record<InfrastructureLayerId, boolean>;

const initialLayerState = Object.fromEntries(
    infrastructureLayers.map((layer) => [layer.id, false]),
) as LayerState;

export function InfrastructurePanel() {
    const [layers, setLayers] = useState<LayerState>(initialLayerState);

    const setLayerEnabled = (id: InfrastructureLayerId, enabled: boolean) => {
        setLayers((current) => ({
            ...current,
            [id]: enabled,
        }));
    };

    return (
        <Box>
            <PanelHeader>Дополнительные слои</PanelHeader>

            <Box mt="12px">
                <SectionTitle>Инфраструктура</SectionTitle>

                <Box
                    overflow="hidden"
                    border="1px solid"
                    borderColor={ui.colors.border}
                    borderRadius={ui.radius.md}
                    bg={ui.colors.panel}
                >
                    {infrastructureLayers.map((layer) => (
                        <LayerListItem
                            key={layer.id}
                            label={layer.label}
                            icon={layer.icon}
                            enabled={layers[layer.id]}
                            onChange={(enabled) => setLayerEnabled(layer.id, enabled)}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
