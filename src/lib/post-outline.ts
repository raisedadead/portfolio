import type { EmdashPortableBlock } from '@/lib/emdash-posts';

export interface OutlineEntry {
  id: string;
  text: string;
}

export interface OutlineSection extends OutlineEntry {
  children: OutlineEntry[];
}

export type AnchoredBlock<T extends EmdashPortableBlock> = T & { anchorId?: string };

const ANCHORED_STYLES = new Set(['h2', 'h3', 'h4']);

const isHeading = (block: EmdashPortableBlock): boolean =>
  block._type === 'block' && ANCHORED_STYLES.has(block.style ?? '');

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
  const sectionStyle = blocks.some((block) => isHeading(block) && block.style === 'h2') ? 'h2' : 'h3';
  const childStyle = sectionStyle === 'h2' ? 'h3' : 'h4';
  const used = new Set<string>();
  const outline: OutlineSection[] = [];

  const content = blocks.map((block): AnchoredBlock<T> => {
    if (!isHeading(block)) return block;
    const text = headingText(block);
    const base = slugify(text) || 'section';
    let id = base;
    for (let suffix = 2; used.has(id); suffix += 1) id = `${base}-${suffix}`;
    used.add(id);
    if (block.style === sectionStyle) outline.push({ id, text, children: [] });
    if (block.style === childStyle) outline.at(-1)?.children.push({ id, text });
    return { ...block, anchorId: id };
  });

  return { content, outline };
}
