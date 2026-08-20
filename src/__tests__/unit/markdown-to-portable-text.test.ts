import { describe, expect, it } from 'vitest';
import { markdownToPortableText } from '../../../scripts/markdown-to-portable-text.mjs';

const text = (block: Record<string, any>): string =>
  ((block.children ?? []) as Array<{ text?: string }>).map((span) => span.text ?? '').join('');

const types = (blocks: Array<Record<string, any>>): string[] => blocks.map((block) => block._type);

describe('markdownToPortableText — block structure', () => {
  it('keeps a wrapped paragraph as one block', () => {
    const blocks = markdownToPortableText('One sentence\nwrapped over\nthree lines.\n');
    expect(blocks).toHaveLength(1);
    expect(text(blocks[0])).toBe('One sentence\nwrapped over\nthree lines.');
  });

  it('maps ATX headings to matching styles', () => {
    const blocks = markdownToPortableText('# One\n\n## Two\n\n### Three\n\n#### Four\n');
    expect(blocks.map((block) => block.style)).toEqual(['h1', 'h2', 'h3', 'h4']);
  });

  it('maps a horizontal rule to a break block', () => {
    const blocks = markdownToPortableText('Before\n\n---\n\nAfter\n');
    expect(types(blocks)).toEqual(['block', 'break', 'block']);
    expect(blocks[1].style).toBe('line');
  });

  it('maps a fenced code block to a code block with its language', () => {
    const blocks = markdownToPortableText('```bash\nls -la\necho hi\n```\n');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]._type).toBe('code');
    expect(blocks[0].language).toBe('bash');
    expect(blocks[0].code).toBe('ls -la\necho hi');
  });

  it('maps a multi-paragraph blockquote to consecutive blockquote blocks', () => {
    const blocks = markdownToPortableText('> First line.\n>\n> Second line.\n');
    expect(blocks.every((block) => block.style === 'blockquote')).toBe(true);
    expect(blocks.map(text)).toEqual(['First line.', 'Second line.']);
  });

  it('maps a pipe table to a table block with a header row', () => {
    const blocks = markdownToPortableText('| Flag | Use |\n| --- | --- |\n| -a | all |\n');
    expect(blocks).toHaveLength(1);
    expect(blocks[0]._type).toBe('table');
    expect(blocks[0].hasHeaderRow).toBe(true);
    expect(blocks[0].rows).toHaveLength(2);
    expect(blocks[0].rows[0].cells.map((cell: any) => cell.content[0].text)).toEqual(['Flag', 'Use']);
    expect(blocks[0].rows[0].cells.every((cell: any) => cell.isHeader)).toBe(true);
  });

  it('maps a raw HTML block to an htmlBlock', () => {
    const blocks = markdownToPortableText('<div class="note">Heads up</div>\n');
    expect(types(blocks)).toEqual(['htmlBlock']);
    expect(blocks[0].html).toContain('Heads up');
  });
});

describe('markdownToPortableText — images', () => {
  it('lifts a standalone image to an image block', () => {
    const blocks = markdownToPortableText('![a shot](../assets/images/post/shot.png)\n');
    expect(types(blocks)).toEqual(['image']);
    expect(blocks[0].alt).toBe('a shot');
    expect(blocks[0].asset.url).toBe('../assets/images/post/shot.png');
  });

  it('lifts an image indented inside an ordered list item', () => {
    const md = '1. Shrink the volume.\n\n   ![1.png](../assets/images/post/ZwwU48KzC.png)\n\n2. Restart.\n';
    const blocks = markdownToPortableText(md);
    const image = blocks.find((block) => block._type === 'image');
    expect(image).toBeDefined();
    expect(image?.asset.url).toBe('../assets/images/post/ZwwU48KzC.png');
    expect(blocks.some((block) => text(block).includes('!['))).toBe(false);
    expect(blocks.some((block) => text(block).startsWith('!'))).toBe(false);
  });

  it('keeps an empty alt when the source has none', () => {
    const blocks = markdownToPortableText('![](../assets/images/post/x.png)\n');
    expect(blocks[0].alt).toBe('');
  });

  it('splits a paragraph that mixes text and an image', () => {
    const blocks = markdownToPortableText('Look here ![x](../assets/images/p/x.png) and here.\n');
    expect(types(blocks)).toEqual(['block', 'image', 'block']);
    expect(text(blocks[0])).toBe('Look here');
    expect(text(blocks[2])).toBe('and here.');
  });

  it('keeps a remote image URL untouched', () => {
    const blocks = markdownToPortableText('![g](https://guide-images.cdn.ifixit.com/igi/1KYGFBXEjBCNtXCW.medium)\n');
    expect(blocks[0].asset.url).toBe('https://guide-images.cdn.ifixit.com/igi/1KYGFBXEjBCNtXCW.medium');
  });
});

