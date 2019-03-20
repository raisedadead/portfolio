import React from 'react';
import { ThemeProvider } from 'mineral-ui/themes';
import Box from 'mineral-ui/Box';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { lightTheme } from '../Theme';
import MainNav from '../Nav/MainNav';
import Footer from '../Footer';
import styled from '@emotion/styled';

library.add(fab);

const MainBox = styled(Box)({
  background: `white`
});

class DefaultLayout extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <ThemeProvider theme={lightTheme}>
        <MainBox height="100vh" width="100vw">
          <MainNav />
          <main>{children}</main>
          <Footer />
        </MainBox>
      </ThemeProvider>
    );
  }
}

export default DefaultLayout;
