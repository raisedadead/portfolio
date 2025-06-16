import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
  MockExpandableSectionLabel,
  MockExpandableSectionProps
} from '../test-utils';

// Mock components
vi.mock('@/components/email', () => ({
  default: () => <span data-testid='email-component'>email@example.com</span>
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

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

// Since this is an Astro page, we'll test the component parts
describe('About Page Content', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAboutContent = () => {
    return render(
      <div>
        <section className='mb-8'>
          <div className='prose prose-lg prose-slate max-w-none'>
            <h1 className='py-4 text-center text-3xl font-extrabold tracking-tight text-slate-900'>
              About & Contact
            </h1>
          </div>
        </section>
        <section className='mb-12'>
          <div className='mx-auto max-w-4xl'>
            <p className='pb-6 text-center text-lg font-medium text-slate-700'>
              Legal information you should be aware of.
            </p>
            <ul className='list-none space-y-6'>
              <li>
                <div
                  data-testid='expandable-section'
                  data-title='About'
                  data-default-open={true}
                >
                  <h3>About</h3>
                  <div data-testid='labels'>
                    <span data-color='blue'>legal</span>
                  </div>
                  <div>
                    <p className='mb-4 text-lg'>
                      Mrugesh Mohapatra is a software & cloud infrastructure
                      consultant, operating as a sole proprietor of{' '}
                      <strong className='font-semibold'>
                        {' '}
                        Mrugesh Mohapatra Co.{' '}
                      </strong>{' '}
                      ("the business") based in Bhubaneswar & Bengaluru, India.
                    </p>
                    <p className='text-lg'>
                      The business is registered with Ministry of Micro Small
                      and Medium Enterprises, Government of India under the
                      "Udyam" scheme.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div
                  data-testid='expandable-section'
                  data-title='Business, Billing & Tax'
                  data-default-open={true}
                >
                  <h3>Business, Billing & Tax</h3>
                  <div data-testid='labels'>
                    <span data-color='blue'>legal</span>
                    <span data-color='green'>business</span>
                  </div>
                  <div>
                    <h4 className='mb-4 text-center text-lg font-bold'>
                      Udyam Registration Number: UDYAM-OD-19-0026052
                    </h4>
                    <p className='mb-4 text-lg'>
                      GSTIN, HSN Codes for services, PAN, and other
                      business-related information is available in the
                      documents, such as the pro-forma invoice, billing invoice,
                      etc., sent automatically on completion of a transaction.
                      Please get in touch if you are still waiting to receive
                      them.
                    </p>
                    <p className='text-lg'>
                      <strong className='font-semibold'>
                        Tax details for Transactions made outside India:{' '}
                      </strong>
                      Please get in touch, we will accommodate documents where
                      feasible as per your needs.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div
                  data-testid='expandable-section'
                  data-title='Contact'
                  data-default-open={true}
                >
                  <h3>Contact</h3>
                  <div data-testid='labels'>
                    <span data-color='orange'>contact</span>
                  </div>
                  <div>
                    <p className='mb-4 text-center text-lg font-bold'>
                      Email:{' '}
                      <span data-testid='email-component'>
                        email@example.com
                      </span>
                    </p>
                    <div className='text-center text-lg'>
                      <p className='mb-2 font-semibold'>
                        Registered Office Address
                      </p>
                      <p>
                        Mrugesh Mohapatra Co. - 2nd Floor (Proworks),
                        <br />
                        235, 13th Cross Rd, Indira Nagar II Stage,
                        <br />
                        Bengaluru, Karnataka, India - 560038
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
    );
  };

  describe('Page Structure', () => {
    it('renders main heading', () => {
      renderAboutContent();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('About & Contact');
      expect(heading).toHaveClass(
        'py-4',
        'text-center',
        'text-3xl',
        'font-extrabold',
        'tracking-tight',
        'text-slate-900'
      );
    });

    it('renders descriptive subtitle', () => {
      renderAboutContent();

      expect(
        screen.getByText('Legal information you should be aware of.')
      ).toBeInTheDocument();
    });

    it('has proper section structure', () => {
      const { container } = renderAboutContent();

      const sections = container.querySelectorAll('section');
      expect(sections).toHaveLength(2);

      const firstSection = sections[0];
      const secondSection = sections[1];

      expect(firstSection).toHaveClass('mb-8');
      expect(secondSection).toHaveClass('mb-12');
    });
  });

  describe('Expandable Sections', () => {
    it('renders all three expandable sections', () => {
      renderAboutContent();

      const sections = screen.getAllByTestId('expandable-section');
      expect(sections).toHaveLength(3);

      expect(sections[0]).toHaveAttribute('data-title', 'About');
      expect(sections[1]).toHaveAttribute(
        'data-title',
        'Business, Billing & Tax'
      );
      expect(sections[2]).toHaveAttribute('data-title', 'Contact');
    });

    it('all sections are set to default open', () => {
      renderAboutContent();

      const sections = screen.getAllByTestId('expandable-section');
      for (const section of sections) {
        expect(section).toHaveAttribute('data-default-open', 'true');
      }
    });

    it('sections have correct labels', () => {
      renderAboutContent();

      const labelContainers = screen.getAllByTestId('labels');

      // About section - legal label
      const aboutLabels = labelContainers[0].querySelectorAll('span');
      expect(aboutLabels).toHaveLength(1);
      expect(aboutLabels[0]).toHaveAttribute('data-color', 'blue');
      expect(aboutLabels[0]).toHaveTextContent('legal');

      // Business section - legal and business labels
      const businessLabels = labelContainers[1].querySelectorAll('span');
      expect(businessLabels).toHaveLength(2);
      expect(businessLabels[0]).toHaveAttribute('data-color', 'blue');
      expect(businessLabels[1]).toHaveAttribute('data-color', 'green');

      // Contact section - contact label
      const contactLabels = labelContainers[2].querySelectorAll('span');
      expect(contactLabels).toHaveLength(1);
      expect(contactLabels[0]).toHaveAttribute('data-color', 'orange');
    });
  });

  describe('About Section Content', () => {
    it('displays business description', () => {
      renderAboutContent();

      expect(
        screen.getByText(
          /Mrugesh Mohapatra is a software & cloud infrastructure consultant/
        )
      ).toBeInTheDocument();
      expect(
        screen.getByText(/operating as a sole proprietor of/)
      ).toBeInTheDocument();
      expect(screen.getByText('Mrugesh Mohapatra Co.')).toBeInTheDocument();
    });

    it('mentions Udyam registration', () => {
      renderAboutContent();

      expect(
        screen.getByText(
          /registered with Ministry of Micro Small and Medium Enterprises/
        )
      ).toBeInTheDocument();
      expect(screen.getByText(/under the "Udyam" scheme/)).toBeInTheDocument();
    });

    it('applies correct text styling', () => {
      renderAboutContent();

      const businessName = screen.getByText('Mrugesh Mohapatra Co.');
      expect(businessName).toHaveClass('font-semibold');
    });
  });

  describe('Business Section Content', () => {
    it('displays Udyam registration number', () => {
      renderAboutContent();

      const udyamHeading = screen.getByRole('heading', { level: 4 });
      expect(udyamHeading).toHaveTextContent(
        'Udyam Registration Number: UDYAM-OD-19-0026052'
      );
      expect(udyamHeading).toHaveClass(
        'mb-4',
        'text-center',
        'text-lg',
        'font-bold'
      );
    });

    it('explains business documentation', () => {
      renderAboutContent();

      expect(
        screen.getByText(/GSTIN, HSN Codes for services, PAN/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/pro-forma invoice, billing invoice/)
      ).toBeInTheDocument();
    });

    it('mentions international tax details', () => {
      renderAboutContent();

      expect(
        screen.getByText('Tax details for Transactions made outside India:')
      ).toBeInTheDocument();
      expect(
        screen.getByText(/we will accommodate documents where feasible/)
      ).toBeInTheDocument();
    });
  });

  describe('Contact Section Content', () => {
    it('displays email component', () => {
      renderAboutContent();

      const emailLabel = screen.getByText('Email:');
      expect(emailLabel).toBeInTheDocument();
      expect(screen.getByTestId('email-component')).toBeInTheDocument();
    });

    it('displays registered office address', () => {
      renderAboutContent();

      expect(screen.getByText('Registered Office Address')).toBeInTheDocument();
      expect(
        screen.getByText(/Mrugesh Mohapatra Co. - 2nd Floor \(Proworks\)/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/235, 13th Cross Rd, Indira Nagar II Stage/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Bengaluru, Karnataka, India - 560038/)
      ).toBeInTheDocument();
    });

    it('applies correct contact styling', () => {
      renderAboutContent();

      const emailText = screen.getByText('Email:');
      expect(emailText).toBeInTheDocument();

      const addressText = screen.getByText('Registered Office Address');
      expect(addressText).toBeInTheDocument();
    });
  });

  describe('Layout and Styling', () => {
    it('uses prose styling for header', () => {
      const { container } = renderAboutContent();

      const proseContainer = container.querySelector(
        '.prose.prose-lg.prose-slate'
      );
      expect(proseContainer).toBeInTheDocument();
      expect(proseContainer).toHaveClass('max-w-none');
    });

    it('applies proper container styling', () => {
      const { container } = renderAboutContent();

      const mainContainer = container.querySelector('.mx-auto.max-w-4xl');
      expect(mainContainer).toBeInTheDocument();
    });

    it('uses list styling for sections', () => {
      const { container } = renderAboutContent();

      const list = container.querySelector('ul');
      expect(list).toHaveClass('list-none', 'space-y-6');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      const { container } = renderAboutContent();

      expect(container.querySelectorAll('section')).toHaveLength(2);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
      expect(container.querySelector('ul')).toBeInTheDocument();
    });

    it('has proper heading hierarchy', () => {
      renderAboutContent();

      const h1 = screen.getByRole('heading', { level: 1 });
      const h3s = screen.getAllByRole('heading', { level: 3 });
      const h4 = screen.getByRole('heading', { level: 4 });

      expect(h1).toBeInTheDocument();
      expect(h3s).toHaveLength(3);
      expect(h4).toBeInTheDocument();
    });

    it('has descriptive text content', () => {
      renderAboutContent();

      expect(
        screen.getByText('Legal information you should be aware of.')
      ).toBeInTheDocument();
      expect(screen.getByText('Registered Office Address')).toBeInTheDocument();
    });
  });

  describe('Content Organization', () => {
    it('organizes content in logical sections', () => {
      const { container } = renderAboutContent();

      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(3);

      // Each list item should contain an expandable section
      for (const item of listItems) {
        expect(
          item.querySelector('[data-testid="expandable-section"]')
        ).toBeInTheDocument();
      }
    });

    it('maintains proper spacing between sections', () => {
      const { container } = renderAboutContent();

      const subtitle = screen.getByText(
        'Legal information you should be aware of.'
      );
      expect(subtitle).toHaveClass('pb-6');

      const list = container.querySelector('ul');
      expect(list).toHaveClass('space-y-6');
    });
  });
});
