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
          background: #c6ffdd; /* fallback for old browsers */
          background: -webkit-linear-gradient(
            to top,
            #abdcff,
            #0396ff
          ); /* Chrome 10-25, Safari 5.1-6 */
          background: linear-gradient(
            to top,
            #abdcff,
            #0396ff
          ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        `}
        {...props}
      />
    )}
  </ClassNames>
);

class DefaultLayout extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <ThemeProvider theme={lightTheme}>
        <MainBox height="100vh">
          <main>{children}</main>
          <Footer />
        </MainBox>
      </ThemeProvider>
    );
  }
}

export default DefaultLayout;
