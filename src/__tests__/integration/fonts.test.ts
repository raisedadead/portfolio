import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const read = (file: string) => readFileSync(path.join(process.cwd(), file), 'utf8');
const astroConfig = read('astro.config.mjs');
const globalCss = read('src/styles/global.css');
const baseLayout = read('src/layouts/base-layout.astro');

describe('Astro Fonts API families', () => {
  it.each([
    ['--font-display', '--font-inter'],
    ['--font-sans', '--font-space-grotesk'],
    ['--font-mono', '--font-jetbrains-mono']
  ])('%s starts with var(%s), which the config and layout declare', (token, cssVariable) => {
    expect(astroConfig).toContain(`cssVariable: '${cssVariable}'`);
    expect(baseLayout).toContain(`<Font cssVariable="${cssVariable}"`);
    expect(globalCss).toMatch(new RegExp(`${token}:\\s*var\\(${cssVariable}\\),`));
  });

  it('sets a latin preload on the two text fonts and none on the code font', () => {
    expect(baseLayout).toContain('<Font cssVariable="--font-inter" preload={[{ subset: "latin" }]} />');
    expect(baseLayout).toContain('<Font cssVariable="--font-space-grotesk" preload={[{ subset: "latin" }]} />');
    expect(baseLayout).toContain('<Font cssVariable="--font-jetbrains-mono" />');
  });
});
