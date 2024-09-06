import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Profile from '@/components/profile';

describe('Profile', () => {
  it('renders the profile name', () => {
    render(<Profile />);
    expect(screen.getByText('mrugesh mohapatra')).toBeDefined();
  });

  it('renders the profile description', () => {
    render(<Profile />);
    expect(
      screen.getByText(
        'nocturnal developer 🦉 • open-source enthusiast 🌏 • photography noob 📷'
      )
    ).toBeDefined();
  });

  it('renders social links', () => {
    render(<Profile />);
    expect(screen.getByRole('link', { name: /twitter/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /github/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /instagram/i })).toBeDefined();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeDefined();
  });
});
