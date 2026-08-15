"use client";

import { useTranslation } from "react-i18next";
import { changeLanguage, SUPPORTED_LANGUAGES } from "@/i18n";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  return (
    <div className="flex gap-1" role="radiogroup">
      {SUPPORTED_LANGUAGES.map((language) => {
        const isActive = currentLanguage === language;
        return (
          <button
            key={language}
            type="button"
            onClick={() => changeLanguage(language)}
            role="radio"
            aria-checked={isActive}
            aria-label={t("languageSwitcher.switchTo", { language: language.toUpperCase() })}
            className={`rounded px-2.5 py-1 text-sm font-semibold ${
              isActive ? "bg-blue-600 text-white" : "text-foreground/70 hover:bg-black/5"
            }`}
          >
            {language.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
