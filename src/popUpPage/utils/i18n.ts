import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import english from "@/locales/englishText.json";
import korean from "@/locales/koreanText.json";

const resources = {
  en: {
    translation: english,
  },
  ko: {
    translation: korean,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ko",
    supportedLngs: ["en", "ko"],
    load: "languageOnly",
    detection: {
      order: ["navigator"],
      caches: [],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
