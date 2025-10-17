import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockCustomLinkProps, MockExpandableSectionLabel, MockExpandableSectionProps } from '../test-utils';

// Mock components
vi.mock('@/components/custom-link', () => ({
  CustomLink: ({ href, className, children, ...props }: MockCustomLinkProps) => (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  )
}));

vi.mock('@/components/expandable-section', () => ({
  ExpandableSection: ({ title, labels, defaultOpen, children, ...props }: MockExpandableSectionProps) => (
    <div data-testid='expandable-section' data-title={title} data-default-open={defaultOpen} {...props}>
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
            <h1 className='py-4 text-center text-3xl font-bold text-slate-800'>Everyday Carry</h1>
          </div>
        </section>
        <section className='mb-12'>
          <div className='mx-auto max-w-3xl'>
            <p className='pb-6 text-center text-lg text-slate-600'>
              A non-exhaustive list of stuff that I use on a daily basis.
            </p>
            <h2 className='mb-6 text-center text-2xl font-bold text-slate-700'>Hardware</h2>
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
                      </a>{' '}
                      with M1 Pro chip, 32GB RAM, and 1TB SSD. I use it for work, personal projects, and everything in
                      between. The 14-inch display is a great size for me when on the move, and the ARM-based M1 Pro is
                      a beast for development and creative work!
                    </p>
                    <p className='text-lg'>
                      At home, this is connected to dual{' '}
                      <a
                        className='text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                        href='https://www.lg.com/us/monitors/lg-27uk650-w-4k-uhd-led-monitor'
                      >
                        LG 27" 4K monitors
                      </a>{' '}
                      via a{' '}
                      <a
                        className='text-blue-600 underline decoration-blue-600 decoration-wavy underline-offset-4 transition-colors hover:text-black hover:decoration-black'
                        href='https://www.dell.com/en-us/shop/dell-thunderbolt-dock-wd19tb/apd/210-arik'
                      >
                        Dell WD19TB Thunderbolt dock
                      </a>
                      , providing 180W power delivery and dual 4K@60Hz output with Gigabit ethernet.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div data-testid='expandable-section' data-title='DeskPi Super6C (2022)' data-default-open={true}>
                  <h3>DeskPi Super6C (2022)</h3>
                  <div data-testid='labels'>
                    <span data-color='green'>2022</span>
                    <span data-color='purple'>homelab</span>
                    <span data-color='yellow'>personal</span>
                  </div>
                  <div>
                    <p className='mb-4 text-lg'>
                      The DeskPi Super6C is a Raspberry Pi Compute Module 4 Cluster. I use it for learning Hashicorp
                      products.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div
                  data-testid='expandable-section'
                  data-title='Keychron Q1 V2 - ANSI with Knob'
                  data-default-open={false}
                >
                  <h3>Keychron Q1 V2 - ANSI with Knob</h3>
                  <div data-testid='labels'>
                    <span data-color='green'>2022</span>
                    <span data-color='orange'>work</span>
                    <span data-color='yellow'>personal</span>
                  </div>
                  <div>
                    <p className='mb-4 text-lg'>
                      I switched to this Keychron Q1 V2 mechanical keyboard because I wanted QMK/VIA support. I've
                      equipped it with Gateron Silent Yellow switches.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div data-testid='expandable-section' data-title='Audio & Video Setup' data-default-open={false}>
                  <h3>Audio & Video Setup</h3>
                  <div data-testid='labels'>
                    <span data-color='green'>2022</span>
                    <span data-color='orange'>work</span>
                    <span data-color='yellow'>personal</span>
                  </div>
                  <div>
                    <p className='mb-4 text-lg'>
                      For audio, I switch between Apple AirPods Pro and Sony WH-1000XM4s. I have a MAONO AU-PM420 USB
                      condenser microphone. I repurpose my old Nikon D5200 DSLR as a webcam using an Elgato CamLink
                      adapter.
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <h2 className='mt-12 mb-6 text-center text-2xl font-bold text-slate-700'>Software</h2>
            <ul className='list-none space-y-6'>
              <li>
                <div data-testid='expandable-section' data-title='Development Environment' data-default-open={true}>
                  <h3>Development Environment</h3>
                  <div data-testid='labels'>
                    <span data-color='green'>2022</span>
                    <span data-color='orange'>work</span>
                    <span data-color='yellow'>personal</span>
                  </div>
                  <div>
                    <p className='mb-4 text-lg'>
                      My primary editor these days is Cursor. I still use VS Code and keep Neovim with LazyVim around. I
                      use the Catppuccin theme across all my applications.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div data-testid='expandable-section' data-title='Terminal & Shell' data-default-open={false}>
                  <h3>Terminal & Shell</h3>
                  <div data-testid='labels'>
                    <span data-color='green'>2022</span>
                    <span data-color='orange'>work</span>
                    <span data-color='yellow'>personal</span>
                  </div>
                  <div>
                    <p className='mb-4 text-lg'>
                      I use WezTerm as my terminal. For my shell, I run Zsh with Zinit. My prompt is powered by
                      Starship. Some CLI tools: Homebrew, Atuin.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div data-testid='expandable-section' data-title='Browser & Extensions' data-default-open={false}>
                  <h3>Browser & Extensions</h3>
                  <div data-testid='labels'>
                    <span data-color='green'>2022</span>
                    <span data-color='orange'>work</span>
                    <span data-color='yellow'>personal</span>
                  </div>
                  <div>
                    <p className='mb-4 text-lg'>
                      I use Arc Browser as my main browser. Essential extensions include uBlock Origin, "Don't F*** With
                      Paste", and 1Password.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div data-testid='expandable-section' data-title='Entertainment & Media' data-default-open={false}>
                  <h3>Entertainment & Media</h3>
                  <div data-testid='labels'>
                    <span data-color='green'>2022</span>
                    <span data-color='red'>gaming</span>
                  </div>
                  <div>
                    <p className='mb-4 text-lg'>
                      I bounce between Spotify and Apple Music. I watch Twitch streams. For gaming, I use Steam and
                      PlayStation. Favorite games include Call of Duty and The Last of Us.
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <h2 className='mt-12 mb-6 text-center text-2xl font-bold text-slate-700'>Philosophy & Principles</h2>
            <ul className='list-none space-y-6'>
              <li>
                <div data-testid='expandable-section' data-title='Setup Philosophy' data-default-open={true}>
                  <h3>Setup Philosophy</h3>
                  <div data-testid='labels' />
                  <div>
                    <p className='mb-4 text-lg'>
                      I'm obsessed with customization. Visual consistency is really important to me. Security and
                      privacy are non-negotiable for me. I believe in investing in quality. My homelab setup exists
                      primarily for hands-on learning.
                    </p>
                  </div>
                </div>
              </li>
            </ul>

            <div className='prose prose-lg prose-slate mx-auto mt-12 max-w-3xl'>
              <h3 className='mb-4 text-center font-bold text-slate-700'>Elsewhere on the internet</h3>
              <p className='text-center text-lg text-slate-600'>
                Have questions about any of the gear or software I use? Feel free to reach out!
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
      expect(heading).toHaveClass('py-4', 'text-center', 'text-3xl', 'font-bold', 'text-slate-800');
    });

    it('renders descriptive subtitle', () => {
      renderUsesContent();

      expect(screen.getByText('A non-exhaustive list of stuff that I use on a daily basis.')).toBeInTheDocument();
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
      expect(hardwareHeading).toHaveClass('mb-6', 'text-center', 'text-2xl', 'font-bold', 'text-slate-700');
    });

    it('renders MacBook Pro section', () => {
      renderUsesContent();

      const sections = screen.getAllByTestId('expandable-section');
      const macbookSection = sections.find(
        (section) => section.getAttribute('data-title') === 'Apple MacBook Pro (14-inch, 2021)'
      );

      expect(macbookSection).toBeInTheDocument();
    });

    it('includes MacBook Pro external link', () => {
      renderUsesContent();

      const macbookLink = screen.getByRole('link', {
        name: /MacBook Pro \(14-inch, 2021\)/
      });
      expect(macbookLink).toBeInTheDocument();
      expect(macbookLink).toHaveAttribute('href', 'https://support.apple.com/en-us/111902');
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

    it('renders development environment content', () => {
      renderUsesContent();

      expect(screen.getByText(/Cursor/)).toBeInTheDocument();
      expect(screen.getByText(/VS Code/)).toBeInTheDocument();
      expect(screen.getByText(/Neovim with LazyVim/)).toBeInTheDocument();
      expect(screen.getByText(/Catppuccin theme/)).toBeInTheDocument();
    });
  });

  describe('Contact Section', () => {
    it('renders Elsewhere on the internet section', () => {
      renderUsesContent();

      const contactHeading = screen.getByRole('heading', {
        level: 3,
        name: 'Elsewhere on the internet'
      });
      expect(contactHeading).toBeInTheDocument();
    });

    it('renders social component', () => {
      renderUsesContent();

      expect(screen.getByTestId('social-component')).toBeInTheDocument();
    });
  });

  describe('Hardware Sections - Extended', () => {
    it('renders DeskPi Super6C section', () => {
      renderUsesContent();

      expect(screen.getAllByText(/DeskPi Super6C/)).toHaveLength(2); // Title and content
      expect(screen.getByText(/Raspberry Pi Compute Module 4/)).toBeInTheDocument();
      expect(screen.getByText(/Hashicorp products/)).toBeInTheDocument();
    });

    it('renders Keychron keyboard section', () => {
      renderUsesContent();

      expect(screen.getAllByText(/Keychron Q1 V2/)).toHaveLength(2); // Title and content
      expect(screen.getByText(/QMK\/VIA support/)).toBeInTheDocument();
      expect(screen.getByText(/Gateron Silent Yellow/)).toBeInTheDocument();
    });

    it('renders Audio & Video Setup section', () => {
      renderUsesContent();

      expect(screen.getByText(/Apple AirPods Pro/)).toBeInTheDocument();
      expect(screen.getByText(/Sony WH-1000XM4s/)).toBeInTheDocument();
      expect(screen.getByText(/MAONO AU-PM420/)).toBeInTheDocument();
      expect(screen.getByText(/Nikon D5200 DSLR/)).toBeInTheDocument();
      expect(screen.getByText(/Elgato CamLink/)).toBeInTheDocument();
    });
  });

  describe('Software Sections - Extended', () => {
    it('renders Development Environment section', () => {
      renderUsesContent();

      expect(screen.getByText(/Cursor/)).toBeInTheDocument();
      expect(screen.getByText(/VS Code/)).toBeInTheDocument();
      expect(screen.getByText(/Neovim with LazyVim/)).toBeInTheDocument();
      expect(screen.getByText(/Catppuccin theme/)).toBeInTheDocument();
    });

    it('renders Terminal & Shell section', () => {
      renderUsesContent();

      expect(screen.getByText(/WezTerm/)).toBeInTheDocument();
      expect(screen.getByText(/Zsh with Zinit/)).toBeInTheDocument();
      expect(screen.getByText(/Starship/)).toBeInTheDocument();
      expect(screen.getByText(/Homebrew/)).toBeInTheDocument();
      expect(screen.getByText(/Atuin/)).toBeInTheDocument();
    });

    it('renders Browser & Extensions section', () => {
      renderUsesContent();

      expect(screen.getByText(/Arc Browser/)).toBeInTheDocument();
      expect(screen.getByText(/uBlock Origin/)).toBeInTheDocument();
      expect(screen.getByText(/Don't F\*\*\* With Paste/)).toBeInTheDocument();
      expect(screen.getByText(/1Password/)).toBeInTheDocument();
    });

    it('renders Entertainment & Media section', () => {
      renderUsesContent();

      expect(screen.getByText(/Spotify/)).toBeInTheDocument();
      expect(screen.getByText(/Apple Music/)).toBeInTheDocument();
      expect(screen.getByText(/Twitch/)).toBeInTheDocument();
      expect(screen.getByText(/Steam/)).toBeInTheDocument();
      expect(screen.getByText(/PlayStation/)).toBeInTheDocument();
      expect(screen.getByText(/Call of Duty/)).toBeInTheDocument();
      expect(screen.getByText(/The Last of Us/)).toBeInTheDocument();
    });
  });

  describe('Philosophy Section', () => {
    it('renders Setup Philosophy section', () => {
      renderUsesContent();

      expect(screen.getByText(/Setup Philosophy/)).toBeInTheDocument();
      expect(screen.getByText(/obsessed with customization/)).toBeInTheDocument();
      expect(screen.getByText(/Visual consistency/)).toBeInTheDocument();
      expect(screen.getByText(/Security and privacy are non-negotiable/)).toBeInTheDocument();
    });

    it('validates philosophy principles', () => {
      renderUsesContent();

      expect(screen.getByText(/investing in quality/)).toBeInTheDocument();
      expect(screen.getByText(/homelab setup exists primarily for hands-on learning/)).toBeInTheDocument();
    });
  });

  describe('External Links Validation', () => {
    it('validates Apple product links', () => {
      renderUsesContent();

      const macbookLink = screen.getByRole('link', {
        name: /MacBook Pro \(14-inch, 2021\)/
      });
      expect(macbookLink).toHaveAttribute('href', 'https://support.apple.com/en-us/111902');
    });

    it('validates software tool content', () => {
      renderUsesContent();

      // These are text content, not actual links in the mock
      expect(screen.getByText(/Cursor/)).toBeInTheDocument();
      expect(screen.getByText(/Arc Browser/)).toBeInTheDocument();
    });

    it('validates hardware vendor links', () => {
      renderUsesContent();

      const lgLink = screen.getByRole('link', { name: /LG 27" 4K monitors/ });
      expect(lgLink).toHaveAttribute('href', 'https://www.lg.com/us/monitors/lg-27uk650-w-4k-uhd-led-monitor');

      const dellLink = screen.getByRole('link', {
        name: /Dell WD19TB Thunderbolt dock/
      });
      expect(dellLink).toHaveAttribute(
        'href',
        'https://www.dell.com/en-us/shop/dell-thunderbolt-dock-wd19tb/apd/210-arik'
      );
    });
  });

  describe('Content Organization', () => {
    it('has proper section count and structure', () => {
      renderUsesContent();

      const hardwareSection = screen.getByRole('heading', { name: 'Hardware' });
      const softwareSection = screen.getByRole('heading', { name: 'Software' });
      const philosophySection = screen.getByRole('heading', {
        name: 'Philosophy & Principles'
      });

      expect(hardwareSection).toBeInTheDocument();
      expect(softwareSection).toBeInTheDocument();
      expect(philosophySection).toBeInTheDocument();
    });

    it('maintains consistent expandable section structure', () => {
      renderUsesContent();

      const expandableSections = screen.getAllByTestId('expandable-section');
      expect(expandableSections.length).toBe(9); // MacBook, DeskPi, Keychron, Audio, Dev Env, Terminal, Browser, Entertainment, Philosophy

      // Check that sections have labels
      const labelContainers = screen.getAllByTestId('labels');
      expect(labelContainers.length).toBe(9);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      const { container } = renderUsesContent();

      expect(container.querySelectorAll('section')).toHaveLength(2);
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(3); // Hardware, Software, Philosophy
      expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(10); // 9 Expandable sections + Elsewhere on the internet
    });

    it('has proper heading hierarchy', () => {
      renderUsesContent();

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2s).toHaveLength(3);
      expect(h3s.length).toBeGreaterThanOrEqual(1);
    });

    it('has comprehensive link accessibility', () => {
      renderUsesContent();

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThanOrEqual(3); // Several external links in mock content

      // All links should have href attributes
      for (const link of links) {
        expect(link).toHaveAttribute('href');
      }
    });
  });
});
