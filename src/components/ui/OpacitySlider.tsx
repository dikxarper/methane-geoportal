import { Flex, Slider, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { ui } from "../../theme/tokens";

interface OpacitySliderProps {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
}

export function OpacitySlider({ value, onChange, disabled = false }: OpacitySliderProps) {
    const { t } = useTranslation();

    return (
        <Flex direction="column" gap="7px" width="100%" opacity={disabled ? 0.45 : 1}>
            <Flex align="center" justify="space-between">
                <Text fontSize="11px" color={ui.colors.textMuted}>
                    {t("common.opacity")}
                </Text>

                <Text fontSize="11px" color={ui.colors.textMuted}>
                    {value}%
                </Text>
            </Flex>

            <Slider.Root
                min={0}
                max={100}
                step={1}
                value={[value]}
                disabled={disabled}
                onValueChange={(details) => {
                    const nextValue = details.value[0];

                    if (nextValue !== undefined) {
                        onChange(nextValue);
                    }
                }}
            >
                <Slider.Control>
                    <Slider.Track height="4px" bg={ui.colors.borderLight} borderRadius="999px">
                        <Slider.Range bg={ui.colors.accent} />
                    </Slider.Track>

                    <Slider.Thumb
                        index={0}
                        width="12px"
                        height="12px"
                        bg={ui.colors.accent}
                        border="2px solid"
                        borderColor={ui.colors.panel}
                    >
                        <Slider.HiddenInput />
                    </Slider.Thumb>
                </Slider.Control>
            </Slider.Root>
        </Flex>
    );
}
