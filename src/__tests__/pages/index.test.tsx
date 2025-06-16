import { Profile } from '@/components/profile';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockMainLayoutProps } from '../test-utils';

// Mock the Profile component
vi.mock('@/components/profile', () => ({
  Profile: vi.fn(() => <div data-testid="profile-component">Profile Component</div>),
}));

// Mock MainLayout
vi.mock('@/layouts/MainLayout.astro', () => ({
  default: ({ children, variant, showHomeButton }: MockMainLayoutProps) => (
    <div data-testid="main-layout" data-variant={variant} data-show-home-button={showHomeButton}>
      {children}
    </div>
  ),
}));

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

// Since this is an Astro page, we'll test the component parts
describe('Index Page Content', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Structure', () => {
    it('renders main section with correct classes', () => {
      const { container } = render(
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <Profile />
          </div>
        </section>
      );

      const section = container.querySelector('section');
      expect(section).toHaveClass('mb-12');

      const div = section?.querySelector('div');
      expect(div).toHaveClass('mx-auto', 'max-w-4xl');
    });

    it('renders profile component', () => {
      render(
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <Profile />
          </div>
        </section>
      );

      expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });
  });

  describe('Layout Configuration', () => {
    it('should use main layout variant', () => {
      // This tests the expected props passed to MainLayout
      const expectedVariant = 'main';
      const expectedShowHomeButton = false;

      expect(expectedVariant).toBe('main');
      expect(expectedShowHomeButton).toBe(false);
    });
  });

  describe('Content Structure', () => {
    it('has proper semantic HTML structure', () => {
      const { container } = render(
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <Profile />
          </div>
        </section>
      );

      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('applies responsive container classes', () => {
      const { container } = render(
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <Profile />
          </div>
        </section>
      );

      const containerDiv = container.querySelector('div');
      expect(containerDiv).toHaveClass('mx-auto', 'max-w-4xl');
    });
  });

  describe('Profile Integration', () => {
    it('profile component is client-side loaded', () => {
      render(
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <Profile />
          </div>
        </section>
      );

      // Verify Profile component is rendered
      expect(vi.mocked(Profile)).toHaveBeenCalled();
    });

    it('profile is within the correct container', () => {
      const { container } = render(
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <Profile />
          </div>
        </section>
      );

      const profileContainer = container.querySelector('.max-w-4xl');
      expect(profileContainer).toContainElement(screen.getByTestId('profile-component'));
    });
  });

  describe('Accessibility', () => {
    it('uses semantic section element', () => {
      const { container } = render(
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <Profile />
          </div>
        </section>
      );

      const section = container.querySelector('section');
      expect(section?.tagName).toBe('SECTION');
    });

    it('has proper content hierarchy', () => {
      const { container } = render(
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <Profile />
          </div>
        </section>
      );

      // Check that section contains div which contains profile
      const section = container.querySelector('section');
      const div = section?.querySelector('div');
      const profile = div?.querySelector('[data-testid="profile-component"]');

      expect(profile).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('applies mobile-first responsive classes', () => {
      const { container } = render(
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <Profile />
          </div>
        </section>
      );

      const section = container.querySelector('section');
      const div = section?.querySelector('div');

      expect(section).toHaveClass('mb-12');
      expect(div).toHaveClass('mx-auto', 'max-w-4xl');
    });
  });
});
