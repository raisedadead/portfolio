const cardsIn = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>('article[data-post-slug]')];

export function pairMorph(from: ParentNode, to: ParentNode): void {
  const post =
    to.querySelector<HTMLElement>('article[data-post]') ?? from.querySelector<HTMLElement>('article[data-post]');
  const slug = post?.dataset.postSlug;
  const paired = [from, to].every((root) => cardsIn(root).some((card) => card.dataset.postSlug === slug));
  for (const card of [...cardsIn(from), ...cardsIn(to)]) {
    card.toggleAttribute('data-morph', paired && card.dataset.postSlug === slug);
  }
}

export function installPostMorph(): void {
  document.addEventListener('astro:before-preparation', (event) => {
    const load = event.loader;
    event.loader = async () => {
      await load();
      if (event.signal.aborted || event.defaultPrevented) return;
      pairMorph(document, event.newDocument);
    };
  });
  document.addEventListener('astro:before-swap', (event) => {
    event.newDocument.documentElement.dataset.softNav = '';
  });
}
