import * as Sentry from '@sentry/astro';

const dsn = process.env.PUBLIC_SENTRY_DSN;

// Sentry's Vite plugin auto-prepends this file's evaluation onto every
// Astro entry chunk, including the SSR bundle for `/admin/*` and any
// other server-rendered route. In workerd, the bundled browser SDK's
// `init()` triggers `browserTracingIntegration` → `addEventListener('load',
// cb, true)`, which workerd rejects (`useCapture must be false`) and
// crashes the response with HTTP 500.
//
// Detect workerd via the `WebSocketPair` global (Cloudflare-only) so we
// skip the init when bundled into the Workers runtime. The Cloudflare
// `unenv` preset exposes `process.versions.node`, so a Node-detection
// check is not enough on its own — `WebSocketPair` is the reliable signal.
// Sentry telemetry stays active in real Node SSR (e.g. prerender) but no
// longer crashes Cloudflare Workers.
const isWorkerd = typeof (globalThis as unknown as { WebSocketPair?: unknown }).WebSocketPair !== 'undefined';
const isNodeServer = typeof process !== 'undefined' && typeof process.versions?.node === 'string';

if (dsn && isNodeServer && !isWorkerd) {
  Sentry.init({
    dsn,
    environment: process.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: process.env.PUBLIC_SENTRY_RELEASE || 'dev',
    tracesSampleRate: 0.1 // 10% of server transactions

    // Note: Cloudflare Workers has limited Node.js API support
    // Auto-instrumentation is disabled in astro.config.mjs
    // Manual instrumentation can be added to API routes if needed
  });
} else if (!dsn && isNodeServer && !isWorkerd) {
  console.warn('[Sentry] DSN not configured - server monitoring disabled');
}
