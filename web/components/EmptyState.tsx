"use client";

import { useTranslation } from "react-i18next";

export function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-1 items-center justify-center py-24 text-foreground/70">
      <p>{t("states.emptyMessage")}</p>
    </div>
  );
}
