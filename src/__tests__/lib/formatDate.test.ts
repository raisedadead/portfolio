import { formatDate } from '@/lib/formatDate';
import { describe, expect, it } from 'vitest';

describe('formatDate', () => {
  it('formats date in MMM DD, YYYY format', () => {
    const date = new Date('2025-10-01T00:00:00Z');
    const result = formatDate(date);
    expect(result).toBe('Oct 01, 2025');
  });

  it('handles different months correctly', () => {
    expect(formatDate(new Date('2025-01-15T00:00:00Z'))).toBe('Jan 15, 2025');
    expect(formatDate(new Date('2025-06-30T00:00:00Z'))).toBe('Jun 30, 2025');
    expect(formatDate(new Date('2025-12-25T00:00:00Z'))).toBe('Dec 25, 2025');
  });

  it('handles single digit days with zero padding', () => {
    expect(formatDate(new Date('2025-03-05T00:00:00Z'))).toBe('Mar 05, 2025');
    expect(formatDate(new Date('2025-03-09T00:00:00Z'))).toBe('Mar 09, 2025');
  });

  it('handles different years correctly', () => {
    expect(formatDate(new Date('2020-01-01T00:00:00Z'))).toBe('Jan 01, 2020');
    expect(formatDate(new Date('2030-12-31T00:00:00Z'))).toBe('Dec 31, 2030');
  });
});
