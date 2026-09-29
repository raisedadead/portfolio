import { describe, expect, it } from 'vitest';
import { installPostMorph, pairMorph } from '@/lib/post-morph';

const page = (html: string) => {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = html;
  return doc;
};
const list = () => page('<article data-post-slug="a"></article><article data-post-slug="b"></article>');
const post = (slug: string) => page(`<article data-post data-post-slug="${slug}"></article>`);
const morphed = (doc: Document) =>
  [...doc.querySelectorAll<HTMLElement>('[data-morph]')].map((card) => card.dataset.postSlug);

describe('post morph', () => {
  it('morphs only the card of the post on the other page', () => {
    const [from, to] = [list(), post('b')];
    pairMorph(from, to);

    expect(morphed(from)).toEqual(['b']);
    expect(morphed(to)).toEqual(['b']);
  });

  it('morphs the card of the post that the list page returns to', () => {
    const [from, to] = [post('b'), list()];
    pairMorph(from, to);

    expect(morphed(from)).toEqual(['b']);
    expect(morphed(to)).toEqual(['b']);
  });

  it('morphs nothing between two different posts', () => {
    const [from, to] = [post('a'), post('b')];
    pairMorph(from, to);

    expect([...morphed(from), ...morphed(to)]).toEqual([]);
  });

  it('morphs nothing when one page lacks the post', () => {
    const [from, to] = [post('a'), page('<main></main>')];
    from.querySelector('article')?.setAttribute('data-morph', '');
    pairMorph(from, to);

    expect(morphed(from)).toEqual([]);
  });

  it('morphs nothing after an aborted load', async () => {
    installPostMorph();
    document.body.innerHTML = '<article data-post data-post-slug="a"></article>';
    const controller = new AbortController();
    const event = Object.assign(new Event('astro:before-preparation'), {
      newDocument: document,
      signal: controller.signal,
      loader: async () => controller.abort()
    });

    document.dispatchEvent(event);
    await event.loader();

    expect(morphed(document)).toEqual([]);
  });
});
