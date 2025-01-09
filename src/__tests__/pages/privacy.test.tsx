import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Privacy from '@/pages/privacy';

// Mock the Nav component
vi.mock('@/components/nav', () => ({
  default: vi.fn(() => <div data-testid='mocked-nav'>Mocked Nav</div>)
}));

// Mock the useDarkMode hook
vi.mock('@/hooks/useDarkMode', () => ({
  default: () => ({ isDarkMode: false, toggle: vi.fn() })
}));

// Mock next/router
const mockRouter = {
  asPath: '/privacy'
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter
}));

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
