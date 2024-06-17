import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Uses from '@/pages/uses';

describe('Uses', () => {
  it('renders the heading', () => {
    render(<Uses />);
    expect(screen.getByText('Everyday Day Carry')).toBeDefined();
  });

  it('renders the subheading', () => {
    render(<Uses />);
    expect(
      screen.getByText(
        'A non-exhaustive list of stuff that I use on a daily basis.'
      )
    ).toBeDefined();
  });

  it('renders a snapshot of the page', () => {
    const { asFragment } = render(<Uses />);
    expect(asFragment()).toMatchSnapshot();
  });
});
