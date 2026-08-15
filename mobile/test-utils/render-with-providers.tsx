import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';

import { createTestI18n } from './i18n-test-instance';

export function renderWithI18n(ui: ReactElement): ReturnType<typeof render> {
  const i18n = createTestI18n();
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}
