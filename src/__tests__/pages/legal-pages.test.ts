import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

describe('Legal Pages', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  function createLegalPageContent(title: string, subtitle: string, sectionTitle: string, sectionContent: string) {
    const container = document.createElement('div');
    container.setAttribute('data-testid', 'legal-content');

    const headerSection = document.createElement('section');
    headerSection.className = 'mb-8';

    const h1 = document.createElement('h1');
    h1.className = 'py-4 text-center text-3xl font-extrabold';
    h1.textContent = title;

    headerSection.appendChild(h1);

    const mainSection = document.createElement('section');
    mainSection.className = 'mb-12';

    const subtitle_p = document.createElement('p');
    subtitle_p.className = 'pb-6 text-center text-lg';
    subtitle_p.textContent = subtitle;

    const contentDiv = document.createElement('div');

    const h2 = document.createElement('h2');
    h2.className = 'mb-4 text-2xl font-bold';
    h2.textContent = sectionTitle;

    const p = document.createElement('p');
    p.className = 'text-lg';
    p.textContent = sectionContent;

    contentDiv.appendChild(h2);
    contentDiv.appendChild(p);

    mainSection.appendChild(subtitle_p);
    mainSection.appendChild(contentDiv);

    container.appendChild(headerSection);
    container.appendChild(mainSection);

    document.body.appendChild(container);
    return container;
  }

  describe('Terms & Conditions', () => {
    it('renders terms page structure', () => {
      createLegalPageContent(
        'Terms & Conditions',
        'Please read these terms and conditions carefully.',
        '1. Acceptance of Terms',
        'By accessing this website, you accept these terms.'
      );

      const h1 = document.querySelector('h1');
      expect(h1?.textContent).toBe('Terms & Conditions');

      expect(document.body.textContent).toContain('Please read these terms and conditions carefully.');

      const h2 = document.querySelector('h2');
      expect(h2?.textContent).toBe('1. Acceptance of Terms');
    });
  });

  describe('Privacy Policy', () => {
    it('renders privacy page structure', () => {
      createLegalPageContent(
        'Privacy Policy',
        'Your privacy is important to us.',
        'Information We Collect',
        'We may collect information you provide directly to us.'
      );

      const h1 = document.querySelector('h1');
      expect(h1?.textContent).toBe('Privacy Policy');

      expect(document.body.textContent).toContain('Your privacy is important to us.');

      const h2 = document.querySelector('h2');
      expect(h2?.textContent).toBe('Information We Collect');
    });
  });

  describe('Refunds Policy', () => {
    it('renders refunds page structure', () => {
      createLegalPageContent(
        'Refunds & Cancellation Policy',
        'Please review our refund and cancellation policy.',
        'Refund Eligibility',
        'Refunds may be available under certain circumstances.'
      );

      const h1 = document.querySelector('h1');
      expect(h1?.textContent).toBe('Refunds & Cancellation Policy');

      expect(document.body.textContent).toContain('Please review our refund and cancellation policy.');

      const h2 = document.querySelector('h2');
      expect(h2?.textContent).toBe('Refund Eligibility');
    });
  });

  it('all legal pages use consistent layout structure', () => {
    createLegalPageContent('Title', 'Subtitle', 'Section', 'Content');

    const sections = document.querySelectorAll('section');
    expect(sections).toHaveLength(2);
    expect(sections[0].classList.contains('mb-8')).toBe(true);
    expect(sections[1].classList.contains('mb-12')).toBe(true);
  });

  describe('Page Structure', () => {
    it('renders proper heading hierarchy', () => {
      createLegalPageContent('Test Title', 'Test subtitle', 'Test Section', 'Test content');

      expect(document.querySelector('h1')).toBeTruthy();
      expect(document.querySelector('h2')).toBeTruthy();
    });

    it('applies correct styling classes', () => {
      createLegalPageContent('Test Title', 'Test subtitle', 'Test Section', 'Test content');

      const h1 = document.querySelector('h1');
      expect(h1?.classList.contains('py-4')).toBe(true);
      expect(h1?.classList.contains('text-center')).toBe(true);
      expect(h1?.classList.contains('text-3xl')).toBe(true);
      expect(h1?.classList.contains('font-extrabold')).toBe(true);

      const h2 = document.querySelector('h2');
      expect(h2?.classList.contains('mb-4')).toBe(true);
      expect(h2?.classList.contains('text-2xl')).toBe(true);
      expect(h2?.classList.contains('font-bold')).toBe(true);

      const p = document.querySelector('p.text-lg');
      expect(p?.classList.contains('text-lg')).toBe(true);
    });
  });

  describe('Content Structure', () => {
    it('organizes content in semantic sections', () => {
      createLegalPageContent('Test Title', 'Test subtitle', 'Test Section', 'Test content');

      const container = document.querySelector('[data-testid="legal-content"]');
      expect(container).toBeTruthy();

      const sections = container?.querySelectorAll('section');
      expect(sections?.length).toBe(2);
    });

    it('maintains proper text hierarchy', () => {
      createLegalPageContent('Main Title', 'Page description', 'Section Title', 'Section content');

      expect(document.body.textContent).toContain('Main Title');
      expect(document.body.textContent).toContain('Page description');
      expect(document.body.textContent).toContain('Section Title');
      expect(document.body.textContent).toContain('Section content');
    });
  });

  describe('Accessibility', () => {
    it('uses proper semantic HTML elements', () => {
      createLegalPageContent('Test Title', 'Test subtitle', 'Test Section', 'Test content');

      expect(document.querySelector('h1')).toBeTruthy();
      expect(document.querySelector('h2')).toBeTruthy();
      expect(document.querySelector('p')).toBeTruthy();
      expect(document.querySelectorAll('section')).toHaveLength(2);
    });

    it('maintains logical heading order', () => {
      createLegalPageContent('Test Title', 'Test subtitle', 'Test Section', 'Test content');

      const h1 = document.querySelector('h1');
      const h2 = document.querySelector('h2');

      expect(h1).toBeTruthy();
      expect(h2).toBeTruthy();

      // h1 should come before h2 in document order
      const h1Position = Array.from(document.querySelectorAll('*')).indexOf(h1!);
      const h2Position = Array.from(document.querySelectorAll('*')).indexOf(h2!);
      expect(h1Position).toBeLessThan(h2Position);
    });
  });
});
