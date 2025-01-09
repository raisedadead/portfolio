import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/pages/index';

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
  asPath: '/'
};

vi.mock('next/router', () => ({
  useRouter: () => mockRouter
}));

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
