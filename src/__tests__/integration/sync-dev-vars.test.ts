/**
 * Tests for `scripts/sync-dev-vars.mjs`. The script bridges a single
 * `.env` source into the `.dev.vars` Wrangler expects, filtered to
 * runtime-only keys. These tests cover dotenv parsing, runtime-key
 * filtering, render shape, and idempotent file write semantics.
 *
 * No real `.env` or `.dev.vars` is touched — every test uses a tmpdir.
 */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  RUNTIME_KEYS,
  parseDotenv,
  renderDevVars,
  selectRuntime,
  syncDevVars
} from '../../../scripts/sync-dev-vars.mjs';

let tmp: string;

beforeEach(() => {
  tmp = mkdtempSync(path.join(os.tmpdir(), 'sync-dev-vars-'));
});

afterEach(() => {
  rmSync(tmp, { recursive: true, force: true });
});

describe('RUNTIME_KEYS', () => {
  it('only contains non-PUBLIC_ keys (no client-bundle leaks)', () => {
    for (const key of RUNTIME_KEYS) {
      expect(key, `${key} must not start with PUBLIC_`).not.toMatch(/^PUBLIC_/);
    }
  });

  it('includes the CF Access verifier prerequisites', () => {
    for (const key of ['CF_ACCESS_TEAM_DOMAIN', 'CF_ACCESS_AUD', 'CF_ACCESS_AUTHOR_EMAIL']) {
      expect(RUNTIME_KEYS).toContain(key);
    }
  });

  it('includes DEPLOY_HOOK_URL and DEV_BYPASS_ACCESS', () => {
    expect(RUNTIME_KEYS).toContain('DEPLOY_HOOK_URL');
    expect(RUNTIME_KEYS).toContain('DEV_BYPASS_ACCESS');
  });
});

describe('parseDotenv', () => {
  it('parses KEY=VALUE pairs and strips comments + blank lines', () => {
    const text = ['# comment', '', 'FOO=bar', '  BAZ=qux  ', '# another', 'EMPTY='].join('\n');
    expect(parseDotenv(text)).toEqual({ FOO: 'bar', BAZ: 'qux', EMPTY: '' });
  });

  it('strips matched single or double quotes', () => {
    expect(parseDotenv('A="hello"\nB=\'world\'\nC="mixed\'')).toEqual({
      A: 'hello',
      B: 'world',
      C: '"mixed\''
    });
  });

  it('ignores lines without an `=` separator', () => {
    expect(parseDotenv('NO_EQUALS\nGOOD=ok')).toEqual({ GOOD: 'ok' });
  });

  it('skips keys that are not valid env identifiers', () => {
    expect(parseDotenv('lowercase=x\n9START=x\nVALID_NAME=y')).toEqual({ VALID_NAME: 'y' });
  });

  it('handles CRLF line endings', () => {
    expect(parseDotenv('FOO=1\r\nBAR=2\r\n')).toEqual({ FOO: '1', BAR: '2' });
  });
});

describe('selectRuntime', () => {
  it('keeps only runtime keys, drops everything else', () => {
    const env = {
      CF_ACCESS_AUD: 'aud',
      DEPLOY_HOOK_URL: 'https://example.com/hook',
      R2_ACCESS_KEY_ID: 'leak',
      PUBLIC_USE_R2_LOADER: '1',
      DEV_BYPASS_ACCESS: '0'
    };
    expect(selectRuntime(env)).toEqual({
      CF_ACCESS_AUD: 'aud',
      DEPLOY_HOOK_URL: 'https://example.com/hook',
      DEV_BYPASS_ACCESS: '0'
    });
  });

  it('returns an empty object when no runtime keys are present', () => {
    expect(selectRuntime({ R2_ACCESS_KEY_ID: 'x' })).toEqual({});
  });

  it('honours a custom keys list', () => {
    expect(selectRuntime({ A: '1', B: '2' }, ['A'])).toEqual({ A: '1' });
  });
});

