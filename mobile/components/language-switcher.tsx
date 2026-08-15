import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { changeLanguage, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;

  const handlePress = useCallback((language: SupportedLanguage) => {
    changeLanguage(language);
  }, []);

  return (
    <View style={styles.container} accessibilityRole="radiogroup">
      {SUPPORTED_LANGUAGES.map((language) => {
        const isActive = currentLanguage === language;
        return (
          <Pressable
            key={language}
            onPress={() => handlePress(language)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={t('languageSwitcher.switchTo', { language: language.toUpperCase() })}
            hitSlop={8}
            style={[styles.button, isActive && styles.buttonActive]}>
            <ThemedText style={[styles.label, isActive && styles.labelActive]}>
              {language.toUpperCase()}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    marginRight: 8,
  },
  button: {
    minWidth: 36,
    minHeight: 32,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  buttonActive: {
    backgroundColor: '#0a7ea4',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.6,
  },
  labelActive: {
    opacity: 1,
    color: '#fff',
  },
});
