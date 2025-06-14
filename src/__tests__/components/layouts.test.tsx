import Layout from '@/components/layouts';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock the nav component
vi.mock('@/components/nav', () => ({
  default: vi.fn(() => <nav data-testid='mocked-nav'>Mocked Nav</nav>)
}));

// Mock the useDarkMode hook
const mockUseDarkMode = vi.fn();
vi.mock('@/hooks/useDarkMode', () => ({
  default: () => mockUseDarkMode()
}));

describe('Layout', () => {
  it('renders children and mocked nav', () => {
    render(
      <Layout variant='main'>
        <div data-testid='child'>Child content</div>
      </Layout>
    );

    expect(screen.getByTestId('mocked-nav')).toBeDefined();
    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('applies correct classes for main variant', () => {
    render(
      <Layout variant='main'>
        <div>Content</div>
      </Layout>
    );

    const main = screen.getByRole('main');
    expect(main.className).toContain('mx-auto');
    expect(main.className).toContain('my-2');
    expect(main.className).toContain('w-[90%]');
    expect(main.className).toContain('py-8');
    expect(main.className).toContain('lg:w-[75%]');
    expect(main.className).toContain('xl:w-[80%]');
  });

  it('applies correct classes for prose variant', () => {
    render(
      <Layout variant='prose'>
        <div>Content</div>
      </Layout>
    );

    const main = screen.getByRole('main');
    expect(main.className).toContain('mx-auto');
    expect(main.className).toContain('my-2');
    expect(main.className).toContain('w-[90%]');
    expect(main.className).toContain('py-8');
    expect(main.className).toContain('lg:w-[75%]');
    expect(main.className).toContain('xl:w-[80%]');
  });

  it('renders an element with correct background class in legal variant', () => {
    mockUseDarkMode.mockReturnValue([false, vi.fn()]);

    const { container } = render(
      <Layout variant='legal'>
        <div>Content</div>
      </Layout>
    );

    const bgElement = container.querySelector('.bg-white.dark\\:bg-gray-900');
    expect(bgElement).not.toBeNull();
  });

  it('renders footer with correct content', () => {
    render(
      <Layout variant='main'>
        <div>Content</div>
      </Layout>
    );

    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent).toContain('© 2012-2025 Mrugesh Mohapatra Co.');
    expect(footer.textContent).toContain('All rights reserved');
    expect(footer.textContent).toContain('Terms');
    expect(footer.textContent).toContain('Privacy');
    expect(footer.textContent).toContain('Refunds');
    expect(footer.textContent).toContain('About & Contact');
  });
});
