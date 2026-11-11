import { bindings, defineConfig } from 'cf/config';

const production = {
  sentryEnvironment: 'production',
  db: { name: 'emdash-db', id: 'c9986d13-d392-4839-bbb1-014afc131260' },
  sessionId: '2e04f6b05af0486f9de09797027d5fc0',
  mediaBucket: 'emdash-media'
};

const preview = {
  sentryEnvironment: 'preview',
  db: { name: 'emdash-db-preview', id: '994b3893-56cc-4dfd-abfe-4cb8a1381545' },
  sessionId: '6e1d014294854034bcf0f8e669c9c29a',
  mediaBucket: 'emdash-media-preview'
};

export default defineConfig(({ isPreview }) => {
  const data = isPreview ? preview : production;
  return {
    accountId: 'dee584c21793767c25eee4cebc062726',
    worker: {
      name: 'portfolio',
      compatibilityDate: '2026-02-24',
      compatibilityFlags: ['nodejs_compat'],
      entrypoint: '@astrojs/cloudflare/entrypoints/server',
      workersDev: false,
      previewUrls: true,
      ...(isPreview ? {} : { domains: ['mrugesh.dev'] }),
      assets: { runWorkerFirst: ['/api/*', '/_emdash/*'] },
      env: {
        PUBLIC_SENTRY_DSN: bindings.text(
          'https://e8c88c11abffd1e5b5c581de57321642@o4507798912958464.ingest.us.sentry.io/4510267624128512'
        ),
        PUBLIC_SENTRY_ENVIRONMENT: bindings.text(data.sentryEnvironment),
        EMDASH_ENCRYPTION_KEY: bindings.secret(),
        DB: bindings.d1({ ...data.db, dev: { remote: false } }),
        SESSION: bindings.kv({ id: data.sessionId, dev: { remote: false } }),
        MEDIA: bindings.r2({ name: data.mediaBucket, dev: { remote: false } }),
        ASSETS: bindings.assets()
      },
      ...(isPreview ? {} : { unsafe: { metadata: { keep_bindings: ['secret_text', 'secret_key'] } } }),
      observability: {
        logs: { enabled: true, invocationLogs: true },
        traces: { enabled: true }
      }
    }
  };
});
