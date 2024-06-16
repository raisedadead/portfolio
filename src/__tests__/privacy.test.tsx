import { render, screen } from '@testing-library/dom';
import Privacy from '../pages/privacy';

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
