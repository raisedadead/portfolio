// Workerd-only env bridge. Reach via `await import(...).catch()` —
// Node-mode prerender cannot resolve `cloudflare:` URLs.

import { env } from 'cloudflare:workers';

export { env };
