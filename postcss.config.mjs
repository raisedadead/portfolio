import tailwindcss from '@tailwindcss/postcss';

const config = {
  plugins: [
    tailwindcss({
      base: './src/styles/globals.css'
    })
  ]
};

export default config;
