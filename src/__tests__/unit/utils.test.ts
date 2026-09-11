import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('class1', 'class2', { class3: true, class4: false });
      expect(result).toBe('class1 class2 class3');
    });

    it('handles empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles conflicting Tailwind classes', () => {
      const result = cn('p-4', 'p-8');
      expect(result).toBe('p-8');
    });

    it('merges conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn('base', { active: isActive, disabled: isDisabled });
      expect(result).toBe('base active');
    });

    it('handles arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toBe('class1 class2 class3');
    });
  });
});
