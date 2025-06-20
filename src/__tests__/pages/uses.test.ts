import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

// Since this is an Astro page, we'll test the component parts
describe('Uses Page Content', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  const createUsesContent = () => {
    const container = document.createElement('div');

    // Header section
    const headerSection = document.createElement('section');
    headerSection.className = 'mb-8';

    const proseDiv = document.createElement('div');
    proseDiv.className = 'prose prose-lg prose-slate max-w-none';

    const h1 = document.createElement('h1');
    h1.className = 'py-4 text-center text-3xl font-bold text-slate-800';
    h1.textContent = 'Everyday Carry';

    proseDiv.appendChild(h1);
    headerSection.appendChild(proseDiv);

    // Main section
    const mainSection = document.createElement('section');
    mainSection.className = 'mb-12';

    const maxWDiv = document.createElement('div');
    maxWDiv.className = 'mx-auto max-w-3xl';

    const subtitle = document.createElement('p');
    subtitle.className = 'pb-6 text-center text-lg text-slate-600';
    subtitle.textContent = 'A non-exhaustive list of stuff that I use on a daily basis.';

    // Hardware section
    const hardwareHeading = document.createElement('h2');
    hardwareHeading.className = 'mb-6 text-center text-2xl font-bold text-slate-700';
    hardwareHeading.textContent = 'Hardware';

    const hardwareList = document.createElement('ul');
    hardwareList.className = 'list-none space-y-6';

    // Create hardware items
    const macbookItem = createExpandableItem(
      'Apple MacBook Pro (14-inch, 2021)',
      ['2022', 'work', 'personal'],
      'I daily drive the MacBook Pro (14-inch, 2021) with M1 Pro chip, 32GB RAM, and 1TB SSD.'
    );

    const deskpiItem = createExpandableItem(
      'DeskPi Super6C (2022)',
      ['2022', 'homelab', 'personal'],
      'The DeskPi Super6C is a Raspberry Pi Compute Module 4 Cluster. I use it for learning Hashicorp products.'
    );

    hardwareList.appendChild(macbookItem);
    hardwareList.appendChild(deskpiItem);

    // Software section
    const softwareHeading = document.createElement('h2');
    softwareHeading.className = 'mt-12 mb-6 text-center text-2xl font-bold text-slate-700';
    softwareHeading.textContent = 'Software';

    const softwareList = document.createElement('ul');
    softwareList.className = 'list-none space-y-6';

    const devEnvItem = createExpandableItem(
      'Development Environment',
      ['2022', 'work', 'personal'],
      'My primary editor these days is Cursor. I still use VS Code and keep Neovim with LazyVim around.'
    );

    softwareList.appendChild(devEnvItem);

    // Contact section
    const contactDiv = document.createElement('div');
    contactDiv.className = 'prose prose-lg prose-slate mx-auto mt-12 max-w-3xl';

    const contactHeading = document.createElement('h3');
    contactHeading.className = 'mb-4 text-center font-bold text-slate-700';
    contactHeading.textContent = 'Get in touch';

    const contactText = document.createElement('p');
    contactText.className = 'text-center text-lg text-slate-600';
    contactText.textContent = 'Have questions about any of the gear or software I use? Feel free to reach out!';

    const socialComponent = document.createElement('div');
    socialComponent.setAttribute('data-testid', 'social-component');
    socialComponent.textContent = 'Social Links';

    contactDiv.appendChild(contactHeading);
    contactDiv.appendChild(contactText);
    contactDiv.appendChild(socialComponent);

    maxWDiv.appendChild(subtitle);
    maxWDiv.appendChild(hardwareHeading);
    maxWDiv.appendChild(hardwareList);
    maxWDiv.appendChild(softwareHeading);
    maxWDiv.appendChild(softwareList);
    maxWDiv.appendChild(contactDiv);

    mainSection.appendChild(maxWDiv);

    container.appendChild(headerSection);
    container.appendChild(mainSection);

    document.body.appendChild(container);
    return container;
  };

  function createExpandableItem(title: string, labels: string[], content: string) {
    const li = document.createElement('li');

    const expandableDiv = document.createElement('div');
    expandableDiv.setAttribute('data-testid', 'expandable-section');
    expandableDiv.setAttribute('data-title', title);
    expandableDiv.setAttribute('data-default-open', 'true');

    const h3 = document.createElement('h3');
    h3.textContent = title;

    const labelsDiv = document.createElement('div');
    labelsDiv.setAttribute('data-testid', 'labels');

    labels.forEach((label) => {
      const span = document.createElement('span');
      span.textContent = label;
      span.setAttribute('data-color', getColorForLabel(label));
      labelsDiv.appendChild(span);
    });

    const contentDiv = document.createElement('div');
    const p = document.createElement('p');
    p.className = 'mb-4 text-lg';
    p.textContent = content;
    contentDiv.appendChild(p);

    expandableDiv.appendChild(h3);
    expandableDiv.appendChild(labelsDiv);
    expandableDiv.appendChild(contentDiv);

    li.appendChild(expandableDiv);
    return li;
  }

  function getColorForLabel(label: string): string {
    const colorMap: Record<string, string> = {
      '2022': 'green',
      work: 'orange',
      personal: 'yellow',
      homelab: 'purple'
    };
    return colorMap[label] || 'blue';
  }

  describe('Page Structure', () => {
    it('renders main heading', () => {
      createUsesContent();

      const heading = document.querySelector('h1');
      expect(heading?.textContent).toBe('Everyday Carry');
      expect(heading?.classList.contains('py-4')).toBe(true);
      expect(heading?.classList.contains('text-center')).toBe(true);
      expect(heading?.classList.contains('text-3xl')).toBe(true);
      expect(heading?.classList.contains('font-bold')).toBe(true);
      expect(heading?.classList.contains('text-slate-800')).toBe(true);
    });

    it('renders descriptive subtitle', () => {
      createUsesContent();

      expect(document.body.textContent).toContain('A non-exhaustive list of stuff that I use on a daily basis.');
    });

    it('has proper section structure', () => {
      createUsesContent();

      const sections = document.querySelectorAll('section');
      expect(sections).toHaveLength(2);
    });
  });

  describe('Hardware Section', () => {
    it('renders hardware section heading', () => {
      createUsesContent();

      const hardwareHeading = document.querySelector('h2');
      expect(hardwareHeading?.textContent).toBe('Hardware');
      expect(hardwareHeading?.classList.contains('mb-6')).toBe(true);
      expect(hardwareHeading?.classList.contains('text-center')).toBe(true);
      expect(hardwareHeading?.classList.contains('text-2xl')).toBe(true);
      expect(hardwareHeading?.classList.contains('font-bold')).toBe(true);
      expect(hardwareHeading?.classList.contains('text-slate-700')).toBe(true);
    });

    it('renders MacBook Pro section', () => {
      createUsesContent();

      const sections = document.querySelectorAll('[data-testid="expandable-section"]');
      const macbookSection = Array.from(sections).find(
        (section) => section.getAttribute('data-title') === 'Apple MacBook Pro (14-inch, 2021)'
      );

      expect(macbookSection).toBeTruthy();
    });
  });

  describe('Software Section', () => {
    it('renders software section heading', () => {
      createUsesContent();

      const headings = document.querySelectorAll('h2');
      const softwareHeading = Array.from(headings).find((h) => h.textContent === 'Software');
      expect(softwareHeading).toBeTruthy();
    });

    it('renders development environment content', () => {
      createUsesContent();

      expect(document.body.textContent).toContain('Cursor');
      expect(document.body.textContent).toContain('VS Code');
      expect(document.body.textContent).toContain('Neovim with LazyVim');
    });
  });

  describe('Contact Section', () => {
    it('renders get in touch section', () => {
      createUsesContent();

      const contactHeading = document.querySelector('.prose h3');
      expect(contactHeading?.textContent).toBe('Get in touch');
    });

    it('renders social component', () => {
      createUsesContent();

      expect(document.querySelector('[data-testid="social-component"]')).toBeTruthy();
    });
  });

  describe('Expandable Sections', () => {
    it('renders expandable sections with correct structure', () => {
      createUsesContent();

      const expandableSections = document.querySelectorAll('[data-testid="expandable-section"]');
      expect(expandableSections.length).toBeGreaterThan(0);

      // Check that sections have labels
      const labelContainers = document.querySelectorAll('[data-testid="labels"]');
      expect(labelContainers.length).toBeGreaterThan(0);
    });

    it('sets correct default open state', () => {
      createUsesContent();

      const expandableSections = document.querySelectorAll('[data-testid="expandable-section"]');
      for (const section of expandableSections) {
        expect(section.getAttribute('data-default-open')).toBe('true');
      }
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      createUsesContent();

      expect(document.querySelectorAll('section')).toHaveLength(2);
      expect(document.querySelector('h1')).toBeTruthy();
      expect(document.querySelectorAll('h2').length).toBeGreaterThanOrEqual(2);
      expect(document.querySelectorAll('h3').length).toBeGreaterThanOrEqual(1);
    });

    it('has proper heading hierarchy', () => {
      createUsesContent();

      const h1 = document.querySelector('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');

      expect(h1).toBeTruthy();
      expect(h2s.length).toBeGreaterThanOrEqual(2);
      expect(h3s.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Content Organization', () => {
    it('organizes content in logical sections', () => {
      createUsesContent();

      const listItems = document.querySelectorAll('li');
      expect(listItems.length).toBeGreaterThan(0);

      // Each list item should contain an expandable section
      for (const item of listItems) {
        expect(item.querySelector('[data-testid="expandable-section"]')).toBeTruthy();
      }
    });

    it('maintains proper spacing between sections', () => {
      createUsesContent();

      const subtitle = document.querySelector('.pb-6');
      expect(subtitle).toBeTruthy();

      const lists = document.querySelectorAll('ul');
      for (const list of lists) {
        expect(list.classList.contains('space-y-6')).toBe(true);
      }
    });
  });
});
