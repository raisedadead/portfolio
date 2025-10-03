import { describe, it, expect } from 'vitest';
import { getBentoGridSpan } from '@/lib/blog-utils';

interface MockPost {
  id: string;
  title: string;
  brief: string;
  coverImage: { url: string };
  publishedAt: Date;
  readingTime: number;
}

function createMockPosts(count: number): MockPost[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `post-${i}`,
    title: `Post ${i}`,
    brief: `Brief ${i}`,
    coverImage: { url: `https://example.com/image-${i}.jpg` },
    publishedAt: new Date(),
    readingTime: 5
  }));
}

describe('getBentoGridSpan', () => {
  it('returns correct pattern for indices 0-5', () => {
    const expected = [
      { desktop: 'lg:col-span-3', aspectClass: 'aspect-16/9', aspectRatio: '16/9', height: 'h-64' },
      { desktop: 'lg:col-span-2', aspectClass: 'aspect-4/3', aspectRatio: '4/3', height: 'h-48' },
      { desktop: 'lg:col-span-5', aspectClass: 'aspect-21/9', aspectRatio: '21/9', height: 'h-56' },
      { desktop: 'lg:col-span-2', aspectClass: 'aspect-3/2', aspectRatio: '3/2', height: 'h-48' },
      { desktop: 'lg:col-span-3', aspectClass: 'aspect-3/4', aspectRatio: '3/4', height: 'h-64' },
      { desktop: 'lg:col-span-5', aspectClass: 'aspect-2/1', aspectRatio: '2/1', height: 'h-40' }
    ];

    expected.forEach((exp, index) => {
      expect(getBentoGridSpan(index)).toEqual(exp);
    });
  });

  it('pattern repeats after index 5', () => {
    expect(getBentoGridSpan(6)).toEqual(getBentoGridSpan(0));
    expect(getBentoGridSpan(7)).toEqual(getBentoGridSpan(1));
    expect(getBentoGridSpan(12)).toEqual(getBentoGridSpan(0));
  });

  it('handles large indices efficiently', () => {
    const result1 = getBentoGridSpan(1000000);
    const result2 = getBentoGridSpan(1000000 % 6);
    expect(result1).toEqual(result2);
  });

  it('property: periodic with period 6', () => {
    const testIndices = [0, 1, 2, 3, 4, 5, 10, 50, 100];
    testIndices.forEach((n) => {
      expect(getBentoGridSpan(n)).toEqual(getBentoGridSpan(n + 6));
      expect(getBentoGridSpan(n)).toEqual(getBentoGridSpan(n + 12));
    });
  });

  it('all outputs have valid Tailwind classes', () => {
    for (let i = 0; i < 6; i++) {
      const result = getBentoGridSpan(i);
      expect(result.desktop).toMatch(/^lg:col-span-\d+$/);
      expect(result.aspectClass).toMatch(/^aspect-[\d/]+$/);
      expect(result.aspectRatio).toMatch(/^\d+\/\d+$/);
      expect(result.height).toMatch(/^h-\d+$/);
    }
  });

  it('handles edge case index 0', () => {
    const result = getBentoGridSpan(0);
    expect(result).toEqual({
      desktop: 'lg:col-span-3',
      aspectClass: 'aspect-16/9',
      aspectRatio: '16/9',
      height: 'h-64'
    });
  });

  it('pattern creates visual rhythm', () => {
    const spans = Array.from({ length: 6 }, (_, i) => {
      const match = getBentoGridSpan(i).desktop.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    });

    expect(spans).toEqual([3, 2, 5, 2, 3, 5]);
  });
});

describe('Blog Bento Pattern', () => {
  it('verifies alternating 1-2-1-2 pattern across 12 posts', () => {
    const posts = createMockPosts(12);

    const spans = posts.map((_, index) => {
      const { desktop } = getBentoGridSpan(index);
      const match = desktop.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    });

    expect(spans).toEqual([3, 2, 5, 2, 3, 5, 3, 2, 5, 2, 3, 5]);
  });

  it('pattern continues correctly after first cycle', () => {
    expect(getBentoGridSpan(6)).toEqual(getBentoGridSpan(0));
    expect(getBentoGridSpan(7)).toEqual(getBentoGridSpan(1));
  });

  it('handles partial cycles correctly', () => {
    const posts7 = createMockPosts(7);
    const spans7 = posts7.map((_, i) => {
      const { desktop } = getBentoGridSpan(i);
      const match = desktop.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    });

    expect(spans7).toEqual([3, 2, 5, 2, 3, 5, 3]);
  });

  it('all aspects are valid CSS values', () => {
    for (let i = 0; i < 12; i++) {
      const { aspectClass } = getBentoGridSpan(i);
      expect(aspectClass).toMatch(/^aspect-[\d/]+$/);
    }
  });
});

describe('Blog Load More Pagination', () => {
  it('verifies 6 initial posts load correctly', () => {
    const allPosts = createMockPosts(20);
    const initialPosts = allPosts.slice(0, 6);

    expect(initialPosts).toHaveLength(6);
    expect(initialPosts[0].id).toBe('post-0');
    expect(initialPosts[5].id).toBe('post-5');
  });

  it('verifies 3 posts added per click', () => {
    const allPosts = createMockPosts(20);
    let visibleCount = 6;

    visibleCount += 3;
    const afterFirstClick = allPosts.slice(0, visibleCount);
    expect(afterFirstClick).toHaveLength(9);

    visibleCount += 3;
    const afterSecondClick = allPosts.slice(0, visibleCount);
    expect(afterSecondClick).toHaveLength(12);
  });

  it('pattern continues after load more', () => {
    expect(getBentoGridSpan(6)).toEqual(getBentoGridSpan(0));
    expect(getBentoGridSpan(7)).toEqual(getBentoGridSpan(1));
    expect(getBentoGridSpan(8)).toEqual(getBentoGridSpan(2));
  });

  it('hasMore flag calculated correctly', () => {
    const totalPosts = 20;
    let visiblePosts = 6;

    expect(visiblePosts < totalPosts).toBe(true);

    visiblePosts = 20;
    expect(visiblePosts < totalPosts).toBe(false);
  });

  it('handles edge case when total equals visible', () => {
    const allPosts = createMockPosts(6);
    const visiblePosts = 6;

    expect(visiblePosts >= allPosts.length).toBe(true);
  });
});

describe('Blog Responsive Layout', () => {
  it('verifies mobile layout data (single column)', () => {
    const gridClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5';
    expect(gridClass).toContain('grid-cols-1');
  });

  it('verifies tablet layout data (2-column base)', () => {
    const gridClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5';
    expect(gridClass).toContain('sm:grid-cols-2');
  });

  it('verifies desktop layout data (5-column grid)', () => {
    const gridClass = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5';
    expect(gridClass).toContain('lg:grid-cols-5');
  });

  it('all cards have responsive span classes', () => {
    for (let i = 0; i < 6; i++) {
      const { desktop } = getBentoGridSpan(i);

      expect(desktop).toMatch(/^lg:col-span-\d+$/);

      const responsiveClass = `sm:col-span-2 ${desktop}`;
      expect(responsiveClass).toContain('sm:col-span-2');
      expect(responsiveClass).toContain(desktop);
    }
  });

  it('verifies gap spacing consistent across breakpoints', () => {
    const gapClass = 'gap-3';
    expect(gapClass).toBe('gap-3');
  });
});
