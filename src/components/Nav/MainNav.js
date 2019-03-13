import React from 'react';
import { Tooltip, PrimaryNav, NavItem } from 'mineral-ui';

import LinkComponent from '../LinkComponent';

const MainNaV = () => (
  <PrimaryNav itemAs={LinkComponent} align="end" minimal>
    <NavItem openNewTab to="https://git.raisedadead.com/resume/">
      <span>résumé</span>
    </NavItem>
    <NavItem openNewTab to="https://github.com/raisedadead/ama/">
      <Tooltip content="ask me anything">
        <span>ama</span>
      </Tooltip>
    </NavItem>
  </PrimaryNav>
);

export default MainNaV;
