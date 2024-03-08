import { render, screen } from '@testing-library/react';
import Uses from '../pages/uses';
import '@testing-library/jest-dom';

describe('Uses', () => {
  it('renders the heading', () => {
    render(<Uses />);
    expect(screen.getByText('Everyday Day Carry')).toBeInTheDocument();
  });

  it('renders the subheading', () => {
    render(<Uses />);
    expect(
      screen.getByText(
        'A non-exhaustive list of stuff that I use on a daily basis.'
      )
    ).toBeInTheDocument();
  });

  it('renders a snapshot of the page', () => {
    const { asFragment } = render(<Uses />);
    expect(asFragment()).toMatchSnapshot();
  });
});
