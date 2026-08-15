import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-native-reanimated';

import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { initI18n } from '@/i18n';

function RootNavigator() {
  const { t } = useTranslation();

  return (
    <Stack screenOptions={{ headerRight: () => <LanguageSwitcher /> }}>
      <Stack.Screen
        name="index"
        options={{
          title: t('list.title'),
          headerLeft: () => (
            <ThemedText style={{ fontSize: 12, opacity: 0.5 }} numberOfLines={1}>
              {t('common.madeBy', { name: 'Felipe Cestau' })}
            </ThemedText>
          ),
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [queryClient] = useState(() => new QueryClient());
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setIsI18nReady(true));
  }, []);

  if (!isI18nReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
