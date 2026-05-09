import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PostForm from '@/components/admin/post-form';

const userEvent = {
  async type(element: HTMLElement, value: string) {
    fireEvent.change(element, { target: { value } });
  },
  async click(element: HTMLElement) {
    fireEvent.click(element);
  }
};

const fetchMock = vi.fn();
const originalLocation = window.location;
const assignMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  assignMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { ...originalLocation, assign: assignMock }
  });
});

afterEach(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  vi.restoreAllMocks();
});

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

describe('PostForm — create mode', () => {
  it('renders a labelled form and is a11y-clean', async () => {
    const { container } = render(<PostForm mode='create' />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText(/Body/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create draft/i })).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('POSTs the title + body to /api/cms/posts and navigates on success', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(201, { slug: 'new-slug', etag: 'etag-1', updatedAt: '2026-05-09T12:00:00Z' })
    );
    render(<PostForm mode='create' />);
    await userEvent.type(screen.getByLabelText('Title'), 'Hello World');
    await userEvent.type(screen.getByLabelText(/Body/), '# heading\n\nbody text');
    await userEvent.click(screen.getByRole('button', { name: /create draft/i }));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/cms/posts',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'content-type': 'application/json' })
      })
    );
    const init = fetchMock.mock.calls[0]?.[1];
    expect(init.headers['if-match']).toBeUndefined();
    const body = JSON.parse(init.body as string);
    expect(body.title).toBe('Hello World');
    expect(body.body).toMatch(/heading/);
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith('/admin/edit/new-slug?created=1'));
  });

  it('surfaces the API error message inline on validation failure', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(400, { error: 'invalid_title', message: 'title required' }));
    render(<PostForm mode='create' />);
    await userEvent.type(screen.getByLabelText('Title'), 'X');
    await userEvent.type(screen.getByLabelText(/Body/), 'body');
    await userEvent.click(screen.getByRole('button', { name: /create draft/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/title required/i);
    expect(assignMock).not.toHaveBeenCalled();
  });
});

describe('PostForm — edit mode', () => {
  const initial = {
    slug: 'hello',
    etag: 'etag-current',
    title: 'Hello',
    date: '2026-05-01T00:00:00.000Z',
    draft: true,
    body: 'old body'
  };

  it('seeds the form with the existing post and surfaces the slug as read-only', async () => {
    const { container } = render(<PostForm mode='edit' initial={initial} />);
    expect(screen.getByLabelText('Title')).toHaveValue('Hello');
    const slugInput = screen.getByLabelText(/Slug/);
    expect(slugInput).toHaveAttribute('readonly');
    expect(slugInput).toHaveValue('hello');
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('PUTs to /api/cms/posts/<slug> with the current ETag in If-Match', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { slug: 'hello', etag: 'etag-next', updatedAt: '2026-05-09T12:00:00Z' })
    );
    render(<PostForm mode='edit' initial={initial} />);
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/cms/posts/hello',
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({ 'if-match': '"etag-current"' })
        })
      )
    );
    await waitFor(() => expect(assignMock).toHaveBeenCalledWith('/admin?saved=1'));
  });

  it('handles 412 etag_mismatch by updating the etag and surfacing a warning', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(412, { error: 'etag_mismatch', current: 'etag-fresh' }));
    render(<PostForm mode='edit' initial={initial} />);
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/another tab saved/i);
    expect(assignMock).not.toHaveBeenCalled();
    // Subsequent submit uses the updated etag.
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, { slug: 'hello', etag: 'etag-fresher', updatedAt: '2026-05-09T12:00:00Z' })
    );
    await userEvent.click(screen.getByRole('button', { name: /save changes/i }));
    const lastCall = fetchMock.mock.calls.at(-1);
    expect(lastCall?.[1]?.headers['if-match']).toBe('"etag-fresh"');
  });
});
