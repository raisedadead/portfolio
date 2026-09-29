import CalButton from '@/components/cal-embed';
import { getCalApi } from '@calcom/embed-react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const cal = vi.fn();

vi.mock('@calcom/embed-react', () => ({
  getCalApi: vi.fn(() => Promise.resolve(cal))
}));

describe('CalButton Component', () => {
  beforeEach(() => {
    vi.mocked(getCalApi).mockClear();
    cal.mockClear();
  });

  it('does not load the Cal.com embed before the visitor shows intent', () => {
    render(<CalButton>Test</CalButton>);

    expect(getCalApi).not.toHaveBeenCalled();
  });

  it('loads the Cal.com embed once on hover or focus', async () => {
    render(<CalButton>Test</CalButton>);
    const button = screen.getByRole('button');

    fireEvent.pointerEnter(button);
    fireEvent.focus(button);

    await waitFor(() => expect(cal).toHaveBeenCalledWith('ui', expect.any(Object)));
    expect(getCalApi).toHaveBeenCalledTimes(1);
  });

  it('opens the booking modal on click', async () => {
    render(<CalButton>Test</CalButton>);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() =>
      expect(cal).toHaveBeenCalledWith('modal', { calLink: 'mrugesh/meet', config: { layout: 'month_view' } })
    );
  });

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

  it('has correct button type', () => {
    render(<CalButton>Test</CalButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
