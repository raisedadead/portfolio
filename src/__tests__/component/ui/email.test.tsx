import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Email } from '@/components/email';

describe('Email', () => {
  it('renders obfuscated email with proper styling', () => {
    render(<Email />);
    const emailElement = screen.getByText('ved.hsegurm@troppus');

    expect(emailElement).toBeInTheDocument();
    expect(emailElement).toHaveClass('font-medium', 'underline');
  });

  it('applies RTL direction for anti-bot protection', () => {
    render(<Email />);
    const emailElement = screen.getByText('ved.hsegurm@troppus');

    expect(emailElement).toHaveClass('email-rtl');
  });

  it('transforms email correctly', () => {
    const originalInput = 'supPo    Rt @ mrug esh.dev';
    const expectedProcessed = originalInput.toLowerCase().replace(/ /g, '').split('').reverse().join('');

    expect(expectedProcessed).toBe('ved.hsegurm@troppus');

    render(<Email />);
    expect(screen.getByText(expectedProcessed)).toBeInTheDocument();
  });
});
