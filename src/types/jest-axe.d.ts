// Ambient declaration for `jest-axe` (the package ships no types).
// Keep this file with no top-level imports/exports so `declare module`
// remains an ambient global declaration rather than a nested submodule.

declare module 'jest-axe' {
  export function axe(html: Element | string, options?: unknown): Promise<unknown>;
  export const toHaveNoViolations: unknown;
}
