import { describe, expect, it } from 'vitest';
import {
  capitalizeTag,
  collectLocalImageRefs,
  refToDiskPath,
  rewriteImageBlocks,
  splitFrontmatter,
  toEntryInput,
  toMediaValue
} from '../../../scripts/import-articles-to-emdash.mjs';

const RAW = `---
title: "Test Post"
date: 2022-11-02
cover: ../assets/images/test-post/cover.webp
tags:
  - github
  - github-actions
---

Body with ![shot](../assets/images/test-post/shot.png) and ![ext](https://cdn.example.com/x.png).
`;

describe('splitFrontmatter', () => {
  it('separates YAML frontmatter from body', () => {
    const { frontmatter, body } = splitFrontmatter(RAW);
    expect(frontmatter.title).toBe('Test Post');
    expect(body.startsWith('Body with')).toBe(true);
  });

  it('returns whole input as body when no frontmatter fence exists', () => {
    expect(splitFrontmatter('just text')).toEqual({ frontmatter: {}, body: 'just text' });
  });
});

describe('collectLocalImageRefs', () => {
  it('collects cover and body refs, deduped, ignoring remote URLs', () => {
    const { frontmatter, body } = splitFrontmatter(RAW);
    expect(collectLocalImageRefs(frontmatter, body)).toEqual([
      '../assets/images/test-post/cover.webp',
      '../assets/images/test-post/shot.png'
    ]);
  });
});

describe('refToDiskPath', () => {
  it('resolves a legacy ref inside the source dir', () => {
    expect(refToDiskPath('/src', '../assets/images/a/b.png')).toBe('/src/assets/images/a/b.png');
  });

  it('rejects refs that traverse outside assets/images', () => {
    expect(() => refToDiskPath('/src', '../assets/images/../../etc/passwd')).toThrow(/escapes/);
  });
});

describe('toMediaValue', () => {
  it('maps a MediaItem to the image-field MediaValue shape', () => {
    const item = {
      id: 'ULID1',
      filename: 'cover.webp',
      key: 'media/ULID1.webp',
      mimeType: 'image/webp',
      size: 10,
      width: 1200,
      height: 630
    };
    expect(toMediaValue(item, 'Alt text')).toEqual({
      provider: 'local',
      id: 'ULID1',
      filename: 'cover.webp',
      mimeType: 'image/webp',
      width: 1200,
      height: 630,
      alt: 'Alt text',
      meta: { storageKey: 'media/ULID1.webp' }
    });
  });
});

describe('rewriteImageBlocks', () => {
  const media = new Map([
    ['../assets/images/test-post/shot.png', { id: 'ULID2', key: 'media/ULID2.png', width: 800, height: 400 }]
  ]);

  it('rewrites local image blocks to media asset refs with dimensions', () => {
    const blocks = [{ _type: 'image', _key: 'k1', alt: 'shot', asset: { url: '../assets/images/test-post/shot.png' } }];
    expect(rewriteImageBlocks(blocks, media)).toEqual([
      {
        _type: 'image',
        _key: 'k1',
        alt: 'shot',
        width: 800,
        height: 400,
        asset: { _ref: 'ULID2', url: 'media/ULID2.png' }
      }
    ]);
  });

  it('leaves external images and text blocks untouched', () => {
    const blocks = [
      { _type: 'image', _key: 'k2', asset: { url: 'https://cdn.example.com/x.png' } },
      { _type: 'block', _key: 'k3', children: [] }
    ];
    expect(rewriteImageBlocks(blocks, media)).toEqual(blocks);
  });
});

describe('toEntryInput', () => {
  const { frontmatter } = splitFrontmatter(RAW);

  it('builds a to-publish entry with ISO date and tag slugs (create is always draft; publish is a follow-up call)', () => {
    const input = toEntryInput('test-post', frontmatter, [], false, undefined);
    expect(input).toEqual({
      slug: 'test-post',
      status: 'draft',
      publish: true,
      data: {
        title: 'Test Post',
        date: new Date('2022-11-02').toISOString(),
        content: []
      },
      taxonomies: { tag: ['github', 'github-actions'] }
    });
  });

  it('keeps drafts unpublished from the drafts dir or a draft flag', () => {
    expect(toEntryInput('a', frontmatter, [], true, undefined).publish).toBe(false);
    expect(toEntryInput('a', { ...frontmatter, draft: true }, [], false, undefined).publish).toBe(false);
  });

  it('maps seo frontmatter into snake_case fields', () => {
    const withSeo = { ...frontmatter, seo: { title: 'S', description: 'D' } };
    const { data } = toEntryInput('a', withSeo, [], false, undefined);
    expect(data.seo_title).toBe('S');
    expect(data.seo_description).toBe('D');
  });
});

describe('capitalizeTag', () => {
  it('matches the articles schema transform', () => {
    expect(capitalizeTag('github-actions')).toBe('Github Actions');
    expect(capitalizeTag('dns')).toBe('Dns');
  });
});
