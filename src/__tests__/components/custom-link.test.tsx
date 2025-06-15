import { CustomLink } from '@/components/custom-link';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../test-utils';
import { testExternalLink, testInternalLink } from '../test-utils';

describe('CustomLink Component', () => {
  describe('Basic Rendering', () => {
    it('renders a link with children', () => {
      render(<CustomLink href="/test">Test Link</CustomLink>);

      const link = screen.getByRole('link', { name: 'Test Link' });
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Test Link');
    });

    it('applies default className when none provided', () => {
      render(<CustomLink href="/test">Test Link</CustomLink>);

      const link = screen.getByRole('link');
      expect(link).toHaveClass(
        'text-blue-500',
        'hover:text-blue-700',
        'inline-flex',
        'items-center'
      );
    });

    it('applies custom className when provided', () => {
      const customClass = 'custom-link-class';
      render(
        <CustomLink href="/test" className={customClass}>
          Test Link
        </CustomLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass(customClass);
      expect(link).not.toHaveClass('text-blue-500');
    });
  });

  describe('Internal Links', () => {
    it('identifies internal links starting with /', () => {
      render(<CustomLink href="/internal-page">Internal Link</CustomLink>);

      const link = screen.getByRole('link') as HTMLAnchorElement;
      expect(link).toHaveAttribute('href', '/internal-page');
      expect(link).not.toHaveAttribute('target', '_blank');
      expect(link).not.toHaveAttribute('rel');
    });

    it('identifies anchor links starting with #', () => {
      render(<CustomLink href="#section">Anchor Link</CustomLink>);

      const link = screen.getByRole('link') as HTMLAnchorElement;
      expect(link).toHaveAttribute('href', '#section');
      expect(link).not.toHaveAttribute('target', '_blank');
      expect(link).not.toHaveAttribute('rel');
    });

    it('does not add noopener/noreferrer to internal links', () => {
      render(
        <CustomLink href="/internal" rel="bookmark">
          Internal Link
        </CustomLink>
      );

      const link = screen.getByRole('link') as HTMLAnchorElement;
      expect(link).not.toHaveAttribute('rel', expect.stringContaining('noopener'));
      expect(link).not.toHaveAttribute('rel', expect.stringContaining('noreferrer'));
    });
  });

  describe('External Links', () => {
    it('identifies external links', () => {
      render(
        <CustomLink href="https://example.com" target="_blank">
          External Link
        </CustomLink>
      );

      const link = screen.getByRole('link') as HTMLAnchorElement;
      expect(link).toHaveAttribute('href', 'https://example.com');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('adds noopener noreferrer to external links with target="_blank"', () => {
      render(
        <CustomLink href="https://example.com" target="_blank">
          External Link
        </CustomLink>
      );

      const link = screen.getByRole('link') as HTMLAnchorElement;
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('preserves existing rel and adds noopener noreferrer for external links', () => {
      render(
        <CustomLink href="https://example.com" target="_blank" rel="me">
          External Link
        </CustomLink>
      );

      const link = screen.getByRole('link') as HTMLAnchorElement;
      expect(link).toHaveAttribute('rel', 'me noopener noreferrer');
    });

    it('does not add noopener noreferrer to external links without target="_blank"', () => {
      render(<CustomLink href="https://example.com">External Link</CustomLink>);

      const link = screen.getByRole('link') as HTMLAnchorElement;
      expect(link).not.toHaveAttribute('rel');
    });
  });

  describe('Props Handling', () => {
    it('applies aria-label when provided', () => {
      render(
        <CustomLink href="/test" ariaLabel="Custom aria label">
          Test Link
        </CustomLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAccessibleName('Custom aria label');
    });

    it('applies type attribute when provided', () => {
      render(
        <CustomLink href="/test" type="button">
          Test Link
        </CustomLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('type', 'button');
    });

    it('applies target attribute when provided', () => {
      render(
        <CustomLink href="/test" target="_self">
          Test Link
        </CustomLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_self');
    });

    it('applies custom rel attribute for external links with target="_blank"', () => {
      render(
        <CustomLink href="https://example.com" rel="bookmark" target="_blank">
          Test Link
        </CustomLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('rel', 'bookmark noopener noreferrer');
    });
  });

  describe('Click Handling', () => {
    it('calls onClick handler when provided', () => {
      const mockClick = vi.fn();
      render(
        <CustomLink href="/test" onClick={mockClick}>
          Test Link
        </CustomLink>
      );

      const link = screen.getByRole('link');
      fireEvent.click(link);

      expect(mockClick).toHaveBeenCalledTimes(1);
      expect(mockClick).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'click',
        })
      );
    });

    it('does not throw error when onClick is not provided', () => {
      render(<CustomLink href="/test">Test Link</CustomLink>);

      const link = screen.getByRole('link');
      expect(() => fireEvent.click(link)).not.toThrow();
    });
  });

  describe('Forward Ref', () => {
    it('forwards ref to the anchor element', () => {
      const ref = { current: null };
      render(
        <CustomLink href="/test" ref={ref}>
          Test Link
        </CustomLink>
      );

      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
      expect(ref.current).toBe(screen.getByRole('link'));
    });
  });

  describe('Complex Link Scenarios', () => {
    it('handles mailto links correctly', () => {
      render(<CustomLink href="mailto:test@example.com">Email Link</CustomLink>);

      const link = screen.getByRole('link') as HTMLAnchorElement;
      expect(link).toHaveAttribute('href', 'mailto:test@example.com');
      expect(link).not.toHaveAttribute('target', '_blank');
      expect(link).not.toHaveAttribute('rel');
    });

    it('handles tel links correctly', () => {
      render(<CustomLink href="tel:+1234567890">Phone Link</CustomLink>);

      const link = screen.getByRole('link') as HTMLAnchorElement;
      expect(link).toHaveAttribute('href', 'tel:+1234567890');
      expect(link).not.toHaveAttribute('target', '_blank');
      expect(link).not.toHaveAttribute('rel');
    });

    it('handles protocol-relative URLs as external', () => {
      render(
        <CustomLink href="//example.com" target="_blank">
          Protocol Relative Link
        </CustomLink>
      );

      const link = screen.getByRole('link') as HTMLAnchorElement;
      expect(link).toHaveAttribute('href', '//example.com');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Display Name', () => {
    it('has correct display name for debugging', () => {
      expect(CustomLink.displayName).toBe('CustomLink');
    });
  });

  describe('All Target Options', () => {
    it('handles target="_blank"', () => {
      render(
        <CustomLink href="https://example.com" target="_blank">
          Blank Target
        </CustomLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    it('handles target="_self"', () => {
      render(
        <CustomLink href="/test" target="_self">
          Self Target
        </CustomLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_self');
    });

    it('handles target="_parent"', () => {
      render(
        <CustomLink href="/test" target="_parent">
          Parent Target
        </CustomLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_parent');
    });

    it('handles target="_top"', () => {
      render(
        <CustomLink href="/test" target="_top">
          Top Target
        </CustomLink>
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('target', '_top');
    });
  });
});
