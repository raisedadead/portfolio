export interface PortableTextSpan {
  _type: 'span';
  _key: string;
  text: string;
  marks: Array<string>;
}

export interface PortableTextMarkDef {
  _type: 'link';
  _key: string;
  href: string;
}

export interface PortableTextTableCell {
  _type: 'tableCell';
  _key: string;
  content: Array<PortableTextSpan>;
  markDefs: Array<PortableTextMarkDef>;
  isHeader: boolean;
}

export interface PortableTextTableRow {
  _type: 'tableRow';
  _key: string;
  cells: Array<PortableTextTableCell>;
}

export interface PortableTextNode {
  _type: 'block' | 'image' | 'code' | 'break' | 'table' | 'htmlBlock';
  _key: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  listId?: string;
  listStart?: number;
  markDefs?: Array<PortableTextMarkDef>;
  children?: Array<PortableTextSpan>;
  code?: string;
  language?: string;
  alt?: string;
  asset?: { url: string };
  hasHeaderRow?: boolean;
  rows?: Array<PortableTextTableRow>;
  html?: string;
}

export function markdownToPortableText(markdown: string): Array<PortableTextNode>;
