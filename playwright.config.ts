import { execSync } from 'node:child_process';
import { defineConfig, devices } from '@playwright/test';

const e2eServer =
  'node scripts/prepare-e2e-state.mjs && exec wrangler dev --config dist/server/wrangler.json --persist-to .wrangler/e2e --port';

const isCI = !!process.env.CI;

const baseURL = isCI
  ? 'http://localhost:8787'
  : execSync('portless get portfolio-e2e --no-worktree', { encoding: 'utf8' }).trim();

/**
 * Playwright E2E test configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 3 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL,
    ignoreHTTPSErrors: !isCI,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  webServer: {
    command: isCI ? `${e2eServer} 8787` : `portless portfolio-e2e --force sh -c '${e2eServer} "$PORT"'`,
    url: `${baseURL}/blog`,
    ignoreHTTPSErrors: !isCI,
    gracefulShutdown: isCI ? undefined : { signal: 'SIGTERM', timeout: 10000 },
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
