import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Refunds from '@/pages/refunds';

// Mock the Nav component
vi.mock('@/components/nav', () => ({
  default: vi.fn(() => <div data-testid='mocked-nav'>Mocked Nav</div>)
}));

// Mock the useDarkMode hook
vi.mock('@/hooks/useDarkMode', () => ({
  default: () => ({ isDarkMode: false, toggle: vi.fn() })
}));

describe('Refunds', () => {
  it('renders a heading', () => {
    render(<Refunds />);
    expect(screen.getByText('Cancellation and Refund Policy')).toBeDefined();
  });
});
