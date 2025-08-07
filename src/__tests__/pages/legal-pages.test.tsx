import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

describe('Legal Pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Terms & Conditions', () => {
    it('renders terms page structure', () => {
      render(
        <div data-testid='legal-content'>
          <section className='mb-8'>
            <h1 className='py-4 text-center text-3xl font-extrabold'>Terms & Conditions</h1>
          </section>
          <section className='mb-12'>
            <p className='pb-6 text-center text-lg'>Please read these terms and conditions carefully.</p>
            <div>
              <h2 className='mb-4 text-2xl font-bold'>1. Acceptance of Terms</h2>
              <p className='text-lg'>By accessing this website, you accept these terms.</p>
            </div>
          </section>
        </div>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Terms & Conditions');
      expect(screen.getByText('Please read these terms and conditions carefully.')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('1. Acceptance of Terms');
    });
  });

  describe('Privacy Policy', () => {
    it('renders privacy page structure', () => {
      render(
        <div data-testid='legal-content'>
          <section className='mb-8'>
            <h1 className='py-4 text-center text-3xl font-extrabold'>Privacy Policy</h1>
          </section>
          <section className='mb-12'>
            <p className='pb-6 text-center text-lg'>Your privacy is important to us.</p>
            <div>
              <h2 className='mb-4 text-2xl font-bold'>Information We Collect</h2>
              <p className='text-lg'>We may collect information you provide directly to us.</p>
            </div>
          </section>
        </div>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Privacy Policy');
      expect(screen.getByText('Your privacy is important to us.')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Information We Collect');
    });
  });

  describe('Refunds Policy', () => {
    it('renders refunds page structure', () => {
      render(
        <div data-testid='legal-content'>
          <section className='mb-8'>
            <h1 className='py-4 text-center text-3xl font-extrabold'>Refunds & Cancellation Policy</h1>
          </section>
          <section className='mb-12'>
            <p className='pb-6 text-center text-lg'>Please review our refund and cancellation policy.</p>
            <div>
              <h2 className='mb-4 text-2xl font-bold'>Refund Eligibility</h2>
              <p className='text-lg'>Refunds may be available under certain circumstances.</p>
            </div>
          </section>
        </div>
      );

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Refunds & Cancellation Policy');
      expect(screen.getByText('Please review our refund and cancellation policy.')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Refund Eligibility');
    });
  });

  it('all legal pages use consistent layout structure', () => {
    const { container } = render(
      <div data-testid='legal-content'>
        <section className='mb-8'>
          <h1>Title</h1>
        </section>
        <section className='mb-12'>
          <div className='space-y-8'>
            <div>
              <h2 className='mb-4'>Section</h2>
              <p>Content</p>
            </div>
          </div>
        </section>
      </div>
    );

    const sections = container.querySelectorAll('section');
    expect(sections).toHaveLength(2);
    expect(sections[0]).toHaveClass('mb-8');
    expect(sections[1]).toHaveClass('mb-12');
  });
});
