#!/usr/bin/env node
/* eslint-disable no-console -- CLI script: stdout is the user-facing surface. */
/**
 * One-shot migration: copy posts/, drafts/, and assets/images/ from a local
 * source tree (the legacy `~/DEV/rd/articles` repo) into a Cloudflare R2
 * bucket. Idempotent: skips any object whose ETag already matches the
 * local md5 hash.
 *
 * Usage:
 *   node scripts/migrate-articles-to-r2.mjs --source <path> [--bucket <name>] [--dry-run | --commit]
 *
 * Env (read at CLI invocation, not at module import):
 *   R2_ENDPOINT             https://<account-id>.r2.cloudflarestorage.com
 *   R2_ACCESS_KEY_ID        R2 API token id (object read+write)
 *   R2_SECRET_ACCESS_KEY    R2 API token secret
 *
 * Defaults: --bucket articles-content-stg, dry-run on. Commits only when
 * `--commit` is passed explicitly.
 *
 * Exits 0 on full success, 1 if any file failed, 2 on missing arg/env.
 *
 * Library exports (used by vitest tests):
 *   md5, pickContentType, walk, planMigration, runMigration,
 *   createAwsR2WriteAdapter
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { AwsClient } from 'aws4fetch';

/**
 * @typedef {Object} Asset
 * @property {string} key             Target R2 key (POSIX style).
 * @property {string} absPath         Absolute filesystem path of the source file.
 * @property {string} contentType     HTTP content-type to PUT with.
 *
 * @typedef {Object} Summary
 * @property {number} copied
 * @property {number} skipped
 * @property {number} failed
 * @property {string[]} failures
 *
 * @typedef {Object} R2WriteAdapter
 * @property {(key: string) => Promise<{ etag: string | null; status: number }>} head
 * @property {(key: string, body: Buffer | Uint8Array, contentType: string) => Promise<{ ok: boolean; status: number }>} put
 */

const CONTENT_TYPE_BY_EXT = {
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif'
};

/** Returns the lowercase hex MD5 hash of a buffer. */
export function md5(buf) {
  return createHash('md5').update(buf).digest('hex');
}

/** Picks an HTTP content-type from a file extension. Falls back to octet-stream. */
export function pickContentType(absPath) {
  const ext = path.extname(absPath).toLowerCase();
  return CONTENT_TYPE_BY_EXT[ext] ?? 'application/octet-stream';
}

/** Recursively lists all regular files under `root`. Returns absolute paths. */
export async function walk(root) {
  /** @type {string[]} */
  const out = [];
  const visit = async (dir) => {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) await visit(abs);
      else if (entry.isFile()) out.push(abs);
    }
  };
  await visit(root);
  return out;
}

