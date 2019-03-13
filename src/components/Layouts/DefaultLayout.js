import React from 'react';
import { ThemeProvider } from 'mineral-ui/themes';
import Box from 'mineral-ui/Box';

import MainNav from '../Nav/MainNav';
import Footer from '../Footer';

class DefaultLayout extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <ThemeProvider>
        <Box marginHorizontal="auto" width={1 / 2}>
          <div>
            <header>
              <MainNav />
            </header>
            <div>{children}</div>
          </div>
          <Footer />
        </Box>
      </ThemeProvider>
    );
  }
}

export default DefaultLayout;
