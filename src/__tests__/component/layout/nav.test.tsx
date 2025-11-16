import { Nav } from '@/components/layout/nav';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../test-utils';

// Mock dependencies
vi.mock('@/components/custom-link', () => ({
  CustomLink: ({ children, href, ariaLabel }: { children: React.ReactNode; href: string; ariaLabel?: string }) => (
    <a href={href} aria-label={ariaLabel}>
      {children}
    </a>
  )
}));

vi.mock('@heroicons/react/24/outline', () => ({
  HomeIcon: () => <div data-testid='home-icon' />,
  BookOpenIcon: () => <div data-testid='book-open-icon' />,
  CpuChipIcon: () => <div data-testid='cpu-chip-icon' />
}));

describe('Nav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation element', () => {
    render(<Nav />);

    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Nav />);

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: /uses/i })).toHaveAttribute('href', '/uses');
  });

  it('renders all icons', () => {
    render(<Nav />);

    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    expect(screen.getByTestId('book-open-icon')).toBeInTheDocument();
    expect(screen.getByTestId('cpu-chip-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-nav-class';
    render(<Nav className={customClass} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass(customClass);
  });

  describe('Keyboard Navigation and Focus Management', () => {
    it('all navigation links are focusable', () => {
      render(<Nav />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      const blogLink = screen.getByRole('link', { name: /blog/i });
      const usesLink = screen.getByRole('link', { name: /uses/i });

      homeLink.focus();
      expect(homeLink).toHaveFocus();

      blogLink.focus();
      expect(blogLink).toHaveFocus();

      usesLink.focus();
      expect(usesLink).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Nav />);

      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
    });

    it('has proper aria-label for all links', () => {
      render(<Nav />);

      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('aria-label', 'Home');
      expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('aria-label', 'Blog');
      expect(screen.getByRole('link', { name: /uses/i })).toHaveAttribute('aria-label', 'Uses');
    });

    it('has visible link text', () => {
      render(<Nav />);

      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Uses')).toBeInTheDocument();
    });
  });
});
