"use client";

import { useTranslation } from "react-i18next";

type ErrorStateProps = {
  onRetry: () => void;
};

export function ErrorState({ onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-foreground/70">{t("states.errorMessage")}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {t("common.retry")}
      </button>
    </div>
  );
}
