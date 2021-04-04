const { tailwindExtractor } = require('tailwindcss/lib/lib/purgeUnusedStyles');
const theme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    options: {
      defaultExtractor: (content) => [
        // If this stops working, please open an issue at https://github.com/svelte-add/tailwindcss/issues rather than bothering Tailwind Labs about it
        ...tailwindExtractor(content),
        // Match Svelte class: directives (https://github.com/tailwindlabs/tailwindcss/discussions/1731)
        ...[...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        )
      ],
      keyframes: true
    }
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [...theme.fontFamily.sans]
      }
    },
    boxShadow: {
      ...theme.boxShadow,
      card: '50px 50px 100px #000'
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ...colors,
      gray: colors.blueGray,
      red: colors.rose,
      yellow: colors.yellow,
      green: colors.emerald,
      blue: colors.teal,
      indigo: colors.violet,
      purple: colors.fuchsia,
      pink: colors.pink
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};
