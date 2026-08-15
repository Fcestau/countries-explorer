import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, es } from "shared";

export const SUPPORTED_LANGUAGES = ["en", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_STORAGE_KEY = "language";

function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value ?? "");
}

/**
 * Solo se debe llamar client-side (desde un useEffect): localStorage y
 * navigator no existen durante el render en el servidor.
 */
function detectInitialLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isSupportedLanguage(stored)) {
    return stored;
  }
  return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

// Init síncrono con un idioma neutro: no toca APIs de browser a nivel de
// módulo, así no rompe el render en el servidor. La detección real ocurre en
// initI18nLanguage(), llamada una sola vez desde el provider client-side.
if (!i18next.isInitialized) {
  i18next.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });
}

export function initI18nLanguage(): void {
  i18next.changeLanguage(detectInitialLanguage());
}

export function changeLanguage(language: SupportedLanguage): void {
  i18next.changeLanguage(language);
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export default i18next;
