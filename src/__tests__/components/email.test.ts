import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Email Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  const createEmailComponent = () => {
    // Simulate the email obfuscation logic from the Astro component
    const email = new String('supPo    Rt @ mrug esh.dev').toLowerCase().replace(/ /g, '').split('').reverse().join('');

    const span = document.createElement('span');
    span.className = 'font-medium underline';
    span.style.unicodeBidi = 'bidi-override';
    span.style.direction = 'rtl';
    span.style.textAlign = 'left';
    span.textContent = email;

    document.body.appendChild(span);
    return span;
  };

  describe('Email Obfuscation', () => {
    it('obfuscates email correctly', () => {
      const emailElement = createEmailComponent();

      // The original email should be 'support@mrugesh.dev'
      // After obfuscation: 'supPo    Rt @ mrug esh.dev' -> 'support@mrugesh.dev' -> reversed
      const expectedObfuscatedEmail = 'ved.hsegurm@troppus';

      expect(emailElement.textContent).toBe(expectedObfuscatedEmail);
    });

    it('applies correct styling for text direction', () => {
      const emailElement = createEmailComponent();

      expect(emailElement.style.unicodeBidi).toBe('bidi-override');
      expect(emailElement.style.direction).toBe('rtl');
      expect(emailElement.style.textAlign).toBe('left');
    });
  });

  describe('Styling', () => {
    it('applies correct CSS classes', () => {
      const emailElement = createEmailComponent();

      expect(emailElement.classList.contains('font-medium')).toBe(true);
      expect(emailElement.classList.contains('underline')).toBe(true);
    });

    it('uses span element', () => {
      const emailElement = createEmailComponent();

      expect(emailElement.tagName.toLowerCase()).toBe('span');
    });
  });

  describe('Accessibility', () => {
    it('renders as text content', () => {
      const emailElement = createEmailComponent();

      expect(emailElement.textContent).toBeTruthy();
      expect(typeof emailElement.textContent).toBe('string');
    });

    it('maintains semantic meaning through styling', () => {
      const emailElement = createEmailComponent();

      // The email should be visually readable due to RTL styling
      // even though the underlying text is reversed
      expect(emailElement.style.direction).toBe('rtl');
      expect(emailElement.style.unicodeBidi).toBe('bidi-override');
    });
  });

  describe('Content Validation', () => {
    it('contains email-like structure when reversed', () => {
      const emailElement = createEmailComponent();
      const reversedEmail = emailElement.textContent?.split('').reverse().join('');

      // When reversed back, it should look like an email
      expect(reversedEmail).toContain('@');
      expect(reversedEmail).toContain('.');
      expect(reversedEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('reveals correct email address when reversed', () => {
      const emailElement = createEmailComponent();
      const reversedEmail = emailElement.textContent?.split('').reverse().join('');

      expect(reversedEmail).toBe('support@mrugesh.dev');
    });
  });

  describe('Anti-Spam Protection', () => {
    it('does not contain readable email in original text', () => {
      const emailElement = createEmailComponent();
      const originalText = emailElement.textContent || '';

      // The text should not start with typical email patterns
      expect(originalText).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(originalText).not.toMatch(/^support@/);
      expect(originalText).not.toMatch(/\.dev$/);
    });

    it('obfuscates @ symbol position', () => {
      const emailElement = createEmailComponent();
      const originalText = emailElement.textContent || '';

      // The @ symbol should not be in the typical position for an email
      const atIndex = originalText.indexOf('@');
      expect(atIndex).not.toBe(-1); // @ should exist
      expect(atIndex).not.toBe(7); // But not at position 7 where it would be in 'support@'
    });
  });

  describe('Visual Rendering', () => {
    it('applies proper font weight and decoration', () => {
      const emailElement = createEmailComponent();

      expect(emailElement.classList.contains('font-medium')).toBe(true);
      expect(emailElement.classList.contains('underline')).toBe(true);
    });

    it('maintains inline display characteristics', () => {
      const emailElement = createEmailComponent();

      // Span elements are inline by default
      expect(emailElement.tagName.toLowerCase()).toBe('span');
      // Should not have block-level styling
      expect(emailElement.style.display).not.toBe('block');
    });
  });
});
