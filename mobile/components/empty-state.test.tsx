import { screen } from '@testing-library/react-native';

import { en } from 'shared';
import { renderWithI18n } from '@/test-utils/render-with-providers';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders the "no results" message', async () => {
    await renderWithI18n(<EmptyState />);

    expect(screen.getByText(en.states.emptyMessage)).toBeTruthy();
  });
});
