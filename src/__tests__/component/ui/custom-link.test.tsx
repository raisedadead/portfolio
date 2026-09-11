import { CustomLink } from '@/components/custom-link';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

describe('CustomLink', () => {
  it('forwards native anchor attributes, events, and its ref', () => {
    const ref = createRef<HTMLAnchorElement>();
    const onKeyDown = vi.fn();
    const onFocus = vi.fn();
    render(
      <CustomLink
        href='/blog'
        id='menu-blog'
        role='menuitem'
        tabIndex={-1}
        aria-label='Read articles'
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        ref={ref}
      >
        Blog
      </CustomLink>
    );
    const link = screen.getByRole('menuitem', { name: 'Read articles' });
    expect(link).toHaveAttribute('id', 'menu-blog');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(ref.current).toBe(link);
    link.focus();
    fireEvent.keyDown(link, { key: 'Enter' });
    expect(onFocus).toHaveBeenCalledOnce();
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it.each(['https://example.com', '//example.com'])('protects a new external tab at %s and preserves rel', (href) => {
    render(
      <CustomLink href={href} target='_blank' rel='me'>
        External
      </CustomLink>
    );
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'me noopener noreferrer');
  });

  it('preserves rel for links in the current tab', () => {
    render(
      <CustomLink href='/blog' rel='bookmark'>
        Blog
      </CustomLink>
    );
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'bookmark');
  });
});
