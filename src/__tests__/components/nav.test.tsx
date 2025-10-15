import { Nav } from '@/components/nav';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../test-utils';

// Mock dependencies
vi.mock('@/components/custom-link', () => ({
  CustomLink: ({ children, href, ariaLabel }: { children: React.ReactNode; href: string; ariaLabel?: string }) => (
    <a href={href} aria-label={ariaLabel}>
      {children}
    </a>
  )
}));

vi.mock('@heroicons/react/24/outline', () => ({
  Bars4Icon: () => <div data-testid='bars4-icon' />,
  HomeIcon: () => <div data-testid='home-icon' />,
  BookOpenIcon: () => <div data-testid='book-open-icon' />,
  CpuChipIcon: () => <div data-testid='cpu-chip-icon' />,
  PhoneIcon: () => <div data-testid='phone-icon' />
}));

vi.mock('@headlessui/react', () => ({
  Menu: ({ children }: { children: (props: { open: boolean }) => React.ReactNode }) => (
    <div data-testid='menu'>{children({ open: false })}</div>
  ),
  MenuButton: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type='button' onClick={onClick} data-testid='menu-button'>
      {children}
    </button>
  ),
  MenuItems: ({ children }: { children: React.ReactNode }) => <div data-testid='menu-items'>{children}</div>,
  MenuItem: ({ children }: { children: React.ReactNode }) => <div data-testid='menu-item'>{children}</div>,
  Transition: ({ children }: { children: React.ReactNode }) => <div data-testid='transition'>{children}</div>
}));

describe('Nav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.paddingRight = '0';
  });

  it('renders navigation with menu button', () => {
    render(<Nav />);

    expect(screen.getByTestId('menu-button')).toBeInTheDocument();
    expect(screen.getByTestId('bars4-icon')).toBeInTheDocument();
  });

  it('renders home button by default', () => {
    render(<Nav />);

    const homeButton = screen.getByRole('link', { name: /go home/i });
    expect(homeButton).toBeInTheDocument();
    expect(homeButton).toHaveAttribute('href', '/');
    expect(screen.getByTestId('home-icon')).toBeInTheDocument();
  });

  it('hides home button when showHomeButton is false', () => {
    render(<Nav showHomeButton={false} />);

    expect(screen.queryByRole('link', { name: /go home/i })).not.toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Nav />);

    expect(screen.getByRole('link', { name: /recent posts/i })).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('link', { name: /uses/i })).toHaveAttribute('href', '/uses');
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
    it('menu button is focusable', () => {
      render(<Nav />);
      const menuButton = screen.getByTestId('menu-button');

      menuButton.focus();
      expect(menuButton).toHaveFocus();
    });

    it('home button is focusable when shown', () => {
      render(<Nav />);
      const homeButton = screen.getByRole('link', { name: /go home/i });

      homeButton.focus();
      expect(homeButton).toHaveFocus();
    });

    it('handles Enter key on menu button', () => {
      render(<Nav />);
      const menuButton = screen.getByTestId('menu-button');

      fireEvent.keyDown(menuButton, { key: 'Enter' });
      expect(screen.getByTestId('menu-items')).toBeInTheDocument();
    });

    it('handles Space key on menu button', () => {
      render(<Nav />);
      const menuButton = screen.getByTestId('menu-button');

      fireEvent.keyDown(menuButton, { key: ' ' });
      expect(screen.getByTestId('menu-items')).toBeInTheDocument();
    });

    it('navigation links are focusable', () => {
      render(<Nav />);

      const recentPostsLink = screen.getByRole('link', {
        name: /recent posts/i
      });
      const usesLink = screen.getByRole('link', { name: /uses/i });

      recentPostsLink.focus();
      expect(recentPostsLink).toHaveFocus();

      usesLink.focus();
      expect(usesLink).toHaveFocus();
    });

    it('handles Escape key to close menu', () => {
      render(<Nav />);
      const menuButton = screen.getByTestId('menu-button');

      fireEvent.click(menuButton);
      expect(screen.getByTestId('menu-items')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });
    });
  });

  describe('Body Padding Management', () => {
    it('resets body padding when component is tested', () => {
      render(<Nav />);

      expect(document.body.style.paddingRight).toBe('0');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(<Nav />);

      const navigation = screen.getByRole('navigation');
      expect(navigation).toBeInTheDocument();
    });

    it('has screen reader text for menu button', () => {
      render(<Nav />);

      expect(screen.getByText('Open navigation menu')).toHaveClass('sr-only');
    });

    it('has screen reader text for home button', () => {
      render(<Nav />);

      expect(screen.getByText('Go Home')).toHaveClass('sr-only');
    });

    it('has proper aria-hidden attributes on icons', () => {
      render(<Nav />);

      const barsIcon = screen.getByTestId('bars4-icon');
      const homeIcon = screen.getByTestId('home-icon');
      const bookIcon = screen.getByTestId('book-open-icon');
      const chipIcon = screen.getByTestId('cpu-chip-icon');
      const phoneIcon = screen.getByTestId('phone-icon');

      expect(barsIcon).toBeInTheDocument();
      expect(homeIcon).toBeInTheDocument();
      expect(bookIcon).toBeInTheDocument();
      expect(chipIcon).toBeInTheDocument();
      expect(phoneIcon).toBeInTheDocument();
    });
  });
});
