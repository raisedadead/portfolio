/**
 * V12 — meta-grep gate: ensure CI workflows never reintroduce the
 * legacy submodule + ARTICLES_PAT coupling that P2 just removed.
 *
 * Detached as a meta-test rather than a runtime check because the only
 * place a regression could land is in `.github/workflows/*.yml` source.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const workflowsDir = join(process.cwd(), '.github/workflows');

function loadWorkflows(): { name: string; body: string }[] {
  return readdirSync(workflowsDir)
    .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'))
    .map((name) => ({ name, body: readFileSync(join(workflowsDir, name), 'utf8') }));
}

describe('V12 — CI workflows are submodule-free', () => {
  const workflows = loadWorkflows();

  it.each(workflows)('$name does not enable submodules in checkout', ({ body }) => {
    expect(body).not.toMatch(/^\s*submodules:\s*(true|recursive)\s*$/m);
  });

  it.each(workflows)('$name does not reference secrets.ARTICLES_PAT', ({ body }) => {
    expect(body).not.toMatch(/secrets\.ARTICLES_PAT/);
  });
});
