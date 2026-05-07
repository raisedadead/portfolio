/**
 * Builds the loader Astro uses for the `blog` content collection. R2 is
 * the source of truth post-migration (P2). The legacy local-glob path is
 * kept only as a graceful-degrade for offline builds and as an explicit
 * opt-out (mostly for emergency rollback).
 *
 * Decision tree (post-cutover, T2.3):
 *   PUBLIC_USE_R2_LOADER=0                        -> glob loader (explicit opt-out)
 *   any other value (including unset) + creds OK  -> R2 loader
 *   any other value (including unset) + missing   -> warn + fallback glob
 *
 * Graceful degrade is intentional: an offline build (no R2 keys) must still
 * exit 0. The fallback warning surfaces the misconfiguration without
 * breaking the build.
 */
import type { Loader } from 'astro/loaders';
import { glob } from 'astro/loaders';
import { createAwsR2Client, r2MarkdownLoader } from './r2-loader';

export interface BlogLoaderEnv {
  PUBLIC_USE_R2_LOADER?: string;
  R2_ENDPOINT?: string;
  R2_BUCKET_NAME?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
}

export interface BlogLoaderDecision {
  source: 'r2' | 'glob' | 'glob-fallback';
  reason?: string;
}

export interface BlogLoaderFactoryOptions {
  env: BlogLoaderEnv;
  /** Override only in tests. Defaults to console-style warn. */
  warn?: (msg: string) => void;
}

const GLOB_PATTERN = '**/*.md';
const GLOB_BASE = './src/content/articles/posts';
const R2_POSTS_PREFIX = 'posts/';

function buildGlobLoader(): Loader {
  return glob({ pattern: GLOB_PATTERN, base: GLOB_BASE });
}

/**
 * Decides which loader to wire and explains why. Returned alongside the
 * loader so callers (and tests) can assert the routing decision without
 * peeking at `Loader` internals.
 */
export function decideBlogLoader(env: BlogLoaderEnv): BlogLoaderDecision {
  // Explicit opt-out — emergency rollback to legacy local-glob path.
  if (env.PUBLIC_USE_R2_LOADER === '0') {
    return { source: 'glob' };
  }
  const missing = (['R2_ENDPOINT', 'R2_BUCKET_NAME', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'] as const).filter(
    (key) => !env[key]
  );
  if (missing.length > 0) {
    return {
      source: 'glob-fallback',
      reason: `R2 credentials missing: ${missing.join(', ')}`
    };
  }
  return { source: 'r2' };
}

export function buildBlogLoader(options: BlogLoaderFactoryOptions): Loader {
  const { env, warn = (msg) => console.warn(msg) } = options;
  const decision = decideBlogLoader(env);

  if (decision.source === 'r2') {
    return r2MarkdownLoader({
      client: createAwsR2Client({
        endpoint: env.R2_ENDPOINT!,
        bucket: env.R2_BUCKET_NAME!,
        accessKeyId: env.R2_ACCESS_KEY_ID!,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY!
      }),
      prefix: R2_POSTS_PREFIX
    });
  }

  if (decision.source === 'glob-fallback') {
    warn(`[blog-loader] R2 is the default source but ${decision.reason}; falling back to local glob.`);
  }

  return buildGlobLoader();
}
