import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Privacy from '@/pages/privacy';

describe('Privacy', () => {
  it('renders a heading', () => {
    render(<Privacy />);
    expect(
      screen.getByText('Privacy Policy', { selector: 'h1' })
    ).toBeDefined();
  });

  it('renders a sub-heading', () => {
    render(<Privacy />);
    expect(screen.getByText('Analytics', { selector: 'h2' })).toBeDefined();
  });
});
