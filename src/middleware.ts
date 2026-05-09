import * as Sentry from '@sentry/astro';
import { defineMiddleware } from 'astro:middleware';
import { createKvJwksProvider, verifyAccessJwt, type KvNamespaceLike } from '@/lib/cf-access-jwt';
import type { AccessGuardConfig } from '@/lib/cms-access-guard';
import { runCmsMiddleware } from '@/lib/cms-middleware';

interface CloudflareEnv {
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  CF_ACCESS_AUTHOR_EMAIL?: string;
  DEV_BYPASS_ACCESS?: string;
  SESSION?: KvNamespaceLike;
}

/**
 * Lazy import of the workerd-only env bridge.
 *
 * The bridge (`@/lib/cloudflare-env-bridge`) statically imports
 * `cloudflare:workers`, which the Cloudflare Vite plugin virtualises into
 * the SSR bundle. Astro v6 with `prerenderEnvironment: 'node'` runs the
 * prerender pass under the Node ESM loader, which cannot resolve the
 * `cloudflare:` URL scheme. Loading the bridge dynamically with a
 * try/catch keeps Node prerender from crashing — the catch returns
 * `null` and the middleware falls through to `next()`, which is correct
 * for the prerendered 404 + static pages (none touch the CMS surface).
 */
async function loadCloudflareEnv(): Promise<CloudflareEnv | null> {
  try {
    const mod = (await import('@/lib/cloudflare-env-bridge')) as { env: unknown };
    return mod.env as CloudflareEnv;
  } catch {
    return null;
  }
}

function buildAccessGuardConfig(cfEnv: CloudflareEnv): AccessGuardConfig {
  const teamDomain = cfEnv.CF_ACCESS_TEAM_DOMAIN ?? '';
  const audience = cfEnv.CF_ACCESS_AUD ?? '';
  const authorEmail = cfEnv.CF_ACCESS_AUTHOR_EMAIL ?? '';
  const kv = cfEnv.SESSION;

  return {
    isDevMode: import.meta.env.DEV === true,
    devBypass: cfEnv.DEV_BYPASS_ACCESS,
    verify: async (token) => {
      if (!kv || !teamDomain || !audience || !authorEmail) {
        return { valid: false, reason: 'unknown_kid' };
      }
      const jwksProvider = createKvJwksProvider({ kv, teamDomain });
      return verifyAccessJwt(token, { teamDomain, audience, authorEmail, jwksProvider });
    }
  };
}

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const cfEnv = await loadCloudflareEnv();
  if (!cfEnv) {
    // Node-mode prerender or any environment without the cloudflare:workers
    // virtual module: skip the gate. Prerendered routes are public.
    return next();
  }
  return runCmsMiddleware({
    request,
    next,
    guardConfig: buildAccessGuardConfig(cfEnv),
    metrics: Sentry.metrics
  });
});
