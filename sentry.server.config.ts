import { init } from '@sentry/astro';

const dsn = process.env.PUBLIC_SENTRY_DSN;

// Skip init in workerd — the bundled browser SDK's
// `addEventListener('load', _, true)` crashes the runtime.
// `process.versions.node` alone is not enough (unenv polyfills it);
// `WebSocketPair` is the reliable Cloudflare signal.
const isWorkerd = 'WebSocketPair' in globalThis;
const isNodeServer = typeof process !== 'undefined' && typeof process.versions?.node === 'string';

if (dsn && isNodeServer && !isWorkerd) {
  init({
    dsn,
    environment: process.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: process.env.PUBLIC_SENTRY_RELEASE || 'dev',
    tracesSampleRate: 0.1
  });
} else if (!dsn && isNodeServer && !isWorkerd) {
  console.warn('[Sentry] DSN not configured - server monitoring disabled');
}
