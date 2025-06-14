import Terms from '@/pages/terms';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

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
  asPath: '/terms'
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter
}));

describe('Terms', () => {
  it('renders a heading', () => {
    render(<Terms />);
    expect(screen.getByText('Terms')).toBeDefined();
  });
});
