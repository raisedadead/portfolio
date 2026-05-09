/**
 * Author dashboard — post editor.
 *
 * Shared between `/admin/new.astro` (no slug) and `/admin/edit/[slug].astro`
 * (existing post pre-loaded server-side). The form posts JSON to the CMS API
 * and surfaces validation errors inline.
 *
 * Editor is a plain textarea today. The Milkdown WYSIWYG island is queued for
 * a follow-up — drag-drop image uploads (sprint S2) need to land first to
 * make Milkdown's image plugin useful, and the textarea covers the
 * keyboard-only authoring path with full a11y support.
 */

import { useState } from 'react';

interface InitialPost {
  slug: string;
  etag: string;
  title: string;
  date: string;
  draft: boolean;
  cover?: string;
  brief?: string;
  body: string;
}

export interface PostFormProps {
  mode: 'create' | 'edit';
  initial?: InitialPost;
}

interface ApiSuccess {
  slug: string;
  etag: string;
  updatedAt: string;
}

interface ApiError {
  error: string;
  message?: string;
  current?: string;
  slug?: string;
}

type SubmitState = { status: 'idle' } | { status: 'saving' } | { status: 'error'; message: string };

function buildPayload(form: HTMLFormElement) {
  const data = new FormData(form);
  return {
    title: String(data.get('title') ?? ''),
    slug: data.get('slug') ? String(data.get('slug')) : undefined,
    date: data.get('date') ? String(data.get('date')) : undefined,
    cover: data.get('cover') ? String(data.get('cover')) : undefined,
    brief: data.get('brief') ? String(data.get('brief')) : undefined,
    draft: data.get('draft') === 'on',
    body: String(data.get('body') ?? '')
  };
}

export function PostForm({ mode, initial }: PostFormProps): React.JSX.Element {
  const [state, setState] = useState<SubmitState>({ status: 'idle' });
  const [etag, setEtag] = useState<string | undefined>(initial?.etag);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ status: 'saving' });
    const payload = buildPayload(e.currentTarget);
    const url = mode === 'create' ? '/api/cms/posts' : `/api/cms/posts/${initial!.slug}`;
    const method = mode === 'create' ? 'POST' : 'PUT';
    const headers: Record<string, string> = { 'content-type': 'application/json' };
    if (mode === 'edit') {
      if (!etag) {
        setState({ status: 'error', message: 'Missing etag — refresh and try again.' });
        return;
      }
      headers['if-match'] = `"${etag}"`;
    }
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      if (response.status === 412) {
        const body = (await response.json()) as ApiError;
        setEtag(body.current);
        setState({
          status: 'error',
          message:
            'Another tab saved this post first. The latest version is now loaded — review your changes and resubmit.'
        });
        return;
      }
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as ApiError;
        setState({ status: 'error', message: body.message ?? `Save failed (HTTP ${response.status}).` });
        return;
      }
      const success = (await response.json()) as ApiSuccess;
      setEtag(success.etag);
      const next = mode === 'create' ? `/admin/edit/${success.slug}?created=1` : '/admin?saved=1';
      window.location.assign(next);
    } catch (err) {
      setState({ status: 'error', message: (err as Error).message });
    }
  }

  async function handleDelete() {
    if (!initial || !etag) return;
    // eslint-disable-next-line no-alert -- single-author admin tool; confirm() is the simplest a11y-correct guard
    const ok = window.confirm(`Delete "${initial.title}"? This cannot be undone.`);
    if (!ok) return;
    setState({ status: 'saving' });
    try {
      const response = await fetch(`/api/cms/posts/${initial.slug}`, {
        method: 'DELETE',
        headers: { 'if-match': `"${etag}"` },
        credentials: 'include'
      });
      if (response.status === 204) {
        window.location.assign('/admin?deleted=1');
        return;
      }
      const body = (await response.json().catch(() => ({}))) as ApiError;
      setState({ status: 'error', message: body.message ?? `Delete failed (HTTP ${response.status}).` });
    } catch (err) {
      setState({ status: 'error', message: (err as Error).message });
    }
  }

  const heading = mode === 'create' ? 'New post' : `Edit · ${initial?.slug}`;
  const submitLabel = mode === 'create' ? 'Create draft' : 'Save changes';

  return (
    <form onSubmit={handleSubmit} className='space-y-4' aria-labelledby='post-form-heading'>
      <h1 id='post-form-heading' className='text-display-md'>
        {heading}
      </h1>

      {state.status === 'error' && (
        <div role='alert' className='brutalist-card border-red-500 p-3 text-sm'>
          {state.message}
        </div>
      )}

      <div>
        <label className='block font-semibold' htmlFor='title'>
          Title
        </label>
        <input
          id='title'
          name='title'
          required
          className='brutalist-input mt-1 w-full p-2'
          defaultValue={initial?.title ?? ''}
          autoComplete='off'
          maxLength={200}
        />
      </div>

      <div>
        <label className='block font-semibold' htmlFor='slug'>
          Slug{' '}
          {mode === 'create' && (
            <span className='text-sm font-normal text-slate-500'>(optional — derived from title)</span>
          )}
        </label>
        <input
          id='slug'
          name='slug'
          className='brutalist-input mt-1 w-full p-2 font-mono'
          defaultValue={initial?.slug ?? ''}
          readOnly={mode === 'edit'}
          aria-readonly={mode === 'edit'}
          pattern='^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$'
          autoComplete='off'
        />
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div>
          <label className='block font-semibold' htmlFor='date'>
            Date
          </label>
          <input
            id='date'
            name='date'
            type='datetime-local'
            className='brutalist-input mt-1 w-full p-2'
            defaultValue={initial?.date ? initial.date.slice(0, 16) : ''}
          />
        </div>
        <div>
          <label className='block font-semibold' htmlFor='cover'>
            Cover URL
          </label>
          <input
            id='cover'
            name='cover'
            className='brutalist-input mt-1 w-full p-2'
            defaultValue={initial?.cover ?? ''}
            placeholder='/api/img/<slug>/cover.jpg'
          />
        </div>
      </div>

      <div>
        <label className='block font-semibold' htmlFor='brief'>
          Brief
        </label>
        <input
          id='brief'
          name='brief'
          className='brutalist-input mt-1 w-full p-2'
          defaultValue={initial?.brief ?? ''}
          maxLength={300}
        />
      </div>

      <div className='flex items-center gap-2'>
        <input
          id='draft'
          name='draft'
          type='checkbox'
          defaultChecked={initial ? initial.draft : true}
          className='h-4 w-4'
        />
        <label htmlFor='draft' className='font-semibold'>
          Draft (hidden from public blog)
        </label>
      </div>

      <div>
        <label className='block font-semibold' htmlFor='body'>
          Body (Markdown)
        </label>
        <textarea
          id='body'
          name='body'
          required
          className='brutalist-input mt-1 w-full p-3 font-mono'
          rows={20}
          defaultValue={initial?.body ?? ''}
        />
      </div>

      <div className='flex flex-wrap items-center gap-3'>
        <button type='submit' className='brutalist-button-primary px-4 py-2' disabled={state.status === 'saving'}>
          {state.status === 'saving' ? 'Saving…' : submitLabel}
        </button>
        <a className='brutalist-button-ghost px-4 py-2' href='/admin'>
          Cancel
        </a>
        {mode === 'edit' && (
          <button
            type='button'
            onClick={handleDelete}
            disabled={state.status === 'saving'}
            className='brutalist-button px-4 py-2 ml-auto'
          >
            Delete post
          </button>
        )}
      </div>
    </form>
  );
}

export default PostForm;
