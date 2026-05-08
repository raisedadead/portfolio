import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E test configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:8787',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  // The webServer boots `wrangler dev` against the built worker. The R2
  // binding picks up `remote: true` from `wrangler.jsonc` (mirrored into
  // `dist/server/wrangler.json`), so the suite hits the real
  // `articles-content-stg` bucket. Without that flag the local R2 simulator
  // is empty and every cover/body image returns 404 (B11 history). If you
  // ever need offline e2e, populate `.wrangler/state/v3/r2/...` first or
  // flip the binding back to local — never both at once.
  webServer: {
    command: 'wrangler dev --config dist/server/wrangler.json --port 8787',
    port: 8787,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
