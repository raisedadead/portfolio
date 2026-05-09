// Augment Vitest's matchers with `toHaveNoViolations`, registered globally
// in `vitest.setup.ts` via `import 'jest-axe/extend-expect';`. This file
// IS a module (top-level import) so the `declare module 'vitest'` block
// merges with vitest's own typings rather than replacing them.

import 'vitest';

declare module 'vitest' {
  interface Assertion {
    toHaveNoViolations(): void;
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): void;
  }
}
