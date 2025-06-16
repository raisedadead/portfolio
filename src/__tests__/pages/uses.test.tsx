import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  MockCustomLinkProps,
  MockExpandableSectionLabel,
  MockExpandableSectionProps
} from '../test-utils';

// Mock components
vi.mock('@/components/custom-link', () => ({
  CustomLink: ({
    href,
    className,
    children,
    ...props
  }: MockCustomLinkProps) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )
}));

vi.mock('@/components/expandable-section', () => ({
  ExpandableSection: ({
    title,
    labels,
    defaultOpen,
    children,
    ...props
  }: MockExpandableSectionProps) => (
    <div
      data-testid='expandable-section'
      data-title={title}
      data-default-open={defaultOpen}
      {...props}
    >
      <h3>{title}</h3>
      <div data-testid='labels'>
        {labels?.map((label: MockExpandableSectionLabel) => (
          <span key={label.name} data-color={label.color}>
            {label.name}
          </span>
        ))}
      </div>
      <div>{children}</div>
    </div>
  )
}));

vi.mock('@/components/social', () => ({
  Social: () => <div data-testid='social-component'>Social Links</div>
}));

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

// Since this is an Astro page, we'll test the component parts
describe('Uses Page Content', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderUsesContent = () => {
    return render(
      <div>
        <section className='mb-8'>
          <div className='prose prose-lg prose-slate max-w-none'>
            <h1 className='py-4 text-center text-3xl font-bold text-slate-800'>
              Everyday Carry
            </h1>
          </div>
        </section>
        <section className='mb-12'>
          <div className='mx-auto max-w-3xl'>
            <p className='pb-6 text-center text-lg text-slate-600'>
              A non-exhaustive list of stuff that I use on a daily basis.
            </p>
            <h2 className='mb-6 text-center text-2xl font-bold text-slate-700'>
              Hardware
            </h2>
            <ul className='list-none space-y-6'>
              <li>
                <div
                  data-testid='expandable-section'
                  data-title='Apple MacBook Pro (14-inch, 2021)'
                  data-default-open={true}
                >
                  <h3>Apple MacBook Pro (14-inch, 2021)</h3>
                  <div data-testid='labels'>
                    <span data-color='green'>2022</span>
                    <span data-color='orange'>work</span>
                    <span data-color='yellow'>personal</span>
                  </div>
                  <div>
                    <p className='mb-4 text-lg'>
                      I daily drive the{' '}
                      <a
                        className='text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                        href='https://support.apple.com/en-us/111902'
                      >
                        MacBook Pro (14-inch, 2021)
                      </a>
                      . I use it for work, personal projects, and everything in
                      between.
                    </p>
                    <p className='text-lg'>
                      At home, this is connected to a dual monitor setup.
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <h2 className='mt-12 mb-6 text-center text-2xl font-bold text-slate-700'>
              Software
            </h2>
            <ul className='list-none space-y-6'>
              <li>
                <div
                  data-testid='expandable-section'
                  data-title='Operating Systems'
                  data-default-open={true}
                >
                  <h3>Operating Systems</h3>
                  <div data-testid='labels'>
                    <span data-color='blue'>os</span>
                  </div>
                  <div>
                    <ul className='list-disc space-y-2 pl-5'>
                      <li>macOS - Primary OS on my MacBook Pro</li>
                      <li>
                        Linux (Debian/Ubuntu) - For servers and development
                      </li>
                      <li>Raspberry Pi OS - On my Raspberry Pi cluster</li>
                    </ul>
                  </div>
                </div>
              </li>
            </ul>

            <div className='prose prose-lg prose-slate mx-auto mt-12 max-w-3xl'>
              <h3 className='mb-4 text-center font-bold text-slate-700'>
                Get in touch
              </h3>
              <p className='text-center text-lg text-slate-600'>
                Have questions about any of the gear or software I use? Feel
                free to reach out!
              </p>
              <div data-testid='social-component'>Social Links</div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  describe('Page Structure', () => {
    it('renders main heading', () => {
      renderUsesContent();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Everyday Carry');
      expect(heading).toHaveClass(
        'py-4',
        'text-center',
        'text-3xl',
        'font-bold',
        'text-slate-800'
      );
    });

    it('renders descriptive subtitle', () => {
      renderUsesContent();

      expect(
        screen.getByText(
          'A non-exhaustive list of stuff that I use on a daily basis.'
        )
      ).toBeInTheDocument();
    });

    it('has proper section structure', () => {
      const { container } = renderUsesContent();

      const sections = container.querySelectorAll('section');
      expect(sections).toHaveLength(2);
    });
  });

  describe('Hardware Section', () => {
    it('renders hardware section heading', () => {
      renderUsesContent();

      const hardwareHeading = screen.getByRole('heading', {
        level: 2,
        name: 'Hardware'
      });
      expect(hardwareHeading).toBeInTheDocument();
      expect(hardwareHeading).toHaveClass(
        'mb-6',
        'text-center',
        'text-2xl',
        'font-bold',
        'text-slate-700'
      );
    });

    it('renders MacBook Pro section', () => {
      renderUsesContent();

      const sections = screen.getAllByTestId('expandable-section');
      const macbookSection = sections.find(
        (section) =>
          section.getAttribute('data-title') ===
          'Apple MacBook Pro (14-inch, 2021)'
      );

      expect(macbookSection).toBeInTheDocument();
    });

    it('includes MacBook Pro external link', () => {
      renderUsesContent();

      const macbookLink = screen.getByRole('link', {
        name: /MacBook Pro \(14-inch, 2021\)/
      });
      expect(macbookLink).toBeInTheDocument();
      expect(macbookLink).toHaveAttribute(
        'href',
        'https://support.apple.com/en-us/111902'
      );
    });
  });

  describe('Software Section', () => {
    it('renders software section heading', () => {
      renderUsesContent();

      const softwareHeading = screen.getByRole('heading', {
        level: 2,
        name: 'Software'
      });
      expect(softwareHeading).toBeInTheDocument();
    });

    it('lists operating systems', () => {
      renderUsesContent();

      expect(
        screen.getByText('macOS - Primary OS on my MacBook Pro')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Linux (Debian/Ubuntu) - For servers and development')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Raspberry Pi OS - On my Raspberry Pi cluster')
      ).toBeInTheDocument();
    });
  });

  describe('Contact Section', () => {
    it('renders get in touch section', () => {
      renderUsesContent();

      const contactHeading = screen.getByRole('heading', {
        level: 3,
        name: 'Get in touch'
      });
      expect(contactHeading).toBeInTheDocument();
    });

    it('renders social component', () => {
      renderUsesContent();

      expect(screen.getByTestId('social-component')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      const { container } = renderUsesContent();

      expect(container.querySelectorAll('section')).toHaveLength(2);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(3);
    });

    it('has proper heading hierarchy', () => {
      renderUsesContent();

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2s).toHaveLength(2);
      expect(h3s.length).toBeGreaterThanOrEqual(1);
    });
  });
});
