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

export type Curtain = {
  cover: (direction: string, source: Element | undefined) => Promise<void>;
  reveal: () => Promise<void>;
  reset: () => void;
};

export function createCurtain(element: HTMLElement): Curtain {
  let generation = 0;
  let cycle: Promise<void> | undefined;
  let direction = 'forward';
  const coverRows = async (current: number, source: Element | undefined) => {
    const rows = [...element.children] as HTMLElement[];
    const delays = rowDelays(rows.length, originRow(rows.length, innerHeight, source), ROW_SPREAD_MS);
    rows.forEach((row, index) => row.style.setProperty('animation-delay', `${delays[index]}ms`));
    element.dataset.direction = direction;
    element.dataset.state = 'covering';
    await settled(element);
    if (generation === current) element.dataset.state = 'covered';
  };
  const cover = (nextDirection: string, source: Element | undefined) => {
    direction = nextDirection;
    cycle ??= coverRows(++generation, source);
    return cycle;
  };
  const reveal = async () => {
    const current = cycle;
    if (!current) return;
    await current;
    if (cycle !== current) return;
    cycle = undefined;
    element.dataset.direction = direction;
    element.dataset.state = 'revealing';
    await settled(element);
    if (!cycle) delete element.dataset.state;
  };
  const reset = () => {
    generation += 1;
    cycle = undefined;
    delete element.dataset.state;
  };
  return { cover, reveal, reset };
}

export function installPageTransitions(): void {
  const curtains = new WeakMap<HTMLElement, Curtain>();
  const curtain = () => {
    const element = document.getElementById('page-curtain');
    if (!element) return undefined;
    const controls = curtains.get(element) ?? createCurtain(element);
    curtains.set(element, controls);
    return controls;
  };
  let userAgentTransition = false;
  let latest = 0;
  addEventListener(
    'popstate',
    (event) => {
      userAgentTransition = event.hasUAVisualTransition ?? false;
      setTimeout(() => {
        userAgentTransition = false;
      });
    },
    { capture: true }
  );
  addEventListener('pageshow', (event) => {
    if (event.persisted) curtain()?.reset();
  });
  document.addEventListener('astro:before-preparation', (event) => {
    const navigation = ++latest;
    const animated = !userAgentTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cover = () => (animated ? curtain()?.cover(event.direction, event.sourceElement) : undefined);
    const covering = mayMorph(event.sourceElement, document) ? undefined : cover();
    const load = event.loader;
    event.loader = async () => {
      await Promise.all([load(), covering]);
      if (event.signal.aborted && navigation === latest) void curtain()?.reveal();
      if (event.signal.aborted || event.defaultPrevented) return;
      if (!pairMorph(document, event.newDocument, !covering)) await cover();
    };
  });
  document.addEventListener('astro:before-swap', (event) => {
    event.newDocument.documentElement.dataset.softNav = '';
  });
  document.addEventListener('astro:after-swap', () => {
    void curtain()?.reveal();
  });
}
