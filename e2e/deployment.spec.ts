import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import cloudflareConfig from '../cloudflare.config';

const packagedConfig = '.cloudflare/output/v0/workers/default/worker.config.json';

test('the deployment package preserves the Worker settings', () => {
  const { manifest, ...packaged } = JSON.parse(readFileSync(packagedConfig, 'utf8')) as Record<string, unknown>;
  const { entrypoint, ...source } = cloudflareConfig.worker;
  expect(manifest).toMatchObject({ mainModule: 'entry.mjs' });
  expect(entrypoint).toBe('@astrojs/cloudflare/entrypoints/server');
  expect(packaged).toEqual(source);
});
