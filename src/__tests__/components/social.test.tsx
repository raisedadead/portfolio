import { Social } from '@/components/social';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../test-utils';

vi.mock('@/components/custom-link', () => ({
  CustomLink: ({
    children,
    href,
    ariaLabel
  }: { children: React.ReactNode; href: string; ariaLabel?: string }) => (
    <a
      href={href}
      aria-label={ariaLabel}
      target='_blank'
      rel='noopener noreferrer'
    >
      {children}
    </a>
  )
}));

describe('Social', () => {
  it('renders social links container with proper styling', () => {
    const { container } = render(<Social />);
    const socialContainer = container.firstChild as HTMLElement;

    expect(socialContainer).toHaveClass(
      'mx-auto',
      'flex',
      'flex-row',
      'items-center',
      'justify-center'
    );
  });

  it('renders all social platform links with correct URLs', () => {
    render(<Social />);

    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/raisedadead'
    );
    expect(screen.getByRole('link', { name: /twitter/i })).toHaveAttribute(
      'href',
      'https://twitter.com/raisedadead'
    );
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/mrugeshm'
    );
    expect(screen.getByRole('link', { name: /instagram/i })).toHaveAttribute(
      'href',
      'https://instagram.com/raisedadead'
    );
    expect(screen.getByRole('link', { name: /peerlist/i })).toHaveAttribute(
      'href',
      'https://peerlist.io/mrugesh/signup'
    );
  });

  it('all social links are external', () => {
    render(<Social />);
    const links = screen.getAllByRole('link');

    for (const link of links) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('renders expected number of social links', () => {
    render(<Social />);
    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(5);
  });
});
