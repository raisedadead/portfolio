import { describe, expect, it } from 'vitest';
import {
  extractBrief,
  MEDIA_FILE_ROUTE,
  mediaValueToUrl,
  normalizeEmdashPosts,
  portableTextWordCount,
  readingTimeMinutes,
  termsToTags,
  type EmdashPortableBlock,
  type EmdashPostEntry
} from '@/lib/emdash-posts';

const BLOCKS: EmdashPortableBlock[] = [
  { _type: 'block', style: 'h2', children: [{ _type: 'span', text: 'Heading words here' }] },
  { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'First paragraph of the post body.' }] },
  { _type: 'code', code: 'echo one two' }
];

describe('mediaValueToUrl', () => {
  it('builds the media route from a safe storage key', () => {
    expect(mediaValueToUrl({ id: 'ULID', meta: { storageKey: 'ULID.webp' } })).toBe(`${MEDIA_FILE_ROUTE}/ULID.webp`);
  });

  it('prefers an explicit src and falls back to the bare id', () => {
    expect(mediaValueToUrl({ id: 'X', src: 'https://cdn.example.com/a.png' })).toBe('https://cdn.example.com/a.png');
    expect(mediaValueToUrl({ id: 'BAREULID' })).toBe(`${MEDIA_FILE_ROUTE}/BAREULID`);
  });

  it('rejects keys outside the safe charset instead of building a traversal URL', () => {
    expect(mediaValueToUrl({ id: 'a', meta: { storageKey: '../secrets' } })).toBeUndefined();
    expect(mediaValueToUrl({ id: 'a', meta: { storageKey: 'x?y#z' } })).toBeUndefined();
    expect(mediaValueToUrl(undefined)).toBeUndefined();
  });
});

describe('termsToTags', () => {
  it('maps tag terms to the UI Tag shape', () => {
    expect(termsToTags({ tag: [{ slug: 'github-actions', label: 'Github Actions' }] })).toEqual([
      { name: 'Github Actions', slug: 'github-actions' }
    ]);
  });

  it('returns empty for missing taxonomies', () => {
    expect(termsToTags(undefined)).toEqual([]);
    expect(termsToTags({})).toEqual([]);
  });
});

describe('portableTextWordCount', () => {
  it('counts words across text and code blocks', () => {
    expect(portableTextWordCount(BLOCKS)).toBe(3 + 6 + 3);
  });

  it('handles empty input', () => {
    expect(portableTextWordCount(undefined)).toBe(0);
    expect(portableTextWordCount([])).toBe(0);
  });
});

describe('extractBrief', () => {
  it('prefers an explicit brief', () => {
    expect(extractBrief('given brief', BLOCKS)).toBe('given brief');
  });

  it('falls back to the first normal paragraph, capped at 160 chars', () => {
    expect(extractBrief(undefined, BLOCKS)).toBe('First paragraph of the post body.');
    const long: EmdashPortableBlock[] = [
      { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'x'.repeat(300) }] }
    ];
    expect(extractBrief(undefined, long)).toHaveLength(160);
  });
});

describe('readingTimeMinutes', () => {
  it('uses an explicit numeric reading_time', () => {
    expect(readingTimeMinutes({ title: 't', date: '2023-01-01', reading_time: '7' })).toBe(7);
  });

  it('estimates from content at 200 wpm with a floor of 1', () => {
    expect(readingTimeMinutes({ title: 't', date: '2023-01-01', content: BLOCKS })).toBe(1);
  });
});

describe('normalizeEmdashPosts', () => {
  it('maps an entry to the LightweightPost shape', () => {
    const entry: EmdashPostEntry = {
      id: 'my-post',
      data: {
        title: 'My Post',
        date: '2023-05-07T00:00:00.000Z',
        cover: { id: 'C', alt: 'cover alt', meta: { storageKey: 'C.webp' } },
        content: BLOCKS,
        terms: { tag: [{ slug: 'dns', label: 'Dns' }] }
      }
    };
    expect(normalizeEmdashPosts([entry])).toEqual([
      {
        id: 'my-post',
        data: {
          slug: 'my-post',
          title: 'My Post',
          brief: 'First paragraph of the post body.',
          coverImage: { url: `${MEDIA_FILE_ROUTE}/C.webp`, alt: 'cover alt' },
          tags: [{ name: 'Dns', slug: 'dns' }],
          publishedAt: new Date('2023-05-07T00:00:00.000Z'),
          readingTime: 1,
          source: 'local'
        }
      }
    ]);
  });

  it('omits coverImage when the media value is unusable', () => {
    const entry: EmdashPostEntry = {
      id: 'p',
      data: { title: 'P', date: '2023-01-01', cover: { id: 'bad key!' } }
    };
    expect(normalizeEmdashPosts([entry])[0].data.coverImage).toBeUndefined();
  });
});
