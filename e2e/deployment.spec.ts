import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';
import cloudflareConfig from '../cloudflare.config';

const packagedConfig = '.cloudflare/output/v1/workers/default/worker.config.json';

test('the deployment package preserves the Worker settings', () => {
  const packaged: unknown = JSON.parse(readFileSync(packagedConfig, 'utf8'));
  const { entrypoint, ...source } = cloudflareConfig({ isPreview: false, mode: undefined }).worker;
  expect(packaged).toMatchObject({ manifest: { mainModule: 'entry.mjs' } });
  expect(packaged).toEqual({ ...source, manifest: expect.anything() });
});
