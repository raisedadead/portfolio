import { describe, it, expect } from 'vitest';
import { cn, SENTRY_DSN } from '@/lib/utils';

describe('utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('class1', 'class2', { class3: true, class4: false });
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });
  });

  describe('SENTRY_DSN', () => {
    it('should be a valid Sentry DSN', () => {
      expect(SENTRY_DSN).toMatch(
        /^https:\/\/[a-zA-Z0-9]+@[a-zA-Z0-9.]+\/[0-9]+$/
      );
    });
  });
});
