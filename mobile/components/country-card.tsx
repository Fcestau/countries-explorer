import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Country } from 'shared';

import { FlagPlaceholder } from '@/components/flag-placeholder';
import { ThemedText } from '@/components/themed-text';

const FLAG_WIDTH = 40;
const FLAG_HEIGHT = 28;

function CountryFlagThumbnail({ uri }: { uri: string }) {
  const [hasError, setHasError] = useState(false);

  if (!uri || hasError) {
    return <FlagPlaceholder width={FLAG_WIDTH} height={FLAG_HEIGHT} />;
  }

  return (
    <Image
      source={{ uri }}
      style={styles.flag}
      contentFit="cover"
      accessibilityIgnoresInvertColors
      onError={() => setHasError(true)}
    />
  );
}

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
      <CountryFlagThumbnail uri={country.flagPng} />
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
    width: FLAG_WIDTH,
    height: FLAG_HEIGHT,
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
