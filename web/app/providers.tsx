"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { initI18nLanguage } from "@/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    initI18nLanguage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <header className="flex justify-end border-b border-black/10 bg-white px-6 py-3">
        <LanguageSwitcher />
      </header>
      {children}
    </QueryClientProvider>
  );
}
