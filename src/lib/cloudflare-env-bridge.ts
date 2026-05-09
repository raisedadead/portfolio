/**
 * Workerd-only env bridge.
 *
 * Top-level static import of `cloudflare:workers` so the Cloudflare Vite
 * plugin recognises it and virtualises the module in the SSR bundle. At
 * workerd runtime this resolves cleanly. The middleware reaches this
 * module via `await import(...).catch(...)`, which means Node-mode
 * prerender (which cannot resolve the `cloudflare:` URL scheme) only
 * fails when the prerender path actually loads this module — and the
 * error is swallowed by the caller, leaving `env` unset for prerendered
 * routes (which never need it).
 *
 * Do NOT add prerendered routes that import this file directly. The
 * adapter forbids it; the middleware uses a guarded dynamic import for
 * exactly that reason.
 */

import { env } from 'cloudflare:workers';

export { env };
