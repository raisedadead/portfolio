/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./src/**/*.{html,js,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-ibm-plex-sans)'],
        mono: ['var(--font-ibm-plex-mono)'],
        'mono-italic': ['var(--font-ibm-plex-mono-italic)']
      }
    }
  },
  plugins: [
    // Use dynamic imports for plugins
    async () => {
      const forms = await import('@tailwindcss/forms');
      const typography = await import('@tailwindcss/typography');
      return [forms.default, typography.default];
    }
  ]
};

export default config;
