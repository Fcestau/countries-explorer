import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { getLocalizedCountryName, type Country } from 'shared';

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
  const { t, i18n } = useTranslation();
  const displayName = getLocalizedCountryName(country, i18n.language);
  const displayRegion = t(`regions.${country.region}`, { defaultValue: country.region });

  const handlePress = useCallback(() => {
    // country.id (ISO alpha_3) puede venir vacío para territorios sin código
    // oficial; uuid siempre está presente, así que es el identificador de ruta.
    router.push({ pathname: '/country/[id]', params: { id: country.uuid } });
  }, [router, country.uuid]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={t('countryCard.accessibilityLabel', {
        name: displayName,
        region: displayRegion,
      })}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <CountryFlagThumbnail uri={country.flagPng} />
      <View style={styles.info}>
        <ThemedText type="defaultSemiBold">{displayName}</ThemedText>
        <ThemedText type="default" style={styles.region}>
          {displayRegion}
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
