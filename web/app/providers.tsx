"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { initI18nLanguage } from "@/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    initI18nLanguage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-3">
        <span className="text-xs text-foreground/50">{t("common.madeBy", { name: "Felipe Cestau" })}</span>
        <LanguageSwitcher />
      </header>
      {children}
    </QueryClientProvider>
  );
}
