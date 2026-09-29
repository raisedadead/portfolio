import { beforeAll, describe, expect, it } from 'vitest';
import {
  createCurtain,
  installPageTransitions,
  mayMorph,
  originRow,
  pairMorph,
  rowDelays
} from '@/lib/page-transition';

const page = (html: string) => {
  const doc = document.implementation.createHTMLDocument();
  doc.body.innerHTML = html;
  return doc;
};
const list = () => page('<article data-post-slug="a"></article><article data-post-slug="b"></article>');
const post = (slug: string) => page(`<article data-post data-post-slug="${slug}"></article>`);
const morphed = (doc: Document) =>
  [...doc.querySelectorAll<HTMLElement>('[data-morph]')].map((card) => card.dataset.postSlug);

const curtainWithAnimations = () => {
  const curtain = document.createElement('div');
  curtain.innerHTML = '<span></span><span></span>';
  const running: Array<() => void> = [];
  curtain.getAnimations = () => {
    const { promise, resolve } = Promise.withResolvers<Animation>();
    running.push(() => resolve({} as Animation));
    return [{ finished: promise } as Animation];
  };
  const finish = async () => {
    running.splice(0).forEach((resolve) => resolve());
    await new Promise((resolve) => setTimeout(resolve));
  };
  return { curtain, finish };
};

beforeAll(() => {
  installPageTransitions();
});

describe('page transitions', () => {
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

    expect(pairMorph(from, to)).toBe(false);
    expect(morphed(from)).toEqual([]);
  });

  it('reports a pair only when both pages hold the post and a pair is allowed', () => {
    const [from, to] = [list(), post('a')];
    expect(pairMorph(from, to)).toBe(true);
    expect(pairMorph(from, to, false)).toBe(false);
    expect([...morphed(from), ...morphed(to)]).toEqual([]);
  });

  it('waits for the pair only from a card or a post page', () => {
    const cards = page('<article data-post-slug="a"><a></a></article>');

    expect(mayMorph(cards.querySelector('a') ?? undefined, cards)).toBe(true);
    expect(mayMorph(undefined, post('a'))).toBe(true);
    expect(mayMorph(undefined, cards)).toBe(false);
    expect(mayMorph(cards.createElement('a'), page('<main></main>'))).toBe(false);
  });

  it('spreads the curtain rows by their distance from the origin row', () => {
    expect(rowDelays(4, 1, 20)).toEqual([10, 0, 10, 20]);
    expect(rowDelays(4, 1.5, 15)).toEqual([15, 5, 5, 15]);
    expect(rowDelays(1, 0, 90)).toEqual([0]);
  });

  it('starts the curtain from the row of the clicked link', () => {
    const link = document.createElement('a');
    link.getBoundingClientRect = () => DOMRect.fromRect({ y: 700, height: 100 });

    expect(originRow(6, 900, link)).toBe(5);
    expect(originRow(6, 900, undefined)).toBe(2.5);
  });

  it('reveals after a swap that lands while the curtain still covers', async () => {
    const { curtain, finish } = curtainWithAnimations();
    const controls = createCurtain(curtain);

    void controls.cover('forward', undefined);
    const revealed = controls.reveal();
    expect(curtain.dataset.state).toBe('covering');

    await finish();
    expect(curtain.dataset.state).toBe('revealing');
    await finish();
    await revealed;
    expect(curtain.dataset.state).toBeUndefined();
  });

  it('reveals the current page after a load that nothing supersedes is aborted', async () => {
    document.body.innerHTML = '<div id="page-curtain"><span></span></div>';
    const curtain = document.getElementById('page-curtain')!;
    curtain.getAnimations = () => [];
    const controller = new AbortController();
    const event = Object.assign(new Event('astro:before-preparation'), {
      direction: 'forward',
      newDocument: document,
      signal: controller.signal,
      loader: async () => controller.abort()
    });

    document.dispatchEvent(event);
    await event.loader();
    await new Promise((resolve) => setTimeout(resolve));

    expect(curtain.dataset.state).toBeUndefined();
  });

  it('morphs nothing after an aborted load', async () => {
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
