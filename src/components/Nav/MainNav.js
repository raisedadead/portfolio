import React from 'react';
import { PrimaryNav, NavItem } from 'mineral-ui/Navigation';
import Tooltip from 'mineral-ui/Tooltip';
import Link from 'mineral-ui/Link';
import Box from 'mineral-ui/Box/Box';

const MainNaV = () => (
  <Box marginHorizontal="auto" width={1 / 2}>
    <PrimaryNav itemAs={Link} align="end" minimal>
      {/*
      <NavItem to="https://git.raisedadead.com/resume/">
        <span>résumé</span>
      </NavItem>
      */}
      <NavItem href="https://github.com/raisedadead/ama/">
        <Tooltip content="ask me anything">ama</Tooltip>
      </NavItem>
    </PrimaryNav>
  </Box>
);

export default MainNaV;
