// Ambient — no top-level imports, otherwise `declare module` becomes a
// nested submodule rather than augmenting `jest-axe`.

declare module 'jest-axe' {
  export function axe(html: Element | string, options?: unknown): Promise<unknown>;
  export const toHaveNoViolations: unknown;
}
