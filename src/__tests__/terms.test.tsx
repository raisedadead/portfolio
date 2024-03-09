import { render, screen } from '@testing-library/react';
import Terms from '../pages/terms';

describe('Terms', () => {
  it('renders a heading', () => {
    render(<Terms />);
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });
});
