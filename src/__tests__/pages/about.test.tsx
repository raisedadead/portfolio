import About from '@/pages/about';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock the entire nav module
vi.mock('@/components/nav', () => ({
  default: vi.fn(() => <div data-testid='mocked-nav'>Mocked Nav</div>)
}));

// Mock the useDarkMode hook
vi.mock('@/hooks/useDarkMode', () => ({
  default: () => ({ isDarkMode: false, toggle: vi.fn() })
}));

// Mock next/router
const mockRouter = {
  asPath: '/about'
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter
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
