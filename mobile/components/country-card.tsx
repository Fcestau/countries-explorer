import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Country } from 'shared';

import { ThemedText } from '@/components/themed-text';

type CountryCardProps = {
  country: Country;
};

function CountryCardComponent({ country }: CountryCardProps) {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.push({ pathname: '/country/[id]', params: { id: country.id } });
  }, [router, country.id]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${country.name}, ${country.region}`}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
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
    </Pressable>
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
  pressed: {
    opacity: 0.6,
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
