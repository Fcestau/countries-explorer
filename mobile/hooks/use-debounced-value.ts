import { useEffect, useMemo, useState } from 'react';
import { debounce, SEARCH_DEBOUNCE_MS } from 'shared';

export function useDebouncedValue<T>(value: T, delayMs: number = SEARCH_DEBOUNCE_MS): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedSetter = useMemo(
    () => debounce((next: T) => setDebouncedValue(next), delayMs),
    [delayMs],
  );

  useEffect(() => {
    debouncedSetter(value);
    return () => debouncedSetter.cancel();
  }, [value, debouncedSetter]);

  return debouncedValue;
}
