#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { DatabaseSync } from 'node:sqlite';
import cloudflareConfig from '../cloudflare.config.ts';

const STATE = path.resolve('.cloudflare/e2e/v3');
const SIGN_IN_TABLES = new Set([
  'credentials',
  'auth_tokens',
  'auth_challenges',
  'oauth_accounts',
  '_emdash_api_tokens',
  '_emdash_oauth_tokens',
  '_emdash_device_codes',
  '_emdash_authorization_codes'
]);

const { env } = cloudflareConfig({ isPreview: true, mode: undefined }).worker;
const databaseId = env.DB.id;
const bucket = env.MEDIA.name;

function cf(args) {
  return execFileSync('pnpm', ['exec', 'cf', ...args, '--quiet'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit']
  });
}

function stateFile(dir) {
  const file = readdirSync(dir).find((name) => name.endsWith('.sqlite') && name !== 'metadata.sqlite');
  if (!file) throw new Error(`no SQLite file in ${dir}`);
  return path.join(dir, file);
}

const quoteIdent = (name) => `"${name.replaceAll('"', '""')}"`;
const isVirtual = ({ sql }) => /^CREATE VIRTUAL TABLE/i.test(sql);

function fixtureStatements(db) {
  const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type = 'table' ORDER BY rowid").all();
  const virtual = tables.filter(isVirtual);
  const isShadow = (name) => virtual.some((table) => name.startsWith(`${table.name}_`));
  const copied = tables
    .filter(({ name }) => !name.startsWith('sqlite_') && !name.startsWith('_cf_') && !isShadow(name))
    .sort((a, b) => Number(isVirtual(a)) - Number(isVirtual(b)));
  const statements = copied.map(({ sql }) => sql);

  for (const { name } of copied) {
    if (SIGN_IN_TABLES.has(name)) continue;
    const columns = db
      .prepare(`PRAGMA table_info(${quoteIdent(name)})`)
      .all()
      .map((column) => column.name);
    const values = columns.map((column) => `quote(${quoteIdent(column)})`).join(" || ',' || ");
    const target = `${quoteIdent(name)}(${columns.map(quoteIdent).join(', ')})`;
    for (const { row } of db.prepare(`SELECT ${values} AS row FROM ${quoteIdent(name)}`).all()) {
      statements.push(`INSERT INTO ${target} VALUES(${row})`);
    }
  }

  const later = db
    .prepare(
      "SELECT sql FROM sqlite_master WHERE type IN ('index', 'trigger', 'view') AND sql IS NOT NULL " +
        "ORDER BY type = 'trigger', rowid"
    )
    .all();
  return [...statements, ...later.map(({ sql }) => sql)];
}

const seeded = JSON.parse(
  cf(['d1', 'query', databaseId, '--sql', "SELECT count(*) AS n FROM sqlite_master WHERE name = 'ec_posts'"])
);
if (seeded[0].results[0].n > 0) {
  console.error(`${env.DB.name} already holds content. Empty it before seeding again.`);
  process.exit(1);
}

execFileSync(process.execPath, ['scripts/prepare-e2e-state.mjs'], { stdio: 'inherit' });

const objects = new DatabaseSync(stateFile(path.join(STATE, 'r2/miniflare-R2BucketObject')));
const blobs = path.join(STATE, 'r2/emdash-media/blobs');
for (const { key, blob_id, http_metadata } of objects
  .prepare('SELECT key, blob_id, http_metadata FROM _mf_objects')
  .all()) {
  const { contentType = 'application/octet-stream' } = JSON.parse(http_metadata);
  cf([
    'r2',
    'objects',
    'put',
    key,
    '--bucket-name',
    bucket,
    '--file',
    path.join(blobs, blob_id),
    '--content-type',
    contentType
  ]);
  console.log(`${bucket}: ${key}`);
}

const work = mkdtempSync(path.join(tmpdir(), 'seed-preview-'));
const db = new DatabaseSync(stateFile(path.join(STATE, 'd1/miniflare-D1DatabaseObject')));
const batchFile = path.join(work, 'batch.json');
const statements = fixtureStatements(db);
writeFileSync(batchFile, JSON.stringify(statements.map((sql) => ({ sql }))));
cf(['d1', 'query', databaseId, '--batch', `@${batchFile}`]);
console.log(`${env.DB.name}: ${statements.length} statements applied`);
