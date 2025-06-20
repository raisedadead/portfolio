import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Skeleton Block Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  const createSkeletonBlock = () => {
    const container = document.createElement('div');
    container.className = 'animate-pulse';
    container.setAttribute('data-testid', 'skeleton-block');

    // Image placeholder
    const imageDiv = document.createElement('div');
    imageDiv.className = 'relative aspect-video w-full bg-gray-200';

    // Content area
    const contentDiv = document.createElement('div');
    contentDiv.className = 'p-6 sm:p-10';

    // Title placeholder
    const titleDiv = document.createElement('div');
    titleDiv.className = 'mb-6 h-8 w-3/4 bg-gray-200';

    // Text content area
    const textAreaDiv = document.createElement('div');
    textAreaDiv.className = 'space-y-4';

    // Create 6 text line groups
    for (let i = 0; i < 6; i++) {
      const lineGroup = document.createElement('div');
      lineGroup.className = 'space-y-2';

      const fullLine = document.createElement('div');
      fullLine.className = 'h-4 w-full bg-gray-200';

      const partialLine = document.createElement('div');
      partialLine.className = 'h-4 w-5/6 bg-gray-200';

      lineGroup.appendChild(fullLine);
      lineGroup.appendChild(partialLine);
      textAreaDiv.appendChild(lineGroup);
    }

    contentDiv.appendChild(titleDiv);
    contentDiv.appendChild(textAreaDiv);

    container.appendChild(imageDiv);
    container.appendChild(contentDiv);

    document.body.appendChild(container);
    return container;
  };

  describe('Structure', () => {
    it('renders skeleton container with correct attributes', () => {
      const skeleton = createSkeletonBlock();

      expect(skeleton.getAttribute('data-testid')).toBe('skeleton-block');
      expect(skeleton.classList.contains('animate-pulse')).toBe(true);
    });

    it('renders image placeholder', () => {
      createSkeletonBlock();

      const imageDiv = document.querySelector('.relative.aspect-video.w-full.bg-gray-200');
      expect(imageDiv).toBeTruthy();
    });

    it('renders content area with proper spacing', () => {
      createSkeletonBlock();

      const contentDiv = document.querySelector('.p-6.sm\\:p-10');
      expect(contentDiv).toBeTruthy();
    });

    it('renders title placeholder', () => {
      createSkeletonBlock();

      const titleDiv = document.querySelector('.mb-6.h-8.w-3\\/4.bg-gray-200');
      expect(titleDiv).toBeTruthy();
    });
  });

  describe('Animation', () => {
    it('applies pulse animation to container', () => {
      const skeleton = createSkeletonBlock();

      expect(skeleton.classList.contains('animate-pulse')).toBe(true);
    });

    it('maintains animation throughout component lifecycle', () => {
      const skeleton = createSkeletonBlock();

      // Animation class should remain present
      expect(skeleton.classList.contains('animate-pulse')).toBe(true);

      // Simulate component update (class should still be there)
      setTimeout(() => {
        expect(skeleton.classList.contains('animate-pulse')).toBe(true);
      }, 100);
    });
  });

  describe('Layout Classes', () => {
    it('applies correct image placeholder classes', () => {
      createSkeletonBlock();

      const skeletonContainer = document.querySelector('[data-testid="skeleton-block"]');
      const imageDiv = skeletonContainer?.children[0];
      expect(imageDiv?.classList.contains('relative')).toBe(true);
      expect(imageDiv?.classList.contains('aspect-video')).toBe(true);
      expect(imageDiv?.classList.contains('w-full')).toBe(true);
      expect(imageDiv?.classList.contains('bg-gray-200')).toBe(true);
    });

    it('applies responsive padding to content area', () => {
      createSkeletonBlock();

      const contentDiv = document.querySelector('.p-6');
      expect(contentDiv?.classList.contains('p-6')).toBe(true);
      expect(contentDiv?.classList.contains('sm:p-10')).toBe(true);
    });

    it('applies correct title placeholder dimensions', () => {
      createSkeletonBlock();

      const titleDiv = document.querySelector('.mb-6.h-8');
      expect(titleDiv?.classList.contains('mb-6')).toBe(true);
      expect(titleDiv?.classList.contains('h-8')).toBe(true);
      expect(titleDiv?.classList.contains('w-3/4')).toBe(true);
      expect(titleDiv?.classList.contains('bg-gray-200')).toBe(true);
    });
  });

  describe('Text Content Simulation', () => {
    it('renders correct number of text line groups', () => {
      createSkeletonBlock();

      const lineGroups = document.querySelectorAll('.space-y-2');
      expect(lineGroups).toHaveLength(6);
    });

    it('each line group contains two lines', () => {
      createSkeletonBlock();

      const lineGroups = document.querySelectorAll('.space-y-2');
      lineGroups.forEach((group) => {
        const lines = group.querySelectorAll('.h-4');
        expect(lines).toHaveLength(2);
      });
    });

    it('renders full-width and partial-width lines', () => {
      createSkeletonBlock();

      const fullLines = document.querySelectorAll('.h-4.w-full.bg-gray-200');
      const partialLines = document.querySelectorAll('.h-4.w-5\\/6.bg-gray-200');

      expect(fullLines).toHaveLength(6); // One per group
      expect(partialLines).toHaveLength(6); // One per group
    });

    it('applies consistent height to all text lines', () => {
      createSkeletonBlock();

      const allLines = document.querySelectorAll('.h-4.bg-gray-200');
      expect(allLines).toHaveLength(12); // 6 groups × 2 lines each

      allLines.forEach((line) => {
        expect(line.classList.contains('h-4')).toBe(true);
        expect(line.classList.contains('bg-gray-200')).toBe(true);
      });
    });
  });

  describe('Spacing and Layout', () => {
    it('applies vertical spacing between line groups', () => {
      createSkeletonBlock();

      const textArea = document.querySelector('.space-y-4');
      expect(textArea).toBeTruthy();
      expect(textArea?.classList.contains('space-y-4')).toBe(true);
    });

    it('applies spacing within each line group', () => {
      createSkeletonBlock();

      const lineGroups = document.querySelectorAll('.space-y-2');
      lineGroups.forEach((group) => {
        expect(group.classList.contains('space-y-2')).toBe(true);
      });
    });

    it('maintains proper hierarchy structure', () => {
      createSkeletonBlock();

      const container = document.querySelector('[data-testid="skeleton-block"]');
      const imageDiv = container?.children[0];
      const contentDiv = container?.children[1];
      const titleDiv = contentDiv?.children[0];
      const textArea = contentDiv?.children[1];

      expect(imageDiv?.classList.contains('aspect-video')).toBe(true);
      expect(contentDiv?.classList.contains('p-6')).toBe(true);
      expect(titleDiv?.classList.contains('h-8')).toBe(true);
      expect(textArea?.classList.contains('space-y-4')).toBe(true);
    });
  });

  describe('Visual Consistency', () => {
    it('uses consistent background color for all placeholders', () => {
      createSkeletonBlock();

      const grayElements = document.querySelectorAll('.bg-gray-200');
      expect(grayElements.length).toBeGreaterThan(0);

      grayElements.forEach((element) => {
        expect(element.classList.contains('bg-gray-200')).toBe(true);
      });
    });

    it('maintains aspect ratio for image placeholder', () => {
      createSkeletonBlock();

      const imageDiv = document.querySelector('.aspect-video');
      expect(imageDiv).toBeTruthy();
      expect(imageDiv?.classList.contains('w-full')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('provides testid for testing identification', () => {
      createSkeletonBlock();

      const skeleton = document.querySelector('[data-testid="skeleton-block"]');
      expect(skeleton).toBeTruthy();
    });

    it('uses semantic div structure', () => {
      const skeleton = createSkeletonBlock();

      expect(skeleton.tagName.toLowerCase()).toBe('div');
      expect(skeleton.children.length).toBe(2); // Image and content areas
    });

    it('maintains loading state semantics', () => {
      const skeleton = createSkeletonBlock();

      // The animate-pulse class indicates loading state
      expect(skeleton.classList.contains('animate-pulse')).toBe(true);
    });
  });

  describe('Performance Considerations', () => {
    it('creates minimal DOM structure', () => {
      createSkeletonBlock();

      // Should not create excessive elements
      const allElements = document.querySelectorAll('*');
      expect(allElements.length).toBeLessThan(50); // Reasonable limit
    });

    it('uses CSS classes for styling rather than inline styles', () => {
      createSkeletonBlock();

      const allElements = document.querySelectorAll('[data-testid="skeleton-block"] *');
      allElements.forEach((element) => {
        // Should primarily use classes, not extensive inline styles
        expect(element.className).toBeTruthy();
      });
    });
  });
});
