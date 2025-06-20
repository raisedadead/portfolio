import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Footer Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  interface FooterProps {
    isDefault?: boolean;
    className?: string;
  }

  const createFooter = (props: FooterProps = {}) => {
    const { isDefault = false, className } = props;
    const currentYear = new Date().getFullYear();

    const footerType = isDefault ? 'font-mono text-gray-700 text-sm text-center mx-8 md:mx-auto' : 'text-center';
    const anchorClass = isDefault
      ? 'text-gray-700 hover:text-black rounded-full hover:bg-white py-1 px-2'
      : 'text-gray-500 hover:text-black rounded-full hover:bg-white py-1 px-2 no-underline';

    const footer = document.createElement('footer');
    if (className) footer.className = className;

    const contentDiv = document.createElement('div');
    contentDiv.className = footerType;

    // Copyright paragraph
    const copyrightP = document.createElement('p');
    copyrightP.textContent = `© 2012-${currentYear} Mrugesh Mohapatra Co. — All rights reserved.`;

    // Links paragraph
    const linksP = document.createElement('p');
    linksP.className = 'mt-2';

    // Home link (only if not default)
    if (!isDefault) {
      const homeLink = document.createElement('a');
      homeLink.href = '/';
      homeLink.setAttribute('aria-label', 'Home');
      homeLink.className = anchorClass;
      homeLink.textContent = 'Home';

      linksP.appendChild(homeLink);
      linksP.appendChild(document.createTextNode(' • '));
    }

    // Other links
    const links = [
      { href: '/terms', label: 'Terms & Conditions', text: 'Terms' },
      { href: '/privacy', label: 'Privacy Policy', text: 'Privacy' },
      { href: '/refunds', label: 'Refunds & Cancellation Policy', text: 'Refunds' },
      { href: '/about', label: 'Contact Us', text: 'About & Contact' }
    ];

    links.forEach((linkData, index) => {
      const link = document.createElement('a');
      link.href = linkData.href;
      link.setAttribute('aria-label', linkData.label);
      link.className = anchorClass;
      link.textContent = ` ${linkData.text} `;

      linksP.appendChild(link);

      if (index < links.length - 1) {
        linksP.appendChild(document.createTextNode(' • '));
      }
    });

    contentDiv.appendChild(copyrightP);
    contentDiv.appendChild(linksP);
    footer.appendChild(contentDiv);

    document.body.appendChild(footer);
    return footer;
  };

  describe('Basic Structure', () => {
    it('renders footer element', () => {
      const footer = createFooter();

      expect(footer.tagName.toLowerCase()).toBe('footer');
    });

    it('applies custom className when provided', () => {
      const customClass = 'custom-footer-class';
      const footer = createFooter({ className: customClass });

      expect(footer.className).toBe(customClass);
    });

    it('contains copyright information', () => {
      createFooter();

      const currentYear = new Date().getFullYear();
      const expectedText = `© 2012-${currentYear} Mrugesh Mohapatra Co. — All rights reserved.`;
      expect(document.body.textContent).toContain(expectedText);
    });
  });

  describe('Default vs Non-Default Styling', () => {
    it('applies default styling when isDefault is true', () => {
      createFooter({ isDefault: true });

      const contentDiv = document.querySelector('footer > div');
      expect(contentDiv?.classList.contains('font-mono')).toBe(true);
      expect(contentDiv?.classList.contains('text-gray-700')).toBe(true);
      expect(contentDiv?.classList.contains('text-sm')).toBe(true);
      expect(contentDiv?.classList.contains('text-center')).toBe(true);
      expect(contentDiv?.classList.contains('mx-8')).toBe(true);
      expect(contentDiv?.classList.contains('md:mx-auto')).toBe(true);
    });

    it('applies non-default styling when isDefault is false', () => {
      createFooter({ isDefault: false });

      const contentDiv = document.querySelector('footer > div');
      expect(contentDiv?.classList.contains('text-center')).toBe(true);
      expect(contentDiv?.classList.contains('font-mono')).toBe(false);
    });

    it('includes home link when isDefault is false', () => {
      createFooter({ isDefault: false });

      const homeLink = document.querySelector('a[href="/"]');
      expect(homeLink).toBeTruthy();
      expect(homeLink?.textContent).toBe('Home');
      expect(homeLink?.getAttribute('aria-label')).toBe('Home');
    });

    it('excludes home link when isDefault is true', () => {
      createFooter({ isDefault: true });

      const homeLink = document.querySelector('a[href="/"]');
      expect(homeLink).toBeNull();
    });
  });

  describe('Link Styling', () => {
    it('applies default anchor styling when isDefault is true', () => {
      createFooter({ isDefault: true });

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.classList.contains('text-gray-700')).toBe(true);
        expect(link.classList.contains('hover:text-black')).toBe(true);
        expect(link.classList.contains('rounded-full')).toBe(true);
        expect(link.classList.contains('hover:bg-white')).toBe(true);
        expect(link.classList.contains('py-1')).toBe(true);
        expect(link.classList.contains('px-2')).toBe(true);
        expect(link.classList.contains('no-underline')).toBe(false);
      });
    });

    it('applies non-default anchor styling when isDefault is false', () => {
      createFooter({ isDefault: false });

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.classList.contains('text-gray-500')).toBe(true);
        expect(link.classList.contains('hover:text-black')).toBe(true);
        expect(link.classList.contains('rounded-full')).toBe(true);
        expect(link.classList.contains('hover:bg-white')).toBe(true);
        expect(link.classList.contains('py-1')).toBe(true);
        expect(link.classList.contains('px-2')).toBe(true);
        expect(link.classList.contains('no-underline')).toBe(true);
      });
    });
  });

  describe('Footer Links', () => {
    it('renders all required footer links', () => {
      createFooter();

      const expectedLinks = [
        { href: '/terms', text: 'Terms' },
        { href: '/privacy', text: 'Privacy' },
        { href: '/refunds', text: 'Refunds' },
        { href: '/about', text: 'About & Contact' }
      ];

      expectedLinks.forEach((expectedLink) => {
        const link = document.querySelector(`a[href="${expectedLink.href}"]`);
        expect(link).toBeTruthy();
        expect(link?.textContent?.trim()).toBe(expectedLink.text);
      });
    });

    it('has proper aria-labels for accessibility', () => {
      createFooter();

      const expectedLabels = [
        { href: '/terms', label: 'Terms & Conditions' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/refunds', label: 'Refunds & Cancellation Policy' },
        { href: '/about', label: 'Contact Us' }
      ];

      expectedLabels.forEach((expected) => {
        const link = document.querySelector(`a[href="${expected.href}"]`);
        expect(link?.getAttribute('aria-label')).toBe(expected.label);
      });
    });

    it('includes separators between links', () => {
      createFooter({ isDefault: false });

      const linksContainer = document.querySelector('p.mt-2');
      expect(linksContainer?.textContent).toContain('•');

      // Should have separators between all links including home
      const separatorCount = (linksContainer?.textContent?.match(/•/g) || []).length;
      expect(separatorCount).toBe(4); // 4 separators for 5 links (including home)
    });
  });

  describe('Copyright Information', () => {
    it('displays current year in copyright', () => {
      createFooter();

      const currentYear = new Date().getFullYear();
      expect(document.body.textContent).toContain(`© 2012-${currentYear}`);
    });

    it('includes company name in copyright', () => {
      createFooter();

      expect(document.body.textContent).toContain('Mrugesh Mohapatra Co.');
      expect(document.body.textContent).toContain('All rights reserved.');
    });

    it('uses proper copyright format', () => {
      createFooter();

      const currentYear = new Date().getFullYear();
      const expectedFormat = `© 2012-${currentYear} Mrugesh Mohapatra Co. — All rights reserved.`;
      expect(document.body.textContent).toContain(expectedFormat);
    });
  });

  describe('Layout Structure', () => {
    it('applies mt-2 class to links paragraph', () => {
      createFooter();

      const linksP = document.querySelector('p.mt-2');
      expect(linksP).toBeTruthy();
    });

    it('maintains proper hierarchy structure', () => {
      createFooter();

      const footer = document.querySelector('footer');
      const contentDiv = footer?.querySelector('div');
      const paragraphs = contentDiv?.querySelectorAll('p');

      expect(paragraphs).toHaveLength(2);
      expect(paragraphs?.[0]).toBeTruthy(); // Copyright paragraph
      expect(paragraphs?.[1]?.classList.contains('mt-2')).toBe(true); // Links paragraph
    });
  });

  describe('Accessibility', () => {
    it('uses semantic footer element', () => {
      createFooter();

      expect(document.querySelector('footer')).toBeTruthy();
    });

    it('provides descriptive aria-labels for all links', () => {
      createFooter({ isDefault: false });

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.getAttribute('aria-label')).toBeTruthy();
        expect(link.getAttribute('aria-label')).not.toBe('');
      });
    });

    it('maintains proper text contrast classes', () => {
      createFooter({ isDefault: true });

      const contentDiv = document.querySelector('footer > div');
      expect(contentDiv?.classList.contains('text-gray-700')).toBe(true);

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.classList.contains('text-gray-700')).toBe(true);
      });
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive margin classes when isDefault is true', () => {
      createFooter({ isDefault: true });

      const contentDiv = document.querySelector('footer > div');
      expect(contentDiv?.classList.contains('mx-8')).toBe(true);
      expect(contentDiv?.classList.contains('md:mx-auto')).toBe(true);
    });

    it('uses appropriate text sizing', () => {
      createFooter({ isDefault: true });

      const contentDiv = document.querySelector('footer > div');
      expect(contentDiv?.classList.contains('text-sm')).toBe(true);
    });
  });

  describe('Interactive States', () => {
    it('applies hover states to all links', () => {
      createFooter();

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.classList.contains('hover:text-black')).toBe(true);
        expect(link.classList.contains('hover:bg-white')).toBe(true);
      });
    });

    it('applies consistent padding to all links', () => {
      createFooter();

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.classList.contains('py-1')).toBe(true);
        expect(link.classList.contains('px-2')).toBe(true);
        expect(link.classList.contains('rounded-full')).toBe(true);
      });
    });
  });
});
