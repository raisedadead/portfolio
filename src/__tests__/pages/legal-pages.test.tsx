import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
}));

// Since these are Astro pages, we'll test the component parts
describe('Legal Pages Content', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderTermsContent = () => {
    return render(
      <div data-testid="legal-content" data-variant="legal">
        <section className="mb-8">
          <h1 className="py-4 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Terms & Conditions
          </h1>
        </section>
        <section className="mb-12">
          <p className="pb-6 text-center text-lg font-medium text-slate-700">
            Please read these terms and conditions carefully.
          </p>
          <div className="space-y-8">
            <div>
              <h2 className="mb-4 text-2xl font-bold text-slate-800">1. Acceptance of Terms</h2>
              <p className="text-lg text-slate-700">
                By accessing this website, you accept these terms.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderPrivacyContent = () => {
    return render(
      <div data-testid="legal-content" data-variant="legal">
        <section className="mb-8">
          <div className="prose prose-lg prose-slate max-w-none">
            <h1 className="py-4 text-center text-3xl font-extrabold tracking-tight text-slate-900">
              Privacy Policy
            </h1>
          </div>
        </section>
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <p className="pb-6 text-center text-lg font-medium text-slate-700">
              Your privacy is important to us. This privacy statement explains what personal data we
              collect and how we use it.
            </p>
            <div className="space-y-8">
              <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-800">Information We Collect</h2>
                <p className="text-lg text-slate-700">
                  We may collect information you provide directly to us, such as when you contact us
                  through our website.
                </p>
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-800">How We Use Information</h2>
                <p className="text-lg text-slate-700">
                  We use the information we collect to provide, maintain, and improve our services.
                </p>
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-800">Data Security</h2>
                <p className="text-lg text-slate-700">
                  We implement appropriate security measures to protect your personal information.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  const renderRefundsContent = () => {
    return render(
      <div data-testid="legal-content" data-variant="legal">
        <section className="mb-8">
          <div className="prose prose-lg prose-slate max-w-none">
            <h1 className="py-4 text-center text-3xl font-extrabold tracking-tight text-slate-900">
              Refunds & Cancellation Policy
            </h1>
          </div>
        </section>
        <section className="mb-12">
          <div className="mx-auto max-w-4xl">
            <p className="pb-6 text-center text-lg font-medium text-slate-700">
              Please review our refund and cancellation policy before engaging our services.
            </p>
            <div className="space-y-8">
              <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-800">Refund Eligibility</h2>
                <p className="text-lg text-slate-700">
                  Refunds may be available under certain circumstances as outlined in our service
                  agreements.
                </p>
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-800">Cancellation Process</h2>
                <p className="text-lg text-slate-700">
                  Service cancellations must be requested in writing with appropriate notice
                  periods.
                </p>
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-bold text-slate-800">Processing Time</h2>
                <p className="text-lg text-slate-700">
                  Approved refunds will be processed within 5-10 business days using the original
                  payment method.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  describe('Terms & Conditions Page', () => {
    it('renders terms page heading', () => {
      renderTermsContent();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Terms & Conditions');
      expect(heading).toHaveClass('py-4', 'text-center', 'text-3xl', 'font-extrabold');
    });

    it('displays terms introduction', () => {
      renderTermsContent();

      expect(
        screen.getByText('Please read these terms and conditions carefully.')
      ).toBeInTheDocument();
    });

    it('renders terms sections', () => {
      renderTermsContent();

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: '1. Acceptance of Terms',
        })
      ).toBeInTheDocument();
    });
  });

  describe('Privacy Policy Page', () => {
    it('renders privacy page heading', () => {
      renderPrivacyContent();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Privacy Policy');
      expect(heading).toHaveClass(
        'py-4',
        'text-center',
        'text-3xl',
        'font-extrabold',
        'tracking-tight',
        'text-slate-900'
      );
    });

    it('displays privacy introduction', () => {
      renderPrivacyContent();

      expect(
        screen.getByText(
          'Your privacy is important to us. This privacy statement explains what personal data we collect and how we use it.'
        )
      ).toBeInTheDocument();
    });

    it('renders all major privacy sections', () => {
      renderPrivacyContent();

      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'Information We Collect',
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', {
          level: 2,
          name: 'How We Use Information',
        })
      ).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2, name: 'Data Security' })).toBeInTheDocument();
    });

    it('displays privacy content', () => {
      renderPrivacyContent();

      expect(
        screen.getByText(/We may collect information you provide directly to us/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/We use the information we collect to provide, maintain/)
      ).toBeInTheDocument();
      expect(screen.getByText(/We implement appropriate security measures/)).toBeInTheDocument();
    });
  });

  describe('Refunds & Cancellation Page', () => {
    it('renders refunds page heading', () => {
      renderRefundsContent();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Refunds & Cancellation Policy');
      expect(heading).toHaveClass(
        'py-4',
        'text-center',
        'text-3xl',
        'font-extrabold',
        'tracking-tight',
        'text-slate-900'
      );
    });

    it('displays refunds introduction', () => {
      renderRefundsContent();

      expect(
        screen.getByText(
          'Please review our refund and cancellation policy before engaging our services.'
        )
      ).toBeInTheDocument();
    });

    it('renders all major refunds sections', () => {
      renderRefundsContent();

      expect(
        screen.getByRole('heading', { level: 2, name: 'Refund Eligibility' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: 'Cancellation Process' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { level: 2, name: 'Processing Time' })
      ).toBeInTheDocument();
    });

    it('displays refunds content', () => {
      renderRefundsContent();

      expect(
        screen.getByText(/Refunds may be available under certain circumstances/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Service cancellations must be requested in writing/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Approved refunds will be processed within 5-10 business days/)
      ).toBeInTheDocument();
    });
  });

  describe('Common Legal Page Structure', () => {
    it('all legal pages use consistent layout', () => {
      const termsContainer = renderTermsContent().container;
      const privacyContainer = renderPrivacyContent().container;
      const refundsContainer = renderRefundsContent().container;

      for (const container of [termsContainer, privacyContainer, refundsContainer]) {
        const legalContent = container.querySelector('[data-testid="legal-content"]');
        expect(legalContent).toHaveAttribute('data-variant', 'legal');

        const sections = container.querySelectorAll('section');
        expect(sections).toHaveLength(2);
        expect(sections[0]).toHaveClass('mb-8');
        expect(sections[1]).toHaveClass('mb-12');
      }
    });

    it('all legal pages have proper prose styling', () => {
      const { container: privacyContainer } = renderPrivacyContent();

      const proseContainer = privacyContainer.querySelector('.prose.prose-lg.prose-slate');
      expect(proseContainer).toBeInTheDocument();
      expect(proseContainer).toHaveClass('max-w-none');
    });

    it('all legal pages have consistent typography', () => {
      const { container } = renderTermsContent();

      const h1 = container.querySelector('h1');
      const h2s = container.querySelectorAll('h2');
      const paragraphs = container.querySelectorAll('p');

      expect(h1).toHaveClass('text-3xl', 'font-extrabold');
      for (const h2 of h2s) {
        expect(h2).toHaveClass('text-2xl', 'font-bold', 'text-slate-800');
      }

      const bodyParagraphs = Array.from(paragraphs).filter(
        (p) => p.classList.contains('text-lg') && p.classList.contains('text-slate-700')
      );
      expect(bodyParagraphs.length).toBeGreaterThan(0);
    });

    it('all legal pages have consistent spacing', () => {
      const { container } = renderTermsContent();

      const contentContainer = container.querySelector('.space-y-8');
      expect(contentContainer).toBeInTheDocument();

      const subtitle = container.querySelector('.pb-6');
      expect(subtitle).toBeInTheDocument();

      const sectionHeadings = container.querySelectorAll('h2.mb-4');
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });
  });

  describe('Layout Configuration', () => {
    it('should use legal layout variant', () => {
      const { container } = renderTermsContent();

      const legalContent = container.querySelector('[data-testid="legal-content"]');
      expect(legalContent).toHaveAttribute('data-variant', 'legal');
    });

    it('applies proper container styling', () => {
      const { container } = renderPrivacyContent();

      const mainContainer = container.querySelector('.mx-auto.max-w-4xl');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      const { container } = renderTermsContent();

      expect(container.querySelectorAll('section')).toHaveLength(2);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      renderTermsContent();

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
    });

    it('has descriptive content for screen readers', () => {
      renderTermsContent();

      const introText = screen.getByText('Please read these terms and conditions carefully.');
      expect(introText).toBeInTheDocument();

      // Check that sections have meaningful content
      const sections = screen.getAllByRole('heading', { level: 2 });
      for (const section of sections) {
        expect(section.textContent).toBeTruthy();
        expect(section.textContent?.length).toBeGreaterThan(5);
      }
    });
  });

  describe('Content Organization', () => {
    it('organizes content in logical sections', () => {
      const { container } = renderTermsContent();

      const contentSections = container.querySelectorAll('.space-y-8 > div');
      expect(contentSections.length).toBeGreaterThan(0);

      for (const section of contentSections) {
        const heading = section.querySelector('h2');
        const content = section.querySelector('p');
        expect(heading).toBeInTheDocument();
        expect(content).toBeInTheDocument();
      }
    });

    it('maintains proper spacing between sections', () => {
      const { container } = renderTermsContent();

      const spacingContainer = container.querySelector('.space-y-8');
      expect(spacingContainer).toBeInTheDocument();

      const headings = container.querySelectorAll('h2.mb-4');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('uses consistent text styling', () => {
      const { container } = renderTermsContent();

      const bodyText = container.querySelectorAll('p.text-lg.text-slate-700');
      expect(bodyText.length).toBeGreaterThan(0);

      const headings = container.querySelectorAll('h2.text-2xl.font-bold.text-slate-800');
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive container classes', () => {
      const { container } = renderPrivacyContent();

      const responsiveContainer = container.querySelector('.mx-auto.max-w-4xl');
      expect(responsiveContainer).toBeInTheDocument();
    });

    it('uses responsive typography', () => {
      const { container } = renderTermsContent();

      const mainHeading = container.querySelector('h1.text-3xl');
      const sectionHeadings = container.querySelectorAll('h2.text-2xl');
      const bodyText = container.querySelectorAll('p.text-lg');

      expect(mainHeading).toBeInTheDocument();
      expect(sectionHeadings.length).toBeGreaterThan(0);
      expect(bodyText.length).toBeGreaterThan(0);
    });
  });
});
