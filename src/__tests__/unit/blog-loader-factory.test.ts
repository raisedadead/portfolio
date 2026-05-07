import { describe, expect, it, vi } from 'vitest';
import { buildBlogLoader, decideBlogLoader, type BlogLoaderEnv } from '@/lib/blog-loader-factory';

const FULL_R2_ENV: BlogLoaderEnv = {
  R2_ENDPOINT: 'https://example.r2.cloudflarestorage.com',
  R2_BUCKET_NAME: 'articles-content-stg',
  R2_ACCESS_KEY_ID: 'akid',
  R2_SECRET_ACCESS_KEY: 'sak'
};

describe('decideBlogLoader', () => {
  it('returns r2 when the flag is unset and credentials are present (R2 is the new default)', () => {
    expect(decideBlogLoader(FULL_R2_ENV)).toEqual({ source: 'r2' });
  });

  it('returns r2 when the flag is 1 and credentials are present', () => {
    expect(decideBlogLoader({ ...FULL_R2_ENV, PUBLIC_USE_R2_LOADER: '1' })).toEqual({
      source: 'r2'
    });
  });

  it('returns glob when the flag is explicitly 0 (emergency rollback)', () => {
    expect(decideBlogLoader({ ...FULL_R2_ENV, PUBLIC_USE_R2_LOADER: '0' })).toEqual({
      source: 'glob'
    });
  });

  it('falls back to glob with a reason when any credential is missing', () => {
    const env: BlogLoaderEnv = { ...FULL_R2_ENV, R2_ACCESS_KEY_ID: undefined };
    const decision = decideBlogLoader(env);
    expect(decision.source).toBe('glob-fallback');
    expect(decision.reason).toContain('R2_ACCESS_KEY_ID');
  });

  it('reports every missing credential when the flag is unset and the env is empty', () => {
    const decision = decideBlogLoader({});
    expect(decision.source).toBe('glob-fallback');
    expect(decision.reason).toContain('R2_ENDPOINT');
    expect(decision.reason).toContain('R2_BUCKET_NAME');
    expect(decision.reason).toContain('R2_ACCESS_KEY_ID');
    expect(decision.reason).toContain('R2_SECRET_ACCESS_KEY');
  });
});

describe('buildBlogLoader', () => {
  it('returns the R2 loader by default when credentials are present', () => {
    const loader = buildBlogLoader({ env: FULL_R2_ENV });
    expect(loader.name).toBe('r2-markdown-loader');
  });

  it('returns the Astro glob loader when PUBLIC_USE_R2_LOADER=0 (explicit opt-out)', () => {
    const loader = buildBlogLoader({ env: { ...FULL_R2_ENV, PUBLIC_USE_R2_LOADER: '0' } });
    // Astro's glob loader names itself "glob-loader"
    expect(loader.name).toBe('glob-loader');
  });

  it('warns and falls back to glob when R2 creds are missing', () => {
    const warn = vi.fn();
    const loader = buildBlogLoader({ env: {}, warn });
    expect(loader.name).toBe('glob-loader');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(/R2 is the default source/);
    expect(warn.mock.calls[0][0]).toMatch(/falling back to local glob/);
  });

  it('does not warn when explicit opt-out is configured', () => {
    const warn = vi.fn();
    buildBlogLoader({ env: { ...FULL_R2_ENV, PUBLIC_USE_R2_LOADER: '0' }, warn });
    expect(warn).not.toHaveBeenCalled();
  });

  it('does not warn when R2 is wired with full credentials', () => {
    const warn = vi.fn();
    buildBlogLoader({ env: FULL_R2_ENV, warn });
    expect(warn).not.toHaveBeenCalled();
  });
});
