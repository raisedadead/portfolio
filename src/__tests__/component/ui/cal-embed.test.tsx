import CalButton from '@/components/cal-embed';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock the Cal API
vi.mock('@calcom/embed-react', () => ({
  getCalApi: vi.fn(() => Promise.resolve(vi.fn()))
}));

describe('CalButton Component', () => {
  it('renders button with children text', () => {
    render(<CalButton>Schedule a Meeting</CalButton>);

    expect(screen.getByText('Schedule a Meeting')).toBeTruthy();
  });

  it('applies default className', () => {
    render(<CalButton>Test</CalButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('cal-embed-button');
  });

  it('applies custom className when provided', () => {
    render(<CalButton className='custom-class'>Test</CalButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('cal-embed-button', 'custom-class');
  });

  it('has correct data attributes for Cal.com integration', () => {
    render(<CalButton>Test</CalButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-cal-namespace', 'meet');
    expect(button).toHaveAttribute('data-cal-link', 'mrugesh/meet');
    expect(button).toHaveAttribute('data-cal-config', '{"layout":"month_view"}');
  });

  it('has correct button type', () => {
    render(<CalButton>Test</CalButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
