import { describe, expect, it } from 'vitest';
import { currentSectionIndex } from '@/lib/section-spy';

describe('currentSectionIndex', () => {
  it('picks the last section whose heading has scrolled above the threshold', () => {
    expect(currentSectionIndex([-900, -20, 400], 300)).toBe(1);
  });

  it('falls back to the first section before any heading reaches the threshold', () => {
    expect(currentSectionIndex([500, 2000, 4000], 300)).toBe(0);
  });
});
