import { Box, Spinner, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { AppPopup } from "../../components/ui/AppPopup";
import { ui } from "../../theme/tokens";

interface S5PPixelPopupProps {
    date: string | null;
    year: number | null;
    loading: boolean;
    value: number | null;
    error: boolean;
    onClose: () => void;
}

function formatDate(date: string, locale: string) {
    const [year, month, day] = date.split("-").map(Number);

    return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function S5PPixelPopup({ date, year, loading, value, error, onClose }: S5PPixelPopupProps) {
    const { t, i18n } = useTranslation();

    const locale = i18n.resolvedLanguage?.startsWith("en") ? "en-US" : "ru-RU";

    const formattedValue =
        value !== null
            ? new Intl.NumberFormat(locale, {
                  maximumFractionDigits: 1,
              }).format(value)
            : null;

    return (
        <AppPopup
            title={t(year === null ? "map.pixel.title" : "map.pixel.annualTitle")}
            subtitle={year === null ? (date ? formatDate(date, locale) : undefined) : String(year)}
            onClose={onClose}
        >
            <Text fontSize="10px" color={ui.colors.textMuted}>
                {t("map.pixel.methane")}
            </Text>

            {loading && (
                <Box mt="4px" display="flex" alignItems="center" gap="6px">
                    <Spinner size="xs" />

                    <Text fontSize="12px">{t("map.pixel.loading")}</Text>
                </Box>
            )}

            {!loading && error && (
                <Text mt="4px" fontSize="11px" color="red.400">
                    {t("map.pixel.loadError")}
                </Text>
            )}

            {!loading && !error && formattedValue !== null && (
                <Text mt="2px" fontSize="18px" fontWeight="700">
                    {formattedValue}{" "}
                    <Text as="span" fontSize="11px" fontWeight="500" color={ui.colors.textMuted}>
                        {t("map.pixel.unit")}
                    </Text>
                </Text>
            )}

            {!loading && !error && formattedValue === null && (
                <Text mt="4px" fontSize="12px" color={ui.colors.textMuted}>
                    {t("map.pixel.noData")}
                </Text>
            )}
        </AppPopup>
    );
}
