import { createTheme } from 'mineral-ui/themes';

import './theme.css';

const color = `#333840`;
export const lightTheme = createTheme({
  overrides: {
    fontFamily: `Poppins`,
    fontSize_base: `18px`,
    color: color,
    h1_color: color,
    h2_color: color,
    h3_color: color,
    h4_color: color,
    h5_color: color,
    h6_color: color
  }
});

export const darkTheme = lightTheme;

const theme = lightTheme;
export default theme;
