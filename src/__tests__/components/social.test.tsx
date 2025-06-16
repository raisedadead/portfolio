import { Social } from '@/components/social';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../test-utils';
import { testExternalLink } from '../test-utils';
import type { MockCustomLinkProps } from '../test-utils';

// Mock the custom-link component
vi.mock('@/components/custom-link', () => ({
  CustomLink: ({
    children,
    href,
    className,
    ariaLabel,
    rel,
    type
  }: MockCustomLinkProps) => (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      rel={rel}
      type={type}
      target='_blank'
    >
      {children}
    </a>
  )
}));

describe('Social Component', () => {
  describe('Rendering', () => {
    it('renders social links container', () => {
      const { container } = render(<Social />);

      const socialContainer = container.firstChild as HTMLElement;
      expect(socialContainer).toHaveClass(
        'mx-auto',
        'mt-2',
        'mb-1',
        'flex',
        'flex-row',
        'items-center',
        'justify-center',
        'space-y-0',
        'space-x-3'
      );
    });

    it('renders all social platform links', () => {
      render(<Social />);

      expect(
        screen.getByRole('link', { name: /twitter/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /instagram/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /linkedin/i })
      ).toBeInTheDocument();
    });
  });

  describe('Twitter Link', () => {
    it('has correct href', () => {
      render(<Social />);

      const twitterLink = screen.getByRole('link', { name: /twitter/i });
      expect(twitterLink).toHaveAttribute(
        'href',
        'https://twitter.com/raisedadead'
      );
    });

    it('has proper styling', () => {
      render(<Social />);

      const twitterLink = screen.getByRole('link', { name: /twitter/i });
      expect(twitterLink).toHaveClass(
        'h-10',
        'w-10',
        'border-2',
        'border-black',
        'bg-orange-200',
        'p-2',
        'text-black'
      );
    });

    it('has proper SVG icon', () => {
      render(<Social />);

      const twitterLink = screen.getByRole('link', { name: /twitter/i });
      const svg = twitterLink.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('has screen reader text', () => {
      render(<Social />);

      expect(screen.getByText('Twitter')).toHaveClass('sr-only');
    });
  });

  describe('GitHub Link', () => {
    it('has correct href', () => {
      render(<Social />);

      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute(
        'href',
        'https://github.com/raisedadead'
      );
    });

    it('has proper styling', () => {
      render(<Social />);

      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveClass(
        'h-10',
        'w-10',
        'border-2',
        'border-black',
        'bg-orange-200',
        'p-2',
        'text-black'
      );
    });

    it('has proper SVG icon', () => {
      render(<Social />);

      const githubLink = screen.getByRole('link', { name: /github/i });
      const svg = githubLink.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('has screen reader text', () => {
      render(<Social />);

      expect(screen.getByText('GitHub')).toHaveClass('sr-only');
    });
  });

  describe('Instagram Link', () => {
    it('has correct href', () => {
      render(<Social />);

      const instagramLink = screen.getByRole('link', { name: /instagram/i });
      expect(instagramLink).toHaveAttribute(
        'href',
        'https://instagram.com/raisedadead'
      );
    });

    it('has proper styling', () => {
      render(<Social />);

      const instagramLink = screen.getByRole('link', { name: /instagram/i });
      expect(instagramLink).toHaveClass(
        'h-10',
        'w-10',
        'border-2',
        'border-black',
        'bg-orange-200',
        'p-2',
        'text-black'
      );
    });

    it('has proper SVG icon', () => {
      render(<Social />);

      const instagramLink = screen.getByRole('link', { name: /instagram/i });
      const svg = instagramLink.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('has screen reader text', () => {
      render(<Social />);

      expect(screen.getByText('Instagram')).toHaveClass('sr-only');
    });
  });

  describe('LinkedIn Link', () => {
    it('has correct href', () => {
      render(<Social />);

      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      expect(linkedinLink).toHaveAttribute(
        'href',
        'https://linkedin.com/in/mrugeshm'
      );
    });

    it('has proper styling', () => {
      render(<Social />);

      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      expect(linkedinLink).toHaveClass(
        'h-10',
        'w-10',
        'border-2',
        'border-black',
        'bg-orange-200',
        'p-2',
        'text-black'
      );
    });

    it('has proper SVG icon', () => {
      render(<Social />);

      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      const svg = linkedinLink.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('has screen reader text', () => {
      render(<Social />);

      expect(screen.getByText('LinkedIn')).toHaveClass('sr-only');
    });
  });

  describe('External Link Properties', () => {
    it('all links are external with proper attributes', () => {
      render(<Social />);

      const links = screen.getAllByRole('link');

      for (const link of links) {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'me');
        expect(link).toHaveAttribute('type', 'button');
      }
    });

    it('all links have proper rel attribute for social profiles', () => {
      render(<Social />);

      const twitterLink = screen.getByRole('link', { name: /twitter/i });
      const githubLink = screen.getByRole('link', { name: /github/i });
      const instagramLink = screen.getByRole('link', { name: /instagram/i });
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });

      expect(twitterLink).toHaveAttribute('rel', 'me');
      expect(githubLink).toHaveAttribute('rel', 'me');
      expect(instagramLink).toHaveAttribute('rel', 'me');
      expect(linkedinLink).toHaveAttribute('rel', 'me');
    });
  });

  describe('Accessibility', () => {
    it('all links have proper aria-labels', () => {
      render(<Social />);

      expect(
        screen.getByRole('link', { name: /twitter/i })
      ).toHaveAccessibleName('Twitter');
      expect(
        screen.getByRole('link', { name: /github/i })
      ).toHaveAccessibleName('GitHub');
      expect(
        screen.getByRole('link', { name: /instagram/i })
      ).toHaveAccessibleName('Instagram');
      expect(
        screen.getByRole('link', { name: /linkedin/i })
      ).toHaveAccessibleName('LinkedIn');
    });

    it('all SVG icons are hidden from screen readers', () => {
      const { container } = render(<Social />);

      const svgs = container.querySelectorAll('svg');
      for (const svg of svgs) {
        expect(svg).toHaveAttribute('aria-hidden', 'true');
      }
    });

    it('has proper screen reader text for each platform', () => {
      render(<Social />);

      expect(screen.getByText('Twitter')).toHaveClass('sr-only');
      expect(screen.getByText('GitHub')).toHaveClass('sr-only');
      expect(screen.getByText('Instagram')).toHaveClass('sr-only');
      expect(screen.getByText('LinkedIn')).toHaveClass('sr-only');
    });
  });

  describe('Hover and Focus States', () => {
    it('all links have hover state classes', () => {
      render(<Social />);

      const links = screen.getAllByRole('link');

      for (const link of links) {
        expect(link).toHaveClass(
          'hover:bg-gray-700',
          'hover:text-white',
          'hover:shadow-none'
        );
      }
    });

    it('all links have active state classes', () => {
      render(<Social />);

      const links = screen.getAllByRole('link');

      for (const link of links) {
        expect(link).toHaveClass('active:bg-black', 'active:shadow-none');
      }
    });
  });

  describe('Layout and Spacing', () => {
    it('has proper flex layout', () => {
      const { container } = render(<Social />);

      const socialContainer = container.firstChild as HTMLElement;
      expect(socialContainer).toHaveClass(
        'flex',
        'flex-row',
        'items-center',
        'justify-center'
      );
    });

    it('has proper spacing', () => {
      const { container } = render(<Social />);

      const socialContainer = container.firstChild as HTMLElement;
      expect(socialContainer).toHaveClass('space-y-0', 'space-x-3');
    });

    it('has proper margins', () => {
      const { container } = render(<Social />);

      const socialContainer = container.firstChild as HTMLElement;
      expect(socialContainer).toHaveClass('mx-auto', 'mt-2', 'mb-1');
    });
  });
});
