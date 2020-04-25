import React from 'react';
import { ClassNames } from '@emotion/core';

import { ThemeProvider } from 'mineral-ui/themes';
import Box from 'mineral-ui/Box';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { lightTheme } from '../Theme';
import Footer from '../Footer';

library.add(fab);

const MainBox = (props) => (
  <ClassNames>
    {({ css }) => (
      <Box
        className={css`
          background: #32ccbc; /* fallback for old browsers */
          background: -webkit-linear-gradient(
            -45deg,
            #90f7ec,
            #32ccbc,
            #abdcff,
            #0396ff
          ); /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(
            -45deg,
            #90f7ec,
            #32ccbc,
            #abdcff,
            #0396ff
          ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
          background-size: 400% 400%;
          -webkit-animation: gradientBG 10s ease infinite;
          animation: gradientBG 10s ease infinite;
          @-webkit-keyframes gradientBG {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          @keyframes gradientBG {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
        `}
        {...props}
      />
    )}
  </ClassNames>
);

class DefaultLayout extends React.Component {
  render() {
    const { children, isHome = false } = this.props;
    return (
      <ThemeProvider theme={lightTheme}>
        {isHome ? (
          <MainBox height="100vh">
            <main>{children}</main>
            <Footer />
          </MainBox>
        ) : (
          <Box height="100vh">
            <main>{children}</main>
            <Footer />
          </Box>
        )}
      </ThemeProvider>
    );
  }
}

export default DefaultLayout;