describe('renderDevVars', () => {
  it('emits a do-not-edit header and trailing newline', () => {
    const out = renderDevVars({ FOO: '1' });
    expect(out.startsWith('# GENERATED')).toBe(true);
    expect(out).toContain('Do not edit');
    expect(out.endsWith('\n')).toBe(true);
  });

  it('writes one KEY=VALUE per line, in iteration order', () => {
    const out = renderDevVars({ A: 'x', B: 'y' });
    const lines = out.trim().split('\n');
    expect(lines.at(-2)).toBe('A=x');
    expect(lines.at(-1)).toBe('B=y');
  });

  it('still emits the header when there are no runtime keys', () => {
    const out = renderDevVars({});
    expect(out).toMatch(/^# GENERATED/);
  });
});

describe('syncDevVars', () => {
  it('skips and logs when .env is missing', () => {
    const log = vi.fn();
    const result = syncDevVars({
      envPath: path.join(tmp, '.env'),
      devVarsPath: path.join(tmp, '.dev.vars'),
      log
    });
    expect(result.wrote).toBe(false);
    expect(result.reason).toBe('missing-env');
    expect(log).toHaveBeenCalled();
  });

  it('writes only the runtime subset on first run', () => {
    writeFileSync(
      path.join(tmp, '.env'),
      [
        'CF_ACCESS_AUD=abc',
        'DEPLOY_HOOK_URL=https://example.com',
        'DEV_BYPASS_ACCESS=0',
        'R2_ACCESS_KEY_ID=should-not-leak',
        'PUBLIC_USE_R2_LOADER=1'
      ].join('\n')
    );
    const result = syncDevVars({
      envPath: path.join(tmp, '.env'),
      devVarsPath: path.join(tmp, '.dev.vars')
    });
    expect(result.wrote).toBe(true);
    expect(result.keys.sort()).toEqual(['CF_ACCESS_AUD', 'DEPLOY_HOOK_URL', 'DEV_BYPASS_ACCESS']);
    const written = readFileSync(path.join(tmp, '.dev.vars'), 'utf8');
    expect(written).toContain('CF_ACCESS_AUD=abc');
    expect(written).toContain('DEPLOY_HOOK_URL=https://example.com');
    expect(written).toContain('DEV_BYPASS_ACCESS=0');
    expect(written).not.toContain('R2_ACCESS_KEY_ID');
    expect(written).not.toContain('PUBLIC_USE_R2_LOADER');
  });

  it('is idempotent — does not rewrite when content is unchanged', () => {
    writeFileSync(path.join(tmp, '.env'), 'CF_ACCESS_AUD=abc\n');
    const first = syncDevVars({
      envPath: path.join(tmp, '.env'),
      devVarsPath: path.join(tmp, '.dev.vars')
    });
    expect(first.wrote).toBe(true);
    const second = syncDevVars({
      envPath: path.join(tmp, '.env'),
      devVarsPath: path.join(tmp, '.dev.vars')
    });
    expect(second.wrote).toBe(false);
    expect(second.reason).toBe('unchanged');
  });

  it('rewrites when the underlying value changes', () => {
    writeFileSync(path.join(tmp, '.env'), 'CF_ACCESS_AUD=abc\n');
    syncDevVars({
      envPath: path.join(tmp, '.env'),
      devVarsPath: path.join(tmp, '.dev.vars')
    });
    writeFileSync(path.join(tmp, '.env'), 'CF_ACCESS_AUD=xyz\n');
    const result = syncDevVars({
      envPath: path.join(tmp, '.env'),
      devVarsPath: path.join(tmp, '.dev.vars')
    });
    expect(result.wrote).toBe(true);
    const written = readFileSync(path.join(tmp, '.dev.vars'), 'utf8');
    expect(written).toContain('CF_ACCESS_AUD=xyz');
    expect(written).not.toContain('abc');
  });

  it('handles a directory that needs to exist for the .dev.vars write', () => {
    mkdirSync(path.join(tmp, 'nested'));
    writeFileSync(path.join(tmp, 'nested', '.env'), 'CF_ACCESS_AUD=abc\n');
    const result = syncDevVars({
      envPath: path.join(tmp, 'nested', '.env'),
      devVarsPath: path.join(tmp, 'nested', '.dev.vars')
    });
    expect(result.wrote).toBe(true);
  });
});
