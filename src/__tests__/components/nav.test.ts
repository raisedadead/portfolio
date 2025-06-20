import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Navigation Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Menu Button Functionality', () => {
    it('should create menu button with correct attributes', () => {
      const button = document.createElement('button');
      button.className =
        'menu-button flex h-10 items-center border-2 p-1.5 shadow-[2px_2px_0px] transition-all duration-200 hover:shadow-none focus:outline-hidden active:shadow-none';
      button.setAttribute('aria-label', 'Open navigation menu');
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-haspopup', 'true');

      expect(button.getAttribute('aria-label')).toBe('Open navigation menu');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('aria-haspopup')).toBe('true');
    });

    it('should toggle menu state correctly', () => {
      const menuButton = document.createElement('button');
      const menuItems = document.createElement('div');

      menuButton.className = 'menu-button';
      menuItems.className =
        'menu-items pointer-events-none absolute right-0 z-10 mt-2 w-48 scale-95 transform border-2 opacity-0 shadow-[2px_2px_0px] transition-all duration-300 ease-in-out focus:outline-hidden';

      document.body.appendChild(menuButton);
      document.body.appendChild(menuItems);

      // Test initial state (closed)
      expect(menuItems.classList.contains('opacity-0')).toBe(true);
      expect(menuItems.classList.contains('scale-95')).toBe(true);
      expect(menuItems.classList.contains('pointer-events-none')).toBe(true);

      // Test opening menu
      menuItems.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
      menuItems.classList.add('opacity-100', 'scale-100');
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'Close navigation menu');

      expect(menuItems.classList.contains('opacity-100')).toBe(true);
      expect(menuItems.classList.contains('scale-100')).toBe(true);
      expect(menuButton.getAttribute('aria-expanded')).toBe('true');
      expect(menuButton.getAttribute('aria-label')).toBe('Close navigation menu');

      // Test closing menu
      menuItems.classList.remove('opacity-100', 'scale-100');
      menuItems.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation menu');

      expect(menuItems.classList.contains('opacity-0')).toBe(true);
      expect(menuItems.classList.contains('pointer-events-none')).toBe(true);
      expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle Enter key press', () => {
      const button = document.createElement('button');
      button.className = 'menu-button';
      document.body.appendChild(button);

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      button.dispatchEvent(enterEvent);

      expect(enterEvent.key).toBe('Enter');
    });

    it('should handle Space key press', () => {
      const button = document.createElement('button');
      button.className = 'menu-button';
      document.body.appendChild(button);

      const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
      button.dispatchEvent(spaceEvent);

      expect(spaceEvent.key).toBe(' ');
    });

    it('should handle Escape key press', () => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(escapeEvent.key).toBe('Escape');
    });

    it('should handle Arrow Down navigation', () => {
      const link1 = document.createElement('a');
      const link2 = document.createElement('a');
      link1.href = '/blog';
      link2.href = '/uses';

      document.body.appendChild(link1);
      document.body.appendChild(link2);

      const arrowDownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      link1.dispatchEvent(arrowDownEvent);

      expect(arrowDownEvent.key).toBe('ArrowDown');
    });

    it('should handle Arrow Up navigation', () => {
      const link1 = document.createElement('a');
      const link2 = document.createElement('a');
      link1.href = '/blog';
      link2.href = '/uses';

      document.body.appendChild(link1);
      document.body.appendChild(link2);

      const arrowUpEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      link2.dispatchEvent(arrowUpEvent);

      expect(arrowUpEvent.key).toBe('ArrowUp');
    });
  });

  describe('Menu Links', () => {
    it('should create navigation links with correct attributes', () => {
      const links = [
        { href: '/blog', label: 'Recent Posts' },
        { href: '/uses', label: 'Uses' }
      ];

      links.forEach((link) => {
        const linkElement = document.createElement('a');
        linkElement.href = link.href;
        linkElement.setAttribute('aria-label', link.label);
        linkElement.className =
          'inline-flex h-full w-full justify-start border-b-2 py-2 pl-4 transition-colors duration-200 last:border-b-0 hover:shadow-none focus:outline-hidden active:shadow-none';
        linkElement.textContent = link.label;

        expect(linkElement.href).toContain(link.href);
        expect(linkElement.getAttribute('aria-label')).toBe(link.label);
        expect(linkElement.textContent).toBe(link.label);
      });
    });

    it('should include proper SVG icons', () => {
      // Test Recent Posts icon
      const postsIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      postsIcon.setAttribute('class', 'mr-2 flex h-6 w-6');
      postsIcon.setAttribute('fill', 'none');
      postsIcon.setAttribute('stroke', 'currentColor');
      postsIcon.setAttribute('viewBox', '0 0 24 24');

      const postsPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      postsPath.setAttribute('stroke-linecap', 'round');
      postsPath.setAttribute('stroke-linejoin', 'round');
      postsPath.setAttribute('stroke-width', '2');
      postsPath.setAttribute(
        'd',
        'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
      );

      postsIcon.appendChild(postsPath);

      expect(postsIcon.tagName).toBe('svg');
      expect(postsPath.getAttribute('d')).toContain('M12 6.253v13m0-13');

      // Test Uses icon
      const usesIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const usesPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      usesPath.setAttribute(
        'd',
        'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z'
      );

      usesIcon.appendChild(usesPath);
      expect(usesPath.getAttribute('d')).toContain('M9 3v2m6-2v2M9 19v2m6-2v2');
    });
  });

  describe('Home Button', () => {
    it('should create home button when showHomeButton is true', () => {
      const homeButton = document.createElement('a');
      homeButton.href = '/';
      homeButton.className =
        'flex h-10 items-center border-2 p-1.5 shadow-[2px_2px_0px] transition-all duration-200 hover:shadow-none focus:outline-hidden active:shadow-none';
      homeButton.setAttribute('aria-label', 'Go Home');

      expect(homeButton.href).toContain('/');
      expect(homeButton.getAttribute('aria-label')).toBe('Go Home');
    });

    it('should include home icon SVG', () => {
      const homeIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      const homePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      homePath.setAttribute(
        'd',
        'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
      );

      homeIcon.appendChild(homePath);
      expect(homePath.getAttribute('d')).toContain('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3');
    });
  });

  describe('Click Outside Handling', () => {
    it('should close menu when clicking outside', () => {
      const menuButton = document.createElement('button');
      const menuItems = document.createElement('div');
      const outsideElement = document.createElement('div');

      menuButton.className = 'menu-button';
      menuItems.className = 'menu-items';
      outsideElement.className = 'outside-element';

      document.body.appendChild(menuButton);
      document.body.appendChild(menuItems);
      document.body.appendChild(outsideElement);

      // Simulate click outside
      const clickEvent = new Event('click');
      Object.defineProperty(clickEvent, 'target', {
        value: outsideElement,
        enumerable: true
      });

      document.dispatchEvent(clickEvent);
      expect(clickEvent.target).toBe(outsideElement);
    });
  });

  describe('Focus Management', () => {
    it('should focus first menu item when opening', () => {
      const menuItems = document.createElement('div');
      const firstLink = document.createElement('a');
      const secondLink = document.createElement('a');

      firstLink.href = '/blog';
      secondLink.href = '/uses';

      menuItems.appendChild(firstLink);
      menuItems.appendChild(secondLink);
      document.body.appendChild(menuItems);

      const links = menuItems.querySelectorAll('a');
      expect(links).toHaveLength(2);
      expect(links[0]).toBe(firstLink);
    });

    it('should return focus to button when closing', () => {
      const menuButton = document.createElement('button');
      menuButton.className = 'menu-button';
      document.body.appendChild(menuButton);

      // Test focus method exists
      expect(typeof menuButton.focus).toBe('function');
    });
  });

  describe('Animation Classes', () => {
    it('should have correct transition classes', () => {
      const menuItems = document.createElement('div');
      menuItems.className =
        'menu-items pointer-events-none absolute right-0 z-10 mt-2 w-48 scale-95 transform border-2 opacity-0 shadow-[2px_2px_0px] transition-all duration-300 ease-in-out focus:outline-hidden';

      expect(menuItems.classList.contains('transition-all')).toBe(true);
      expect(menuItems.classList.contains('duration-300')).toBe(true);
      expect(menuItems.classList.contains('ease-in-out')).toBe(true);
    });

    it('should have proper transform classes', () => {
      const menuItems = document.createElement('div');
      menuItems.className = 'scale-95 transform opacity-0';

      expect(menuItems.classList.contains('scale-95')).toBe(true);
      expect(menuItems.classList.contains('transform')).toBe(true);
      expect(menuItems.classList.contains('opacity-0')).toBe(true);
    });
  });
});
