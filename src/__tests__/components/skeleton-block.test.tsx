import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SkeletonBlock from '@/components/skeleton-block';

describe('SkeletonBlock Component', () => {
  describe('Basic Rendering', () => {
    it('renders the skeleton block container', () => {
      render(<SkeletonBlock />);

      const skeleton = screen.getByTestId('skeleton-block');
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('renders the video aspect ratio container', () => {
      const { container } = render(<SkeletonBlock />);

      const videoContainer = container.querySelector('.aspect-video');
      expect(videoContainer).toBeInTheDocument();
      expect(videoContainer).toHaveClass('relative', 'aspect-video', 'w-full', 'bg-gray-200');
    });

    it('renders the content padding container', () => {
      const { container } = render(<SkeletonBlock />);

      const contentContainer = container.querySelector('.p-6');
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass('p-6', 'sm:p-10');
    });
  });

  describe('Skeleton Elements', () => {
    it('renders the title skeleton', () => {
      const { container } = render(<SkeletonBlock />);

      const titleSkeleton = container.querySelector('.mb-6.h-8.w-3\\/4');
      expect(titleSkeleton).toBeInTheDocument();
      expect(titleSkeleton).toHaveClass('mb-6', 'h-8', 'w-3/4', 'bg-gray-200');
    });

    it('renders the content skeleton lines', () => {
      const { container } = render(<SkeletonBlock />);

      // Should render 6 paragraph blocks
      const paragraphBlocks = container.querySelectorAll('.space-y-2');
      expect(paragraphBlocks).toHaveLength(6);
    });

    it('each paragraph block has two lines', () => {
      const { container } = render(<SkeletonBlock />);

      const paragraphBlocks = container.querySelectorAll('.space-y-2');
      for (const block of paragraphBlocks) {
        const lines = block.querySelectorAll('.h-4');
        expect(lines).toHaveLength(2);
      }
    });

    it('paragraph lines have different widths', () => {
      const { container } = render(<SkeletonBlock />);

      const paragraphBlocks = container.querySelectorAll('.space-y-2');
      for (const block of paragraphBlocks) {
        const lines = block.querySelectorAll('.h-4');
        const firstLine = lines[0];
        const secondLine = lines[1];

        expect(firstLine).toHaveClass('w-full');
        expect(secondLine).toHaveClass('w-5/6');
      }
    });
  });

  describe('Animation and Visual Effects', () => {
    it('applies pulse animation to main container', () => {
      render(<SkeletonBlock />);

      const skeleton = screen.getByTestId('skeleton-block');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('all skeleton elements have gray background', () => {
      const { container } = render(<SkeletonBlock />);

      const grayElements = container.querySelectorAll('.bg-gray-200');
      // Should have video container, title, and all content lines
      expect(grayElements.length).toBeGreaterThan(10);
    });
  });

  describe('Layout Structure', () => {
    it('has proper spacing between sections', () => {
      const { container } = render(<SkeletonBlock />);

      const contentSection = container.querySelector('.space-y-4');
      expect(contentSection).toBeInTheDocument();
      expect(contentSection).toHaveClass('space-y-4');
    });

    it('uses responsive padding', () => {
      const { container } = render(<SkeletonBlock />);

      const paddingContainer = container.querySelector('.p-6');
      expect(paddingContainer).toHaveClass('p-6', 'sm:p-10');
    });

    it('maintains aspect ratio for video area', () => {
      const { container } = render(<SkeletonBlock />);

      const videoArea = container.querySelector('.aspect-video');
      expect(videoArea).toHaveClass('aspect-video');
    });
  });

  describe('Accessibility', () => {
    it('provides testid for identification', () => {
      render(<SkeletonBlock />);

      const skeleton = screen.getByTestId('skeleton-block');
      expect(skeleton).toBeInTheDocument();
    });

    it('uses semantic div structure', () => {
      const { container } = render(<SkeletonBlock />);

      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('skeleton is purely visual (no interactive elements)', () => {
      render(<SkeletonBlock />);

      const skeleton = screen.getByTestId('skeleton-block');
      expect(skeleton.querySelector('button')).toBeNull();
      expect(skeleton.querySelector('a')).toBeNull();
      expect(skeleton.querySelector('input')).toBeNull();
    });
  });

  describe('Content Structure Simulation', () => {
    it('simulates a typical blog post or article layout', () => {
      const { container } = render(<SkeletonBlock />);

      // Hero/featured image area
      const heroArea = container.querySelector('.aspect-video');
      expect(heroArea).toBeInTheDocument();

      // Title area
      const titleArea = container.querySelector('.h-8');
      expect(titleArea).toBeInTheDocument();

      // Content paragraphs
      const contentArea = container.querySelector('.space-y-4');
      expect(contentArea).toBeInTheDocument();
    });

    it('creates realistic content proportions', () => {
      const { container } = render(<SkeletonBlock />);

      // Title should be shorter than full width
      const title = container.querySelector('.w-3\\/4');
      expect(title).toBeInTheDocument();

      // Content lines should vary in width
      const fullWidthLines = container.querySelectorAll('.w-full');
      const partialWidthLines = container.querySelectorAll('.w-5\\/6');

      expect(fullWidthLines.length).toBeGreaterThan(0);
      expect(partialWidthLines.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('adjusts padding for different screen sizes', () => {
      const { container } = render(<SkeletonBlock />);

      const responsiveContainer = container.querySelector('.p-6.sm\\:p-10');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('maintains full width for main elements', () => {
      const { container } = render(<SkeletonBlock />);

      const videoContainer = container.querySelector('.w-full');
      expect(videoContainer).toBeInTheDocument();
    });
  });

  describe('Performance Considerations', () => {
    it('renders efficiently with minimal DOM nodes', () => {
      const { container } = render(<SkeletonBlock />);

      // Should be lightweight with reasonable number of elements
      const allDivs = container.querySelectorAll('div');
      expect(allDivs.length).toBeLessThan(50); // Reasonable upper bound
    });

    it('uses CSS classes for styling (no inline styles)', () => {
      const { container } = render(<SkeletonBlock />);

      const allElements = container.querySelectorAll('*');
      for (const element of allElements) {
        expect(element.getAttribute('style')).toBeNull();
      }
    });
  });
});
