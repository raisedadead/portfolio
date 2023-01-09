import { render, screen } from '@testing-library/react';
import Terms from '../pages/terms';
import '@testing-library/jest-dom';

describe('Terms', () => {
  it('renders a heading', () => {
    render(<Terms />);
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });
});
