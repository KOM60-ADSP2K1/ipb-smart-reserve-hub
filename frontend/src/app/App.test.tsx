import { screen } from '@testing-library/react';

import { StackReadyPage } from '../pages/StackReadyPage';
import { renderWithProviders } from '../test/render';

it('renders the technical frontend readiness placeholder', () => {
  renderWithProviders(<StackReadyPage />);

  expect(screen.getByRole('heading', { name: /frontend is ready/i })).toBeInTheDocument();
});
