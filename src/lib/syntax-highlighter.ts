import { codeToHtml } from 'shiki';

/**
 * Highlights code at build time using Shiki
 * Returns HTML string with syntax highlighting
 */
export async function highlightCode(code: string, language: string): Promise<string> {
  const formattedLanguage = language.replace(/^lang-/, '');
  const showLineNumbers = !['', 'bash', 'console', 'plaintext', 'text', 'txt'].includes(formattedLanguage);

  try {
    const html = await codeToHtml(code, {
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

    return html;
  } catch {
    // Fallback to plaintext if language not supported
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
