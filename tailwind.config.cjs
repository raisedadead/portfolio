const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');

const config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        'spin-slower': 'spin 6s linear infinite',
        'spin-reverse': 'spin-reverse 1s linear infinite',
        'spin-reverse-slow': 'spin-reverse 4s linear infinite',
        'spin-reverse-slower': 'spin-reverse 6s linear infinite'
      },
      keyframes: {
        'spin-reverse': {
          to: {
            transform: 'rotate(-360deg)'
          }
        }
      }
    }
  },

  plugins: [forms, typography]
};

module.exports = config;
