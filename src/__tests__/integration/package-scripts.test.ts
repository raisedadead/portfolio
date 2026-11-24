import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vite-plus/test';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const pkg: { scripts: Record<string, string> } = JSON.parse(readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const prepareSteps: Array<string> = pkg.scripts.prepare.split('; ');
const [handover, hookInstall] = prepareSteps;

const dirs: Array<string> = [];

function tempDir() {
  const dir = mkdtempSync(path.join(tmpdir(), 'prepare-'));
  dirs.push(dir);
  return dir;
}

// security: a git hook exports GIT_DIR, which would point these calls at the real repo.
function isolatedEnv(globalConfig = '/dev/null') {
  const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GIT_')));
  return { ...env, GIT_CONFIG_GLOBAL: globalConfig, GIT_CONFIG_NOSYSTEM: '1' };
}

function repo(env: NodeJS.ProcessEnv, localHooksPath?: string) {
  const dir = tempDir();
  execFileSync('git', ['init', '-q', '--template='], { cwd: dir, env });
  if (localHooksPath) {
    execFileSync('git', ['config', '--local', 'core.hooksPath', localHooksPath], { cwd: dir, env });
  }
  return dir;
}

function localHooksPathAfterHandover(dir: string, env: NodeJS.ProcessEnv) {
  execFileSync('sh', ['-c', handover], { cwd: dir, env });
  return spawnSync('git', ['config', '--local', '--get', 'core.hooksPath'], {
    cwd: dir,
    env,
    encoding: 'utf8'
  }).stdout.trim();
}

afterEach(() => {
  for (const dir of dirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe('package scripts', () => {
  it('checks formatting without writing files', () => {
    expect(pkg.scripts['format:check']).toBe('vp fmt --check .');
  });

  it('runs nested scripts through vp, not pnpm', () => {
    const scriptsCallingPnpm = Object.entries(pkg.scripts)
      .filter(([, command]) => /\bpnpm\b/.test(command))
      .map(([name]) => name);
    expect(scriptsCallingPnpm).toEqual([]);
  });

  it('hands over the hooks path, then installs Vite+ hooks without touching agent files', () => {
    expect(prepareSteps).toHaveLength(2);
    expect(hookInstall).toBe('vp config --no-agent');
  });

  it('clears a local Husky hooks path before Vite+ installs its hooks', () => {
    const env = isolatedEnv();
    expect(localHooksPathAfterHandover(repo(env, '.husky/_'), env)).toBe('');
  });

  it('keeps any other hooks path', () => {
    const env = isolatedEnv();
    expect(localHooksPathAfterHandover(repo(env, 'custom/hooks'), env)).toBe('custom/hooks');
  });

  it('ignores a Husky hooks path set outside the repo', () => {
    const globalConfig = path.join(tempDir(), 'gitconfig');
    writeFileSync(globalConfig, '[core]\n\thooksPath = .husky/_\n');
    const env = isolatedEnv(globalConfig);
    expect(localHooksPathAfterHandover(repo(env), env)).toBe('');
    expect(readFileSync(globalConfig, 'utf8')).toContain('hooksPath = .husky/_');
  });
});
