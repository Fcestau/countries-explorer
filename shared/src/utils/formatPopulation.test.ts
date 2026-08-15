import { formatPopulation } from './formatPopulation';

describe('formatPopulation', () => {
  it('formats large numbers with thousands separators', () => {
    expect(formatPopulation(47351567)).toBe('47,351,567');
  });

  it('formats small numbers without separators', () => {
    expect(formatPopulation(800)).toBe('800');
  });

  it('respects the provided locale', () => {
    expect(formatPopulation(47351567, 'es-ES')).toBe('47.351.567');
  });
});
