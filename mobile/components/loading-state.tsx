import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedView } from '@/components/themed-view';

export function LoadingState() {
  const { t } = useTranslation();

  return (
    <ThemedView
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={t('states.loadingAccessibilityLabel')}>
      <ActivityIndicator size="large" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
