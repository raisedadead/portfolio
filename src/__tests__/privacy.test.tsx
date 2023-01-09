import { render, screen } from '@testing-library/react';
import Privacy from '../pages/privacy';
import '@testing-library/jest-dom';

describe('Privacy', () => {
  it('renders a heading', () => {
    render(<Privacy />);
    expect(screen.getByText('Privacy')).toBeInTheDocument();
  });

  it('renders a sub-heading', () => {
    render(<Privacy />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });
});
