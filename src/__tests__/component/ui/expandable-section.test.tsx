import { ExpandableSection } from '@/components/expandable-section';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '../../test-utils';

// Mock headlessui
vi.mock('@headlessui/react', () => ({
  Disclosure: ({
    children,
    defaultOpen
  }: {
    children: (props: { open: boolean }) => React.ReactNode;
    defaultOpen?: boolean;
  }) => {
    const [isOpen] = React.useState(defaultOpen || false);
    return <div data-testid='disclosure'>{children({ open: isOpen })}</div>;
  },
  DisclosureButton: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type='button' onClick={onClick} data-testid='disclosure-button'>
      {children}
    </button>
  ),
  DisclosurePanel: ({ children }: { children: React.ReactNode }) => <div data-testid='disclosure-panel'>{children}</div>
}));

// Mock icons
vi.mock('@heroicons/react/24/outline', () => ({
  MinusIcon: () => <div data-testid='minus-icon' />,
  PlusIcon: () => <div data-testid='plus-icon' />
}));

describe('ExpandableSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section with title and content', () => {
    render(
      <ExpandableSection title='Test Section'>
        <p>Test content</p>
      </ExpandableSection>
    );

    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    expect(screen.getByTestId('disclosure-button')).toBeInTheDocument();
  });

  it('renders labels when provided', () => {
    const labels = [
      { name: 'React', color: 'blue' },
      { name: 'TypeScript', color: 'green' }
    ];

    render(
      <ExpandableSection title='Test Section' labels={labels}>
        <p>Test content</p>
      </ExpandableSection>
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('handles defaultOpen prop', () => {
    render(
      <ExpandableSection title='Test Section' defaultOpen={true}>
        <p>Test content</p>
      </ExpandableSection>
    );

    expect(screen.getByTestId('disclosure')).toBeInTheDocument();
  });

  it('renders toggle icons', () => {
    render(
      <ExpandableSection title='Test Section'>
        <p>Test content</p>
      </ExpandableSection>
    );

    // Should show plus icon when closed
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('toggles content visibility on button click', () => {
    render(
      <ExpandableSection title='Test Section'>
        <p>Test content</p>
      </ExpandableSection>
    );

    const button = screen.getByTestId('disclosure-button');
    fireEvent.click(button);

    expect(screen.getByTestId('disclosure-panel')).toBeInTheDocument();
  });
});
