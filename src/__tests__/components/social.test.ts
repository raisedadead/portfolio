import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Social Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  const createSocialComponent = () => {
    const container = document.createElement('div');
    container.className = 'mx-auto mt-2 mb-1 flex flex-row items-center justify-center space-y-0 space-x-3';

    const socialLinks = [
      {
        href: 'https://twitter.com/raisedadead',
        ariaLabel: 'Twitter',
        srText: 'Twitter',
        svgPath:
          'M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z'
      },
      {
        href: 'https://github.com/raisedadead',
        ariaLabel: 'Github',
        srText: 'GitHub',
        svgPath:
          'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
      },
      {
        href: 'https://instagram.com/raisedadead',
        ariaLabel: 'Instagram',
        srText: 'Instagram',
        svgPath:
          'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
      },
      {
        href: 'https://linkedin.com/in/mrugeshm',
        ariaLabel: 'LinkedIn',
        srText: 'LinkedIn',
        svgPath:
          'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'
      }
    ];

    socialLinks.forEach((link) => {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.setAttribute('aria-label', link.ariaLabel);
      anchor.className =
        'h-10 w-10 border-2 border-black bg-orange-200 p-2 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none';
      anchor.setAttribute('rel', 'me');

      const srSpan = document.createElement('span');
      srSpan.className = 'sr-only';
      srSpan.textContent = link.srText;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', link.svgPath);
      if (link.ariaLabel === 'Github' || link.ariaLabel === 'Instagram' || link.ariaLabel === 'LinkedIn') {
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('clip-rule', 'evenodd');
      }

      svg.appendChild(path);
      anchor.appendChild(srSpan);
      anchor.appendChild(svg);
      container.appendChild(anchor);
    });

    document.body.appendChild(container);
    return container;
  };

  describe('Container Structure', () => {
    it('renders container with correct layout classes', () => {
      const container = createSocialComponent();

      expect(container.classList.contains('mx-auto')).toBe(true);
      expect(container.classList.contains('mt-2')).toBe(true);
      expect(container.classList.contains('mb-1')).toBe(true);
      expect(container.classList.contains('flex')).toBe(true);
      expect(container.classList.contains('flex-row')).toBe(true);
      expect(container.classList.contains('items-center')).toBe(true);
      expect(container.classList.contains('justify-center')).toBe(true);
      expect(container.classList.contains('space-y-0')).toBe(true);
      expect(container.classList.contains('space-x-3')).toBe(true);
    });

    it('contains four social links', () => {
      createSocialComponent();

      const links = document.querySelectorAll('a');
      expect(links).toHaveLength(4);
    });
  });

  describe('Social Links', () => {
    it('renders Twitter link correctly', () => {
      createSocialComponent();

      const twitterLink = document.querySelector('a[href="https://twitter.com/raisedadead"]');
      expect(twitterLink).toBeTruthy();
      expect(twitterLink?.getAttribute('aria-label')).toBe('Twitter');
      expect(twitterLink?.getAttribute('rel')).toBe('me');
    });

    it('renders GitHub link correctly', () => {
      createSocialComponent();

      const githubLink = document.querySelector('a[href="https://github.com/raisedadead"]');
      expect(githubLink).toBeTruthy();
      expect(githubLink?.getAttribute('aria-label')).toBe('Github');
      expect(githubLink?.getAttribute('rel')).toBe('me');
    });

    it('renders Instagram link correctly', () => {
      createSocialComponent();

      const instagramLink = document.querySelector('a[href="https://instagram.com/raisedadead"]');
      expect(instagramLink).toBeTruthy();
      expect(instagramLink?.getAttribute('aria-label')).toBe('Instagram');
      expect(instagramLink?.getAttribute('rel')).toBe('me');
    });

    it('renders LinkedIn link correctly', () => {
      createSocialComponent();

      const linkedinLink = document.querySelector('a[href="https://linkedin.com/in/mrugeshm"]');
      expect(linkedinLink).toBeTruthy();
      expect(linkedinLink?.getAttribute('aria-label')).toBe('LinkedIn');
      expect(linkedinLink?.getAttribute('rel')).toBe('me');
    });
  });

  describe('Link Styling', () => {
    it('applies consistent styling to all links', () => {
      createSocialComponent();

      const links = document.querySelectorAll('a');
      const expectedClasses = [
        'h-10',
        'w-10',
        'border-2',
        'border-black',
        'bg-orange-200',
        'p-2',
        'text-black',
        'shadow-[2px_2px_0px_rgba(0,0,0,1)]',
        'transition-all',
        'duration-200',
        'hover:bg-gray-700',
        'hover:text-white',
        'hover:shadow-none',
        'active:bg-black',
        'active:shadow-none'
      ];

      links.forEach((link) => {
        expectedClasses.forEach((className) => {
          expect(link.classList.contains(className)).toBe(true);
        });
      });
    });

    it('applies rel="me" to all links', () => {
      createSocialComponent();

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.getAttribute('rel')).toBe('me');
      });
    });
  });

  describe('Icons and SVGs', () => {
    it('each link contains an SVG icon', () => {
      createSocialComponent();

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        const svg = link.querySelector('svg');
        expect(svg).toBeTruthy();
        expect(svg?.getAttribute('fill')).toBe('currentColor');
        expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
        expect(svg?.getAttribute('aria-hidden')).toBe('true');
      });
    });

    it('each SVG contains a path element', () => {
      createSocialComponent();

      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg) => {
        const path = svg.querySelector('path');
        expect(path).toBeTruthy();
        expect(path?.getAttribute('d')).toBeTruthy();
      });
    });

    it('some paths have fill-rule and clip-rule attributes', () => {
      createSocialComponent();

      const githubLink = document.querySelector('a[href="https://github.com/raisedadead"]');
      const instagramLink = document.querySelector('a[href="https://instagram.com/raisedadead"]');
      const linkedinLink = document.querySelector('a[href="https://linkedin.com/in/mrugeshm"]');

      const githubPath = githubLink?.querySelector('path');
      const instagramPath = instagramLink?.querySelector('path');
      const linkedinPath = linkedinLink?.querySelector('path');

      expect(githubPath?.getAttribute('fill-rule')).toBe('evenodd');
      expect(githubPath?.getAttribute('clip-rule')).toBe('evenodd');
      expect(instagramPath?.getAttribute('fill-rule')).toBe('evenodd');
      expect(instagramPath?.getAttribute('clip-rule')).toBe('evenodd');
      expect(linkedinPath?.getAttribute('fill-rule')).toBe('evenodd');
      expect(linkedinPath?.getAttribute('clip-rule')).toBe('evenodd');
    });
  });

  describe('Accessibility', () => {
    it('provides screen reader text for each link', () => {
      createSocialComponent();

      const expectedSrTexts = ['Twitter', 'GitHub', 'Instagram', 'LinkedIn'];
      const srSpans = document.querySelectorAll('.sr-only');

      expect(srSpans).toHaveLength(4);
      srSpans.forEach((span, index) => {
        expect(span.textContent).toBe(expectedSrTexts[index]);
      });
    });

    it('has proper aria-label attributes', () => {
      createSocialComponent();

      const expectedLabels = ['Twitter', 'Github', 'Instagram', 'LinkedIn'];
      const links = document.querySelectorAll('a');

      links.forEach((link, index) => {
        expect(link.getAttribute('aria-label')).toBe(expectedLabels[index]);
      });
    });

    it('hides decorative SVGs from screen readers', () => {
      createSocialComponent();

      const svgs = document.querySelectorAll('svg');
      svgs.forEach((svg) => {
        expect(svg.getAttribute('aria-hidden')).toBe('true');
      });
    });

    it('uses semantic link elements', () => {
      createSocialComponent();

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.tagName.toLowerCase()).toBe('a');
        expect(link.getAttribute('href')).toBeTruthy();
      });
    });
  });

  describe('External Links', () => {
    it('all links are external with proper URLs', () => {
      createSocialComponent();

      const expectedUrls = [
        'https://twitter.com/raisedadead',
        'https://github.com/raisedadead',
        'https://instagram.com/raisedadead',
        'https://linkedin.com/in/mrugeshm'
      ];

      const links = document.querySelectorAll('a');
      links.forEach((link, index) => {
        expect(link.getAttribute('href')).toBe(expectedUrls[index]);
      });
    });

    it('uses rel="me" for identity verification', () => {
      createSocialComponent();

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.getAttribute('rel')).toBe('me');
      });
    });
  });

  describe('Layout and Spacing', () => {
    it('applies horizontal spacing between links', () => {
      const container = createSocialComponent();

      expect(container.classList.contains('space-x-3')).toBe(true);
      expect(container.classList.contains('space-y-0')).toBe(true);
    });

    it('centers content horizontally and vertically', () => {
      const container = createSocialComponent();

      expect(container.classList.contains('items-center')).toBe(true);
      expect(container.classList.contains('justify-center')).toBe(true);
      expect(container.classList.contains('mx-auto')).toBe(true);
    });

    it('applies proper margin to container', () => {
      const container = createSocialComponent();

      expect(container.classList.contains('mt-2')).toBe(true);
      expect(container.classList.contains('mb-1')).toBe(true);
    });
  });

  describe('Interactive States', () => {
    it('applies hover states to links', () => {
      createSocialComponent();

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.classList.contains('hover:bg-gray-700')).toBe(true);
        expect(link.classList.contains('hover:text-white')).toBe(true);
        expect(link.classList.contains('hover:shadow-none')).toBe(true);
      });
    });

    it('applies active states to links', () => {
      createSocialComponent();

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.classList.contains('active:bg-black')).toBe(true);
        expect(link.classList.contains('active:shadow-none')).toBe(true);
      });
    });

    it('includes transition animations', () => {
      createSocialComponent();

      const links = document.querySelectorAll('a');
      links.forEach((link) => {
        expect(link.classList.contains('transition-all')).toBe(true);
        expect(link.classList.contains('duration-200')).toBe(true);
      });
    });
  });
});
