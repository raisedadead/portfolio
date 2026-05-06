import { describe, expect, it, vi } from 'vitest';
import { buildBlogLoader, decideBlogLoader, type BlogLoaderEnv } from '@/lib/blog-loader-factory';

const FULL_R2_ENV: BlogLoaderEnv = {
  PUBLIC_USE_R2_LOADER: '1',
  R2_ENDPOINT: 'https://example.r2.cloudflarestorage.com',
  R2_BUCKET_NAME: 'articles-content-stg',
  R2_ACCESS_KEY_ID: 'akid',
  R2_SECRET_ACCESS_KEY: 'sak'
};

describe('decideBlogLoader', () => {
  it('returns glob when the feature flag is unset', () => {
    expect(decideBlogLoader({})).toEqual({ source: 'glob' });
  });

  it('returns glob when the feature flag is 0', () => {
    expect(decideBlogLoader({ PUBLIC_USE_R2_LOADER: '0' })).toEqual({ source: 'glob' });
  });

  it('returns r2 when the flag is 1 and all credentials are present', () => {
    expect(decideBlogLoader(FULL_R2_ENV)).toEqual({ source: 'r2' });
  });

  it('falls back to glob with a reason when any credential is missing', () => {
    const env: BlogLoaderEnv = { ...FULL_R2_ENV, R2_ACCESS_KEY_ID: undefined };
    const decision = decideBlogLoader(env);
    expect(decision.source).toBe('glob-fallback');
    expect(decision.reason).toContain('R2_ACCESS_KEY_ID');
  });

  it('reports every missing credential', () => {
    const decision = decideBlogLoader({ PUBLIC_USE_R2_LOADER: '1' });
    expect(decision.source).toBe('glob-fallback');
    expect(decision.reason).toContain('R2_ENDPOINT');
    expect(decision.reason).toContain('R2_BUCKET_NAME');
    expect(decision.reason).toContain('R2_ACCESS_KEY_ID');
    expect(decision.reason).toContain('R2_SECRET_ACCESS_KEY');
  });
});

describe('buildBlogLoader', () => {
  it('returns a loader with name "r2-markdown-loader" when wiring R2', () => {
    const loader = buildBlogLoader({ env: FULL_R2_ENV });
    expect(loader.name).toBe('r2-markdown-loader');
  });

  it('returns the Astro glob loader when the flag is unset', () => {
    const loader = buildBlogLoader({ env: {} });
    // Astro's glob loader names itself "glob-loader"
    expect(loader.name).toBe('glob-loader');
  });

  it('warns and returns the glob loader when R2 creds are missing under flag=1', () => {
    const warn = vi.fn();
    const loader = buildBlogLoader({ env: { PUBLIC_USE_R2_LOADER: '1' }, warn });
    expect(loader.name).toBe('glob-loader');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(/PUBLIC_USE_R2_LOADER=1/);
    expect(warn.mock.calls[0][0]).toMatch(/falling back to local glob/);
  });

  it('does not warn when the flag is unset', () => {
    const warn = vi.fn();
    buildBlogLoader({ env: {}, warn });
    expect(warn).not.toHaveBeenCalled();
  });
});
