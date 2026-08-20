import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import catppuccinMocha from 'shiki/themes/catppuccin-mocha.mjs';
import langBash from 'shiki/langs/bash.mjs';
import langConsole from 'shiki/langs/console.mjs';
import langDiff from 'shiki/langs/diff.mjs';
import langHtml from 'shiki/langs/html.mjs';
import langJavascript from 'shiki/langs/javascript.mjs';
import langJson from 'shiki/langs/json.mjs';
import langPowershell from 'shiki/langs/powershell.mjs';
import langPython from 'shiki/langs/python.mjs';
import langTypescript from 'shiki/langs/typescript.mjs';
import langYaml from 'shiki/langs/yaml.mjs';

const NO_LINE_NUMBER_LANGUAGES = ['bash', 'console', 'plaintext'];
const LANGUAGE_ALIASES: Record<string, string> = {
  '': 'plaintext',
  text: 'plaintext',
  txt: 'plaintext',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  js: 'javascript',
  ts: 'typescript',
  ps1: 'powershell',
  pwsh: 'powershell'
};
const PLAIN_LANGUAGES = ['plaintext', 'ansi'];

let highlighterPromise: Promise<HighlighterCore> | undefined;

function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= createHighlighterCore({
    themes: [catppuccinMocha],
    langs: [
      langBash,
      langConsole,
      langDiff,
      langHtml,
      langJavascript,
      langJson,
      langPowershell,
      langPython,
      langTypescript,
      langYaml
    ],
    engine: createJavaScriptRegexEngine({ forgiving: true })
  });
  return highlighterPromise;
}

export async function highlightCode(code: string, language: string): Promise<string> {
  const stripped = language
    .trim()
    .toLowerCase()
    .replace(/^lang-/, '');
  const formattedLanguage = Object.hasOwn(LANGUAGE_ALIASES, stripped) ? LANGUAGE_ALIASES[stripped] : stripped;
  const showLineNumbers = !NO_LINE_NUMBER_LANGUAGES.includes(formattedLanguage);

  try {
    const highlighter = await getHighlighter();
    if (!PLAIN_LANGUAGES.includes(formattedLanguage) && !highlighter.getLoadedLanguages().includes(formattedLanguage)) {
      throw new Error(`language not loaded: ${formattedLanguage}`);
    }
    return highlighter.codeToHtml(code, {
      lang: formattedLanguage,
      theme: 'catppuccin-mocha',
      transformers: [
        {
          pre(node) {
            this.addClassToHast(node, 'shiki-code-block');
            if (showLineNumbers) {
              this.addClassToHast(node, 'shiki-line-numbers');
            }
          },
          line(node, line) {
            if (showLineNumbers) {
              node.properties['data-line'] = line;
            }
          }
        }
      ]
    });
  } catch {
    console.warn(`Shiki: Language "${formattedLanguage}" not supported, using plaintext`);
    return `<pre class="shiki shiki-code-block"><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
