import type { EmdashPortableBlock } from '@/lib/emdash-posts';

export interface OutlineEntry {
  id: string;
  text: string;
}

export interface OutlineSection extends OutlineEntry {
  children: OutlineEntry[];
}

export type AnchoredBlock<T extends EmdashPortableBlock> = T & { anchorId?: string };

const HEADING_STYLE = /^h([2-6])$/;

const headingLevel = (block: EmdashPortableBlock): number =>
  block._type === 'block' ? Number(block.style?.match(HEADING_STYLE)?.[1] ?? 0) : 0;

const headingText = (block: EmdashPortableBlock): string =>
  (block.children ?? [])
    .map((span) => span.text ?? '')
    .join('')
    .trim();

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-');

export function anchorHeadings<T extends EmdashPortableBlock>(
  blocks: readonly T[]
): { content: AnchoredBlock<T>[]; outline: OutlineSection[] } {
  const levels = blocks.map(headingLevel);
  const present = levels.filter(Boolean);
  const shift = present.length > 0 ? Math.min(...present) - 2 : 0;
  const used = new Set<string>();
  const outline: OutlineSection[] = [];

  const content = blocks.map((block, index): AnchoredBlock<T> => {
    if (!levels[index]) return block;
    const level = levels[index] - shift;
    const promoted = { ...block, style: `h${level}` };
    if (level > 4) return promoted;
    const text = headingText(block);
    const base = slugify(text) || 'section';
    let id = base;
    for (let suffix = 2; used.has(id); suffix += 1) id = `${base}-${suffix}`;
    used.add(id);
    if (level === 2) outline.push({ id, text, children: [] });
    if (level === 3) outline.at(-1)?.children.push({ id, text });
    return { ...promoted, anchorId: id };
  });

  return { content, outline };
}
