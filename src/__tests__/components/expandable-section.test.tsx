import { ExpandableSection } from '@/components/expandable-section';
import type { ReactNode } from 'react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../test-utils';

// Type definitions for mocks
interface MockDisclosureProps {
  children: (props: { open: boolean; close: () => void }) => ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

interface MockDisclosureButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

interface MockDisclosurePanelProps {
  children: ReactNode;
  className?: string;
}

interface MockIconProps {
  className?: string;
}

// Mock headlessui
vi.mock('@headlessui/react', () => ({
  Disclosure: ({ children, defaultOpen, className }: MockDisclosureProps) => {
    const [isOpen, setIsOpen] = React.useState(defaultOpen || false);
    return (
      <div className={className} data-testid="disclosure">
        {children({ open: isOpen, close: () => setIsOpen(false) })}
      </div>
    );
  },
  DisclosureButton: ({ children, className, onClick }: MockDisclosureButtonProps) => (
    <button type="button" className={className} onClick={onClick} data-testid="disclosure-button">
      {children}
    </button>
  ),
  DisclosurePanel: ({ children, className }: MockDisclosurePanelProps) => (
    <div className={className} data-testid="disclosure-panel">
      {children}
    </div>
  ),
}));

// Mock heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  MinusIcon: ({ className }: MockIconProps) => (
    <div className={className} data-testid="minus-icon" aria-hidden="true" />
  ),
  PlusIcon: ({ className }: MockIconProps) => (
    <div className={className} data-testid="plus-icon" aria-hidden="true" />
  ),
}));

