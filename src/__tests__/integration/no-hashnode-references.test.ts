/**
 * V11 — meta-grep gate.
 *
 * Asserts that the live production codebase contains zero references to
 * "hashnode" (case-insensitive). The migration to R2 (P2) and the image
 * pipeline rewrite (P3) removed Hashnode as a runtime dependency; this
 * test prevents regressions from sneaking it back in.
 *
 * Scope: walks `src/`, `astro.config.mjs`, root `*.md` config files,
 * and `wrangler.jsonc`. Excludes:
 *   - `src/__tests__/**` (test files may negate-match the string as
 *     part of their assertions, including this very file)
 *   - `.scratchpad/` (gitignored dossier theatre)
 *   - generated artefacts (dist/, .astro/, coverage/, etc.) — these are
 *     gitignored already and never read by this walk
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

const SCAN_TARGETS = [
  path.join(repoRoot, 'src'),
  path.join(repoRoot, 'astro.config.mjs'),
  path.join(repoRoot, 'wrangler.jsonc'),
  path.join(repoRoot, 'CLAUDE.md'),
  path.join(repoRoot, 'README.md')
] as const;

const EXCLUDED_DIRS = new Set(['node_modules', 'dist', 'coverage', '.astro', '.wrangler', '__tests__', '__mocks__']);

function* walk(target: string): Generator<string> {
  let stat;
  try {
    stat = statSync(target);
  } catch {
    return;
  }
  if (stat.isFile()) {
    yield target;
    return;
  }
  for (const entry of readdirSync(target, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = path.join(target, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile()) {
      yield full;
    }
  }
}

function findHashnodeHits(): { file: string; line: number; preview: string }[] {
  const hits: { file: string; line: number; preview: string }[] = [];
  for (const target of SCAN_TARGETS) {
    for (const file of walk(target)) {
      const text = readFileSync(file, 'utf8');
      const lines = text.split('\n');
      lines.forEach((line, idx) => {
        if (/hashnode/i.test(line)) {
          hits.push({
            file: path.relative(repoRoot, file),
            line: idx + 1,
            preview: line.trim().slice(0, 120)
          });
        }
      });
    }
  }
  return hits;
}

describe('V11 — production codebase is Hashnode-free', () => {
  it('no source file references "hashnode" (case-insensitive)', () => {
    const hits = findHashnodeHits();
    if (hits.length > 0) {
      const summary = hits.map((h) => `  ${h.file}:${h.line}  ${h.preview}`).join('\n');
      expect.fail(`V11 violation — found ${hits.length} hashnode reference(s):\n${summary}`);
    }
    expect(hits).toEqual([]);
  });
});
