import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type ErrorStateProps = {
  onRetry: () => void;
};

export function ErrorState({ onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="default" style={styles.message}>
        {t('states.errorMessage')}
      </ThemedText>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel={t('states.retryAccessibilityLabel')}
        style={styles.button}>
        <ThemedText type="defaultSemiBold" style={styles.buttonText}>
          {t('common.retry')}
        </ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
  },
  message: {
    textAlign: 'center',
  },
  button: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#0a7ea4',
  },
  buttonText: {
    color: '#fff',
  },
});
