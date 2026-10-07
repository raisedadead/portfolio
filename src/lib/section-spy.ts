export function currentSectionIndex(headingTops: readonly number[], threshold: number): number {
  let current = 0;
  headingTops.forEach((top, index) => {
    if (top < threshold) current = index;
  });
  return current;
}

export function installSectionSpy(nav: HTMLElement): () => void {
  const links = [...nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')];
  const headings = links.map((link) => document.getElementById(link.hash.slice(1)));

  const update = () => {
    const tops = headings.map((heading) => heading?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY);
    const current = currentSectionIndex(tops, window.innerHeight * 0.35);
    links.forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  const resizeObserver = new ResizeObserver(update);
  resizeObserver.observe(document.body);
  return () => {
    window.removeEventListener('scroll', update);
    resizeObserver.disconnect();
  };
}
