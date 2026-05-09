/**
 * Author dashboard — list view.
 *
 * Hydrated as `client:idle` from `/admin/index.astro`. The page shell is
 * rendered server-side (gated by the CMS Access middleware) and the React
 * island fetches `/api/cms/posts` for the live table. Errors are surfaced
 * inline so the dashboard remains usable when the cache or R2 is degraded.
 */

import { useEffect, useState } from 'react';

interface PostSummary {
  slug: string;
  title: string;
  date: string;
  draft: boolean;
  brief?: string;
  updatedAt: string;
  etag: string;
}

interface ListResponse {
  posts: PostSummary[];
  cached: boolean;
  generatedAt: string;
}

type FetchState =
  | { status: 'loading' }
  | { status: 'ready'; payload: ListResponse }
  | { status: 'error'; message: string };

async function fetchPosts(refresh: boolean): Promise<ListResponse> {
  const url = refresh ? '/api/cms/posts?refresh=1' : '/api/cms/posts';
  const response = await fetch(url, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`/api/cms/posts → HTTP ${response.status}`);
  }
  return (await response.json()) as ListResponse;
}

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
}

export function PostList(): React.JSX.Element {
  const [state, setState] = useState<FetchState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    fetchPosts(false)
      .then((payload) => {
        if (!cancelled) setState({ status: 'ready', payload });
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ status: 'error', message: (err as Error).message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === 'loading') {
    return (
      <p role='status' aria-live='polite'>
        Loading posts…
      </p>
    );
  }

  if (state.status === 'error') {
    return (
      <div role='alert' className='brutalist-card p-4'>
        <p className='font-semibold'>Failed to load posts</p>
        <p className='text-sm'>{state.message}</p>
      </div>
    );
  }

  const { posts, cached, generatedAt } = state.payload;

  if (posts.length === 0) {
    return (
      <div className='brutalist-card p-6 text-center'>
        <p>No posts yet.</p>
        <p className='mt-2 text-sm'>
          <a className='underline' href='/admin/new'>
            Create the first one →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className='mb-2 text-sm text-slate-600'>
        {posts.length} post{posts.length === 1 ? '' : 's'} · index {cached ? 'from KV cache' : 'rebuilt now'} ·{' '}
        {formatDate(generatedAt)}
      </p>
      <table className='brutalist-card w-full text-left'>
        <caption className='sr-only'>Post list</caption>
        <thead>
          <tr className='border-b-2 border-black bg-slate-100'>
            <th scope='col' className='p-3'>
              Title
            </th>
            <th scope='col' className='p-3'>
              Date
            </th>
            <th scope='col' className='p-3'>
              Status
            </th>
            <th scope='col' className='p-3'>
              <span className='sr-only'>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.slug} className='border-b border-slate-200'>
              <td className='p-3'>
                <a className='font-semibold underline' href={`/admin/edit/${post.slug}`}>
                  {post.title}
                </a>
              </td>
              <td className='p-3 font-mono text-sm'>{formatDate(post.date)}</td>
              <td className='p-3 text-sm'>
                <span
                  className={`brutalist-card inline-block px-2 py-0.5 ${post.draft ? 'bg-amber-100' : 'bg-emerald-100'}`}
                >
                  {post.draft ? 'Draft' : 'Published'}
                </span>
              </td>
              <td className='p-3 text-right'>
                <a className='brutalist-button px-3 py-1 text-sm' href={`/admin/edit/${post.slug}`}>
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PostList;
