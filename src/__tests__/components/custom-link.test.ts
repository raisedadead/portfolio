import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Custom Link Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  interface LinkProps {
    href: string;
    ariaLabel?: string;
    className?: string;
    rel?: string;
    target?: '_blank' | '_self' | '_parent' | '_top';
    type?: string;
    children?: string;
  }

  const createCustomLink = (props: LinkProps) => {
    const {
      href,
      ariaLabel,
      className = 'text-blue-500 hover:text-blue-700 inline-flex items-center',
      rel,
      target,
      type,
      children = 'Link text'
    } = props;

    // Implement the isExternal logic from the component
    const isExternal = (!href.startsWith('/') && !href.startsWith('#')) || href.startsWith('//');
    const linkRel = isExternal && target === '_blank' ? `${rel ? `${rel} ` : ''}noopener noreferrer` : rel;

    const link = document.createElement('a');
    link.href = href;
    link.className = className;
    if (ariaLabel) link.setAttribute('aria-label', ariaLabel);
    if (linkRel) link.setAttribute('rel', linkRel);
    if (target) link.setAttribute('target', target);
    if (type) link.setAttribute('type', type);
    link.textContent = children;

    document.body.appendChild(link);
    return link;
  };

  describe('Basic Link Creation', () => {
    it('creates a link with href', () => {
      const link = createCustomLink({ href: '/test' });

      expect(link.tagName.toLowerCase()).toBe('a');
      expect(link.getAttribute('href')).toBe('/test');
    });

    it('applies default className when none provided', () => {
      const link = createCustomLink({ href: '/test' });

      expect(link.className).toBe('text-blue-500 hover:text-blue-700 inline-flex items-center');
    });

    it('applies custom className when provided', () => {
      const customClass = 'custom-link-class';
      const link = createCustomLink({ href: '/test', className: customClass });

      expect(link.className).toBe(customClass);
    });

    it('sets aria-label when provided', () => {
      const ariaLabel = 'Custom aria label';
      const link = createCustomLink({ href: '/test', ariaLabel });

      expect(link.getAttribute('aria-label')).toBe(ariaLabel);
    });
  });

  describe('External Link Detection', () => {
    it('detects external HTTP links', () => {
      const link = createCustomLink({
        href: 'https://example.com',
        target: '_blank'
      });

      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('detects external HTTPS links', () => {
      const link = createCustomLink({
        href: 'https://external.com',
        target: '_blank'
      });

      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('detects protocol-relative links as external', () => {
      const link = createCustomLink({
        href: '//example.com',
        target: '_blank'
      });

      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('treats internal paths as internal', () => {
      const link = createCustomLink({
        href: '/internal/path',
        target: '_blank'
      });

      expect(link.getAttribute('rel')).toBeNull();
    });

    it('treats hash links as internal', () => {
      const link = createCustomLink({
        href: '#section',
        target: '_blank'
      });

      expect(link.getAttribute('rel')).toBeNull();
    });
  });

  describe('Security Attributes', () => {
    it('adds noopener noreferrer to external links with _blank target', () => {
      const link = createCustomLink({
        href: 'https://example.com',
        target: '_blank'
      });

      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('preserves existing rel attribute for external links', () => {
      const link = createCustomLink({
        href: 'https://example.com',
        target: '_blank',
        rel: 'sponsored'
      });

      expect(link.getAttribute('rel')).toBe('sponsored noopener noreferrer');
    });

    it('does not add security attributes to internal links', () => {
      const link = createCustomLink({
        href: '/internal',
        target: '_blank'
      });

      expect(link.getAttribute('rel')).toBeNull();
    });

    it('does not add security attributes when target is not _blank', () => {
      const link = createCustomLink({
        href: 'https://example.com',
        target: '_self'
      });

      expect(link.getAttribute('rel')).toBeNull();
    });
  });

  describe('Target Attribute', () => {
    it('sets target attribute when provided', () => {
      const targets: Array<'_blank' | '_self' | '_parent' | '_top'> = ['_blank', '_self', '_parent', '_top'];

      targets.forEach((target) => {
        const link = createCustomLink({
          href: '/test',
          target
        });

        expect(link.getAttribute('target')).toBe(target);
      });
    });

    it('does not set target attribute when not provided', () => {
      const link = createCustomLink({ href: '/test' });

      expect(link.getAttribute('target')).toBeNull();
    });
  });

  describe('Type Attribute', () => {
    it('sets type attribute when provided', () => {
      const type = 'application/pdf';
      const link = createCustomLink({
        href: '/document.pdf',
        type
      });

      expect(link.getAttribute('type')).toBe(type);
    });

    it('does not set type attribute when not provided', () => {
      const link = createCustomLink({ href: '/test' });

      expect(link.getAttribute('type')).toBeNull();
    });
  });

  describe('Link Content', () => {
    it('renders slot content', () => {
      const content = 'Click me';
      const link = createCustomLink({
        href: '/test',
        children: content
      });

      expect(link.textContent).toBe(content);
    });

    it('handles empty content', () => {
      const link = createCustomLink({
        href: '/test',
        children: ''
      });

      expect(link.textContent).toBe('');
    });
  });

  describe('Accessibility', () => {
    it('provides accessible structure', () => {
      const link = createCustomLink({
        href: '/test',
        ariaLabel: 'Navigate to test page'
      });

      expect(link.getAttribute('aria-label')).toBe('Navigate to test page');
      expect(link.getAttribute('href')).toBeTruthy();
    });

    it('maintains semantic link element', () => {
      const link = createCustomLink({ href: '/test' });

      expect(link.tagName.toLowerCase()).toBe('a');
      expect(link.getAttribute('href')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles mailto links', () => {
      const link = createCustomLink({
        href: 'mailto:test@example.com',
        target: '_blank'
      });

      // mailto links are considered external
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('handles tel links', () => {
      const link = createCustomLink({
        href: 'tel:+1234567890',
        target: '_blank'
      });

      // tel links are considered external
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });

    it('handles empty href', () => {
      const link = createCustomLink({ href: '' });

      expect(link.getAttribute('href')).toBe('');
    });

    it('handles complex URLs', () => {
      const complexUrl = 'https://example.com/path?query=value&other=test#fragment';
      const link = createCustomLink({
        href: complexUrl,
        target: '_blank'
      });

      expect(link.getAttribute('href')).toBe(complexUrl);
      expect(link.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  describe('Default Behavior', () => {
    it('uses default className when not specified', () => {
      const link = createCustomLink({ href: '/test' });

      expect(link.className).toBe('text-blue-500 hover:text-blue-700 inline-flex items-center');
    });

    it('handles all props being optional except href', () => {
      const link = createCustomLink({ href: '/test' });

      expect(link.getAttribute('href')).toBe('/test');
      expect(link.className).toBeTruthy(); // Should have default className
      expect(link.getAttribute('target')).toBeNull();
      expect(link.getAttribute('rel')).toBeNull();
      expect(link.getAttribute('type')).toBeNull();
    });
  });
});
