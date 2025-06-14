import Uses from '@/pages/uses';
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
  asPath: '/uses'
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter
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