describe('ExpandableSection Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders with title and children', () => {
      render(
        <ExpandableSection title="Test Section">
          <p>Test content</p>
        </ExpandableSection>
      );

      expect(screen.getByText('Test Section')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const customClass = 'custom-expandable-class';
      render(
        <ExpandableSection title="Test" className={customClass}>
          Content
        </ExpandableSection>
      );

      const disclosure = screen.getByTestId('disclosure');
      expect(disclosure).toHaveClass(customClass);
    });

    it('renders disclosure structure', () => {
      render(<ExpandableSection title="Test">Content</ExpandableSection>);

      expect(screen.getByTestId('disclosure')).toBeInTheDocument();
      expect(screen.getByTestId('disclosure-button')).toBeInTheDocument();
      expect(screen.getByTestId('disclosure-panel')).toBeInTheDocument();
    });
  });

  describe('Default State', () => {
    it('is closed by default', () => {
      render(<ExpandableSection title="Test">Content</ExpandableSection>);

      const button = screen.getByTestId('disclosure-button');
      expect(button).toHaveClass('bg-red-200');
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('minus-icon')).not.toBeInTheDocument();
    });

    it('can be opened by default when defaultOpen is true', () => {
      render(
        <ExpandableSection title="Test" defaultOpen={true}>
          Content
        </ExpandableSection>
      );

      const button = screen.getByTestId('disclosure-button');
      expect(button).toHaveClass('bg-purple-300');
      expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument();
    });
  });

  describe('Labels', () => {
    const testLabels = [
      { name: 'React', color: 'blue' },
      { name: 'TypeScript', color: 'green' },
      { name: 'Testing', color: 'red' },
    ];

    it('renders labels when provided', () => {
      render(
        <ExpandableSection title="Test" labels={testLabels}>
          Content
        </ExpandableSection>
      );

      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Testing')).toBeInTheDocument();
    });

    it('does not render labels container when no labels provided', () => {
      render(<ExpandableSection title="Test">Content</ExpandableSection>);

      // Should not have any label elements
      expect(screen.queryByText('React')).not.toBeInTheDocument();
    });

    it('does not render labels container when empty labels array', () => {
      render(
        <ExpandableSection title="Test" labels={[]}>
          Content
        </ExpandableSection>
      );

      // Should not have the labels wrapper
      const button = screen.getByTestId('disclosure-button');
      const labelsContainer = button.querySelector('.mx-2');
      expect(labelsContainer).not.toBeInTheDocument();
    });

    it('applies correct color classes to labels', () => {
      render(
        <ExpandableSection title="Test" labels={[{ name: 'React', color: 'blue' }]}>
          Content
        </ExpandableSection>
      );

      const label = screen.getByText('React');
      expect(label).toHaveClass('border-black', 'bg-blue-100', 'text-blue-800');
    });

    it('applies label base styling', () => {
      render(
        <ExpandableSection title="Test" labels={[{ name: 'Test', color: 'red' }]}>
          Content
        </ExpandableSection>
      );

      const labels = screen.getAllByText('Test');
      const label = labels[1]; // Get the label span, not the title span
      expect(label).toHaveClass(
        'mx-1',
        'inline-flex',
        'items-center',
        'rounded-full',
        'shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]',
        'border-2',
        'px-2',
        'py-0.5',
        'text-xs',
        'font-medium'
      );
    });

    it('handles all color variants', () => {
      const allColors = [
        { name: 'Red', color: 'red' },
        { name: 'Green', color: 'green' },
        { name: 'Blue', color: 'blue' },
        { name: 'Orange', color: 'orange' },
        { name: 'Yellow', color: 'yellow' },
        { name: 'Purple', color: 'purple' },
        { name: 'Pink', color: 'pink' },
        { name: 'Gray', color: 'gray' },
      ];

      render(
        <ExpandableSection title="Test" labels={allColors}>
          Content
        </ExpandableSection>
      );

      expect(screen.getByText('Red')).toHaveClass('bg-red-100', 'text-red-800');
      expect(screen.getByText('Green')).toHaveClass('bg-green-100', 'text-green-800');
      expect(screen.getByText('Blue')).toHaveClass('bg-blue-100', 'text-blue-800');
      expect(screen.getByText('Orange')).toHaveClass('bg-orange-100', 'text-orange-800');
      expect(screen.getByText('Yellow')).toHaveClass('bg-yellow-100', 'text-yellow-800');
      expect(screen.getByText('Purple')).toHaveClass('bg-purple-100', 'text-purple-800');
      expect(screen.getByText('Pink')).toHaveClass('bg-pink-100', 'text-pink-800');
      expect(screen.getByText('Gray')).toHaveClass('bg-gray-100', 'text-gray-800');
    });
  });

  describe('Button Styling', () => {
    it('has correct button base styling', () => {
      render(<ExpandableSection title="Test">Content</ExpandableSection>);

      const button = screen.getByTestId('disclosure-button');
      expect(button).toHaveClass(
        'flex',
        'w-full',
        'flex-row',
        'justify-between',
        'border-b-2',
        'border-black',
        'px-2',
        'py-2',
        'text-left',
        'font-bold',
        'text-slate-900'
      );
    });

    it('changes background color based on open state - closed', () => {
      render(
        <ExpandableSection title="Test" defaultOpen={false}>
          Content
        </ExpandableSection>
      );

      const button = screen.getByTestId('disclosure-button');
      expect(button).toHaveClass('bg-red-200');
    });

    it('changes background color based on open state - open', () => {
      render(
        <ExpandableSection title="Test" defaultOpen={true}>
          Content
        </ExpandableSection>
      );

      const button = screen.getByTestId('disclosure-button');
      expect(button).toHaveClass('bg-purple-300');
    });
  });

  describe('Container Styling', () => {
    it('has correct container styling when closed', () => {
      const { container } = render(
        <ExpandableSection title="Test" defaultOpen={false}>
          Content
        </ExpandableSection>
      );

      const sectionContainer = container.querySelector('.my-4');
      expect(sectionContainer).toHaveClass(
        'border-t-2',
        'border-r-2',
        'border-l-2',
        'my-4',
        'border-black',
        'shadow-[2px_2px_0px_rgba(0,0,0,1)]'
      );
    });

    it('has correct container styling when open', () => {
      const { container } = render(
        <ExpandableSection title="Test" defaultOpen={true}>
          Content
        </ExpandableSection>
      );

      const sectionContainer = container.querySelector('.my-4');
      expect(sectionContainer).toHaveClass(
        'border-2',
        'my-4',
        'border-black',
        'shadow-[2px_2px_0px_rgba(0,0,0,1)]'
      );
    });
  });

  describe('Panel Styling', () => {
    it('has correct panel styling', () => {
      render(<ExpandableSection title="Test">Content</ExpandableSection>);

      const panel = screen.getByTestId('disclosure-panel');
      expect(panel).toHaveClass('bg-blue-100', 'p-4', 'text-slate-700');
    });
  });

  describe('Icons', () => {
    it('shows plus icon when closed', () => {
      render(
        <ExpandableSection title="Test" defaultOpen={false}>
          Content
        </ExpandableSection>
      );

      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('minus-icon')).not.toBeInTheDocument();
    });

    it('shows minus icon when open', () => {
      render(
        <ExpandableSection title="Test" defaultOpen={true}>
          Content
        </ExpandableSection>
      );

      expect(screen.getByTestId('minus-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument();
    });

    it('icons have proper styling', () => {
      render(<ExpandableSection title="Test">Content</ExpandableSection>);

      const icon = screen.getByTestId('plus-icon');
      expect(icon).toHaveClass('h-5', 'w-5');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Accessibility', () => {
    it('button has proper text alignment', () => {
      render(<ExpandableSection title="Test">Content</ExpandableSection>);

      const button = screen.getByTestId('disclosure-button');
      expect(button).toHaveClass('text-left');
    });

    it('icons are hidden from screen readers', () => {
      render(<ExpandableSection title="Test">Content</ExpandableSection>);

      const icon = screen.getByTestId('plus-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('button spans full width for better click target', () => {
      render(<ExpandableSection title="Test">Content</ExpandableSection>);

      const button = screen.getByTestId('disclosure-button');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Content Layout', () => {
    it('displays title correctly', () => {
      const title = 'Complex Section Title';
      render(<ExpandableSection title={title}>Content</ExpandableSection>);

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it('displays content in panel', () => {
      const content = 'This is complex panel content with multiple elements.';
      render(
        <ExpandableSection title="Test">
          <div>{content}</div>
        </ExpandableSection>
      );

      expect(screen.getByText(content)).toBeInTheDocument();
    });

    it('handles React elements as children', () => {
      render(
        <ExpandableSection title="Test">
          <div>
            <h3>Subheading</h3>
            <p>Paragraph content</p>
            <ul>
              <li>List item</li>
            </ul>
          </div>
        </ExpandableSection>
      );

      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByText('Paragraph content')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
    });
  });

  describe('Button Layout', () => {
    it('has correct flex layout for button content', () => {
      render(
        <ExpandableSection title="Test" labels={[{ name: 'Label', color: 'blue' }]}>
          Content
        </ExpandableSection>
      );

      const button = screen.getByTestId('disclosure-button');
      expect(button).toHaveClass('flex', 'flex-row', 'justify-between');
    });

    it('positions labels and icon in flex container', () => {
      render(
        <ExpandableSection title="Test" labels={[{ name: 'Label', color: 'blue' }]}>
          Content
        </ExpandableSection>
      );

      const button = screen.getByTestId('disclosure-button');
      const rightSection = button.children[1]; // Second child contains labels + icon

      expect(rightSection).toHaveClass('flex', 'flex-row', 'items-center');
    });
  });
});
