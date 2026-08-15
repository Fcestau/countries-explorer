import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Country } from 'shared';

import { ThemedText } from '@/components/themed-text';

type CountryCardProps = {
  country: Country;
};

function CountryCardComponent({ country }: CountryCardProps) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: country.flagPng }}
        style={styles.flag}
        contentFit="cover"
        accessibilityIgnoresInvertColors
      />
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold">{country.name}</ThemedText>
        <ThemedText type="default" style={styles.region}>
          {country.region}
        </ThemedText>
      </View>
    </View>
  );
}

export const CountryCard = memo(CountryCardComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 44,
  },
  flag: {
    width: 40,
    height: 28,
    borderRadius: 4,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  region: {
    opacity: 0.6,
    fontSize: 14,
  },
});
