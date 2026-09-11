import { Nav } from '@/components/layout/nav';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('Nav', () => {
  it('opens the real menu with accessible links and closes on Escape', async () => {
    render(<Nav />);
    const trigger = screen.getByRole('button', { name: 'Open navigation menu' });
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.click(trigger);
    const menu = await screen.findByRole('menu');
    const blog = screen.getByRole('menuitem', { name: 'Recent Posts' });
    expect(blog).toHaveAttribute('href', '/blog');
    expect(screen.getByRole('menuitem', { name: 'Uses' })).toHaveAttribute('href', '/uses');
    fireEvent.keyDown(menu, { key: 'ArrowDown' });
    await waitFor(() => expect(menu).toHaveAttribute('aria-activedescendant', blog.id));
    expect(blog.id).not.toBe('');
    fireEvent.keyDown(menu, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('can omit the home link', () => {
    const { rerender } = render(<Nav />);
    expect(screen.getByRole('link', { name: 'Go Home' })).toHaveAttribute('href', '/');
    rerender(<Nav showHomeButton={false} />);
    expect(screen.queryByRole('link', { name: 'Go Home' })).not.toBeInTheDocument();
  });
});
