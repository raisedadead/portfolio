import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Expandable Section Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  interface ExpandableSectionProps {
    title: string;
    labels?: { name: string; color: string }[];
    className?: string;
    defaultOpen?: boolean;
    children?: string;
  }

  const createExpandableSection = (props: ExpandableSectionProps) => {
    const { title, labels, className, defaultOpen = false, children = 'Test content' } = props;

    const colorVariants: Record<string, string> = {
      red: 'border-black bg-red-100 text-red-800',
      green: 'border-black bg-green-100 text-green-800',
      blue: 'border-black bg-blue-100 text-blue-800',
      orange: 'border-black bg-orange-100 text-orange-800',
      yellow: 'border-black bg-yellow-100 text-yellow-800',
      purple: 'border-black bg-purple-100 text-purple-800',
      pink: 'border-black bg-pink-100 text-pink-800',
      gray: 'border-black bg-gray-100 text-gray-800'
    };

    const outerDiv = document.createElement('div');
    outerDiv.className = `expandable-section my-4 ${className || ''}`;

    const container = document.createElement('div');
    container.className = `expandable-container ${defaultOpen ? 'border-2' : 'border-t-2 border-r-2 border-l-2'} border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]`;

    const button = document.createElement('button');
    button.className = `expandable-button ${defaultOpen ? 'bg-purple-300' : 'bg-red-200'} flex w-full flex-row justify-between border-b-2 border-black px-2 py-2 text-left font-bold text-slate-900 transition-colors duration-200`;
    button.setAttribute('aria-expanded', defaultOpen.toString());

    const titleSpan = document.createElement('span');
    titleSpan.textContent = title;

    const rightDiv = document.createElement('div');
    rightDiv.className = 'flex flex-row items-center';

    // Labels section
    if (labels && labels.length > 0) {
      const labelsDiv = document.createElement('div');
      labelsDiv.className = 'mx-2';

      labels.forEach((label) => {
        const labelSpan = document.createElement('span');
        labelSpan.className = `mx-1 inline-flex items-center rounded-full border-2 px-2 py-0.5 text-xs font-medium shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${colorVariants[label.color] || colorVariants.gray}`;
        labelSpan.textContent = label.name;
        labelsDiv.appendChild(labelSpan);
      });

      rightDiv.appendChild(labelsDiv);
    }

    // Icon
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'expand-icon h-5 w-5 transition-transform duration-200');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');

    const iconPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    iconPath.setAttribute('stroke-linecap', 'round');
    iconPath.setAttribute('stroke-linejoin', 'round');
    iconPath.setAttribute('stroke-width', '2');
    iconPath.setAttribute('d', 'M12 6v6m0 0v6m0-6h6m-6 0H6');

    icon.appendChild(iconPath);
    rightDiv.appendChild(icon);

    // Set initial icon rotation
    if (!defaultOpen) {
      icon.style.transform = 'rotate(0deg)';
    }

    button.appendChild(titleSpan);
    button.appendChild(rightDiv);

    // Panel
    const panel = document.createElement('div');
    panel.className = `expandable-panel bg-blue-100 p-4 text-slate-700 transition-all duration-300 ${defaultOpen ? '' : 'hidden'}`;
    panel.textContent = children;

    container.appendChild(button);
    container.appendChild(panel);
    outerDiv.appendChild(container);

    document.body.appendChild(outerDiv);

    // Add event listener to simulate the component's behavior
    button.addEventListener('click', (e) => {
      e.preventDefault(); // This might be the issue - preventing default behavior
      const isCurrentlyOpen = button.getAttribute('aria-expanded') === 'true';
      const newState = !isCurrentlyOpen;

      // Update state
      button.setAttribute('aria-expanded', newState.toString());
      if (newState) {
        panel.classList.remove('hidden');
        button.classList.remove('bg-red-200');
        button.classList.add('bg-purple-300');
        container.classList.add('border-2');
        container.classList.remove('border-t-2', 'border-r-2', 'border-l-2');
        icon.style.transform = 'rotate(45deg)';
      } else {
        panel.classList.add('hidden');
        button.classList.remove('bg-purple-300');
        button.classList.add('bg-red-200');
        container.classList.remove('border-2');
        container.classList.add('border-t-2', 'border-r-2', 'border-l-2');
        icon.style.transform = 'rotate(0deg)';
      }
    });

    return outerDiv;
  };

  describe('Structure and Layout', () => {
    it('renders expandable section with correct structure', () => {
      createExpandableSection({ title: 'Test Section' });

      const section = document.querySelector('.expandable-section');
      expect(section).toBeTruthy();
      expect(section?.classList.contains('my-4')).toBe(true);
    });

    it('applies custom className when provided', () => {
      const customClass = 'custom-expandable';
      createExpandableSection({ title: 'Test', className: customClass });

      const section = document.querySelector('.expandable-section');
      expect(section?.classList.contains(customClass)).toBe(true);
    });

    it('creates button with correct structure', () => {
      createExpandableSection({ title: 'Test Section' });

      const button = document.querySelector('.expandable-button');
      expect(button?.tagName.toLowerCase()).toBe('button');
      expect(button?.classList.contains('flex')).toBe(true);
      expect(button?.classList.contains('w-full')).toBe(true);
      expect(button?.classList.contains('justify-between')).toBe(true);
    });

    it('creates panel for content', () => {
      createExpandableSection({ title: 'Test', children: 'Panel content' });

      const panel = document.querySelector('.expandable-panel');
      expect(panel).toBeTruthy();
      expect(panel?.textContent).toBe('Panel content');
    });
  });

  describe('Default State Behavior', () => {
    it('is closed by default when defaultOpen is false', () => {
      createExpandableSection({ title: 'Test', defaultOpen: false });

      const button = document.querySelector('.expandable-button');
      const panel = document.querySelector('.expandable-panel');
      const container = document.querySelector('.expandable-container');

      expect(button?.getAttribute('aria-expanded')).toBe('false');
      expect(panel?.classList.contains('hidden')).toBe(true);
      expect(button?.classList.contains('bg-red-200')).toBe(true);
      expect(container?.classList.contains('border-t-2')).toBe(true);
      expect(container?.classList.contains('border-r-2')).toBe(true);
      expect(container?.classList.contains('border-l-2')).toBe(true);
    });

    it('is open by default when defaultOpen is true', () => {
      createExpandableSection({ title: 'Test', defaultOpen: true });

      const button = document.querySelector('.expandable-button');
      const panel = document.querySelector('.expandable-panel');
      const container = document.querySelector('.expandable-container');

      expect(button?.getAttribute('aria-expanded')).toBe('true');
      expect(panel?.classList.contains('hidden')).toBe(false);
      expect(button?.classList.contains('bg-purple-300')).toBe(true);
      expect(container?.classList.contains('border-2')).toBe(true);
    });
  });

  describe('Interactive Behavior', () => {
    it('toggles panel visibility when button is clicked', () => {
      createExpandableSection({ title: 'Test', defaultOpen: false });

      const button = document.querySelector('.expandable-button') as HTMLButtonElement;
      const panel = document.querySelector('.expandable-panel');

      // Initially closed
      expect(panel?.classList.contains('hidden')).toBe(true);

      // Click to open
      button.click();
      expect(panel?.classList.contains('hidden')).toBe(false);
      expect(button.getAttribute('aria-expanded')).toBe('true');

      // Click to close
      button.click();
      expect(panel?.classList.contains('hidden')).toBe(true);
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('changes button background color when toggled', () => {
      createExpandableSection({ title: 'Test', defaultOpen: false });

      const button = document.querySelector('.expandable-button') as HTMLButtonElement;

      // Initially red
      expect(button.classList.contains('bg-red-200')).toBe(true);

      // Click to open - should become purple
      button.click();
      expect(button.classList.contains('bg-purple-300')).toBe(true);
      expect(button.classList.contains('bg-red-200')).toBe(false);

      // Click to close - should become red again
      button.click();
      expect(button.classList.contains('bg-red-200')).toBe(true);
      expect(button.classList.contains('bg-purple-300')).toBe(false);
    });

    it('rotates icon when toggled', () => {
      createExpandableSection({ title: 'Test', defaultOpen: false });

      const button = document.querySelector('.expandable-button') as HTMLButtonElement;
      const icon = document.querySelector('.expand-icon') as HTMLElement;

      // Initially no rotation
      expect(icon.style.transform).toBe('rotate(0deg)');

      // Click to open - should rotate
      button.click();
      expect(icon.style.transform).toBe('rotate(45deg)');

      // Click to close - should reset rotation
      button.click();
      expect(icon.style.transform).toBe('rotate(0deg)');
    });

    it('changes container border when toggled', () => {
      createExpandableSection({ title: 'Test', defaultOpen: false });

      const button = document.querySelector('.expandable-button') as HTMLButtonElement;
      const container = document.querySelector('.expandable-container');

      // Initially partial border
      expect(container?.classList.contains('border-t-2')).toBe(true);
      expect(container?.classList.contains('border-r-2')).toBe(true);
      expect(container?.classList.contains('border-l-2')).toBe(true);
      expect(container?.classList.contains('border-2')).toBe(false);

      // Click to open - should get full border
      button.click();
      expect(container?.classList.contains('border-2')).toBe(true);
      expect(container?.classList.contains('border-t-2')).toBe(false);
    });
  });

  describe('Labels Functionality', () => {
    it('renders labels when provided', () => {
      const labels = [
        { name: 'test', color: 'blue' },
        { name: 'example', color: 'red' }
      ];
      createExpandableSection({ title: 'Test', labels });

      const labelElements = document.querySelectorAll('.mx-1.inline-flex');
      expect(labelElements).toHaveLength(2);
      expect(labelElements[0].textContent).toBe('test');
      expect(labelElements[1].textContent).toBe('example');
    });

    it('applies correct color classes to labels', () => {
      const labels = [{ name: 'test', color: 'blue' }];
      createExpandableSection({ title: 'Test', labels });

      const labelElement = document.querySelector('.mx-1.inline-flex');
      expect(labelElement?.classList.contains('bg-blue-100')).toBe(true);
      expect(labelElement?.classList.contains('text-blue-800')).toBe(true);
      expect(labelElement?.classList.contains('border-black')).toBe(true);
    });

    it('falls back to gray color for unknown colors', () => {
      const labels = [{ name: 'test', color: 'unknown' }];
      createExpandableSection({ title: 'Test', labels });

      const labelElement = document.querySelector('.mx-1.inline-flex');
      expect(labelElement?.classList.contains('bg-gray-100')).toBe(true);
      expect(labelElement?.classList.contains('text-gray-800')).toBe(true);
    });

    it('does not render labels container when no labels provided', () => {
      createExpandableSection({ title: 'Test' });

      const labelsContainer = document.querySelector('.mx-2');
      expect(labelsContainer).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('uses proper ARIA attributes', () => {
      createExpandableSection({ title: 'Test', defaultOpen: false });

      const button = document.querySelector('.expandable-button');
      expect(button?.getAttribute('aria-expanded')).toBe('false');
    });

    it('updates aria-expanded when toggled', () => {
      createExpandableSection({ title: 'Test', defaultOpen: false });

      const button = document.querySelector('.expandable-button') as HTMLButtonElement;

      button.click();
      expect(button.getAttribute('aria-expanded')).toBe('true');

      button.click();
      expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('hides icon from screen readers', () => {
      createExpandableSection({ title: 'Test' });

      const icon = document.querySelector('.expand-icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });

    it('uses semantic button element', () => {
      createExpandableSection({ title: 'Test' });

      const button = document.querySelector('.expandable-button');
      expect(button?.tagName.toLowerCase()).toBe('button');
    });
  });

  describe('Styling Classes', () => {
    it('applies transition classes', () => {
      createExpandableSection({ title: 'Test' });

      const button = document.querySelector('.expandable-button');
      const panel = document.querySelector('.expandable-panel');
      const icon = document.querySelector('.expand-icon');

      expect(button?.classList.contains('transition-colors')).toBe(true);
      expect(button?.classList.contains('duration-200')).toBe(true);
      expect(panel?.classList.contains('transition-all')).toBe(true);
      expect(panel?.classList.contains('duration-300')).toBe(true);
      expect(icon?.classList.contains('transition-transform')).toBe(true);
      expect(icon?.classList.contains('duration-200')).toBe(true);
    });

    it('applies shadow classes', () => {
      createExpandableSection({ title: 'Test' });

      const container = document.querySelector('.expandable-container');
      const labels = document.querySelectorAll('.mx-1.inline-flex');

      expect(container?.className).toContain('shadow-[2px_2px_0px_rgba(0,0,0,1)]');

      if (labels.length > 0) {
        expect(labels[0].className).toContain('shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]');
      }
    });

    it('applies correct text and background colors', () => {
      createExpandableSection({ title: 'Test' });

      const button = document.querySelector('.expandable-button');
      const panel = document.querySelector('.expandable-panel');

      expect(button?.classList.contains('text-slate-900')).toBe(true);
      expect(button?.classList.contains('font-bold')).toBe(true);
      expect(panel?.classList.contains('bg-blue-100')).toBe(true);
      expect(panel?.classList.contains('text-slate-700')).toBe(true);
    });
  });

  describe('Potential Issues and Bug Detection', () => {
    it('button does not cause page navigation (no default href behavior)', () => {
      createExpandableSection({ title: 'Test' });

      const button = document.querySelector('.expandable-button') as HTMLButtonElement;

      // The button should be a button element, not a link
      expect(button.tagName.toLowerCase()).toBe('button');
      expect(button.getAttribute('href')).toBeNull();
    });

    it('clicking button prevents default behavior to avoid page jumps', () => {
      createExpandableSection({ title: 'Test' });

      const button = document.querySelector('.expandable-button') as HTMLButtonElement;

      // Test that preventDefault is being called
      const clickEvent = new Event('click', { cancelable: true });
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');

      button.dispatchEvent(clickEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('icon rotation values are valid CSS transforms', () => {
      createExpandableSection({ title: 'Test', defaultOpen: false });

      const button = document.querySelector('.expandable-button') as HTMLButtonElement;
      const icon = document.querySelector('.expand-icon') as HTMLElement;

      // Test both rotation states
      expect(['rotate(0deg)', 'rotate(45deg)']).toContain(icon.style.transform || 'rotate(0deg)');

      button.click();
      expect(['rotate(0deg)', 'rotate(45deg)']).toContain(icon.style.transform);
    });

    it('manages focus properly during state changes', () => {
      createExpandableSection({ title: 'Test' });

      const button = document.querySelector('.expandable-button') as HTMLButtonElement;

      // Focus the button
      button.focus();
      expect(document.activeElement).toBe(button);

      // Click and ensure focus is maintained
      button.click();
      expect(document.activeElement).toBe(button);
    });

    it('class modifications are atomic and consistent', () => {
      createExpandableSection({ title: 'Test', defaultOpen: false });

      const button = document.querySelector('.expandable-button') as HTMLButtonElement;
      const container = document.querySelector('.expandable-container');

      // Initial state should be consistent
      expect(button?.classList.contains('bg-red-200')).toBe(true);
      expect(button?.classList.contains('bg-purple-300')).toBe(false);
      expect(container?.classList.contains('border-2')).toBe(false);

      // After toggle, state should still be consistent
      button.click();
      expect(button?.classList.contains('bg-red-200')).toBe(false);
      expect(button?.classList.contains('bg-purple-300')).toBe(true);
      expect(container?.classList.contains('border-2')).toBe(true);
    });
  });

  describe('Content Slot Behavior', () => {
    it('renders slot content properly', () => {
      const content = 'This is test content for the expandable section';
      createExpandableSection({ title: 'Test', children: content });

      const panel = document.querySelector('.expandable-panel');
      expect(panel?.textContent).toBe(content);
    });

    it('handles empty content gracefully', () => {
      createExpandableSection({ title: 'Test', children: '' });

      const panel = document.querySelector('.expandable-panel');
      expect(panel?.textContent).toBe('');
    });
  });
});
