#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { EmDashClient, markdownToPortableText } from 'emdash/client';
import sharp from 'sharp';
import { parse as parseYaml } from 'yaml';

const MAX_IMAGE_WIDTH = 1280;

export async function optimizeImage(bytes, filename) {
  const image = sharp(bytes, { animated: true });
  const meta = await image.metadata();
  if (meta.pages && meta.pages > 1) {
    return { bytes, filename, contentType: undefined };
  }
  const optimized = await image
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  return {
    bytes: new Uint8Array(optimized),
    filename: filename.replace(/\.[a-z0-9]+$/i, '.webp'),
    contentType: 'image/webp'
  };
}

const USAGE = `One-shot import: articles repo markdown -> EmDash (D1 + media storage).
Idempotent by slug; dry-run by default.

  node scripts/import-articles-to-emdash.mjs [--source <dir>] [--base-url <url>]
       [--token ec_pat_...] [--commit | --dry-run | --status]

Auth resolution order: --token, then the EMDASH_TOKEN env var, then (localhost
only) a token minted via the DEV-only /_emdash/api/setup/dev-bypass endpoint.
Prefer EMDASH_TOKEN over --token: argv leaks into the process table and logs.`;

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const LOCAL_IMAGE_RE = /\.\.\/assets\/images\/[^\s)"']+/g;

export function splitFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { frontmatter: {}, body: raw };
  return { frontmatter: parseYaml(match[1]) ?? {}, body: raw.slice(match[0].length).trimStart() };
}

export function collectLocalImageRefs(frontmatter, body) {
  const refs = new Set();
  if (typeof frontmatter.cover === 'string' && frontmatter.cover.startsWith('../assets/images/')) {
    refs.add(frontmatter.cover);
  }
  for (const ref of body.match(LOCAL_IMAGE_RE) ?? []) refs.add(ref);
  return [...refs];
}

