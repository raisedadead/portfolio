import { ScrollButton } from '@/components/scroll-button';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('ScrollButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 900, writable: true, configurable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 2000, configurable: true });
  });

  it('scrolls to the top through button activation', () => {
    render(<ScrollButton className='fixed' />);
    const button = screen.getByRole('button', { name: 'Scroll to top' });
    fireEvent.click(button);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it.each([0, 100])('hides when no scrolling is needed at offset %i', (offset) => {
    window.pageYOffset = offset;
    if (offset) Object.defineProperty(document.documentElement, 'scrollHeight', { value: 800, configurable: true });
    render(<ScrollButton className='fixed' />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
