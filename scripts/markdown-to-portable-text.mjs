import { Lexer } from 'marked';

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  rsquo: '’',
  lsquo: '‘',
  ldquo: '“',
  rdquo: '”',
  copy: '©',
  reg: '®',
  trade: '™',
  deg: '°',
  times: '×',
  middot: '·',
  bull: '•'
};

const ENTITY_RE = /&(?:#(\d{1,7})|#[xX]([0-9a-fA-F]{1,6})|([a-zA-Z][a-zA-Z0-9]{1,31}));/g;

const INLINE_TAG_MARKS = {
  kbd: 'code',
  code: 'code',
  samp: 'code',
  b: 'strong',
  strong: 'strong',
  i: 'em',
  em: 'em',
  u: 'underline',
  ins: 'underline',
  s: 'strike-through',
  del: 'strike-through',
  strike: 'strike-through',
  sup: 'superscript',
  sub: 'subscript'
};

const HTML_ELEMENTS = new Set([
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'br',
  'cite',
  'code',
  'data',
  'del',
  'dfn',
  'em',
  'i',
  'img',
  'ins',
  'kbd',
  'mark',
  'picture',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strike',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
  'wbr',
  'font',
  'center',
  'big',
  'tt',
  'nobr',
  'blink'
]);

const INLINE_TAG_RE = /^<\s*(\/)?\s*([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*?(\/)?\s*>$/;

const SAFE_HREF_SCHEME_RE = /^(?:https?:|mailto:|tel:)/i;
const SCHEME_RE = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

function decodeEntities(input) {
  return input.replace(ENTITY_RE, (match, dec, hex, name) => {
    if (dec !== undefined) return safeCodePoint(Number.parseInt(dec, 10)) ?? match;
    if (hex !== undefined) return safeCodePoint(Number.parseInt(hex, 16)) ?? match;
    return Object.hasOwn(NAMED_ENTITIES, name) ? NAMED_ENTITIES[name] : match;
  });
}

function safeCodePoint(code) {
  if (!Number.isInteger(code) || code <= 0 || code > 0x10ffff) return undefined;
  if (code >= 0xd800 && code <= 0xdfff) return undefined;
  return String.fromCodePoint(code);
}

function createKeyFactory() {
  let counter = 0;
  return () => `pt${(counter++).toString(36)}`;
}

function infoStringLanguage(lang) {
  const first = (lang ?? '').trim().split(/\s+/)[0];
  return first || undefined;
}

function makeSpan(nextKey, text, marks) {
  return { _type: 'span', _key: nextKey(), text, marks: [...marks] };
}

function collectInline(tokens, context, marks, spans) {
  const open = [];
  const active = () => (open.length ? [...marks, ...open] : marks);

  for (const token of tokens ?? []) {
    switch (token.type) {
      case 'text':
        if (token.tokens?.length) {
          collectInline(token.tokens, context, active(), spans);
        } else {
          spans.push(makeSpan(context.nextKey, decodeEntities(token.text ?? ''), active()));
        }
        break;
      case 'escape':
        spans.push(makeSpan(context.nextKey, token.text ?? '', active()));
        break;
      case 'strong':
        collectInline(token.tokens, context, [...active(), 'strong'], spans);
        break;
      case 'em':
        collectInline(token.tokens, context, [...active(), 'em'], spans);
        break;
      case 'del':
        collectInline(token.tokens, context, [...active(), 'strike-through'], spans);
        break;
      case 'codespan':
        spans.push(makeSpan(context.nextKey, token.text ?? '', [...active(), 'code']));
        break;
      case 'br':
        spans.push(makeSpan(context.nextKey, '\n', active()));
        break;
      case 'link': {
        const href = token.href ?? '';
        if (!isSafeHref(href)) {
          collectInline(token.tokens, context, active(), spans);
          break;
        }
        const key = context.nextKey();
        context.markDefs.push({ _key: key, _type: 'link', href });
        collectInline(token.tokens, context, [...active(), key], spans);
        break;
      }
      case 'html':
        applyInlineTag(token.text ?? '', open, context, spans, marks);
        break;
      case 'image':
        spans.push({ image: token });
        break;
      default:
        if (token.tokens?.length) collectInline(token.tokens, context, active(), spans);
        else if (typeof token.text === 'string')
          spans.push(makeSpan(context.nextKey, decodeEntities(token.text), active()));
    }
  }
  return spans;
}

function isSafeHref(href) {
  const trimmed = href.trim();
  if (!trimmed) return false;
  return SCHEME_RE.test(trimmed) ? SAFE_HREF_SCHEME_RE.test(trimmed) : true;
}

function applyInlineTag(raw, open, context, spans, marks) {
  const match = raw.trim().match(INLINE_TAG_RE);
  if (!match) {
    spans.push(makeSpan(context.nextKey, decodeEntities(raw), open.length ? [...marks, ...open] : marks));
    return;
  }
  const [, closing, rawName, selfClosing] = match;
  const name = rawName.toLowerCase();
  if (!HTML_ELEMENTS.has(name)) {
    spans.push(makeSpan(context.nextKey, decodeEntities(raw), open.length ? [...marks, ...open] : marks));
    return;
  }
  if (name === 'br') {
    spans.push(makeSpan(context.nextKey, '\n', open.length ? [...marks, ...open] : marks));
    return;
  }
  if (selfClosing) return;
  if (!Object.hasOwn(INLINE_TAG_MARKS, name)) return;
  const mark = INLINE_TAG_MARKS[name];
  if (closing) {
    const index = open.lastIndexOf(mark);
    if (index !== -1) open.splice(index, 1);
    return;
  }
  open.push(mark);
}

function trimSpans(spans) {
  const trimmed = spans.map((span) => ({ ...span }));
  while (trimmed.length && trimmed[0].text.trimStart() === '') trimmed.shift();
  while (trimmed.length && trimmed.at(-1).text.trimEnd() === '') trimmed.pop();
  if (!trimmed.length) return trimmed;
  trimmed[0].text = trimmed[0].text.trimStart();
  trimmed[trimmed.length - 1].text = trimmed.at(-1).text.trimEnd();
  return trimmed;
}

function imageBlock(nextKey, token) {
  return {
    _type: 'image',
    _key: nextKey(),
    alt: decodeEntities(token.text ?? ''),
    asset: { url: token.href ?? '' }
  };
}

function inlineToBlocks(nextKey, tokens, blockAttributes) {
  const context = { nextKey, markDefs: [] };
  const parts = collectInline(tokens, context, [], []);
  const blocks = [];
  let run = [];

  const flush = () => {
    const spans = trimSpans(run);
    run = [];
    if (!spans.length) return;
    const used = new Set(spans.flatMap((span) => span.marks));
    blocks.push({
      _type: 'block',
      _key: nextKey(),
      style: 'normal',
      markDefs: context.markDefs.filter((def) => used.has(def._key)),
      children: spans,
      ...blockAttributes
    });
  };

  for (const part of parts) {
    if (part.image) {
      flush();
      blocks.push(imageBlock(nextKey, part.image));
    } else {
      run.push(part);
    }
  }
  flush();
  return blocks;
}

function tableCell(nextKey, cell, isHeader) {
  const context = { nextKey, markDefs: [] };
  const spans = collectInline(cell.tokens, context, [], []).filter((part) => !part.image);
  return {
    _type: 'tableCell',
    _key: nextKey(),
    content: spans.length ? spans : [makeSpan(nextKey, decodeEntities(cell.text ?? ''), [])],
    markDefs: context.markDefs,
    isHeader
  };
}

function tableBlock(nextKey, token) {
  const header = {
    _type: 'tableRow',
    _key: nextKey(),
    cells: (token.header ?? []).map((cell) => tableCell(nextKey, cell, true))
  };
  const body = (token.rows ?? []).map((row) => ({
    _type: 'tableRow',
    _key: nextKey(),
    cells: row.map((cell) => tableCell(nextKey, cell, false))
  }));
  return {
    _type: 'table',
    _key: nextKey(),
    hasHeaderRow: header.cells.length > 0,
    rows: [header, ...body]
  };
}

function listItemLead(tokens) {
  const index = (tokens ?? []).findIndex((token) => token.type === 'paragraph' || token.type === 'text');
  return index === -1
    ? { lead: undefined, rest: tokens ?? [] }
    : { lead: tokens[index], rest: [...tokens.slice(0, index), ...tokens.slice(index + 1)] };
}

function listBlocks(state, token, level) {
  const listId = `md:l${state.listCounter++}`;
  const listItem = token.ordered ? 'number' : 'bullet';
  const listStart = token.ordered ? normalizeStart(token.start) : undefined;
  const blocks = [];

  for (const item of token.items ?? []) {
    const { lead, rest } = listItemLead(item.tokens);
    const attributes = { listItem, level, listId };
    if (listStart !== undefined) attributes.listStart = listStart;

    const leadBlocks = lead ? inlineToBlocks(state.nextKey, lead.tokens ?? [], attributes) : [];
    if (leadBlocks.length && leadBlocks[0]._type === 'block') {
      blocks.push(leadBlocks[0]);
      blocks.push(...leadBlocks.slice(1).map(stripListAttributes));
    } else {
      blocks.push({
        _type: 'block',
        _key: state.nextKey(),
        style: 'normal',
        markDefs: [],
        children: [makeSpan(state.nextKey, '', [])],
        ...attributes
      });
      blocks.push(...leadBlocks.map(stripListAttributes));
    }

    for (const child of rest) {
      blocks.push(...(child.type === 'list' ? listBlocks(state, child, level + 1) : tokenToBlocks(state, child)));
    }
  }
  return blocks;
}

function stripListAttributes(block) {
  if (block._type !== 'block') return block;
  const { listItem: _listItem, level: _level, listId: _listId, listStart: _listStart, ...rest } = block;
  return rest;
}

function normalizeStart(value) {
  return Number.isInteger(value) && value >= 1 && value <= 2_147_483_647 ? value : 1;
}

function tokenToBlocks(state, token) {
  const { nextKey } = state;
  switch (token.type) {
    case 'space':
    case 'def':
      return [];
    case 'heading':
      return inlineToBlocks(nextKey, token.tokens ?? [], { style: `h${Math.min(6, Math.max(1, token.depth))}` });
    case 'paragraph':
    case 'text':
      return inlineToBlocks(nextKey, token.tokens ?? [], {});
    case 'code':
      return [{ _type: 'code', _key: nextKey(), language: infoStringLanguage(token.lang), code: token.text ?? '' }];
    case 'hr':
      return [{ _type: 'break', _key: nextKey(), style: 'line' }];
    case 'blockquote':
      return (token.tokens ?? [])
        .flatMap((child) => tokenToBlocks(state, child))
        .map((block) => (block._type === 'block' && !block.listItem ? { ...block, style: 'blockquote' } : block));
    case 'list':
      return listBlocks(state, token, 1);
    case 'table':
      return [tableBlock(nextKey, token)];
    case 'html': {
      const html = (token.text ?? '').trim();
      return html ? [{ _type: 'htmlBlock', _key: nextKey(), html }] : [];
    }
    default:
      return token.tokens?.length ? inlineToBlocks(nextKey, token.tokens, {}) : [];
  }
}

export function markdownToPortableText(markdown) {
  const state = { nextKey: createKeyFactory(), listCounter: 0 };
  const tokens = new Lexer({ gfm: true }).lex(markdown ?? '');
  return tokens.flatMap((token) => tokenToBlocks(state, token));
}