describe('markdownToPortableText — lists', () => {
  it('marks ordered and unordered items with the right listItem', () => {
    const blocks = markdownToPortableText('1. one\n2. two\n\n- a\n- b\n');
    expect(blocks.map((block) => block.listItem)).toEqual(['number', 'number', 'bullet', 'bullet']);
  });

  it('raises level for a nested list', () => {
    const blocks = markdownToPortableText('- outer\n  - inner\n');
    expect(blocks.map((block) => block.level)).toEqual([1, 2]);
  });

  it('gives every item of one ordered list the same listId', () => {
    const blocks = markdownToPortableText('1. one\n2. two\n3. three\n');
    const ids = new Set(blocks.map((block) => block.listId));
    expect(ids.size).toBe(1);
    expect(blocks[0].listStart).toBe(1);
  });

  it('keeps one listId across items separated by a code block', () => {
    const md = '1. First.\n\n   ```bash\n   ls\n   ```\n\n2. Second.\n';
    const blocks = markdownToPortableText(md);
    const items = blocks.filter((block) => block.listItem === 'number');
    expect(items).toHaveLength(2);
    expect(items[0].listId).toBe(items[1].listId);
    expect(types(blocks)).toContain('code');
  });

  it('gives two separate ordered lists different listIds', () => {
    const blocks = markdownToPortableText('1. a\n2. b\n\nBreak.\n\n1. c\n2. d\n');
    const items = blocks.filter((block) => block.listItem === 'number');
    expect(items[0].listId).not.toBe(items[3].listId);
  });

  it('honours a list that starts at a number other than one', () => {
    const blocks = markdownToPortableText('3. three\n4. four\n');
    expect(blocks[0].listStart).toBe(3);
  });

  it('emits a list-item continuation paragraph without leading whitespace', () => {
    const md = '1. Turn off BitLocker.\n\n   This step is required because of secure boot.\n\n2. Restart.\n';
    const blocks = markdownToPortableText(md);
    const paragraph = blocks.find((block) => text(block).startsWith('This step'));
    expect(paragraph).toBeDefined();
    expect(paragraph?.listItem).toBeUndefined();
    expect(blocks.every((block) => !/^\s/.test(text(block)))).toBe(true);
  });

  it('lifts an indented code fence inside a list item to a code block', () => {
    const md = '1. Run this:\n\n   ```shell\n   fd --type f\n   ```\n';
    const blocks = markdownToPortableText(md);
    const code = blocks.find((block) => block._type === 'code');
    expect(code?.language).toBe('shell');
    expect(code?.code).toBe('fd --type f');
    expect(blocks.some((block) => text(block).includes('```'))).toBe(false);
  });
});

describe('markdownToPortableText — inline marks', () => {
  it('marks strong and emphasis, including single-asterisk emphasis', () => {
    const blocks = markdownToPortableText('This is **bold** and *slanted* and _also slanted_.\n');
    const marked = blocks[0].children.filter((span: any) => (span.marks ?? []).length > 0);
    expect(marked.map((span: any) => [span.text, span.marks])).toEqual([
      ['bold', ['strong']],
      ['slanted', ['em']],
      ['also slanted', ['em']]
    ]);
  });

  it('marks inline code and keeps underscores inside it intact', () => {
    const blocks = markdownToPortableText('Set the `ZSH_THEME` value in `~/.zshrc`.\n');
    const code = blocks[0].children.filter((span: any) => (span.marks ?? []).includes('code'));
    expect(code.map((span: any) => span.text)).toEqual(['ZSH_THEME', '~/.zshrc']);
  });

  it('does not italicise snake_case words outside code', () => {
    const blocks = markdownToPortableText('The known_hosts file lives in ~/.ssh/known_hosts today.\n');
    expect(text(blocks[0])).toBe('The known_hosts file lives in ~/.ssh/known_hosts today.');
    expect(blocks[0].children.every((span: any) => (span.marks ?? []).length === 0)).toBe(true);
  });

  it('marks strikethrough', () => {
    const blocks = markdownToPortableText('This is ~~gone~~ now.\n');
    const struck = blocks[0].children.find((span: any) => (span.marks ?? []).includes('strike-through'));
    expect(struck.text).toBe('gone');
  });

  it('records a link as a markDef annotation', () => {
    const blocks = markdownToPortableText('See [the docs](https://example.com/docs).\n');
    expect(blocks[0].markDefs).toHaveLength(1);
    expect(blocks[0].markDefs[0]).toMatchObject({ _type: 'link', href: 'https://example.com/docs' });
    const linked = blocks[0].children.find((span: any) => (span.marks ?? []).includes(blocks[0].markDefs[0]._key));
    expect(linked.text).toBe('the docs');
  });

  it('resolves a reference-style link', () => {
    const blocks = markdownToPortableText('See [the docs][d].\n\n[d]: https://example.com/docs\n');
    expect(blocks[0].markDefs[0].href).toBe('https://example.com/docs');
  });

  it('autolinks a bare URL', () => {
    const blocks = markdownToPortableText('Read https://cli.github.com/manual/ for more.\n');
    expect(blocks[0].markDefs[0].href).toBe('https://cli.github.com/manual/');
  });
});

