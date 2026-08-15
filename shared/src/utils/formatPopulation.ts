export function formatPopulation(population: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(population);
}
