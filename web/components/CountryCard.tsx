import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { formatPopulation, type Country } from "shared";

function CountryCardComponent({ country }: { country: Country }) {
  return (
    <Link
      href={`/country/${country.uuid}`}
      className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-4 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {country.flagPng ? (
        <Image
          src={country.flagPng}
          alt={`Flag of ${country.name}`}
          width={64}
          height={44}
          className="h-11 w-16 rounded object-cover"
        />
      ) : (
        <div className="h-11 w-16 rounded bg-black/5" />
      )}
      <h2 className="font-semibold">{country.name}</h2>
      <dl className="space-y-0.5 text-sm text-foreground/70">
        <div>
          <dt className="inline font-medium">Capital: </dt>
          <dd className="inline">{country.capital}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Population: </dt>
          <dd className="inline">{formatPopulation(country.population)}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Region: </dt>
          <dd className="inline">{country.region}</dd>
        </div>
      </dl>
    </Link>
  );
}

export const CountryCard = memo(CountryCardComponent);
