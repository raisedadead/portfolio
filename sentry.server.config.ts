import * as Sentry from '@sentry/astro';

const dsn = process.env.PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.PUBLIC_SENTRY_ENVIRONMENT || 'production',
    release: 'portfolio@0.1.0',
    tracesSampleRate: 0.1 // 10% of server transactions

    // Note: Cloudflare Workers has limited Node.js API support
    // Auto-instrumentation is disabled in astro.config.mjs
    // Manual instrumentation can be added to API routes if needed
  });
} else {
  console.warn('[Sentry] DSN not configured - server monitoring disabled');
}
