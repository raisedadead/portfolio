const ROW_SPREAD_MS = 90;

const cardsIn = (root: ParentNode) => [...root.querySelectorAll<HTMLElement>('article[data-post-slug]')];

export function pairMorph(from: ParentNode, to: ParentNode, allowed = true): boolean {
  const post =
    to.querySelector<HTMLElement>('article[data-post]') ?? from.querySelector<HTMLElement>('article[data-post]');
  const slug = post?.dataset.postSlug;
  const paired = allowed && [from, to].every((root) => cardsIn(root).some((card) => card.dataset.postSlug === slug));
  for (const card of [...cardsIn(from), ...cardsIn(to)]) {
    card.toggleAttribute('data-morph', paired && card.dataset.postSlug === slug);
  }
  return paired;
}

export function mayMorph(source: Element | undefined, page: ParentNode): boolean {
  return Boolean(source?.closest('article[data-post-slug]') ?? page.querySelector('article[data-post]'));
}

export function rowDelays(rows: number, origin: number, spread: number): number[] {
  const farthest = Math.max(origin, rows - 1 - origin) || 1;
  return Array.from({ length: rows }, (_, row) => (Math.abs(row - origin) / farthest) * spread);
}

export function originRow(rows: number, viewportHeight: number, source: Element | undefined): number {
  if (!source) return (rows - 1) / 2;
  const { top, height } = source.getBoundingClientRect();
  return Math.min(rows - 1, Math.max(0, Math.floor(((top + height / 2) / viewportHeight) * rows)));
}

const settled = (curtain: HTMLElement) =>
  Promise.allSettled(curtain.getAnimations({ subtree: true }).map((animation) => animation.finished));

async function cover(curtain: HTMLElement, direction: string, source: Element | undefined): Promise<void> {
  if (curtain.dataset.state === 'covered') return;
  if (curtain.dataset.state !== 'covering') {
    const rows = [...curtain.children] as HTMLElement[];
    const delays = rowDelays(rows.length, originRow(rows.length, innerHeight, source), ROW_SPREAD_MS);
    rows.forEach((row, index) => row.style.setProperty('animation-delay', `${delays[index]}ms`));
    curtain.dataset.direction = direction;
    curtain.dataset.state = 'covering';
  }
  await settled(curtain);
  if (curtain.dataset.state === 'covering') curtain.dataset.state = 'covered';
}

async function reveal(curtain: HTMLElement): Promise<void> {
  if (curtain.dataset.state !== 'covered') return;
  curtain.dataset.state = 'revealing';
  await settled(curtain);
  if (curtain.dataset.state === 'revealing') delete curtain.dataset.state;
}

export function installPageTransitions(): void {
  let userAgentTransition = false;
  addEventListener(
    'popstate',
    (event) => {
      userAgentTransition = event.hasUAVisualTransition ?? false;
    },
    { capture: true }
  );
  document.addEventListener('astro:before-preparation', (event) => {
    const curtain = document.getElementById('page-curtain');
    const animated = !userAgentTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    userAgentTransition = false;
    const curtainFor = () => (curtain && animated ? cover(curtain, event.direction, event.sourceElement) : undefined);
    const covering = mayMorph(event.sourceElement, document) ? undefined : curtainFor();
    const load = event.loader;
    event.loader = async () => {
      await Promise.all([load(), covering]);
      if (event.signal.aborted || event.defaultPrevented) return;
      if (!pairMorph(document, event.newDocument, !covering)) await curtainFor();
    };
  });
  document.addEventListener('astro:before-swap', (event) => {
    event.newDocument.documentElement.dataset.softNav = '';
  });
  document.addEventListener('astro:after-swap', () => {
    const curtain = document.getElementById('page-curtain');
    if (curtain) void reveal(curtain);
  });
}
