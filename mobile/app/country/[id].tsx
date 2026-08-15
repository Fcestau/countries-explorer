import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { formatPopulation, getLocalizedCountryName } from 'shared';

import { CountryFlag } from '@/components/country-flag';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useCountry } from '@/hooks/use-country';

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <ThemedText>{value}</ThemedText>
    </View>
  );
}

export default function CountryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { country, isPending, isError, refetch } = useCountry(id);
  const { t, i18n } = useTranslation();

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  if (!country) {
    return <EmptyState />;
  }

  const displayName = getLocalizedCountryName(country, i18n.language);
  const displayRegion = t(`regions.${country.region}`, { defaultValue: country.region });

  return (
    <ThemedView style={styles.screen}>
      <Stack.Screen options={{ title: displayName }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.flag}>
          <CountryFlag
            uri={country.flagSvg}
            width={160}
            height={112}
            accessibilityLabel={t('detail.flagAccessibilityLabel', { name: displayName })}
          />
        </View>
        <ThemedText type="title" style={styles.name}>
          {displayName}
        </ThemedText>
        <View style={styles.details}>
          <DetailRow label={t('detail.capital')} value={country.capital} />
          <DetailRow label={t('detail.population')} value={formatPopulation(country.population)} />
          <DetailRow label={t('detail.region')} value={displayRegion} />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  flag: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  name: {
    textAlign: 'center',
  },
  details: {
    width: '100%',
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#9BA1A6',
  },
});
