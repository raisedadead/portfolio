import type { LightweightPost, Tag } from '@/types/blog';

export interface EmdashMediaValue {
  id?: string;
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  meta?: { storageKey?: string };
}

export interface EmdashTerm {
  slug: string;
  label: string;
}

export interface EmdashPortableSpan {
  _type: string;
  text?: string;
}

export interface EmdashPortableBlock {
  _type: string;
  style?: string;
  children?: EmdashPortableSpan[];
  code?: string;
}

export interface EmdashPostData {
  title: string;
  date: string;
  modified?: string;
  cover?: EmdashMediaValue;
  brief?: string;
  reading_time?: string;
  content?: EmdashPortableBlock[];
  seo_title?: string;
  seo_description?: string;
  terms?: Record<string, EmdashTerm[]>;
}

export interface EmdashPostEntry {
  id: string;
  data: EmdashPostData;
}

export const MEDIA_FILE_ROUTE = '/_emdash/api/media/file';

export const SAFE_STORAGE_KEY = /^[A-Za-z0-9._-]+$/;

export function mediaValueToUrl(value: EmdashMediaValue | undefined): string | undefined {
  if (!value) return undefined;
  if (value.src) return value.src;
  const key = value.meta?.storageKey || value.id;
  return key && SAFE_STORAGE_KEY.test(key) ? `${MEDIA_FILE_ROUTE}/${key}` : undefined;
}

export function termsToTags(terms: Record<string, EmdashTerm[]> | undefined): Tag[] {
  return (terms?.tag ?? []).map((term) => ({ name: term.label, slug: term.slug }));
}

export function portableTextWordCount(blocks: EmdashPortableBlock[] | undefined): number {
  let count = 0;
  for (const block of blocks ?? []) {
    const text =
      block._type === 'code' ? (block.code ?? '') : (block.children ?? []).map((span) => span.text ?? '').join(' ');
    count += text.split(/\s+/).filter(Boolean).length;
  }
  return count;
}

export function extractBrief(brief: string | undefined, blocks: EmdashPortableBlock[] | undefined): string {
  if (brief) return brief;
  const firstText = (blocks ?? []).find((block) => block._type === 'block' && (block.style ?? 'normal') === 'normal');
  const text = (firstText?.children ?? [])
    .map((span) => span.text ?? '')
    .join('')
    .trim();
  return text.slice(0, 160);
}

export function readingTimeMinutes(data: EmdashPostData): number {
  const explicit = Number.parseInt(data.reading_time ?? '', 10);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  return Math.max(1, Math.ceil(portableTextWordCount(data.content) / 200));
}

export function normalizeEmdashPosts(entries: EmdashPostEntry[]): LightweightPost[] {
  return entries.map((entry) => {
    const { data } = entry;
    const coverUrl = mediaValueToUrl(data.cover);
    return {
      id: entry.id,
      data: {
        slug: entry.id,
        title: data.title,
        brief: extractBrief(data.brief, data.content),
        coverImage: coverUrl ? { url: coverUrl, alt: data.cover?.alt } : undefined,
        tags: termsToTags(data.terms),
        publishedAt: new Date(data.date),
        readingTime: readingTimeMinutes(data),
        source: 'local' as const
      }
    };
  });
}
