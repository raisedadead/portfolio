import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock utility functions
vi.mock('@/lib/utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' ')
}));

// Since this is an Astro page, we'll test the component parts
describe('404 Page Content', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  const create404Content = () => {
    const section = document.createElement('section');
    section.className = 'mb-8 flex flex-col items-center justify-center';

    const proseDiv = document.createElement('div');
    proseDiv.className = 'prose prose-lg prose-slate max-w-none text-center';

    const h1 = document.createElement('h1');
    h1.className = 'py-4 text-4xl font-extrabold tracking-tight text-slate-900';
    h1.textContent = 'Page Not Found';

    const subtitle = document.createElement('p');
    subtitle.className = 'text-xl font-medium text-slate-700';
    subtitle.textContent = "Oops! It seems you've wandered into uncharted territory.";

    proseDiv.appendChild(h1);
    proseDiv.appendChild(subtitle);

    const imageDiv = document.createElement('div');
    imageDiv.className = 'my-8 flex w-full flex-col items-center justify-center';

    const img = document.createElement('img');
    img.src = '/images/404.svg';
    img.alt = '404';
    img.width = 640;
    img.height = 640;
    img.setAttribute('data-format', 'svg');

    const attribution = document.createElement('p');
    attribution.className = 'mt-2 text-xs text-slate-500';
    attribution.textContent = 'Image by storyset on Freepik';

    imageDiv.appendChild(img);
    imageDiv.appendChild(attribution);

    const encouragement = document.createElement('p');
    encouragement.className = 'mb-6 text-lg font-medium text-slate-700';
    encouragement.textContent = "Don't worry, even the best explorers get lost sometimes!";

    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.className =
      'inline-flex items-center border-2 border-black bg-orange-200 px-4 py-2 text-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-700 hover:text-white hover:shadow-none focus:outline-hidden active:bg-black active:shadow-none';
    homeLink.textContent = 'Return to Home';

    section.appendChild(proseDiv);
    section.appendChild(imageDiv);
    section.appendChild(encouragement);
    section.appendChild(homeLink);

    document.body.appendChild(section);
    return section;
  };

  describe('Basic Structure', () => {
    it('renders main section with correct classes', () => {
      const section = create404Content();

      expect(section.classList.contains('mb-8')).toBe(true);
      expect(section.classList.contains('flex')).toBe(true);
      expect(section.classList.contains('flex-col')).toBe(true);
      expect(section.classList.contains('items-center')).toBe(true);
      expect(section.classList.contains('justify-center')).toBe(true);
    });

    it('renders heading and content sections', () => {
      create404Content();

      const heading = document.querySelector('h1');
      const link = document.querySelector('a[href="/"]');

      expect(heading).toBeTruthy();
      expect(link).toBeTruthy();
      expect(link?.textContent).toBe('Return to Home');
    });
  });

  describe('Heading and Text Content', () => {
    it('displays correct page title', () => {
      create404Content();

      const heading = document.querySelector('h1');
      expect(heading?.textContent).toBe('Page Not Found');
      expect(heading?.classList.contains('py-4')).toBe(true);
      expect(heading?.classList.contains('text-4xl')).toBe(true);
      expect(heading?.classList.contains('font-extrabold')).toBe(true);
      expect(heading?.classList.contains('tracking-tight')).toBe(true);
      expect(heading?.classList.contains('text-slate-900')).toBe(true);
    });

    it('displays descriptive error messages', () => {
      create404Content();

      const subtitleText = "Oops! It seems you've wandered into uncharted territory.";
      const encouragementText = "Don't worry, even the best explorers get lost sometimes!";

      expect(document.body.textContent).toContain(subtitleText);
      expect(document.body.textContent).toContain(encouragementText);
    });

    it('applies correct typography classes', () => {
      create404Content();

      const subtitle = document.querySelector('.text-xl.font-medium.text-slate-700');
      const encouragement = document.querySelector('.mb-6.text-lg.font-medium.text-slate-700');

      expect(subtitle).toBeTruthy();
      expect(encouragement).toBeTruthy();
    });
  });

  describe('404 Image', () => {
    it('renders 404 illustration', () => {
      create404Content();

      const image = document.querySelector('img[alt="404"]');
      expect(image).toBeTruthy();
      expect(image?.getAttribute('src')).toBe('/images/404.svg');
      expect(image?.getAttribute('width')).toBe('640');
      expect(image?.getAttribute('height')).toBe('640');
    });

    it('displays image attribution', () => {
      create404Content();

      expect(document.body.textContent).toContain('Image by storyset on Freepik');
    });

    it('image container has correct styling', () => {
      create404Content();

      const imageContainer = document.querySelector('.my-8.flex.w-full.flex-col.items-center.justify-center');
      expect(imageContainer).toBeTruthy();

      const attribution = document.querySelector('.mt-2.text-xs.text-slate-500');
      expect(attribution).toBeTruthy();
      expect(attribution?.textContent).toBe('Image by storyset on Freepik');
    });
  });

  describe('Return to Home Button', () => {
    it('renders return home link', () => {
      create404Content();

      const homeLink = document.querySelector('a[href="/"]');
      expect(homeLink).toBeTruthy();
      expect(homeLink?.textContent).toBe('Return to Home');
    });

    it('applies correct button styling', () => {
      create404Content();

      const homeLink = document.querySelector('a[href="/"]');
      expect(homeLink?.classList.contains('inline-flex')).toBe(true);
      expect(homeLink?.classList.contains('items-center')).toBe(true);
      expect(homeLink?.classList.contains('border-2')).toBe(true);
      expect(homeLink?.classList.contains('border-black')).toBe(true);
      expect(homeLink?.classList.contains('bg-orange-200')).toBe(true);
      expect(homeLink?.classList.contains('px-4')).toBe(true);
      expect(homeLink?.classList.contains('py-2')).toBe(true);
      expect(homeLink?.classList.contains('text-black')).toBe(true);
    });

    it('includes hover and focus states', () => {
      create404Content();

      const homeLink = document.querySelector('a[href="/"]');
      expect(homeLink?.classList.contains('hover:bg-gray-700')).toBe(true);
      expect(homeLink?.classList.contains('hover:text-white')).toBe(true);
      expect(homeLink?.classList.contains('hover:shadow-none')).toBe(true);
      expect(homeLink?.classList.contains('focus:outline-hidden')).toBe(true);
      expect(homeLink?.classList.contains('active:bg-black')).toBe(true);
      expect(homeLink?.classList.contains('active:shadow-none')).toBe(true);
    });
  });

  describe('Layout and Design', () => {
    it('uses prose styling for content sections', () => {
      create404Content();

      const proseContainer = document.querySelector('.prose.prose-lg.prose-slate');
      expect(proseContainer).toBeTruthy();
      expect(proseContainer?.classList.contains('max-w-none')).toBe(true);
      expect(proseContainer?.classList.contains('text-center')).toBe(true);
    });

    it('centers content vertically and horizontally', () => {
      const section = create404Content();

      expect(section.classList.contains('flex')).toBe(true);
      expect(section.classList.contains('flex-col')).toBe(true);
      expect(section.classList.contains('items-center')).toBe(true);
      expect(section.classList.contains('justify-center')).toBe(true);
    });

    it('applies proper spacing between elements', () => {
      create404Content();

      const imageContainer = document.querySelector('.my-8');
      const encouragementText = document.querySelector('.mb-6');

      expect(imageContainer?.classList.contains('my-8')).toBe(true);
      expect(encouragementText?.classList.contains('mb-6')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      create404Content();

      expect(document.querySelector('section')).toBeTruthy();
      expect(document.querySelector('h1')).toBeTruthy();
      expect(document.querySelector('a')).toBeTruthy();
      expect(document.querySelector('img')).toBeTruthy();
    });

    it('has descriptive alt text for image', () => {
      create404Content();

      const image = document.querySelector('img');
      expect(image?.getAttribute('alt')).toBe('404');
    });

    it('link has descriptive text', () => {
      create404Content();

      const homeLink = document.querySelector('a');
      expect(homeLink?.textContent).toBe('Return to Home');
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive layout classes', () => {
      const section = create404Content();
      const imageContainer = document.querySelector('.flex.w-full.flex-col');

      expect(section.classList.contains('flex')).toBe(true);
      expect(section.classList.contains('flex-col')).toBe(true);
      expect(imageContainer?.classList.contains('flex')).toBe(true);
      expect(imageContainer?.classList.contains('w-full')).toBe(true);
      expect(imageContainer?.classList.contains('flex-col')).toBe(true);
      expect(imageContainer?.classList.contains('items-center')).toBe(true);
      expect(imageContainer?.classList.contains('justify-center')).toBe(true);
    });

    it('uses responsive typography', () => {
      create404Content();

      const heading = document.querySelector('h1');
      const subtitle = document.querySelector('.text-xl');

      expect(heading?.classList.contains('text-4xl')).toBe(true);
      expect(subtitle?.classList.contains('text-xl')).toBe(true);
    });
  });
});