export function refToDiskPath(sourceDir, ref) {
  const rel = ref.replace(/^\.\.\//, '');
  const resolved = path.resolve(sourceDir, rel);
  const imagesRoot = path.resolve(sourceDir, 'assets/images') + path.sep;
  if (!resolved.startsWith(imagesRoot)) {
    throw new Error(`image ref escapes assets/images: ${ref}`);
  }
  return resolved;
}

export function toMediaValue(item, alt) {
  return {
    provider: 'local',
    id: item.id,
    filename: item.filename,
    mimeType: item.mimeType,
    width: item.width,
    height: item.height,
    alt: alt ?? item.alt,
    meta: { storageKey: item.storageKey }
  };
}

export function rewriteImageBlocks(blocks, mediaByRef) {
  return blocks.map((block) => {
    if (block._type !== 'image' || typeof block.asset?.url !== 'string') return block;
    const item = mediaByRef.get(block.asset.url);
    if (!item) return block;
    return {
      ...block,
      width: item.width,
      height: item.height,
      asset: { _ref: item.id, url: item.url ?? `/_emdash/api/media/file/${item.storageKey}` }
    };
  });
}

export function toEntryInput(slug, frontmatter, blocks, isDraft, coverValue) {
  const tags = (frontmatter.tags ?? []).map((tag) => (typeof tag === 'string' ? tag : tag.slug));
  const data = {
    title: frontmatter.title,
    date: new Date(frontmatter.date).toISOString(),
    content: blocks
  };
  if (frontmatter.modified) data.modified = new Date(frontmatter.modified).toISOString();
  if (coverValue) data.cover = coverValue;
  if (frontmatter.brief) data.brief = frontmatter.brief;
  if (frontmatter.readingTime) data.reading_time = frontmatter.readingTime;
  if (frontmatter.seo?.title) data.seo_title = frontmatter.seo.title;
  if (frontmatter.seo?.description) data.seo_description = frontmatter.seo.description;
  return {
    slug,
    publish: !(isDraft || frontmatter.draft),
    status: 'draft',
    data,
    taxonomies: { tag: tags }
  };
}

export function capitalizeTag(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function parseArgs(argv) {
  const args = {
    sourceDir: '../articles',
    baseUrl: 'http://localhost:4321',
    commit: false,
    status: false,
    token: ''
  };
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--commit') args.commit = true;
    else if (arg === '--dry-run') args.commit = false;
    else if (arg === '--status') args.status = true;
    else if (arg === '--source') args.sourceDir = argv[++i];
    else if (arg === '--base-url') args.baseUrl = argv[++i];
    else if (arg === '--token') args.token = argv[++i];
    else if (arg === '--help' || arg === '-h') {
      console.log(USAGE);
      process.exit(0);
    } else throw new Error(`unknown argument: ${arg}\n${USAGE}`);
  }
  return args;
}

async function mintDevToken(baseUrl) {
  const response = await fetch(`${baseUrl}/_emdash/api/setup/dev-bypass?token=1`, { method: 'POST' });
  if (!response.ok) throw new Error(`dev-bypass failed: ${response.status}`);
  const payload = await response.json();
  const token = payload?.data?.token;
  if (!token) throw new Error('dev-bypass returned no token');
  return token;
}

async function readCollectionFiles(sourceDir, dir) {
  const abs = path.join(sourceDir, dir);
  let entries;
  try {
    entries = await readdir(abs);
  } catch {
    return [];
  }
  const names = entries.filter((name) => name.endsWith('.md') && !name.startsWith('_'));
  return Promise.all(
    names.map(async (name) => ({
      slug: name.replace(/\.md$/, ''),
      isDraft: dir === 'drafts',
      raw: await readFile(path.join(abs, name), 'utf8')
    }))
  );
}

async function ensureTerms(client, entries) {
  const wanted = new Map();
  for (const entry of entries) {
    for (const slug of entry.input.taxonomies.tag) wanted.set(slug, capitalizeTag(slug));
  }
  const existing = new Set();
  const { items } = await client.terms('tag', { limit: 200 });
  for (const term of items ?? []) existing.add(term.slug);
  for (const [slug, label] of wanted) {
    if (existing.has(slug)) continue;
    await client.createTerm('tag', { slug, label });
    console.log(`  + term ${slug} (${label})`);
  }
}

async function createEntry(baseUrl, token, input) {
  const { publish, ...body } = input;
  const response = await fetch(`${baseUrl}/_emdash/api/content/posts`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    throw new Error(`create ${input.slug} failed: ${response.status} ${JSON.stringify(payload.error ?? payload)}`);
  }
  return payload.data;
}

async function main() {
  const args = parseArgs(process.argv);
  const sourceDir = path.resolve(args.sourceDir);
  const token = args.token || process.env.EMDASH_TOKEN || (await mintDevToken(args.baseUrl));
  const client = new EmDashClient({ baseUrl: args.baseUrl, token });

  const existingSlugs = new Set();
  let publishedCount = 0;
  let draftCount = 0;
  for await (const item of client.listAll('posts', { limit: 100 })) {
    if (item.slug) existingSlugs.add(item.slug);
    if (item.status === 'published') publishedCount++;
    else draftCount++;
  }

  if (args.status) {
    console.log(`posts collection: ${publishedCount} published, ${draftCount} drafts`);
    return;
  }

  const files = [
    ...(await readCollectionFiles(sourceDir, 'posts')),
    ...(await readCollectionFiles(sourceDir, 'drafts'))
  ];
  console.log(`${files.length} markdown files in ${sourceDir}; ${existingSlugs.size} entries already in EmDash`);

  const entries = files.map((file) => {
    const { frontmatter, body } = splitFrontmatter(file.raw);
    return { ...file, frontmatter, body, refs: collectLocalImageRefs(frontmatter, body) };
  });

  const pending = entries.filter((entry) => !existingSlugs.has(entry.slug));
  for (const entry of entries) {
    const state = existingSlugs.has(entry.slug)
      ? 'skip (exists)'
      : entry.isDraft || entry.frontmatter.draft
        ? 'draft'
        : 'publish';
    console.log(`  ${state}: ${entry.slug} (${entry.refs.length} local images)`);
  }
  if (!args.commit) {
    console.log(`dry-run: would import ${pending.length} entries. Pass --commit to write.`);
    return;
  }

  const mediaByRef = new Map();
  for (const entry of pending) {
    for (const ref of entry.refs) {
      if (mediaByRef.has(ref)) continue;
      const raw = await readFile(refToDiskPath(sourceDir, ref));
      const optimized = await optimizeImage(raw, `${entry.slug}--${path.basename(ref)}`);
      const item = await client.mediaUpload(new Uint8Array(optimized.bytes), optimized.filename, {
        alt: entry.frontmatter.title,
        contentType: optimized.contentType
      });
      mediaByRef.set(ref, item);
      console.log(`  ^ media ${optimized.filename} -> ${item.id}`);
    }
  }

  for (const entry of pending) {
    entry.input = toEntryInput(
      entry.slug,
      entry.frontmatter,
      rewriteImageBlocks(markdownToPortableText(entry.body), mediaByRef),
      entry.isDraft,
      entry.frontmatter.cover && mediaByRef.has(entry.frontmatter.cover)
        ? toMediaValue(mediaByRef.get(entry.frontmatter.cover), entry.frontmatter.coverAlt ?? entry.frontmatter.title)
        : undefined
    );
  }

  await ensureTerms(client, pending);

  let created = 0;
  for (const entry of pending) {
    const item = await createEntry(args.baseUrl, token, entry.input);
    const record = item?.item ?? item;
    if (entry.input.publish) await client.publish('posts', record.id);
    created++;
    console.log(`  = ${entry.input.publish ? 'published' : 'draft'}: ${entry.slug}`);
  }
  console.log(`imported ${created} of ${pending.length} pending entries`);
}

const isDirectRun = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isDirectRun) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
