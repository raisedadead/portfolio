#!/usr/bin/env node

import { execSync } from 'node:child_process';
import process from 'node:process';

const DEV_URL = 'http://localhost:4321';

async function waitForHealth(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${DEV_URL}/api/health`);
      if (res.ok) return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

execSync('pnpm exec astro dev', { stdio: 'inherit', timeout: 180_000 });
try {
  if (!(await waitForHealth(120_000))) {
    throw new Error('astro dev did not become ready for e2e seeding');
  }
  const bypass = await fetch(`${DEV_URL}/_emdash/api/setup/dev-bypass`, { method: 'POST' });
  if (!bypass.ok) {
    throw new Error(`dev-bypass failed: ${bypass.status}`);
  }
  execSync('node scripts/import-articles-to-emdash.mjs --source e2e/fixtures/content --commit', {
    stdio: 'inherit',
    timeout: 300_000
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  execSync('pnpm exec astro dev stop', { stdio: 'inherit', timeout: 60_000 });
}
if (process.exitCode === 1) process.exit(1);
execSync('node scripts/snapshot-preview-state.mjs', { stdio: 'inherit', timeout: 120_000 });
