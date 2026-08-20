import { execSync } from 'node:child_process';
import { cpSync, existsSync, rmSync } from 'node:fs';
import path from 'node:path';

const DEV_URL = 'http://localhost:4321';
const STATE_DIR = '.wrangler/state/v3';
const PREVIEW_DIR = '.wrangler/preview';

async function waitFor(url: string, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

function seedEmDashStateViaDevBypassImport(): Promise<void> {
  return (async () => {
    execSync('pnpm exec astro dev', { stdio: 'inherit', timeout: 180_000 });
    const ready = await waitFor(`${DEV_URL}/api/health`, 120_000);
    if (!ready) throw new Error('astro dev did not become ready for e2e seeding');

    const bypass = await fetch(`${DEV_URL}/_emdash/api/setup/dev-bypass`, { method: 'POST' });
    if (!bypass.ok) throw new Error(`dev-bypass failed: ${bypass.status}`);

    execSync('node scripts/import-articles-to-emdash.mjs --source e2e/fixtures/content --commit', {
      stdio: 'inherit',
      timeout: 300_000
    });
    execSync('pnpm exec astro dev stop', { stdio: 'inherit', timeout: 60_000 });
  })();
}

function snapshotStateForNewerWranglerMiniflare(root: string): void {
  const preview = path.join(root, PREVIEW_DIR);
  if (existsSync(preview)) rmSync(preview, { recursive: true });
  cpSync(path.join(root, STATE_DIR), path.join(preview, 'v3'), { recursive: true });
}

export default async function globalSetup(): Promise<void> {
  await seedEmDashStateViaDevBypassImport();
  snapshotStateForNewerWranglerMiniflare(process.cwd());
}
