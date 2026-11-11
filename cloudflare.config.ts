import { bindings, defineConfig } from 'cf/config';

export default defineConfig({
  accountId: 'dee584c21793767c25eee4cebc062726',
  worker: {
    name: 'portfolio',
    compatibilityDate: '2026-02-24',
    compatibilityFlags: ['nodejs_compat'],
    entrypoint: '@astrojs/cloudflare/entrypoints/server',
    workersDev: false,
    previewUrls: true,
    domains: ['mrugesh.dev'],
    assets: { runWorkerFirst: ['/api/*', '/_emdash/*'] },
    env: {
      PUBLIC_SENTRY_DSN: bindings.text(
        'https://e8c88c11abffd1e5b5c581de57321642@o4507798912958464.ingest.us.sentry.io/4510267624128512'
      ),
      PUBLIC_SENTRY_ENVIRONMENT: bindings.text('production'),
      EMDASH_ENCRYPTION_KEY: bindings.secret(),
      DB: bindings.d1({
        name: 'emdash-db',
        id: 'c9986d13-d392-4839-bbb1-014afc131260',
        dev: { remote: false }
      }),
      SESSION: bindings.kv({
        id: '2e04f6b05af0486f9de09797027d5fc0',
        dev: { remote: false }
      }),
      MEDIA: bindings.r2({ name: 'emdash-media', dev: { remote: false } }),
      ASSETS: bindings.assets()
    },
    unsafe: { metadata: { keep_bindings: ['secret_text', 'secret_key'] } },
    observability: {
      logs: { enabled: true, invocationLogs: true },
      traces: { enabled: true }
    }
  }
});
