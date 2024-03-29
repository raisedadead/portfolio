import { render, screen } from '@testing-library/react';
import Refunds from '../pages/refunds';

describe('Refunds', () => {
  it('renders a heading', () => {
    render(<Refunds />);
    expect(
      screen.getByText('Cancellation and Refund Policy')
    ).toBeInTheDocument();
  });
});
