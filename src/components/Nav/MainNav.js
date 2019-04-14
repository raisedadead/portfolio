import React from 'react';
import styled from '@emotion/styled';
import { PrimaryNav, NavItem as NavigationItem } from 'mineral-ui/Navigation';
import Link from 'mineral-ui/Link';
import Box from 'mineral-ui/Box/Box';

const NavItem = styled(NavigationItem)({
  minWidth: `auto`,
  minHeight: `auto`,
  padding: `0.5em 0.5em`,
  height: `auto`
});

const MainNaV = () => (
  <Box marginHorizontal="auto" width={1 / 2}>
    <PrimaryNav
      css={{
        width: `75vw`
      }}
      itemAs={Link}
      align="end"
      minimal
    >
      {/*
      <NavItem to="https://git.raisedadead.com/resume/">
        <span>résumé</span>
      </NavItem>
      */}
      <NavItem
        href="https://github.com/raisedadead/ama/"
        aria-label="Ask me anything"
      >
        ama
      </NavItem>
    </PrimaryNav>
  </Box>
);

export default MainNaV;
