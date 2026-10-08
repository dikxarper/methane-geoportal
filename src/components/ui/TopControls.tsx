import { Flex, Text } from "@chakra-ui/react";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";
import { useAppTheme } from "../../hooks/useAppTheme";

import { MapControlButton } from "./MapControlButton";

export function TopControls() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();

    const { theme, toggleTheme } = useAppTheme();
    const { isAuthenticated, logout } = useAuth();

    const language = i18n.resolvedLanguage?.startsWith("en") ? "EN" : "RU";

    const toggleLanguage = () => {
        void i18n.changeLanguage(language === "RU" ? "en" : "ru");
    };

    const handleLogout = async () => {
        await logout();

        navigate("/login", {
            replace: true,
        });
    };

    return (
        <Flex gap="5px">
            <MapControlButton
                label={
                    language === "RU"
                        ? t("topControls.switchToEnglish")
                        : t("topControls.switchToRussian")
                }
                onClick={toggleLanguage}
            >
                <Text fontSize="10px" fontWeight="700">
                    {language}
                </Text>
            </MapControlButton>

            <MapControlButton
                label={theme === "dark" ? t("topControls.lightTheme") : t("topControls.darkTheme")}
                onClick={toggleTheme}
            >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </MapControlButton>

            {isAuthenticated && (
                <MapControlButton label={t("common.logout")} onClick={handleLogout}>
                    <LogOut size={16} />
                </MapControlButton>
            )}
        </Flex>
    );
}
