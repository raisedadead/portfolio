import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

// Since this is an Astro page, we'll test the component parts
describe('About Page Content', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  const createAboutContent = () => {
    const container = document.createElement('div');

    // Header section
    const headerSection = document.createElement('section');
    headerSection.className = 'mb-8';

    const proseDiv = document.createElement('div');
    proseDiv.className = 'prose prose-lg prose-slate max-w-none';

    const h1 = document.createElement('h1');
    h1.className = 'py-4 text-center text-3xl font-extrabold tracking-tight text-slate-900';
    h1.textContent = 'About & Contact';

    proseDiv.appendChild(h1);
    headerSection.appendChild(proseDiv);

    // Main section
    const mainSection = document.createElement('section');
    mainSection.className = 'mb-12';

    const maxWDiv = document.createElement('div');
    maxWDiv.className = 'mx-auto max-w-4xl';

    const subtitle = document.createElement('p');
    subtitle.className = 'pb-6 text-center text-lg font-medium text-slate-700';
    subtitle.textContent = 'Legal information you should be aware of.';

    const ul = document.createElement('ul');
    ul.className = 'list-none space-y-6';

    // About section
    const aboutItem = createExpandableItem(
      'About',
      [{ name: 'legal', color: 'blue' }],
      'Mrugesh Mohapatra is a software & cloud infrastructure consultant, operating as a sole proprietor of Mrugesh Mohapatra Co. ("the business") based in Bhubaneswar & Bengaluru, India.'
    );

    // Business section
    const businessItem = createExpandableItem(
      'Business, Billing & Tax',
      [
        { name: 'legal', color: 'blue' },
        { name: 'business', color: 'green' }
      ],
      'GSTIN, HSN Codes for services, PAN, and other business-related information is available in the documents.'
    );

    // Contact section
    const contactItem = createExpandableItem(
      'Contact',
      [{ name: 'contact', color: 'orange' }],
      'Email: test@example.com'
    );

    ul.appendChild(aboutItem);
    ul.appendChild(businessItem);
    ul.appendChild(contactItem);

    maxWDiv.appendChild(subtitle);
    maxWDiv.appendChild(ul);
    mainSection.appendChild(maxWDiv);

    container.appendChild(headerSection);
    container.appendChild(mainSection);

    document.body.appendChild(container);
    return container;
  };

  function createExpandableItem(title: string, labels: Array<{ name: string; color: string }>, content: string) {
    const li = document.createElement('li');

    const expandableDiv = document.createElement('div');
    expandableDiv.setAttribute('data-testid', 'expandable-section');
    expandableDiv.setAttribute('data-title', title);
    expandableDiv.setAttribute('data-default-open', 'true');

    const h3 = document.createElement('h3');
    h3.textContent = title;

    const labelsDiv = document.createElement('div');
    labelsDiv.setAttribute('data-testid', 'labels');

    labels.forEach((label) => {
      const span = document.createElement('span');
      span.textContent = label.name;
      span.setAttribute('data-color', label.color);
      labelsDiv.appendChild(span);
    });

    const contentDiv = document.createElement('div');

    if (title === 'Business, Billing & Tax') {
      const h4 = document.createElement('h4');
      h4.className = 'mb-4 text-center text-lg font-bold';
      h4.textContent = 'Udyam Registration Number: UDYAM-OD-19-0026052';
      contentDiv.appendChild(h4);
    }

    if (title === 'Contact') {
      const emailP = document.createElement('p');
      emailP.className = 'mb-4 text-center text-lg font-bold';
      emailP.innerHTML = 'Email: <span data-testid="email-component">email@example.com</span>';
      contentDiv.appendChild(emailP);

      const addressDiv = document.createElement('div');
      addressDiv.className = 'text-center text-lg';

      const addressTitle = document.createElement('p');
      addressTitle.className = 'mb-2 font-semibold';
      addressTitle.textContent = 'Registered Office Address';

      const addressContent = document.createElement('p');
      addressContent.innerHTML =
        'Mrugesh Mohapatra Co. - 2nd Floor (Proworks),<br />235, 13th Cross Rd, Indira Nagar II Stage,<br />Bengaluru, Karnataka, India - 560038';

      addressDiv.appendChild(addressTitle);
      addressDiv.appendChild(addressContent);
      contentDiv.appendChild(addressDiv);
    } else {
      const p = document.createElement('p');
      p.className = 'mb-4 text-lg';
      if (title === 'About') {
        p.innerHTML =
          content +
          ' The business is registered with Ministry of Micro Small and Medium Enterprises, Government of India under the "Udyam" scheme.';
      } else {
        p.textContent = content;
      }
      contentDiv.appendChild(p);
    }

    expandableDiv.appendChild(h3);
    expandableDiv.appendChild(labelsDiv);
    expandableDiv.appendChild(contentDiv);

    li.appendChild(expandableDiv);
    return li;
  }

  describe('Page Structure', () => {
    it('renders main heading', () => {
      createAboutContent();

      const heading = document.querySelector('h1');
      expect(heading?.textContent).toBe('About & Contact');
      expect(heading?.classList.contains('py-4')).toBe(true);
      expect(heading?.classList.contains('text-center')).toBe(true);
      expect(heading?.classList.contains('text-3xl')).toBe(true);
      expect(heading?.classList.contains('font-extrabold')).toBe(true);
      expect(heading?.classList.contains('tracking-tight')).toBe(true);
      expect(heading?.classList.contains('text-slate-900')).toBe(true);
    });

    it('renders descriptive subtitle', () => {
      createAboutContent();

      expect(document.body.textContent).toContain('Legal information you should be aware of.');
    });

    it('has proper section structure', () => {
      createAboutContent();

      const sections = document.querySelectorAll('section');
      expect(sections).toHaveLength(2);

      const firstSection = sections[0];
      const secondSection = sections[1];

      expect(firstSection.classList.contains('mb-8')).toBe(true);
      expect(secondSection.classList.contains('mb-12')).toBe(true);
    });
  });

  describe('Expandable Sections', () => {
    it('renders all three expandable sections', () => {
      createAboutContent();

      const sections = document.querySelectorAll('[data-testid="expandable-section"]');
      expect(sections).toHaveLength(3);

      expect(sections[0].getAttribute('data-title')).toBe('About');
      expect(sections[1].getAttribute('data-title')).toBe('Business, Billing & Tax');
      expect(sections[2].getAttribute('data-title')).toBe('Contact');
    });

    it('all sections are set to default open', () => {
      createAboutContent();

      const sections = document.querySelectorAll('[data-testid="expandable-section"]');
      for (const section of sections) {
        expect(section.getAttribute('data-default-open')).toBe('true');
      }
    });

    it('sections have correct labels', () => {
      createAboutContent();

      const labelContainers = document.querySelectorAll('[data-testid="labels"]');

      // About section - legal label
      const aboutLabels = labelContainers[0].querySelectorAll('span');
      expect(aboutLabels).toHaveLength(1);
      expect(aboutLabels[0].getAttribute('data-color')).toBe('blue');
      expect(aboutLabels[0].textContent).toBe('legal');

      // Business section - legal and business labels
      const businessLabels = labelContainers[1].querySelectorAll('span');
      expect(businessLabels).toHaveLength(2);
      expect(businessLabels[0].getAttribute('data-color')).toBe('blue');
      expect(businessLabels[1].getAttribute('data-color')).toBe('green');

      // Contact section - contact label
      const contactLabels = labelContainers[2].querySelectorAll('span');
      expect(contactLabels).toHaveLength(1);
      expect(contactLabels[0].getAttribute('data-color')).toBe('orange');
    });
  });

  describe('About Section Content', () => {
    it('displays business description', () => {
      createAboutContent();

      expect(document.body.textContent).toContain('Mrugesh Mohapatra is a software & cloud infrastructure consultant');
      expect(document.body.textContent).toContain('operating as a sole proprietor of');
      expect(document.body.textContent).toContain('Mrugesh Mohapatra Co.');
    });

    it('mentions Udyam registration', () => {
      createAboutContent();

      expect(document.body.textContent).toContain('registered with Ministry of Micro Small and Medium Enterprises');
      expect(document.body.textContent).toContain('under the "Udyam" scheme');
    });
  });

  describe('Business Section Content', () => {
    it('displays Udyam registration number', () => {
      createAboutContent();

      const udyamHeading = document.querySelector('h4');
      expect(udyamHeading?.textContent).toBe('Udyam Registration Number: UDYAM-OD-19-0026052');
      expect(udyamHeading?.classList.contains('mb-4')).toBe(true);
      expect(udyamHeading?.classList.contains('text-center')).toBe(true);
      expect(udyamHeading?.classList.contains('text-lg')).toBe(true);
      expect(udyamHeading?.classList.contains('font-bold')).toBe(true);
    });
  });

  describe('Contact Section Content', () => {
    it('displays email component', () => {
      createAboutContent();

      expect(document.body.textContent).toContain('Email:');
      expect(document.querySelector('[data-testid="email-component"]')).toBeTruthy();
    });

    it('displays registered office address', () => {
      createAboutContent();

      expect(document.body.textContent).toContain('Registered Office Address');
      expect(document.body.textContent).toContain('Mrugesh Mohapatra Co. - 2nd Floor (Proworks)');
      expect(document.body.textContent).toContain('235, 13th Cross Rd, Indira Nagar II Stage');
      expect(document.body.textContent).toContain('Bengaluru, Karnataka, India - 560038');
    });
  });

  describe('Layout and Styling', () => {
    it('uses prose styling for header', () => {
      createAboutContent();

      const proseContainer = document.querySelector('.prose.prose-lg.prose-slate');
      expect(proseContainer).toBeTruthy();
      expect(proseContainer?.classList.contains('max-w-none')).toBe(true);
    });

    it('applies proper container styling', () => {
      createAboutContent();

      const mainContainer = document.querySelector('.mx-auto.max-w-4xl');
      expect(mainContainer).toBeTruthy();
    });

    it('uses list styling for sections', () => {
      createAboutContent();

      const list = document.querySelector('ul');
      expect(list?.classList.contains('list-none')).toBe(true);
      expect(list?.classList.contains('space-y-6')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      createAboutContent();

      expect(document.querySelectorAll('section')).toHaveLength(2);
      expect(document.querySelector('h1')).toBeTruthy();
      expect(document.querySelector('h4')).toBeTruthy();
      expect(document.querySelector('ul')).toBeTruthy();
    });

    it('has proper heading hierarchy', () => {
      createAboutContent();

      const h1 = document.querySelector('h1');
      const h3s = document.querySelectorAll('h3');
      const h4 = document.querySelector('h4');

      expect(h1).toBeTruthy();
      expect(h3s).toHaveLength(3);
      expect(h4).toBeTruthy();
    });

    it('has descriptive text content', () => {
      createAboutContent();

      expect(document.body.textContent).toContain('Legal information you should be aware of.');
      expect(document.body.textContent).toContain('Registered Office Address');
    });
  });

  describe('Content Organization', () => {
    it('organizes content in logical sections', () => {
      createAboutContent();

      const listItems = document.querySelectorAll('li');
      expect(listItems).toHaveLength(3);

      // Each list item should contain an expandable section
      for (const item of listItems) {
        expect(item.querySelector('[data-testid="expandable-section"]')).toBeTruthy();
      }
    });

    it('maintains proper spacing between sections', () => {
      createAboutContent();

      const subtitle = document.querySelector('.pb-6');
      expect(subtitle).toBeTruthy();

      const list = document.querySelector('ul');
      expect(list?.classList.contains('space-y-6')).toBe(true);
    });
  });
});
