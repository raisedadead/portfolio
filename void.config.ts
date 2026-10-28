import { defineConfig } from 'void/config';

export default defineConfig({
  cloudflare: {
    $schema: 'node_modules/wrangler/config-schema.json',
    name: 'portfolio',
    // OAuth token sees both MMCo + freeCodeCamp; pin to disambiguate.
    account_id: 'dee584c21793767c25eee4cebc062726',
    main: '@astrojs/cloudflare/entrypoints/server',
    compatibility_date: '2026-02-24',
    compatibility_flags: ['nodejs_compat'],
    preview_urls: true,
    workers_dev: false,
    dev: {
      port: 8787
    },
    routes: [
      {
        pattern: 'mrugesh.dev',
        custom_domain: true
      }
    ],
    assets: {
      binding: 'ASSETS',
      directory: './dist',
      run_worker_first: ['/api/*', '/_emdash/*']
    },
    vars: {
      PUBLIC_SENTRY_DSN:
        'https://e8c88c11abffd1e5b5c581de57321642@o4507798912958464.ingest.us.sentry.io/4510267624128512',
      PUBLIC_SENTRY_ENVIRONMENT: 'production'
    },
    kv_namespaces: [
      {
        binding: 'SESSION',
        id: '2e04f6b05af0486f9de09797027d5fc0'
      }
    ],
    r2_buckets: [
      {
        binding: 'MEDIA',
        bucket_name: 'emdash-media'
      }
    ],
    d1_databases: [
      {
        binding: 'DB',
        database_name: 'emdash-db',
        database_id: 'c9986d13-d392-4839-bbb1-014afc131260'
      }
    ],
    observability: {
      logs: {
        enabled: true,
        invocation_logs: true
      },
      traces: {
        enabled: true
      }
    }
  }
});
