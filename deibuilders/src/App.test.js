import { render, screen } from '@testing-library/react';
import Home from './pages/Home';

test('renders top navigation brand on Home', () => {
  render(<Home />);
  const brands = screen.getAllByText(/DEI Builders/i);
  expect(brands.length).toBeGreaterThan(0);
});
