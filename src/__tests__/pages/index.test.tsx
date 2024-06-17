import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

describe('Home', () => {
  it('renders the name on the homepage', () => {
    render(<Home />);
    expect(screen.getByText('mrugesh mohapatra')).toBeDefined();
  });

  it('renders the description on the homepage', () => {
    render(<Home />);
    expect(
      screen.getByText(
        'nocturnal developer 🦉 • open-source enthusiast 🌏 • photography noob 📷'
      )
    ).toBeDefined();
  });

  it('renders the social links on the homepage', () => {
    render(<Home />);
    expect(screen.getByText('GitHub')).toBeDefined();
    expect(screen.getByText('Twitter')).toBeDefined();
    expect(screen.getByText('LinkedIn')).toBeDefined();
    expect(screen.getByText('Instagram')).toBeDefined();
  });

  it('renders a snapshot of the homepage', () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });
});
