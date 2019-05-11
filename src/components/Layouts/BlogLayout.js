import React from 'react';

import { ThemeProvider } from 'mineral-ui/themes';
import Box from 'mineral-ui/Box';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { lightTheme } from '../Theme';
import MainNav from '../Nav/MainNav';
import Footer from '../Footer';

library.add(fab);

class DefaultLayout extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <ThemeProvider theme={lightTheme}>
        <Box height="100vh" width="100vw">
          <MainNav showHome={true} />
          <main>{children}</main>
          <Footer />
        </Box>
      </ThemeProvider>
    );
  }
}

export default DefaultLayout;
