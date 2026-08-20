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
  workers: process.env.CI ? 3 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://localhost:8787',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  webServer: {
    command:
      'node scripts/prepare-e2e-state.mjs && wrangler dev --config dist/server/wrangler.json --port 8787 --persist-to .wrangler/preview',
    url: 'http://localhost:8787/blog',
    reuseExistingServer: false,
    timeout: 300000
  },

  projects: [
    {
      name: 'warmup',
      testMatch: /warmup\.setup\.ts/
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['warmup'],
      testIgnore: /warmup\.setup\.ts/
    }
  ]
});
