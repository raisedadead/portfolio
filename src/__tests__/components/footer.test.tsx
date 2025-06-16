import { Footer } from '@/components/footer';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '../test-utils';

// Mock the custom-link component
vi.mock('@/components/custom-link', () => ({
  CustomLink: ({ children, href, className, ariaLabel }: MockLinkProps) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )
}));

describe('Footer Component', () => {
  describe('Rendering', () => {
    it('renders footer element', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it('renders copyright text', () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(
        screen.getByText(
          /© 2012-\d{4} Mrugesh Mohapatra Co. — All rights reserved./
        )
      ).toBeInTheDocument();
    });

    it('renders navigation links', () => {
      render(<Footer />);

      expect(screen.getByRole('link', { name: /terms/i })).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /privacy/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /refunds/i })
      ).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    });
  });

  describe('Default Footer (isDefault=false)', () => {
    it('has proper footer styling when not default', () => {
      const { container } = render(<Footer />);

      const footerDiv = container.querySelector('div');
      expect(footerDiv).toHaveClass('text-center');
    });

    it('shows home link when not default', () => {
      render(<Footer />);

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    });

    it('has proper link styling when not default', () => {
      render(<Footer />);

      const homeLink = screen.getByRole('link', { name: /home/i });
      expect(homeLink).toHaveClass(
        'text-gray-500',
        'hover:text-black',
        'rounded-full',
        'hover:bg-white',
        'py-1',
        'px-2',
        'no-underline'
      );
    });
  });

  describe('Default Footer (isDefault=true)', () => {
    it('has proper default footer styling', () => {
      const { container } = render(<Footer isDefault={true} />);

      const footerDiv = container.querySelector('div');
      expect(footerDiv).toHaveClass(
        'font-mono',
        'text-gray-700',
        'text-sm',
        'text-center',
        'mx-8',
        'md:mx-auto'
      );
    });

    it('does not show home link when default', () => {
      render(<Footer isDefault={true} />);

      expect(
        screen.queryByRole('link', { name: /home/i })
      ).not.toBeInTheDocument();
    });

    it('has proper default link styling', () => {
      render(<Footer isDefault={true} />);

      const termsLink = screen.getByRole('link', { name: /terms/i });
      expect(termsLink).toHaveClass(
        'text-gray-700',
        'hover:text-black',
        'rounded-full',
        'hover:bg-white',
        'py-1',
        'px-2'
      );
    });
  });

  describe('Copyright Text', () => {
    it('shows current year in copyright', () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      const copyrightRegex = new RegExp(
        `© 2012-${currentYear} Mrugesh Mohapatra Co. — All rights reserved.`
      );

      expect(screen.getByText(copyrightRegex)).toBeInTheDocument();
    });

    it('shows year range starting from 2012', () => {
      render(<Footer />);

      expect(screen.getByText(/© 2012-/)).toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('all navigation links have correct hrefs', () => {
      render(<Footer />);

      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute(
        'href',
        '/'
      );
      expect(screen.getByRole('link', { name: /terms/i })).toHaveAttribute(
        'href',
        '/terms'
      );
      expect(screen.getByRole('link', { name: /privacy/i })).toHaveAttribute(
        'href',
        '/privacy'
      );
      expect(screen.getByRole('link', { name: /refunds/i })).toHaveAttribute(
        'href',
        '/refunds'
      );
      expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
        'href',
        '/about'
      );
    });

    it('all navigation links have proper aria labels', () => {
      render(<Footer />);

      expect(screen.getByRole('link', { name: /home/i })).toHaveAccessibleName(
        'Home'
      );
      expect(screen.getByRole('link', { name: /terms/i })).toHaveAccessibleName(
        'Terms'
      );
      expect(
        screen.getByRole('link', { name: /privacy/i })
      ).toHaveAccessibleName('Privacy');
      expect(
        screen.getByRole('link', { name: /refunds/i })
      ).toHaveAccessibleName('Refunds');
      expect(screen.getByRole('link', { name: /about/i })).toHaveAccessibleName(
        'About & Contact'
      );
    });
  });

  describe('Props Handling', () => {
    it('applies custom className', () => {
      const customClass = 'custom-footer-class';
      render(<Footer className={customClass} />);

      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass(customClass);
    });

    it('handles isDefault prop correctly', () => {
      const { rerender } = render(<Footer isDefault={false} />);

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();

      rerender(<Footer isDefault={true} />);

      expect(
        screen.queryByRole('link', { name: /home/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('has proper footer structure', () => {
      const { container } = render(<Footer />);

      const footer = container.querySelector('footer');
      const div = footer?.querySelector('div');
      const paragraphs = div?.querySelectorAll('p');

      expect(footer).toBeInTheDocument();
      expect(div).toBeInTheDocument();
      expect(paragraphs).toHaveLength(2);
    });

    it('copyright text is in first paragraph', () => {
      const { container } = render(<Footer />);

      const firstParagraph = container.querySelector('p');
      expect(firstParagraph).toHaveTextContent(/© 2012-/);
    });

    it('navigation links are in second paragraph', () => {
      const { container } = render(<Footer />);

      const paragraphs = container.querySelectorAll('p');
      const secondParagraph = paragraphs[1];

      expect(secondParagraph).toHaveClass('mt-2');
      expect(secondParagraph).toContainElement(
        screen.getByRole('link', { name: /terms/i })
      );
    });
  });

  describe('Accessibility', () => {
    it('uses semantic footer element', () => {
      render(<Footer />);

      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');
    });

    it('all links have accessible names', () => {
      render(<Footer />);

      const links = screen.getAllByRole('link');
      for (const link of links) {
        expect(link).toHaveAccessibleName();
      }
    });
  });

  describe('Responsive Design', () => {
    it('has responsive classes for default footer', () => {
      const { container } = render(<Footer isDefault={true} />);

      const footerDiv = container.querySelector('div');
      expect(footerDiv).toHaveClass('mx-8', 'md:mx-auto');
    });
  });
});
