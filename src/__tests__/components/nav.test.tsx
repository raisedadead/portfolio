import { Nav } from '@/components/nav';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '../test-utils';

// Mock dependencies
vi.mock('@/components/custom-link', () => ({
  CustomLink: ({
    children,
    href,
    ariaLabel
  }: { children: React.ReactNode; href: string; ariaLabel?: string }) => (
    <a href={href} aria-label={ariaLabel}>
      {children}
    </a>
  )
}));

vi.mock('@heroicons/react/24/outline', () => ({
  Bars4Icon: () => <div data-testid='bars4-icon' />,
  HomeIcon: () => <div data-testid='home-icon' />,
  BookOpenIcon: () => <div data-testid='book-open-icon' />,
  CpuChipIcon: () => <div data-testid='cpu-chip-icon' />
}));

vi.mock('@headlessui/react', () => ({
  Menu: ({
    children
  }: { children: (props: { open: boolean }) => React.ReactNode }) => (
    <div data-testid='menu'>{children({ open: false })}</div>
  ),
  MenuButton: ({
    children,
    onClick
  }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type='button' onClick={onClick} data-testid='menu-button'>
      {children}
    </button>
  ),
  MenuItems: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='menu-items'>{children}</div>
  ),
  MenuItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='menu-item'>{children}</div>
  ),
  Transition: ({ children }: { children: React.ReactNode }) => (
    <div data-testid='transition'>{children}</div>
  )
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

    expect(
      screen.queryByRole('link', { name: /go home/i })
    ).not.toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Nav />);

    expect(screen.getByRole('link', { name: /recent posts/i })).toHaveAttribute(
      'href',
      'https://hn.mrugesh.dev'
    );
    expect(screen.getByRole('link', { name: /uses/i })).toHaveAttribute(
      'href',
      '/uses'
    );
    expect(screen.getByTestId('book-open-icon')).toBeInTheDocument();
    expect(screen.getByTestId('cpu-chip-icon')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-nav-class';
    render(<Nav className={customClass} />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass(customClass);
  });
});
