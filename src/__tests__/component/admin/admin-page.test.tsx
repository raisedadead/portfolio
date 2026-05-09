import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostForm from '@/components/admin/post-form';
import PostList from '@/components/admin/post-list';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  fetchMock.mockResolvedValue(
    new Response(
      JSON.stringify({
        cached: false,
        generatedAt: '2026-05-09T10:00:00Z',
        posts: [
          {
            slug: 'a',
            title: 'A',
            date: '2026-05-01T00:00:00Z',
            draft: false,
            updatedAt: '2026-05-01T00:00:00Z',
            etag: 'a-etag'
          }
        ]
      }),
      { headers: { 'content-type': 'application/json' } }
    )
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

function AdminShell({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <>
      <header>
        <nav aria-label='Admin navigation'>
          <a href='/admin'>CMS</a>
          <a href='/admin'>Posts</a>
          <a href='/admin/new'>New</a>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
}

describe('Admin page shell — a11y', () => {
  it('admin index (post list inside layout shell) has zero axe violations', async () => {
    const { container } = render(
      <AdminShell>
        <h1>Posts</h1>
        <PostList />
      </AdminShell>
    );
    await screen.findByText('A');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('admin new (create form inside layout shell) has zero axe violations', async () => {
    const { container } = render(
      <AdminShell>
        <PostForm mode='create' />
      </AdminShell>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('admin edit (edit form inside layout shell) has zero axe violations', async () => {
    const { container } = render(
      <AdminShell>
        <PostForm
          mode='edit'
          initial={{
            slug: 'sample',
            etag: 'etag-sample',
            title: 'Sample',
            date: '2026-05-09T00:00:00Z',
            draft: true,
            body: 'body content'
          }}
        />
      </AdminShell>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
