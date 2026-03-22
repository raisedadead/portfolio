import * as Sentry from '@sentry/astro';
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ request }, next) => {
  const url = new URL(request.url);

  if (!url.pathname.startsWith('/api/')) {
    return next();
  }

  const start = performance.now();
  const response = await next();
  const duration = performance.now() - start;

  Sentry.metrics.distribution('api.response_time', duration, {
    unit: 'millisecond',
    attributes: {
      route: url.pathname,
      method: request.method,
      status: String(response.status)
    }
  });

  Sentry.metrics.count('api.requests', 1, {
    attributes: {
      route: url.pathname,
      method: request.method,
      status: String(response.status)
    }
  });

  return response;
});
