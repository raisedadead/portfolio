import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Uses from '@/pages/uses';

// Mock the entire nav module
vi.mock('@/components/nav', () => ({
  default: vi.fn(() => <div data-testid='mocked-nav'>Mocked Nav</div>)
}));

// Mock the useDarkMode hook
vi.mock('@/hooks/useDarkMode', () => ({
  default: () => ({ isDarkMode: false, toggle: vi.fn() })
}));

describe('Uses', () => {
  it('renders the Uses page', () => {
    render(<Uses />);

    // Check for the presence of key elements
    expect(
      screen.getByRole('heading', { name: /everyday carry/i })
    ).toBeTruthy();
    expect(
      screen.getByText(
        /A non-exhaustive list of stuff that I use on a daily basis./i
      )
    ).toBeTruthy();
    expect(screen.getByTestId('mocked-nav')).toBeTruthy();
  });
});
