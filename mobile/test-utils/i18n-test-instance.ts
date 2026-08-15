import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/i18n/locales/en.json';

/** Instancia i18next aislada para tests: sin AsyncStorage ni expo-localization. */
export function createTestI18n() {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    resources: { en: { translation: en } },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
  return instance;
}
