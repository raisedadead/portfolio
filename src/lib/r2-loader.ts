/**
 * Cloudflare R2 markdown loader for Astro content collections.
 *
 * Two layers, kept separate so the loader can be unit-tested without any
 * network or AWS-SDK shape pollution:
 *
 *   1. `r2MarkdownLoader(options)` — the Astro `Loader`. Pure logic. Takes an
 *      `R2ListGetClient` interface, lists keys under a prefix, fetches the
 *      markdown bodies, splits frontmatter, calls `parseData` + `store.set`.
 *      Tests pass an in-memory fake client; no network calls happen.
 *
 *   2. `createAwsR2Client(options)` — the production adapter. Uses
 *      `aws4fetch` (~10 KB) to sign S3-compatible requests against R2 and
 *      satisfies the `R2ListGetClient` interface.
 *
 * R2 endpoint: https://<account-id>.r2.cloudflarestorage.com
 * Buckets:    articles-content-prd | articles-content-stg
 * Layout:     posts/<slug>.md, drafts/<slug>.md, assets/images/<slug>/<file>
 */
import type { Loader } from 'astro/loaders';
import { AwsClient } from 'aws4fetch';
import { parse as parseYaml } from 'yaml';

/**
 * Minimal interface the loader needs from R2: list keys under a prefix and
 * read a key's body. Anything that satisfies this works in tests.
 */
export interface R2ListGetClient {
  list(prefix: string): Promise<string[]>;
  get(key: string): Promise<string | null>;
}

export interface R2MarkdownLoaderOptions {
  client: R2ListGetClient;
  /** Key prefix to scan, e.g. `"posts/"`. Trailing slash recommended. */
  prefix: string;
  /** Loader name surfaced in Astro logs. */
  name?: string;
}

interface ParsedFrontmatter {
  data: Record<string, unknown>;
  body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/**
 * Splits a markdown blob into YAML frontmatter + body. If no frontmatter
 * fence is present, returns `{ data: {}, body: raw }`. The YAML is parsed
 * with the `yaml` package (Astro's own transitive dep) so we avoid pulling
 * in `gray-matter`.
 */
export function splitFrontmatter(raw: string): ParsedFrontmatter {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    return { data: {}, body: raw };
  }
  const [, yamlBlock, body] = match;
  const parsed = (parseYaml(yamlBlock) ?? {}) as Record<string, unknown>;
  return { data: parsed, body };
}

/**
 * Rewrites legacy submodule-relative asset paths into the portfolio's
 * runtime image-streamer route. The migration source still embeds
 * `../assets/images/<slug>/<file>` references from the pre-R2 era; those
 * paths no longer resolve at build time (no local files) so the build
 * crashes in `image()`. Mapping them to `/api/img/<slug>/<file>` lets
 * `<img>` tags fetch from the R2 streamer at request time.
 *
 * Returns the input unchanged when no asset prefix is found.
 */
export function rewriteAssetUrl(value: string | undefined): string | undefined {
  if (!value) return value;
  return value.replace(
    /(?:\.\.\/)?assets\/images\/([^/]+)\/([^\s)"']+)/g,
    (_match, slug, rest) => `/api/img/${slug}/${rest}`
  );
}

/**
 * Parses an S3 ListObjectsV2 XML response and returns the `<Key>` values.
 * R2 mirrors the S3 XML schema exactly, so this works against either.
 */
export function parseS3Keys(xml: string): string[] {
  const matches = xml.matchAll(/<Key>([^<]+)<\/Key>/g);
  return Array.from(matches, (m) => decodeXmlEntities(m[1]));
}

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

/**
 * Builds an Astro Loader that pulls markdown entries from R2.
 *
 * The loader:
 *   - lists keys under `prefix`
 *   - filters to `*.md`
 *   - fetches each blob, splits frontmatter
 *   - validates via `parseData` (collection schema applies)
 *   - writes to the `store` with a content digest
 *
 * Failures on individual objects are logged and skipped, not thrown — one
 * malformed post must not poison the whole build. List failures degrade
 * gracefully: the previous store contents are preserved.
 */
export function r2MarkdownLoader(options: R2MarkdownLoaderOptions): Loader {
  const { client, prefix, name = 'r2-markdown-loader' } = options;
  return {
    name,
    async load({ store, logger, parseData, generateDigest, renderMarkdown }) {
      let keys: string[];
      try {
        const listed = await client.list(prefix);
        keys = listed.filter((key) => key.endsWith('.md'));
      } catch (err) {
        logger.warn(`R2 list failed for prefix "${prefix}": ${(err as Error).message}`);
        return;
      }

      store.clear();

      for (const key of keys) {
        let raw: string | null;
        try {
          raw = await client.get(key);
        } catch (err) {
          logger.warn(`R2 get failed for ${key}: ${(err as Error).message}`);
          continue;
        }

        if (raw === null) {
          logger.warn(`R2 get returned null for ${key}`);
          continue;
        }

        const { data, body: rawBody } = splitFrontmatter(raw);
        const id = key.slice(prefix.length).replace(/\.md$/, '');

        if (typeof data.cover === 'string') {
          data.cover = rewriteAssetUrl(data.cover);
        }
        const body = rewriteAssetUrl(rawBody) ?? rawBody;

        let parsedData: Record<string, unknown>;
        try {
          parsedData = await parseData({ id, data });
        } catch (err) {
          logger.warn(`R2 parseData failed for ${key}: ${(err as Error).message}`);
          continue;
        }

        // Render markdown to HTML so `render(entry)` / `<Content />` returns
        // populated output. Without this `store.set` would carry the body text
        // only and Astro would have nothing to render. Failures here are not
        // fatal: the entry is skipped and the rest of the build proceeds.
        let rendered;
        try {
          rendered = await renderMarkdown(body);
        } catch (err) {
          logger.warn(`R2 renderMarkdown failed for ${key}: ${(err as Error).message}`);
          continue;
        }

        store.set({
          id,
          data: parsedData,
          body,
          digest: generateDigest(raw),
          rendered
        });
      }
    }
  };
}

export interface AwsR2ClientOptions {
  /** e.g. `https://<account-id>.r2.cloudflarestorage.com` (no trailing slash). */
  endpoint: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
}

/**
 * Production adapter: signs S3-compatible HTTP calls against R2 with
 * `aws4fetch`. Region is `auto` for R2.
 */
export function createAwsR2Client(opts: AwsR2ClientOptions): R2ListGetClient {
  const aws = new AwsClient({
    accessKeyId: opts.accessKeyId,
    secretAccessKey: opts.secretAccessKey,
    service: 's3',
    region: 'auto'
  });
  const baseUrl = `${opts.endpoint.replace(/\/$/, '')}/${opts.bucket}`;

  return {
    async list(prefix: string): Promise<string[]> {
      const url = `${baseUrl}?list-type=2&prefix=${encodeURIComponent(prefix)}`;
      const res = await aws.fetch(url);
      if (!res.ok) {
        throw new Error(`R2 list "${prefix}" → HTTP ${res.status}`);
      }
      return parseS3Keys(await res.text());
    },
    async get(key: string): Promise<string | null> {
      const res = await aws.fetch(`${baseUrl}/${encodeURI(key)}`);
      if (res.status === 404) return null;
      if (!res.ok) {
        throw new Error(`R2 get "${key}" → HTTP ${res.status}`);
      }
      return res.text();
    }
  };
}
