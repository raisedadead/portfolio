// Module file (top-level import) — merges with `vitest`'s typings
// rather than replacing them. `toHaveNoViolations` is registered at
// runtime by `vitest.setup.ts`.

import 'vitest';

declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
