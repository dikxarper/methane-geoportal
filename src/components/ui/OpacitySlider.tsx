import { useState } from "react";
import { Flex, Slider, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { ui } from "../../theme/tokens";

interface OpacitySliderProps {
    value: number;
    onChange: (value: number) => void;
    onPreview?: (value: number) => void;
    disabled?: boolean;
}

export function OpacitySlider({
    value,
    onChange,
    onPreview,
    disabled = false,
}: OpacitySliderProps) {
    const { t } = useTranslation();
    const [draft, setDraft] = useState<number | null>(null);
    const current = draft ?? value;

    return (
        <Flex direction="column" gap="7px" width="100%" opacity={disabled ? 0.45 : 1}>
            <Flex align="center" justify="space-between">
                <Text fontSize="11px" color={ui.colors.textMuted}>
                    {t("common.opacity")}
                </Text>
                <Text fontSize="11px" color={ui.colors.textMuted}>
                    {current}%
                </Text>
            </Flex>

            <Slider.Root
                min={0}
                max={100}
                step={1}
                value={[current]}
                disabled={disabled}
                onValueChange={({ value: values }) => {
                    const next = values[0];
                    if (next === undefined) return;

                    if (onPreview) {
                        setDraft(next);
                        onPreview(next);
                    } else {
                        onChange(next);
                    }
                }}
                onValueChangeEnd={({ value: values }) => {
                    if (!onPreview) return;

                    const next = values[0] ?? current;
                    onPreview(next);
                    onChange(next);
                    setDraft(null);
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
