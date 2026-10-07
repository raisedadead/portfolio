import { describe, expect, it } from 'vitest';
import type { EmdashPortableBlock } from '@/lib/emdash-posts';
import { anchorHeadings } from '@/lib/post-outline';

const heading = (style: string, text: string): EmdashPortableBlock => ({
  _type: 'block',
  style,
  children: [{ _type: 'span', text }]
});
const paragraph = heading('normal', 'Body text.');

describe('anchorHeadings', () => {
  it('uses H2 headings as sections and nests H3 headings under them', () => {
    const { outline } = anchorHeadings([
      heading('h2', 'Understanding the .dockerignore File'),
      paragraph,
      heading('h2', 'Useful Examples'),
      heading('h3', '1. Node.js Applications'),
      heading('h4', 'Ignored depth')
    ]);
    expect(outline).toEqual([
      { id: 'understanding-the-dockerignore-file', text: 'Understanding the .dockerignore File', children: [] },
      {
        id: 'useful-examples',
        text: 'Useful Examples',
        children: [{ id: '1-nodejs-applications', text: '1. Node.js Applications' }]
      }
    ]);
  });

  it('uses H3 headings as sections when the post has no H2', () => {
    const { outline } = anchorHeadings([heading('h3', 'What is the SSH known_hosts File?'), heading('h4', 'Detail')]);
    expect(outline).toEqual([
      {
        id: 'what-is-the-ssh-known_hosts-file',
        text: 'What is the SSH known_hosts File?',
        children: [{ id: 'detail', text: 'Detail' }]
      }
    ]);
  });

  it('gives repeated headings unique ids', () => {
    const { outline } = anchorHeadings([heading('h2', 'Setup'), heading('h2', 'Setup')]);
    expect(outline.map((section) => section.id)).toEqual(['setup', 'setup-2']);
  });

  it('skips a suffixed id that another heading already uses', () => {
    const { outline } = anchorHeadings([heading('h2', 'Setup'), heading('h2', 'Setup 2'), heading('h2', 'Setup')]);
    expect(outline.map((section) => section.id)).toEqual(['setup', 'setup-2', 'setup-3']);
  });

  it('stamps the ids on heading blocks without changing the input', () => {
    const blocks = [heading('h2', 'Setup'), paragraph];
    const { content } = anchorHeadings(blocks);
    expect(content).toEqual([{ ...blocks[0], anchorId: 'setup' }, paragraph]);
    expect(blocks[0]).not.toHaveProperty('anchorId');
  });
});
