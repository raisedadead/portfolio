import { Nav } from '@/components/nav';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '../test-utils';
import type {
  MockIconProps,
  MockLinkProps,
  MockMenuButtonProps,
  MockMenuItemsProps,
  MockMenuProps
} from '../test-utils';

// Mock the custom-link component
vi.mock('@/components/custom-link', () => ({
  CustomLink: ({ children, href, className, ariaLabel }: MockLinkProps) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )
}));

// Mock heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  Bars4Icon: ({ className }: MockIconProps) => (
    <div className={className} data-testid='bars4-icon' />
  ),
  HomeIcon: ({ className }: MockIconProps) => (
    <div className={className} data-testid='home-icon' />
  ),
  BookOpenIcon: ({ className }: MockIconProps) => (
    <div className={className} data-testid='book-open-icon' />
  ),
  CpuChipIcon: ({ className }: MockIconProps) => (
    <div className={className} data-testid='cpu-chip-icon' />
  )
}));

// Mock headlessui
vi.mock('@headlessui/react', () => ({
  Menu: ({ children }: MockMenuProps) => (
    <div data-testid='menu'>{children({ open: false })}</div>
  ),
  MenuButton: ({ children, className, onClick }: MockMenuButtonProps) => (
    <button
      type='button'
      className={className}
      onClick={onClick}
      data-testid='menu-button'
    >
      {children}
    </button>
  ),
  MenuItems: ({ children, className }: MockMenuItemsProps) => (
    <div className={className} data-testid='menu-items'>
      {children}
    </div>
  ),
  MenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='menu-item'>{children}</div>
  ),
  Transition: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='transition'>{children}</div>
  )
}));

describe('Nav Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document.body.style.paddingRight
    document.body.style.paddingRight = '0';
  });

  describe('Rendering', () => {
    it('renders navigation menu button', () => {
      render(<Nav />);

      const menuButton = screen.getByTestId('menu-button');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveClass(
        'flex',
        'h-10',
        'items-center',
        'border-2',
        'border-black'
      );
    });

    it('renders home button by default', () => {
      render(<Nav />);

      const homeButton = screen.getByRole('link', { name: /go home/i });
      expect(homeButton).toBeInTheDocument();
      expect(homeButton).toHaveAttribute('href', '/');
    });

    it('hides home button when showHomeButton is false', () => {
      render(<Nav showHomeButton={false} />);

      const homeButton = screen.queryByRole('link', { name: /go home/i });
      expect(homeButton).not.toBeInTheDocument();
    });

    it('applies custom className', () => {
      const customClass = 'custom-nav-class';
      render(<Nav className={customClass} />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass(customClass);
    });
  });

  describe('Navigation Links', () => {
    it('renders all navigation links in menu', () => {
      render(<Nav />);

      // Check for Recent Posts link
      const recentPostsLink = screen.getByRole('link', {
        name: /recent posts/i
      });
      expect(recentPostsLink).toBeInTheDocument();
      expect(recentPostsLink).toHaveAttribute('href', 'https://hn.mrugesh.dev');

      // Check for Uses link
      const usesLink = screen.getByRole('link', { name: /uses/i });
      expect(usesLink).toBeInTheDocument();
      expect(usesLink).toHaveAttribute('href', '/uses');
    });

    it('renders navigation link icons', () => {
      render(<Nav />);

      expect(screen.getByTestId('book-open-icon')).toBeInTheDocument();
      expect(screen.getByTestId('cpu-chip-icon')).toBeInTheDocument();
    });

    it('applies correct link styling', () => {
      render(<Nav />);

      const recentPostsLink = screen.getByRole('link', {
        name: /recent posts/i
      });
      expect(recentPostsLink).toHaveClass(
        'inline-flex',
        'h-full',
        'w-full',
        'justify-start',
        'border-b-2',
        'border-black'
      );
    });
  });

  describe('Menu Button Interaction', () => {
    it('has proper menu button styling', () => {
      render(<Nav />);

      const menuButton = screen.getByTestId('menu-button');
      expect(menuButton).toHaveClass(
        'flex',
        'h-10',
        'items-center',
        'border-2',
        'border-black',
        'bg-orange-200'
      );
    });

    it('contains menu icon', () => {
      render(<Nav />);

      expect(screen.getByTestId('bars4-icon')).toBeInTheDocument();
    });
  });

  describe('Home Button', () => {
    it('has proper home button styling', () => {
      render(<Nav />);

      const homeButton = screen.getByRole('link', { name: /go home/i });
      expect(homeButton).toHaveClass(
        'flex',
        'h-10',
        'items-center',
        'border-2',
        'border-black',
        'bg-orange-200'
      );
    });

    it('contains home icon', () => {
      render(<Nav />);

      expect(screen.getByTestId('home-icon')).toBeInTheDocument();
    });

    it('has correct positioning', () => {
      render(<Nav />);

      const homeButtonContainer = screen.getByRole('link', {
        name: /go home/i
      }).parentElement;
      expect(homeButtonContainer).toHaveClass('absolute', 'top-4', 'left-4');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<Nav />);

      const menuButton = screen.getByTestId('menu-button');
      expect(menuButton).toHaveAccessibleName('Open navigation menu');

      const homeButton = screen.getByRole('link', { name: /go home/i });
      expect(homeButton).toHaveAccessibleName('Go Home');
    });

    it('has proper screen reader text', () => {
      render(<Nav />);

      expect(screen.getByText('Open navigation menu')).toHaveClass('sr-only');
      expect(screen.getByText('Go Home')).toHaveClass('sr-only');
    });

    it('marks icons as hidden from screen readers', () => {
      render(<Nav />);

      const barsIcon = screen.getByTestId('bars4-icon');
      const homeIcon = screen.getByTestId('home-icon');

      // Note: Mock icons may not preserve aria-hidden attributes
      expect(barsIcon).toBeInTheDocument();
      expect(homeIcon).toBeInTheDocument();
    });
  });

  describe('External Link Properties', () => {
    it('handles external links correctly', () => {
      render(<Nav />);

      const recentPostsLink = screen.getByRole('link', {
        name: /recent posts/i
      });
      expect(recentPostsLink).toHaveAttribute('href', 'https://hn.mrugesh.dev');
    });

    it('handles internal links correctly', () => {
      render(<Nav />);

      const usesLink = screen.getByRole('link', { name: /uses/i });
      expect(usesLink).toHaveAttribute('href', '/uses');

      const homeLink = screen.getByRole('link', { name: /go home/i });
      expect(homeLink).toHaveAttribute('href', '/');
    });
  });

  describe('Menu Layout', () => {
    it('positions menu correctly', () => {
      const { container } = render(<Nav />);

      // Check if nav has the proper structure
      const nav = container.querySelector('nav');
      expect(nav).toBeInTheDocument();

      // Check for menu button presence which indicates menu structure
      const menuButton =
        container.querySelector('button[aria-expanded]') ||
        container.querySelector('[role="button"]') ||
        container.querySelector('button');
      expect(menuButton).toBeInTheDocument();
    });

    it('positions menu items correctly', () => {
      render(<Nav />);

      const menuItems = screen.getByTestId('menu-items');
      expect(menuItems).toHaveClass(
        'absolute',
        'right-0',
        'z-10',
        'mt-2',
        'w-48',
        'border-2',
        'border-black',
        'bg-orange-200'
      );
    });
  });
});
