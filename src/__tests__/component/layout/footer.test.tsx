import { Footer } from '@/components/layout/footer';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../../test-utils';

vi.mock('@/components/custom-link', () => ({
  CustomLink: ({ children, href, ariaLabel }: { children: React.ReactNode; href: string; ariaLabel?: string }) => (
    <a href={href} aria-label={ariaLabel}>
      {children}
    </a>
  )
}));

describe('Footer', () => {
  it('renders footer with navigation links', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /terms/i })).toHaveAttribute('href', '/terms');
    expect(screen.getByRole('link', { name: /privacy/i })).toHaveAttribute('href', '/privacy');
    expect(screen.getByRole('link', { name: /refunds/i })).toHaveAttribute('href', '/refunds');
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
  });

  it('renders copyright with current year', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© 2012-${currentYear} Mrugesh Mohapatra Co`))).toBeInTheDocument();
  });

  it('shows home link when not default', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  });

  it('hides home link when isDefault is true', () => {
    render(<Footer isDefault={true} />);

    expect(screen.queryByRole('link', { name: /home/i })).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-footer-class';
    render(<Footer className={customClass} />);

    expect(screen.getByRole('contentinfo')).toHaveClass(customClass);
  });

  it('uses different styling for default footer', () => {
    const { container: defaultContainer } = render(<Footer isDefault={true} />);
    const { container: regularContainer } = render(<Footer isDefault={false} />);

    const defaultDiv = defaultContainer.querySelector('div');
    const regularDiv = regularContainer.querySelector('div');

    expect(defaultDiv).toHaveClass('text-gray-700');
    expect(regularDiv).not.toHaveClass('text-gray-700');
  });
});
