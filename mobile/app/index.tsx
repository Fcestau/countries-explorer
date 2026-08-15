import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { filterCountriesByName, type Country } from 'shared';

import { CountryCard } from '@/components/country-card';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { SearchBar } from '@/components/search-bar';
import { useCountries } from '@/hooks/use-countries';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

export default function CountriesListScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const { data, isPending, isError, refetch } = useCountries();

  const filteredCountries = useMemo(
    () => filterCountriesByName(data ?? [], debouncedQuery),
    [data, debouncedQuery],
  );

  const keyExtractor = useCallback((item: Country) => item.id, []);
  const renderItem = useCallback(({ item }: { item: Country }) => <CountryCard country={item} />, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <SearchBar value={query} onChangeText={setQuery} />

      {isPending ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : filteredCountries.length === 0 ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredCountries}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={20}
          windowSize={7}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
