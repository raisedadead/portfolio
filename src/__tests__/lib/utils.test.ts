import { cn } from '@/lib/utils';
import { describe, expect, it } from 'vitest';

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
});