describe('markdownToPortableText — inline HTML', () => {
  it('maps a kbd tag to the code mark instead of leaking the tag', () => {
    const blocks = markdownToPortableText('Press <kbd>Ctrl</kbd>+<kbd>P</kbd> to open it.\n');
    expect(text(blocks[0])).toBe('Press Ctrl+P to open it.');
    const marked = blocks[0].children.filter((span: any) => (span.marks ?? []).includes('code'));
    expect(marked.map((span: any) => span.text)).toEqual(['Ctrl', 'P']);
  });

  it('maps presentational tags to their Portable Text marks', () => {
    const blocks = markdownToPortableText('<b>b</b> <i>i</i> <u>u</u> <s>s</s> <sup>up</sup> <sub>dn</sub>\n');
    const pairs = blocks[0].children
      .filter((span: any) => (span.marks ?? []).length > 0)
      .map((span: any) => [span.text, span.marks[0]]);
    expect(pairs).toEqual([
      ['b', 'strong'],
      ['i', 'em'],
      ['u', 'underline'],
      ['s', 'strike-through'],
      ['up', 'superscript'],
      ['dn', 'subscript']
    ]);
  });

  it('keeps an angle-bracket placeholder that is not a real tag', () => {
    const blocks = markdownToPortableText('socat pairs a given <PORT_NO> with a <UUID> value.\n');
    expect(text(blocks[0])).toBe('socat pairs a given <PORT_NO> with a <UUID> value.');
  });

  it('drops an unmapped inline tag but keeps its text', () => {
    const blocks = markdownToPortableText('a <span class="x">kept</span> b\n');
    expect(text(blocks[0])).toBe('a kept b');
    expect(blocks[0].children.every((span: any) => (span.marks ?? []).length === 0)).toBe(true);
  });

  it('turns an inline br into a newline', () => {
    const blocks = markdownToPortableText('one<br>two\n');
    expect(text(blocks[0])).toBe('one\ntwo');
  });
});

describe('markdownToPortableText — escaping', () => {
  it('unescapes a backslash-escaped asterisk', () => {
    const blocks = markdownToPortableText('This step is \\*required\\* today.\n');
    expect(text(blocks[0])).toBe('This step is *required* today.');
  });

  it('unescapes a backslash-escaped underscore', () => {
    const blocks = markdownToPortableText('My distro of choice is Pop!\\_OS 20.04.\n');
    expect(text(blocks[0])).toBe('My distro of choice is Pop!_OS 20.04.');
  });

  it('decodes an HTML entity into its character', () => {
    const blocks = markdownToPortableText('Right-click --&gt; Shrink Volume.\n');
    expect(text(blocks[0])).toBe('Right-click --> Shrink Volume.');
  });

  it('decodes a numeric HTML entity', () => {
    const blocks = markdownToPortableText('Press Win &#8984; then S.\n');
    expect(text(blocks[0])).toBe('Press Win ⌘ then S.');
  });

  it('leaves code block content byte-exact', () => {
    const blocks = markdownToPortableText('```bash\necho "a > b" && echo \'c\\_d\'\n```\n');
    expect(blocks[0].code).toBe('echo "a > b" && echo \'c\\_d\'');
  });
});