async function dirExists(dir) {
  try {
    const s = await stat(dir);
    return s.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Plans the migration: enumerates target keys for the legacy articles tree.
 *
 *   posts/<slug>.md        from <source>/posts/
 *   drafts/<slug>.md       from <source>/drafts/
 *   assets/images/<slug>/* from <source>/assets/images/
 *
 * @param {{ source: string }} opts
 * @returns {Promise<Asset[]>}
 */
export async function planMigration({ source }) {
  /** @type {Asset[]} */
  const assets = [];

  for (const sub of ['posts', 'drafts']) {
    const dir = path.join(source, sub);
    if (!(await dirExists(dir))) continue;
    const files = (await walk(dir)).filter((f) => f.endsWith('.md'));
    for (const abs of files) {
      assets.push({
        key: `${sub}/${path.basename(abs)}`,
        absPath: abs,
        contentType: pickContentType(abs)
      });
    }
  }

  const imagesDir = path.join(source, 'assets', 'images');
  if (await dirExists(imagesDir)) {
    const files = await walk(imagesDir);
    for (const abs of files) {
      const rel = path.relative(source, abs).split(path.sep).join('/');
      assets.push({ key: rel, absPath: abs, contentType: pickContentType(abs) });
    }
  }

  return assets.sort((a, b) => a.key.localeCompare(b.key));
}

function stripQuotes(s) {
  return s.replace(/^"|"$/g, '');
}

/**
 * Runs the migration against an injected R2 adapter. Pure logic; no
 * filesystem walking — pass a planned `assets[]`. Reads each file, hashes,
 * heads target, skips when ETag matches md5, otherwise PUTs (or just
 * counts when `commit === false`).
 *
 * @param {{
 *   assets: Asset[];
 *   adapter: R2WriteAdapter;
 *   commit: boolean;
 *   log?: (msg: string) => void;
 * }} opts
 * @returns {Promise<Summary>}
 */
export async function runMigration({ assets, adapter, commit, log = () => {} }) {
  /** @type {Summary} */
  const summary = { copied: 0, skipped: 0, failed: 0, failures: [] };

  for (const asset of assets) {
    let body;
    try {
      body = await readFile(asset.absPath);
    } catch (err) {
      summary.failed += 1;
      summary.failures.push(`read ${asset.absPath}: ${err.message}`);
      continue;
    }

    const localHash = md5(body);

    let head;
    try {
      head = await adapter.head(asset.key);
    } catch (err) {
      summary.failed += 1;
      summary.failures.push(`head ${asset.key}: ${err.message}`);
      continue;
    }

    if (head.status === 200 && head.etag && stripQuotes(head.etag) === localHash) {
      summary.skipped += 1;
      log(`skip ${asset.key} (etag matches md5)`);
      continue;
    }

    if (!commit) {
      summary.copied += 1;
      log(`would copy ${asset.key} (${body.length} B)`);
      continue;
    }

    try {
      const put = await adapter.put(asset.key, body, asset.contentType);
      if (put.ok) {
        summary.copied += 1;
        log(`put  ${asset.key} (HTTP ${put.status})`);
      } else {
        summary.failed += 1;
        summary.failures.push(`put ${asset.key}: HTTP ${put.status}`);
      }
    } catch (err) {
      summary.failed += 1;
      summary.failures.push(`put ${asset.key}: ${err.message}`);
    }
  }

  return summary;
}

/**
 * Production write adapter: signs HEAD/PUT against R2 with aws4fetch.
 * @param {{ endpoint: string; bucket: string; accessKeyId: string; secretAccessKey: string }} opts
 * @returns {R2WriteAdapter}
 */
export function createAwsR2WriteAdapter({ endpoint, bucket, accessKeyId, secretAccessKey }) {
  const aws = new AwsClient({ accessKeyId, secretAccessKey, service: 's3', region: 'auto' });
  const baseUrl = `${endpoint.replace(/\/$/, '')}/${bucket}`;
  return {
    async head(key) {
      const res = await aws.fetch(`${baseUrl}/${encodeURI(key)}`, { method: 'HEAD' });
      return { etag: res.headers.get('etag'), status: res.status };
    },
    async put(key, body, contentType) {
      const res = await aws.fetch(`${baseUrl}/${encodeURI(key)}`, {
        method: 'PUT',
        body,
        headers: { 'content-type': contentType }
      });
      return { ok: res.ok, status: res.status };
    }
  };
}

function parseArgs(argv) {
  const args = { source: '', bucket: 'articles-content-stg', commit: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--source') args.source = argv[++i];
    else if (a === '--bucket') args.bucket = argv[++i];
    else if (a === '--commit') args.commit = true;
    else if (a === '--dry-run') args.commit = false;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

const USAGE = `Usage: node scripts/migrate-articles-to-r2.mjs --source <path> [--bucket <name>] [--dry-run | --commit]

Defaults: --bucket articles-content-stg, dry-run on.

Env required:
  R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY`;

/* c8 ignore start */
const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isCli) {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.source) {
    console.error(USAGE);
    process.exit(args.help ? 0 : 2);
  }
  for (const key of ['R2_ENDPOINT', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY']) {
    if (!process.env[key]) {
      console.error(`Missing env var: ${key}`);
      process.exit(2);
    }
  }
  const adapter = createAwsR2WriteAdapter({
    endpoint: process.env.R2_ENDPOINT,
    bucket: args.bucket,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  });
  const assets = await planMigration({ source: path.resolve(args.source) });
  const mode = args.commit ? 'COMMIT' : 'DRY-RUN';
  console.log(`[migrate] ${mode} bucket=${args.bucket} assets=${assets.length}`);
  const summary = await runMigration({
    assets,
    adapter,
    commit: args.commit,
    log: console.log
  });
  console.log('---');
  console.log(`copied : ${summary.copied}`);
  console.log(`skipped: ${summary.skipped}`);
  console.log(`failed : ${summary.failed}`);
  if (summary.failures.length) {
    console.log('failures:');
    for (const f of summary.failures) console.log(`  - ${f}`);
  }
  process.exit(summary.failed === 0 ? 0 : 1);
}
/* c8 ignore stop */
