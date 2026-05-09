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

// Dynamic + try/catch: Node-mode prerender cannot resolve `cloudflare:`
// URLs (the bridge has the static import). Catch → null → guard skipped
// for prerendered routes, which never touch CMS surfaces anyway.
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
      return verifyAccessJwt(token, {
        teamDomain,
        audience,
        authorEmail,
        jwksProvider: createKvJwksProvider({ kv, teamDomain })
      });
    }
  };
}

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const cfEnv = await loadCloudflareEnv();
  if (!cfEnv) return next();
  return runCmsMiddleware({
    request,
    next,
    guardConfig: buildAccessGuardConfig(cfEnv),
    metrics: Sentry.metrics
  });
});
