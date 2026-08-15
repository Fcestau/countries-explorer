"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { formatPopulation } from "shared";

import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { useCountry } from "@/hooks/useCountry";

export default function CountryDetailPage() {
  const params = useParams<{ id: string }>();
  const { country, isPending, isError, refetch } = useCountry(params.id);
  const { t } = useTranslation();

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  if (!country) {
    return <EmptyState />;
  }

  const region = t(`regions.${country.region}`, { defaultValue: country.region });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-10">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        {t("detail.backToList")}
      </Link>

      <div className="flex flex-col items-center gap-4 text-center">
        {country.flagPng ? (
          <Image
            src={country.flagPng}
            alt={t("detail.flagAccessibilityLabel", { name: country.name })}
            width={200}
            height={140}
            className="h-35 w-50 rounded-lg object-cover"
            priority
          />
        ) : (
          <div className="h-35 w-50 rounded-lg bg-black/5" />
        )}
        <h1 className="text-3xl font-semibold">{country.name}</h1>
      </div>

      <dl className="divide-y divide-black/10">
        <div className="flex justify-between py-3">
          <dt className="font-medium">{t("detail.capital")}</dt>
          <dd>{country.capital}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="font-medium">{t("detail.population")}</dt>
          <dd>{formatPopulation(country.population)}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="font-medium">{t("detail.region")}</dt>
          <dd>{region}</dd>
        </div>
      </dl>
    </main>
  );
}
