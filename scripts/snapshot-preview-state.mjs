#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, readdirSync, rmSync, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const STATE = '.wrangler/state/v3';
const PREVIEW = '.wrangler/preview';

function walkSqliteFiles(dir, found = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walkSqliteFiles(full, found);
    else if (name.endsWith('.sqlite')) found.push(full);
  }
  return found;
}

const root = process.cwd();
const stateDir = path.join(root, STATE);
const previewDir = path.join(root, PREVIEW);

if (!existsSync(stateDir)) {
  console.error(`missing ${STATE} — run \`pnpm do:develop\` once to create local state`);
  process.exit(1);
}

if (existsSync(previewDir)) rmSync(previewDir, { recursive: true });
cpSync(stateDir, path.join(previewDir, 'v3'), { recursive: true });

for (const file of walkSqliteFiles(previewDir)) {
  execFileSync('sqlite3', [file, 'PRAGMA wal_checkpoint(TRUNCATE);']);
  for (const suffix of ['-shm', '-wal']) {
    const sidecar = `${file}${suffix}`;
    if (existsSync(sidecar)) unlinkSync(sidecar);
  }
}

console.log(`snapshotted ${STATE} -> ${PREVIEW} (WAL checkpointed)`);