describe('markdownToPortableText — nesting', () => {
  it('keeps inline code inside a link', () => {
    const blocks = markdownToPortableText('Use [`fzf`](https://github.com/junegunn/fzf) for this.\n');
    const linkKey = blocks[0].markDefs[0]._key;
    const span = blocks[0].children.find((s: any) => s.text === 'fzf');
    expect(span.marks).toEqual(expect.arrayContaining(['code', linkKey]));
  });

  it('keeps emphasis nested inside strong', () => {
    const blocks = markdownToPortableText('**bold _and italic_ here**\n');
    const both = blocks[0].children.find((s: any) => s.text === 'and italic');
    expect(both.marks).toEqual(['strong', 'em']);
  });

  it('drops a trailing reference definition instead of leaking it as a paragraph', () => {
    const blocks = markdownToPortableText('See [one][1].\n\n[1]: https://example.com/one\n');
    expect(blocks).toHaveLength(1);
    expect(text(blocks[0])).toBe('See one.');
  });

  it('lifts a blockquote indented inside a list item', () => {
    const md = '1. Open the guide.\n\n   > Image Courtesy: iFixit Guide\n\n2. Close it.\n';
    const blocks = markdownToPortableText(md);
    const quote = blocks.find((block) => block.style === 'blockquote');
    expect(text(quote!)).toBe('Image Courtesy: iFixit Guide');
    expect(quote!.listItem).toBeUndefined();
  });

  it('keeps one blockquote run across a bare quote marker line', () => {
    const blocks = markdownToPortableText('> first\n>\n> second\n');
    expect(blocks.map((block) => block.style)).toEqual(['blockquote', 'blockquote']);
  });
});

describe('markdownToPortableText — untrusted input', () => {
  it('leaves an entity name that collides with an Object prototype key alone', () => {
    const blocks = markdownToPortableText('Use the &constructor; and &toString; here.\n');
    expect(text(blocks[0])).toBe('Use the &constructor; and &toString; here.');
  });

  it('never derives a mark from an Object prototype key', () => {
    const blocks = markdownToPortableText('A <constructor>x</constructor> B\n');
    const persisted = JSON.parse(JSON.stringify(blocks));
    expect(persisted[0].children.flatMap((span: any) => span.marks ?? [])).toEqual([]);
    expect(text(blocks[0])).toBe('A <constructor>x</constructor> B');
  });

  it('drops a link mark whose scheme is not safe', () => {
    const blocks = markdownToPortableText('Click [here](javascript:alert(1)) now.\n');
    expect(blocks[0].markDefs).toEqual([]);
    expect(text(blocks[0])).toBe('Click here now.');
    expect(blocks[0].children.every((span: any) => (span.marks ?? []).length === 0)).toBe(true);
  });

  it('drops a data-url link mark', () => {
    const blocks = markdownToPortableText('See [x](data:text/html;base64,PHNjcmlwdD4=).\n');
    expect(blocks[0].markDefs).toEqual([]);
  });

  it('keeps http, mailto, anchor and relative link marks', () => {
    const md = '[a](https://x.dev) [b](mailto:x@y.dev) [c](#top) [d](/blog/post) [e](../other)\n';
    const blocks = markdownToPortableText(md);
    expect(blocks[0].markDefs.map((def: any) => def.href)).toEqual([
      'https://x.dev',
      'mailto:x@y.dev',
      '#top',
      '/blog/post',
      '../other'
    ]);
  });
});

describe('markdownToPortableText — invariants', () => {
  it('gives every block a unique _key', () => {
    const blocks = markdownToPortableText('# A\n\nB\n\n- c\n- d\n\n```js\ne\n```\n');
    const keys = blocks.map((block) => block._key);
    expect(keys.length).toBeGreaterThan(4);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys.every((key) => typeof key === 'string' && key.length > 0)).toBe(true);
  });

  it('returns an empty array for empty input', () => {
    expect(markdownToPortableText('')).toEqual([]);
    expect(markdownToPortableText('\n\n  \n')).toEqual([]);
  });

  it('never emits a block whose text still holds raw markdown syntax', () => {
    const md =
      '1. Step\n\n   ![x](../assets/images/p/x.png)\n\n   ```bash\n   ls\n   ```\n\n---\n\n> quote\n\n| a |\n| - |\n| 1 |\n';
    const checked = markdownToPortableText(md).filter((block) => block._type === 'block');
    expect(checked.length).toBeGreaterThan(0);
    for (const block of checked) {
      expect(text(block)).not.toMatch(/^\s*(!\[|```|\||>\s|-{3,})/);
    }
  });
});
