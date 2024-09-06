import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from '@/pages/about';

// Mock the entire nav module
vi.mock('@/components/nav', () => ({
  default: vi.fn(() => <div data-testid='mocked-nav'>Mocked Nav</div>)
}));

// Mock the useDarkMode hook
vi.mock('@/hooks/useDarkMode', () => ({
  default: () => ({ isDarkMode: false, toggle: vi.fn() })
}));

describe('About', () => {
  it('renders the About page', () => {
    render(<About />);

    // Check for the presence of key elements
    expect(screen.getByRole('heading', { name: /about/i })).toBeTruthy();
    expect(screen.getByTestId('mocked-nav')).toBeTruthy();
    // Add more specific checks based on your About page content
  });
});
