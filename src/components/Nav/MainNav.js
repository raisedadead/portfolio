import React from 'react';
import styled from '@emotion/styled';
import { PrimaryNav, NavItem as NavigationItem } from 'mineral-ui/Navigation';
import Link from 'mineral-ui/Link';
import Box from 'mineral-ui/Box/Box';
import Tooltip from 'mineral-ui/Tooltip';

const NavItem = styled(NavigationItem)({
  minWidth: `auto`,
  minHeight: `auto`,
  padding: `0`,
  height: `auto`
});

const MainNaV = () => (
  <Box marginHorizontal="auto" width={1 / 2}>
    <PrimaryNav
      css={{
        width: `75vw`,
        backgroundColor: `rgba(255, 255, 255, 0)`
      }}
      itemAs={Link}
      align="end"
      minimal
    >
      <NavItem
        href="https://represent.io/mrugesh"
        aria-label="Mrugesh Mohapatra's resumé"
      >
        <Tooltip content="resumé" usePortal>
          resumé
        </Tooltip>
      </NavItem>
      <NavItem
        href="https://github.com/raisedadead/ama/"
        aria-label="Ask me anything"
      >
        <Tooltip content="ask me anything" usePortal>
          ama
        </Tooltip>
      </NavItem>
    </PrimaryNav>
  </Box>
);

export default MainNaV;
