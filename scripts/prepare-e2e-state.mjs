#!/usr/bin/env node

import { execSync, spawn } from 'node:child_process';
import { mkdirSync, openSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';

const DEV_URL = 'http://localhost:4321';
const DEV_LOG = '.astro/e2e-dev.log';

const require = createRequire(import.meta.url);
const astroBin = path.join(path.dirname(require.resolve('astro/package.json')), 'bin/astro.mjs');

async function isServing() {
  try {
    const res = await fetch(`${DEV_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startDevServer() {
  mkdirSync('.astro', { recursive: true });
  const logFd = openSync(DEV_LOG, 'w');
  const child = spawn(process.execPath, [astroBin, 'dev'], { stdio: ['ignore', logFd, logFd] });
  const state = { child, exited: false, exitCode: null, spawnError: null };
  child.on('exit', (code) => {
    state.exited = true;
    state.exitCode = code;
  });
  child.on('error', (error) => {
    state.spawnError = error;
  });
  return state;
}

async function waitUntilReady(state, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (state.spawnError) return `spawn failed: ${state.spawnError.message}`;
    if (state.exited && state.exitCode !== 0) {
      return `astro dev exited with code ${state.exitCode}`;
    }
    if (await isServing()) return null;
    await sleep(1000);
  }
  return 'timed out waiting for astro dev health';
}

async function stopDevServer(state) {
  try {
    execSync('pnpm exec astro dev stop', { stdio: 'ignore', timeout: 30_000 });
  } catch (error) {
    console.error('astro dev stop:', error instanceof Error ? error.message : error);
  }
  if (!state.exited && !state.spawnError) {
    state.child.kill('SIGTERM');
    const deadline = Date.now() + 10_000;
    while (!state.exited && Date.now() < deadline) {
      await sleep(250);
    }
    if (!state.exited) state.child.kill('SIGKILL');
  }
  const deadline = Date.now() + 15_000;
  while ((await isServing()) && Date.now() < deadline) {
    await sleep(500);
  }
}

if (await isServing()) {
  console.error(`a server already listens at ${DEV_URL} — stop it before e2e seeding`);
  process.exit(1);
}

const state = startDevServer();
try {
  const failure = await waitUntilReady(state, 120_000);
  if (failure) {
    console.error(`e2e seeding: ${failure}`);
    try {
      console.error(readFileSync(DEV_LOG, 'utf8').slice(-4000));
    } catch {
      console.error(`(no ${DEV_LOG} captured)`);
    }
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
  await stopDevServer(state);
}
if (process.exitCode === 1) process.exit(1);
execSync('node scripts/snapshot-preview-state.mjs', { stdio: 'inherit', timeout: 120_000 });
