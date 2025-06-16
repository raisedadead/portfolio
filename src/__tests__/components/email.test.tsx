import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Email } from '../../components/email';

describe('Email Component', () => {
  describe('Basic Rendering', () => {
    it('renders the email span element', () => {
      render(<Email />);

      const emailElement = screen.getByText(/ved\.hse/);
      expect(emailElement).toBeInTheDocument();
      expect(emailElement.tagName).toBe('SPAN');
    });

    it('has correct styling classes', () => {
      render(<Email />);

      const emailElement = screen.getByText(/ved\.hse/);
      expect(emailElement).toHaveClass('font-medium', 'underline');
    });
  });

  describe('Email Obfuscation', () => {
    it('displays email in reversed format', () => {
      render(<Email />);

      // The email should be displayed as reversed text
      const emailElement = screen.getByText(/ved\.hsegurm@troppus/);
      expect(emailElement).toBeInTheDocument();
    });

    it('processes email string correctly', () => {
      // Testing the transformation logic
      const originalInput = 'supPo    Rt @ mrug esh.dev';
      const expectedProcessed = originalInput
        .toLowerCase()
        .replace(/ /g, '')
        .split('')
        .reverse()
        .join('');

      expect(expectedProcessed).toBe('ved.hsegurm@troppus');

      render(<Email />);
      const emailElement = screen.getByText(expectedProcessed);
      expect(emailElement).toBeInTheDocument();
    });

    it('removes spaces from original email', () => {
      render(<Email />);

      // Verify no spaces remain in the displayed text
      const emailElement = screen.getByText(/ved\.hsegurm@troppus/);
      expect(emailElement.textContent).not.toContain(' ');
    });
  });

  describe('CSS Styling and Direction', () => {
    it('applies RTL (right-to-left) direction styling', () => {
      render(<Email />);

      const emailElement = screen.getByText(/ved\.hse/);
      expect(emailElement).toHaveStyle({
        direction: 'rtl',
        unicodeBidi: 'bidi-override',
        textAlign: 'left',
      });
    });

    it('uses inline styles for text direction', () => {
      render(<Email />);

      const emailElement = screen.getByText(/ved\.hse/);
      const styles = window.getComputedStyle(emailElement);

      // Note: In test environment, getComputedStyle may not reflect inline styles
      // So we check the style attribute directly
      expect(emailElement.style.direction).toBe('rtl');
      expect(emailElement.style.unicodeBidi).toBe('bidi-override');
      expect(emailElement.style.textAlign).toBe('left');
    });
  });

  describe('Anti-Bot Protection', () => {
    it('makes email harder for bots to parse', () => {
      render(<Email />);

      const emailElement = screen.getByText(/ved\.hse/);
      const displayedText = emailElement.textContent;

      // The displayed text should not be the readable email format
      expect(displayedText).not.toBe('support@mrugesh.dev');
      expect(displayedText).toBe('ved.hsegurm@troppus');
    });

    it('requires CSS to display correctly', () => {
      render(<Email />);

      const emailElement = screen.getByText(/ved\.hse/);

      // The component relies on CSS direction properties
      expect(emailElement.style.direction).toBe('rtl');
      expect(emailElement.style.unicodeBidi).toBe('bidi-override');
    });
  });

  describe('Visual Appearance', () => {
    it('appears as a link-like element', () => {
      render(<Email />);

      const emailElement = screen.getByText(/ved\.hse/);
      expect(emailElement).toHaveClass('font-medium', 'underline');
    });

    it('maintains text alignment', () => {
      render(<Email />);

      const emailElement = screen.getByText(/ved\.hse/);
      expect(emailElement.style.textAlign).toBe('left');
    });
  });

  describe('Accessibility', () => {
    it('renders as accessible text element', () => {
      render(<Email />);

      const emailElement = screen.getByText(/ved\.hse/);
      expect(emailElement).toBeInTheDocument();

      // Text should be accessible to screen readers
      expect(emailElement.textContent).toBeTruthy();
    });

    it('uses semantic span element', () => {
      render(<Email />);

      const emailElement = screen.getByText(/ved\.hse/);
      expect(emailElement.tagName).toBe('SPAN');
    });
  });

  describe('String Processing Edge Cases', () => {
    it('handles the specific input format correctly', () => {
      // The component uses a specific obfuscated input
      const testInput = 'supPo    Rt @ mrug esh.dev';
      const processed = testInput.toLowerCase().replace(/ /g, '').split('').reverse().join('');

      expect(processed).toBe('ved.hsegurm@troppus');
    });

    it('processes case conversion correctly', () => {
      const testInput = 'supPo    Rt @ mrug esh.dev';
      const lowercased = testInput.toLowerCase();

      expect(lowercased).toBe('suppo    rt @ mrug esh.dev');
    });

    it('removes all spaces correctly', () => {
      const testInput = 'suppo    rt @ mrug esh.dev';
      const spacesRemoved = testInput.replace(/ /g, '');

      expect(spacesRemoved).toBe('support@mrugesh.dev');
    });
  });

  describe('Component Export', () => {
    it('exports Email as named export', () => {
      expect(Email).toBeDefined();
      expect(typeof Email).toBe('function');
    });

    it('renders without props', () => {
      expect(() => render(<Email />)).not.toThrow();
    });
  });
});
