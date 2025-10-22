import { describe, expect, it, vi } from 'vitest';
import { highlightCode } from '@/lib/syntax-highlighter';

describe('highlightCode', () => {
  describe('Language Support', () => {
    it('highlights JavaScript code', async () => {
      const code = 'const hello = "world";';
      const result = await highlightCode(code, 'javascript');

      expect(result).toContain('shiki-code-block');
      expect(result).toContain('shiki-line-numbers');
      expect(result).toContain('<pre');
      expect(result).toContain('catppuccin-mocha');
    });

    it('highlights TypeScript code', async () => {
      const code = 'const hello: string = "world";';
      const result = await highlightCode(code, 'typescript');

      expect(result).toContain('shiki-code-block');
      expect(result).toContain('shiki-line-numbers');
      expect(result).toContain('<pre');
    });

    it('highlights Python code', async () => {
      const code = 'print("Hello, World!")';
      const result = await highlightCode(code, 'python');

      expect(result).toContain('shiki-code-block');
      expect(result).toContain('shiki-line-numbers');
      expect(result).toContain('print');
    });

    it('highlights bash code without line numbers', async () => {
      const code = 'echo "Hello, World!"';
      const result = await highlightCode(code, 'bash');

      expect(result).toContain('shiki-code-block');
      expect(result).not.toContain('shiki-line-numbers');
      expect(result).toContain('echo');
    });

    it('highlights console code without line numbers', async () => {
      const code = '$ npm install';
      const result = await highlightCode(code, 'console');

      expect(result).toContain('shiki-code-block');
      expect(result).not.toContain('shiki-line-numbers');
      expect(result).toContain('npm');
    });

    it('highlights plaintext without line numbers', async () => {
      const code = 'This is plain text';
      const result = await highlightCode(code, 'plaintext');

      expect(result).toContain('shiki-code-block');
      expect(result).not.toContain('shiki-line-numbers');
      expect(result).toContain(code);
    });
  });

  describe('Language Prefix Handling', () => {
    it('strips "lang-" prefix from language', async () => {
      const code = 'const test = true;';
      const result = await highlightCode(code, 'lang-javascript');

      expect(result).toContain('shiki-code-block');
      expect(result).toContain('<pre');
    });

    it('handles language without prefix', async () => {
      const code = 'const test = true;';
      const result = await highlightCode(code, 'javascript');

      expect(result).toContain('shiki-code-block');
      expect(result).toContain('<pre');
    });
  });

  describe('Unsupported Languages', () => {
    it('falls back to plaintext for unsupported languages', async () => {
      const code = 'some random code';
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await highlightCode(code, 'fake-language-xyz');

      expect(consoleWarnSpy).toHaveBeenCalledWith('Shiki: Language "fake-language-xyz" not supported, using plaintext');
      expect(result).toContain('shiki-code-block');
      expect(result).toContain(code);

      consoleWarnSpy.mockRestore();
    });

    it('escapes HTML in fallback', async () => {
      const code = '<script>alert("xss")</script>';
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = await highlightCode(code, 'fake-language');

      expect(result).toContain('&lt;script&gt;');
      expect(result).toContain('&lt;/script&gt;');
      expect(result).not.toContain('<script>');

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Special Characters', () => {
    it('handles HTML special characters', async () => {
      const code = 'const html = "<div>Hello</div>";';
      const result = await highlightCode(code, 'javascript');

      expect(result).toContain('shiki-code-block');
      expect(result.length).toBeGreaterThan(code.length);
    });

    it('handles quotes and apostrophes', async () => {
      const code = `const str = "It's a test";`;
      const result = await highlightCode(code, 'javascript');

      expect(result).toContain('shiki-code-block');
      expect(result.length).toBeGreaterThan(0);
    });

    it('handles ampersands', async () => {
      const code = 'const result = a && b;';
      const result = await highlightCode(code, 'javascript');

      expect(result).toContain('shiki-code-block');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty code', async () => {
      const result = await highlightCode('', 'javascript');

      expect(result).toContain('shiki-code-block');
    });

    it('handles empty language', async () => {
      const code = 'some code';
      const result = await highlightCode(code, '');

      expect(result).toContain('shiki-code-block');
      expect(result).not.toContain('shiki-line-numbers');
    });

    it('handles multiline code', async () => {
      const code = `function test() {
  return true;
}`;
      const result = await highlightCode(code, 'javascript');

      expect(result).toContain('shiki-code-block');
      expect(result).toContain('shiki-line-numbers');
      expect(result).toContain('data-line');
    });

    it('handles very long single line', async () => {
      const code = `const x = ${'"a"'.repeat(1000)};`;
      const result = await highlightCode(code, 'javascript');

      expect(result).toContain('shiki-code-block');
      expect(result.length).toBeGreaterThan(code.length);
    });
  });

  describe('Line Numbers', () => {
    it('adds line numbers for JavaScript', async () => {
      const code = 'const test = true;';
      const result = await highlightCode(code, 'javascript');

      expect(result).toContain('shiki-line-numbers');
      expect(result).toContain('data-line');
    });

    it('adds line numbers for TypeScript', async () => {
      const code = 'const test: boolean = true;';
      const result = await highlightCode(code, 'typescript');

      expect(result).toContain('shiki-line-numbers');
      expect(result).toContain('data-line');
    });

    it('does not add line numbers for bash', async () => {
      const code = 'echo "test"';
      const result = await highlightCode(code, 'bash');

      expect(result).not.toContain('shiki-line-numbers');
      expect(result).not.toContain('data-line');
    });

    it('does not add line numbers for console', async () => {
      const code = '$ ls -la';
      const result = await highlightCode(code, 'console');

      expect(result).not.toContain('shiki-line-numbers');
      expect(result).not.toContain('data-line');
    });

    it('does not add line numbers for text', async () => {
      const code = 'plain text';
      const result = await highlightCode(code, 'text');

      expect(result).not.toContain('shiki-line-numbers');
    });

    it('does not add line numbers for txt', async () => {
      const code = 'plain text';
      const result = await highlightCode(code, 'txt');

      expect(result).not.toContain('shiki-line-numbers');
    });
  });

  describe('Theme', () => {
    it('uses catppuccin-mocha theme', async () => {
      const code = 'const test = true;';
      const result = await highlightCode(code, 'javascript');

      expect(result).toContain('catppuccin-mocha');
      expect(result).toContain('<pre');
      expect(result).toContain('style=');
    });
  });
});
