/**
 * Component-level a11y + behavior tests for the admin post list.
 *
 * jest-axe sweeps each render state (loading / loaded / empty / error) so
 * regressions in heading order, table semantics, or focus targets fail
 * locally before they reach `/admin`. The fetch is mocked; no network.
 */

import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostList from '@/components/admin/post-list';

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

describe('PostList', () => {
  it('renders a loading state and announces it to assistive tech', async () => {
    fetchMock.mockReturnValue(new Promise(() => {})); // never resolves
    const { container } = render(<PostList />);
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders a populated post table with accessible headers', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, {
        cached: true,
        generatedAt: '2026-05-09T10:00:00Z',
        posts: [
          {
            slug: 'first',
            title: 'First Post',
            date: '2026-05-01T00:00:00Z',
            draft: false,
            updatedAt: '2026-05-01T00:00:00Z',
            etag: 'etag-first'
          },
          {
            slug: 'second',
            title: 'Second',
            date: '2026-04-30T00:00:00Z',
            draft: true,
            updatedAt: '2026-04-30T00:00:00Z',
            etag: 'etag-second'
          }
        ]
      })
    );
    const { container } = render(<PostList />);
    await waitFor(() => expect(screen.getByText('First Post')).toBeInTheDocument());
    expect(screen.getByRole('table')).toBeInTheDocument();
    const headers = screen.getAllByRole('columnheader').map((th) => th.textContent?.trim());
    expect(headers).toContain('Title');
    expect(headers).toContain('Status');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders the empty state with a "create one" call to action', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { cached: false, generatedAt: '2026-05-09T10:00:00Z', posts: [] }));
    const { container } = render(<PostList />);
    await waitFor(() => expect(screen.getByText(/no posts yet/i)).toBeInTheDocument());
    expect(screen.getByRole('link', { name: /create the first one/i })).toHaveAttribute('href', '/admin/new');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('surfaces fetch failures inline as an alert', async () => {
    fetchMock.mockResolvedValue(jsonResponse(503, { error: 'cms_not_configured' }));
    const { container } = render(<PostList />);
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByText(/HTTP 503/)).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
