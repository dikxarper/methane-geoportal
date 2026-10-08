import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./en";
import { ru } from "./ru";

export type AppLanguage = "ru" | "en";

const STORAGE_KEY = "locale";

function getInitialLanguage(): AppLanguage {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "EN" || saved === "en") {
        return "en";
    }

    return "ru";
}

const initialLanguage = getInitialLanguage();

void i18n.use(initReactI18next).init({
    resources: {
        ru: {
            translation: ru,
        },
        en: {
            translation: en,
        },
    },

    lng: initialLanguage,
    fallbackLng: "ru",
    supportedLngs: ["ru", "en"],

    interpolation: {
        escapeValue: false,
    },

    react: {
        useSuspense: false,
    },
});

function applyLanguage(language: string) {
    const normalized: AppLanguage = language.startsWith("en") ? "en" : "ru";

    localStorage.setItem(STORAGE_KEY, normalized === "en" ? "EN" : "RU");
    document.documentElement.lang = normalized;
}

applyLanguage(initialLanguage);

i18n.on("languageChanged", applyLanguage);

export default i18n;
