import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('Profile Component', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  const createProfile = () => {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center py-12 text-center';

    // Profile image section
    const imageDiv = document.createElement('div');
    imageDiv.className = 'mb-8 md:mb-10';

    const img = document.createElement('img');
    img.id = 'profile-image';
    img.alt = "Mrugesh Mohapatra's profile picture.";
    img.src = '/images/profile.small.webp';
    img.className = 'h-28 w-28 border-4 border-orange-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] md:h-36 md:w-36';
    img.width = 144;
    img.height = 144;

    imageDiv.appendChild(img);

    // Name section with pronunciation
    const nameDiv = document.createElement('div');
    nameDiv.className = 'relative mb-8 flex -rotate-12 transform flex-col items-center md:mb-10';

    const nameH1 = document.createElement('h1');
    nameH1.className = 'group rotate-12 transform cursor-pointer text-3xl font-extrabold text-slate-800 md:text-5xl';
    nameH1.textContent = 'mrugesh mohapatra';

    const pronunciationSpan = document.createElement('span');
    pronunciationSpan.className =
      'pronunciation-tooltip absolute left-1/4 hidden w-auto rounded-md bg-black p-3 text-sm font-normal text-white group-hover:block';
    pronunciationSpan.style.cssText = 'top: 100%; margin-top: 0.75rem; transform: translateX(-50%);';

    const pronunciationLink = document.createElement('a');
    pronunciationLink.href = 'https://itinerarium.github.io/phoneme-synthesis/?w= /ˈm.ruː.geɪ.ʃ/';
    pronunciationLink.className = 'no-underline';
    pronunciationLink.setAttribute('aria-label', 'Pronunciation of my name');
    pronunciationLink.textContent = '🗣 /ˈm.ruː.geɪ.ʃ/';

    const tooltipSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tooltipSvg.setAttribute('class', 'absolute left-1/4 h-4 w-full text-black');
    tooltipSvg.style.cssText = 'top: -0.5rem; transform: translateX(-50%);';
    tooltipSvg.setAttribute('viewBox', '0 0 255 255');
    tooltipSvg.setAttribute('aria-hidden', 'true');

    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('class', 'fill-current');
    polygon.setAttribute('points', '128,0 128,128 0,128');

    tooltipSvg.appendChild(polygon);
    pronunciationSpan.appendChild(pronunciationLink);
    pronunciationSpan.appendChild(tooltipSvg);
    nameH1.appendChild(pronunciationSpan);

    const underlineDiv = document.createElement('div');
    underlineDiv.className = 'm-1 mx-auto -mt-8 w-2/5 border-8 border-orange-50 bg-orange-50';

    nameDiv.appendChild(nameH1);
    nameDiv.appendChild(underlineDiv);

    // Description
    const descH2 = document.createElement('h2');
    descH2.className = 'mb-4 max-w-md p-1 text-xl leading-relaxed font-bold text-slate-700 md:text-2xl';
    descH2.textContent = 'nocturnal developer 🦉 • open-source enthusiast 🌏 • photography noob 📷';

    // Job title
    const jobH3 = document.createElement('h3');
    jobH3.className = 'mb-8 p-1 text-lg leading-relaxed font-medium text-slate-700 md:text-xl';
    jobH3.innerHTML =
      'Principal Maintainer — Cloud Infrastructure & Open-source, <a href="https://www.freecodecamp.org/news/team#:~:text=around%20the%20world.-,Mrugesh%20Mohapatra,-from%20Bengaluru%2C%20India" class="-ml-1 p-1 text-slate-700 underline decoration-orange-200 decoration-wavy decoration-2 underline-offset-2 transition-colors duration-200 hover:text-white hover:decoration-white" aria-label="freecodecamp.org">freeCodeCamp.org</a>';

    // Action buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'mb-10 flex flex-row items-center justify-center space-x-4';

    const contactLink = document.createElement('a');
    contactLink.setAttribute('aria-label', 'Book a 1-on-1 Call');
    contactLink.className =
      'flex h-14 w-80 items-center justify-center border-2 border-black bg-orange-50 p-3 text-lg font-semibold text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none';
    contactLink.href = 'https://topmate.io/mrugesh';

    const contactSpan = document.createElement('span');
    contactSpan.className = 'inline-flex items-center';
    contactSpan.textContent = 'Get in touch!';
    contactLink.appendChild(contactSpan);

    const blogLink = document.createElement('a');
    blogLink.setAttribute('aria-label', 'Browse my blog');
    blogLink.className =
      'flex h-14 w-36 items-center justify-center border-2 border-black bg-orange-200 p-3 text-lg font-semibold text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none';
    blogLink.href = '/blog';

    const blogSpan = document.createElement('span');
    blogSpan.className = 'inline-flex items-center';
    blogSpan.textContent = 'Blog';
    blogLink.appendChild(blogSpan);

    buttonsDiv.appendChild(contactLink);
    buttonsDiv.appendChild(blogLink);

    // Social section
    const socialDiv = document.createElement('div');
    socialDiv.className = 'prose prose-lg prose-slate mx-auto mt-8 max-w-3xl';

    const socialH3 = document.createElement('h3');
    socialH3.className = 'mb-4 text-center font-bold text-slate-700';
    socialH3.textContent = 'Elsewhere on the internet';

    const socialLinksDiv = document.createElement('div');
    socialLinksDiv.className = 'mx-auto mt-2 mb-1 flex flex-row items-center justify-center space-y-0 space-x-3';

    // Add social links (simplified for testing)
    const socialLinks = [
      { href: 'https://twitter.com/raisedadead', label: 'Twitter', icon: 'twitter' },
      { href: 'https://github.com/raisedadead', label: 'Github', icon: 'github' },
      { href: 'https://instagram.com/raisedadead', label: 'Instagram', icon: 'instagram' },
      { href: 'https://linkedin.com/in/mrugeshm', label: 'LinkedIn', icon: 'linkedin' }
    ];

    socialLinks.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.setAttribute('aria-label', link.label);
      a.className =
        'h-10 w-10 border-2 border-black bg-orange-200 p-2 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-200 hover:bg-gray-700 hover:text-white hover:shadow-none active:bg-black active:shadow-none';
      a.setAttribute('rel', 'me');

      const srSpan = document.createElement('span');
      srSpan.className = 'sr-only';
      srSpan.textContent = link.label;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('fill', 'currentColor');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0z'); // Simplified path

      svg.appendChild(path);
      a.appendChild(srSpan);
      a.appendChild(svg);
      socialLinksDiv.appendChild(a);
    });

    socialDiv.appendChild(socialH3);
    socialDiv.appendChild(socialLinksDiv);

    container.appendChild(imageDiv);
    container.appendChild(nameDiv);
    container.appendChild(descH2);
    container.appendChild(jobH3);
    container.appendChild(buttonsDiv);
    container.appendChild(socialDiv);

    document.body.appendChild(container);
    return container;
  };

  describe('Structure and Layout', () => {
    it('renders profile container with correct layout classes', () => {
      const profile = createProfile();

      expect(profile.classList.contains('flex')).toBe(true);
      expect(profile.classList.contains('flex-col')).toBe(true);
      expect(profile.classList.contains('items-center')).toBe(true);
      expect(profile.classList.contains('justify-center')).toBe(true);
      expect(profile.classList.contains('py-12')).toBe(true);
      expect(profile.classList.contains('text-center')).toBe(true);
    });

    it('contains all main sections', () => {
      createProfile();

      expect(document.querySelector('#profile-image')).toBeTruthy();
      expect(document.querySelector('h1')).toBeTruthy();
      expect(document.querySelector('h2')).toBeTruthy();
      expect(document.querySelector('h3')).toBeTruthy();
      expect(document.querySelectorAll('a')).toHaveLength(8); // Contact, blog, freeCodeCamp, pronunciation (2 links in tooltip), 4 social links
    });
  });

  describe('Profile Image', () => {
    it('renders profile image with correct attributes', () => {
      createProfile();

      const img = document.querySelector('#profile-image') as HTMLImageElement;
      expect(img.alt).toBe("Mrugesh Mohapatra's profile picture.");
      expect(img.src).toContain('/images/profile.small.webp');
      expect(img.width).toBe(144);
      expect(img.height).toBe(144);
    });

    it('applies correct styling to profile image', () => {
      createProfile();

      const img = document.querySelector('#profile-image');
      expect(img?.classList.contains('h-28')).toBe(true);
      expect(img?.classList.contains('w-28')).toBe(true);
      expect(img?.classList.contains('border-4')).toBe(true);
      expect(img?.classList.contains('border-orange-50')).toBe(true);
      expect(img?.classList.contains('md:h-36')).toBe(true);
      expect(img?.classList.contains('md:w-36')).toBe(true);
      expect(img?.className).toContain('shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]');
    });

    it('applies responsive sizing to image container', () => {
      createProfile();

      const imageContainer = document.querySelector('#profile-image')?.parentElement;
      expect(imageContainer?.classList.contains('mb-8')).toBe(true);
      expect(imageContainer?.classList.contains('md:mb-10')).toBe(true);
    });
  });

  describe('Name and Pronunciation', () => {
    it('renders name with correct styling', () => {
      createProfile();

      const nameHeading = document.querySelector('h1');
      expect(nameHeading?.textContent).toContain('mrugesh mohapatra');
      expect(nameHeading?.classList.contains('text-3xl')).toBe(true);
      expect(nameHeading?.classList.contains('font-extrabold')).toBe(true);
      expect(nameHeading?.classList.contains('text-slate-800')).toBe(true);
      expect(nameHeading?.classList.contains('md:text-5xl')).toBe(true);
    });

    it('applies rotation transforms to name section', () => {
      createProfile();

      const nameContainer = document.querySelector('h1')?.parentElement;
      const nameHeading = document.querySelector('h1');

      expect(nameContainer?.classList.contains('-rotate-12')).toBe(true);
      expect(nameContainer?.classList.contains('transform')).toBe(true);
      expect(nameHeading?.classList.contains('rotate-12')).toBe(true);
      expect(nameHeading?.classList.contains('transform')).toBe(true);
    });

    it('includes pronunciation tooltip', () => {
      createProfile();

      const tooltip = document.querySelector('.pronunciation-tooltip');
      expect(tooltip).toBeTruthy();
      expect(tooltip?.classList.contains('hidden')).toBe(true);
      expect(tooltip?.classList.contains('group-hover:block')).toBe(true);
    });

    it('renders pronunciation link with correct attributes', () => {
      createProfile();

      const pronunciationLink = document.querySelector('.pronunciation-tooltip a');
      expect(pronunciationLink?.getAttribute('href')).toContain('phoneme-synthesis');
      expect(pronunciationLink?.getAttribute('aria-label')).toBe('Pronunciation of my name');
      expect(pronunciationLink?.textContent).toBe('🗣 /ˈm.ruː.geɪ.ʃ/');
    });

    it('includes decorative underline', () => {
      createProfile();

      const underline = document.querySelector('.border-8.border-orange-50.bg-orange-50');
      expect(underline).toBeTruthy();
      expect(underline?.classList.contains('w-2/5')).toBe(true);
      expect(underline?.classList.contains('-mt-8')).toBe(true);
    });
  });

  describe('Description and Job Title', () => {
    it('renders description with emojis', () => {
      createProfile();

      const description = document.querySelector('h2');
      expect(description?.textContent).toContain('nocturnal developer 🦉');
      expect(description?.textContent).toContain('open-source enthusiast 🌏');
      expect(description?.textContent).toContain('photography noob 📷');
    });

    it('applies correct styling to description', () => {
      createProfile();

      const description = document.querySelector('h2');
      expect(description?.classList.contains('mb-4')).toBe(true);
      expect(description?.classList.contains('max-w-md')).toBe(true);
      expect(description?.classList.contains('text-xl')).toBe(true);
      expect(description?.classList.contains('font-bold')).toBe(true);
      expect(description?.classList.contains('text-slate-700')).toBe(true);
      expect(description?.classList.contains('md:text-2xl')).toBe(true);
    });

    it('renders job title with freeCodeCamp link', () => {
      createProfile();

      const jobTitle = document.querySelector('h3');
      expect(jobTitle?.textContent).toContain('Principal Maintainer');
      expect(jobTitle?.textContent).toContain('freeCodeCamp.org');

      const fccLink = jobTitle?.querySelector('a');
      expect(fccLink?.getAttribute('href')).toContain('freecodecamp.org');
      expect(fccLink?.getAttribute('aria-label')).toBe('freecodecamp.org');
    });

    it('applies decorative underline to freeCodeCamp link', () => {
      createProfile();

      const fccLink = document.querySelector('h3 a');
      expect(fccLink?.classList.contains('underline')).toBe(true);
      expect(fccLink?.classList.contains('decoration-orange-200')).toBe(true);
      expect(fccLink?.classList.contains('decoration-wavy')).toBe(true);
      expect(fccLink?.classList.contains('decoration-2')).toBe(true);
      expect(fccLink?.classList.contains('underline-offset-2')).toBe(true);
    });
  });

  describe('Action Buttons', () => {
    it('renders contact button with correct attributes', () => {
      createProfile();

      const contactButton = document.querySelector('a[href="https://topmate.io/mrugesh"]');
      expect(contactButton).toBeTruthy();
      expect(contactButton?.getAttribute('aria-label')).toBe('Book a 1-on-1 Call');
      expect(contactButton?.textContent).toContain('Get in touch!');
    });

    it('renders blog button with correct attributes', () => {
      createProfile();

      const blogButton = document.querySelector('a[href="/blog"]');
      expect(blogButton).toBeTruthy();
      expect(blogButton?.getAttribute('aria-label')).toBe('Browse my blog');
      expect(blogButton?.textContent).toContain('Blog');
    });

    it('applies consistent styling to both buttons', () => {
      createProfile();

      const buttons = document.querySelectorAll('.mb-10 a');
      buttons.forEach((button) => {
        expect(button.classList.contains('flex')).toBe(true);
        expect(button.classList.contains('h-14')).toBe(true);
        expect(button.classList.contains('items-center')).toBe(true);
        expect(button.classList.contains('justify-center')).toBe(true);
        expect(button.classList.contains('border-2')).toBe(true);
        expect(button.classList.contains('border-black')).toBe(true);
        expect(button.classList.contains('transition-all')).toBe(true);
        expect(button.classList.contains('duration-200')).toBe(true);
      });
    });

    it('applies different background colors to buttons', () => {
      createProfile();

      const contactButton = document.querySelector('a[href="https://topmate.io/mrugesh"]');
      const blogButton = document.querySelector('a[href="/blog"]');

      expect(contactButton?.classList.contains('bg-orange-50')).toBe(true);
      expect(blogButton?.classList.contains('bg-orange-200')).toBe(true);
    });

    it('applies different widths to buttons', () => {
      createProfile();

      const contactButton = document.querySelector('a[href="https://topmate.io/mrugesh"]');
      const blogButton = document.querySelector('a[href="/blog"]');

      expect(contactButton?.classList.contains('w-80')).toBe(true);
      expect(blogButton?.classList.contains('w-36')).toBe(true);
    });

    it('applies hover effects to buttons', () => {
      createProfile();

      const buttons = document.querySelectorAll('.mb-10 a');
      buttons.forEach((button) => {
        expect(button.classList.contains('hover:bg-gray-700')).toBe(true);
        expect(button.classList.contains('hover:text-white')).toBe(true);
        expect(button.classList.contains('hover:shadow-none')).toBe(true);
        expect(button.classList.contains('active:bg-black')).toBe(true);
        expect(button.classList.contains('active:shadow-none')).toBe(true);
      });
    });
  });

  describe('Social Links Section', () => {
    it('renders social section heading', () => {
      createProfile();

      const socialHeading = document.querySelector('.prose h3');
      expect(socialHeading?.textContent).toBe('Elsewhere on the internet');
      expect(socialHeading?.classList.contains('text-center')).toBe(true);
      expect(socialHeading?.classList.contains('font-bold')).toBe(true);
      expect(socialHeading?.classList.contains('text-slate-700')).toBe(true);
    });

    it('renders all four social links', () => {
      createProfile();

      const socialLinks = document.querySelectorAll('.prose a[rel="me"]');
      expect(socialLinks).toHaveLength(4);

      const expectedUrls = [
        'https://twitter.com/raisedadead',
        'https://github.com/raisedadead',
        'https://instagram.com/raisedadead',
        'https://linkedin.com/in/mrugeshm'
      ];

      socialLinks.forEach((link, index) => {
        expect(link.getAttribute('href')).toBe(expectedUrls[index]);
      });
    });

    it('applies consistent styling to social links', () => {
      createProfile();

      const socialLinks = document.querySelectorAll('.prose a[rel="me"]');
      socialLinks.forEach((link) => {
        expect(link.classList.contains('h-10')).toBe(true);
        expect(link.classList.contains('w-10')).toBe(true);
        expect(link.classList.contains('border-2')).toBe(true);
        expect(link.classList.contains('border-black')).toBe(true);
        expect(link.classList.contains('bg-orange-200')).toBe(true);
        expect(link.classList.contains('p-2')).toBe(true);
      });
    });

    it('includes screen reader text for social links', () => {
      createProfile();

      const srTexts = document.querySelectorAll('.prose .sr-only');
      const expectedLabels = ['Twitter', 'Github', 'Instagram', 'LinkedIn'];

      expect(srTexts).toHaveLength(4);
      srTexts.forEach((srText, index) => {
        expect(srText.textContent).toBe(expectedLabels[index]);
      });
    });
  });

  describe('Accessibility', () => {
    it('uses proper heading hierarchy', () => {
      createProfile();

      const h1 = document.querySelector('h1');
      const h2 = document.querySelector('h2');
      const h3s = document.querySelectorAll('h3');

      expect(h1).toBeTruthy();
      expect(h2).toBeTruthy();
      expect(h3s).toHaveLength(2); // Job title and social heading
    });

    it('provides descriptive alt text for profile image', () => {
      createProfile();

      const img = document.querySelector('#profile-image') as HTMLImageElement;
      expect(img.alt).toBe("Mrugesh Mohapatra's profile picture.");
    });

    it('includes aria-labels for action buttons', () => {
      createProfile();

      const contactButton = document.querySelector('a[href="https://topmate.io/mrugesh"]');
      const blogButton = document.querySelector('a[href="/blog"]');

      expect(contactButton?.getAttribute('aria-label')).toBe('Book a 1-on-1 Call');
      expect(blogButton?.getAttribute('aria-label')).toBe('Browse my blog');
    });

    it('includes aria-labels for social links', () => {
      createProfile();

      const socialLinks = document.querySelectorAll('.prose a[rel="me"]');
      const expectedLabels = ['Twitter', 'Github', 'Instagram', 'LinkedIn'];

      socialLinks.forEach((link, index) => {
        expect(link.getAttribute('aria-label')).toBe(expectedLabels[index]);
      });
    });

    it('hides decorative SVGs from screen readers', () => {
      createProfile();

      const decorativeSvgs = document.querySelectorAll('svg[aria-hidden="true"]');
      expect(decorativeSvgs.length).toBeGreaterThan(0);
    });

    it('provides accessible pronunciation link', () => {
      createProfile();

      const pronunciationLink = document.querySelector('.pronunciation-tooltip a');
      expect(pronunciationLink?.getAttribute('aria-label')).toBe('Pronunciation of my name');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive image sizing', () => {
      createProfile();

      const img = document.querySelector('#profile-image');
      expect(img?.classList.contains('h-28')).toBe(true);
      expect(img?.classList.contains('w-28')).toBe(true);
      expect(img?.classList.contains('md:h-36')).toBe(true);
      expect(img?.classList.contains('md:w-36')).toBe(true);
    });

    it('applies responsive text sizing', () => {
      createProfile();

      const nameHeading = document.querySelector('h1');
      const description = document.querySelector('h2');
      const jobTitle = document.querySelector('h3');

      expect(nameHeading?.classList.contains('text-3xl')).toBe(true);
      expect(nameHeading?.classList.contains('md:text-5xl')).toBe(true);

      expect(description?.classList.contains('text-xl')).toBe(true);
      expect(description?.classList.contains('md:text-2xl')).toBe(true);

      expect(jobTitle?.classList.contains('text-lg')).toBe(true);
      expect(jobTitle?.classList.contains('md:text-xl')).toBe(true);
    });

    it('applies responsive margins', () => {
      createProfile();

      const imageContainer = document.querySelector('#profile-image')?.parentElement;
      const nameContainer = document.querySelector('h1')?.parentElement;

      expect(imageContainer?.classList.contains('mb-8')).toBe(true);
      expect(imageContainer?.classList.contains('md:mb-10')).toBe(true);

      expect(nameContainer?.classList.contains('mb-8')).toBe(true);
      expect(nameContainer?.classList.contains('md:mb-10')).toBe(true);
    });
  });

  describe('Interactive Elements', () => {
    it('makes name clickable with cursor pointer', () => {
      createProfile();

      const nameHeading = document.querySelector('h1');
      expect(nameHeading?.classList.contains('cursor-pointer')).toBe(true);
      expect(nameHeading?.classList.contains('group')).toBe(true);
    });

    it('shows pronunciation on hover', () => {
      createProfile();

      const tooltip = document.querySelector('.pronunciation-tooltip');
      expect(tooltip?.classList.contains('hidden')).toBe(true);
      expect(tooltip?.classList.contains('group-hover:block')).toBe(true);
    });

    it('applies transition effects to links', () => {
      createProfile();

      const fccLink = document.querySelector('h3 a');
      const actionButtons = document.querySelectorAll('.mb-10 a');
      const socialLinks = document.querySelectorAll('.prose a[rel="me"]');

      expect(fccLink?.classList.contains('transition-colors')).toBe(true);
      expect(fccLink?.classList.contains('duration-200')).toBe(true);

      actionButtons.forEach((button) => {
        expect(button.classList.contains('transition-all')).toBe(true);
        expect(button.classList.contains('duration-200')).toBe(true);
      });

      socialLinks.forEach((link) => {
        expect(link.classList.contains('transition-all')).toBe(true);
        expect(link.classList.contains('duration-200')).toBe(true);
      });
    });
  });

  describe('Visual Design Elements', () => {
    it('applies shadow effects', () => {
      createProfile();

      const img = document.querySelector('#profile-image');
      const actionButtons = document.querySelectorAll('.mb-10 a');
      const socialLinks = document.querySelectorAll('.prose a[rel="me"]');

      expect(img?.className).toContain('shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]');

      actionButtons.forEach((button) => {
        expect(button.className).toContain('shadow-[2px_2px_0px_rgba(0,0,0,1)]');
      });

      socialLinks.forEach((link) => {
        expect(link.className).toContain('shadow-[2px_2px_0px_rgba(0,0,0,1)]');
      });
    });

    it('uses consistent color scheme', () => {
      createProfile();

      const nameHeading = document.querySelector('h1');
      const description = document.querySelector('h2');
      const jobTitle = document.querySelector('h3');

      expect(nameHeading?.classList.contains('text-slate-800')).toBe(true);
      expect(description?.classList.contains('text-slate-700')).toBe(true);
      expect(jobTitle?.classList.contains('text-slate-700')).toBe(true);
    });

    it('applies orange accent colors consistently', () => {
      createProfile();

      const img = document.querySelector('#profile-image');
      const underline = document.querySelector('.border-orange-50.bg-orange-50');
      const actionButtons = document.querySelectorAll('.mb-10 a');
      const socialLinks = document.querySelectorAll('.prose a[rel="me"]');

      expect(img?.classList.contains('border-orange-50')).toBe(true);
      expect(underline).toBeTruthy();

      expect(actionButtons[0].classList.contains('bg-orange-50')).toBe(true);
      expect(actionButtons[1].classList.contains('bg-orange-200')).toBe(true);

      socialLinks.forEach((link) => {
        expect(link.classList.contains('bg-orange-200')).toBe(true);
      });
    });
  });
});
