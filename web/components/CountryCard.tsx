"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { formatPopulation, getLocalizedCountryName, type Country } from "shared";

function CountryCardComponent({ country }: { country: Country }) {
  const { t, i18n } = useTranslation();
  const name = getLocalizedCountryName(country, i18n.language);
  const region = t(`regions.${country.region}`, { defaultValue: country.region });

  return (
    <Link
      href={`/country/${country.uuid}`}
      className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {country.flagPng ? (
        <Image
          src={country.flagPng}
          alt={t("detail.flagAccessibilityLabel", { name })}
          width={64}
          height={44}
          className="h-11 w-16 rounded object-cover"
        />
      ) : (
        <div className="h-11 w-16 rounded bg-black/5" />
      )}
      <h2 className="font-semibold">{name}</h2>
      <dl className="space-y-0.5 text-sm text-foreground/70">
        <div>
          <dt className="inline font-medium">{t("detail.capital")}: </dt>
          <dd className="inline">{country.capital}</dd>
        </div>
        <div>
          <dt className="inline font-medium">{t("detail.population")}: </dt>
          <dd className="inline">{formatPopulation(country.population)}</dd>
        </div>
        <div>
          <dt className="inline font-medium">{t("detail.region")}: </dt>
          <dd className="inline">{region}</dd>
        </div>
      </dl>
    </Link>
  );
}

export const CountryCard = memo(CountryCardComponent);
