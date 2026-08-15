import { fireEvent, screen } from '@testing-library/react-native';

import en from '@/i18n/locales/en.json';
import { renderWithI18n } from '@/test-utils/render-with-providers';

import { ErrorState } from './error-state';

describe('ErrorState', () => {
  it('renders the error message and triggers onRetry when the retry button is pressed', async () => {
    const onRetry = jest.fn();
    await renderWithI18n(<ErrorState onRetry={onRetry} />);

    expect(screen.getByText(en.states.errorMessage)).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: en.states.retryAccessibilityLabel }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
