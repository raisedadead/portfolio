import { Profile } from '@/components/profile';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/profile', () => ({
  Profile: vi.fn(() => <div data-testid='profile-component'>Profile Component</div>)
}));

vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

describe('Index Page', () => {
  it('renders main section with profile component', () => {
    const { container } = render(
      <section className='mb-12'>
        <div className='mx-auto max-w-4xl'>
          <Profile />
        </div>
      </section>
    );

    expect(container.querySelector('section')).toHaveClass('mb-12');
    expect(container.querySelector('div')).toHaveClass('mx-auto', 'max-w-4xl');
    expect(screen.getByTestId('profile-component')).toBeInTheDocument();
  });

  it('profile component is rendered within container', () => {
    const { container } = render(
      <section className='mb-12'>
        <div className='mx-auto max-w-4xl'>
          <Profile />
        </div>
      </section>
    );

    const profileContainer = container.querySelector('.max-w-4xl');
    expect(profileContainer).toContainElement(screen.getByTestId('profile-component'));
    expect(vi.mocked(Profile)).toHaveBeenCalled();
  });
});
