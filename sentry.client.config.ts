import * as Sentry from '@sentry/astro';

const dsn = import.meta.env.PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: import.meta.env.PUBLIC_SENTRY_ENVIRONMENT || (import.meta.env.PROD ? 'production' : 'development'),
    release: import.meta.env.PUBLIC_SENTRY_RELEASE || 'dev',

    // Performance monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% in production, 100% in dev

    // Session replay (free tier: 50 replays/month)
    replaysSessionSampleRate: 0.0, // Disabled for normal sessions
    replaysOnErrorSampleRate: 0.5, // 50% of errors (conserve quota)

    // Trace propagation for distributed tracing
    tracePropagationTargets: [
      'mrugesh.dev',
      /\.workers\.dev$/, // Cloudflare Workers preview deployments
      /^\/api\//
    ],

    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
        maskAllInputs: true
      })
    ],

    beforeSend(event) {
      const url = event.request?.url || '';

      // Block localhost (open-source repo protection)
      if (url.includes('localhost') || url.includes('127.0.0.1') || url.includes('[::1]')) {
        return null;
      }

      // Allow production and Cloudflare preview environments
      const isProduction = event.environment === 'production';
      const isCloudflarePreview = url.includes('.workers.dev');

      if (!isProduction && !isCloudflarePreview) {
        return null;
      }

      // Remove sensitive headers
      if (event.request?.headers) {
        delete event.request.headers['Authorization'];
        delete event.request.headers['Cookie'];
        delete event.request.headers['X-API-Key'];
      }

      return event;
    },

    ignoreErrors: [
      // Browser extension errors
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',

      // Network errors (user's connection, not our bug)
      'Network request failed',
      'Failed to fetch',
      'NetworkError',

      // Third-party script errors
      /gtag/i,
      /google-analytics/i,

      // Common non-actionable errors
      'Non-Error promise rejection captured',
      'AbortError'
    ]
  });
} else {
  console.warn('[Sentry] DSN not configured - monitoring disabled');
}
