import React from 'react';
import { PrimaryNav, NavItem } from 'mineral-ui';

import LinkComponent from '../LinkComponent';

const SocialNav = () => (
  <PrimaryNav itemAs={LinkComponent} minimal>
    <NavItem to="https://twitter.com/raisedadead">
      <span>Twitter</span>
    </NavItem>
    <NavItem to="https://github.com/raisedadead">
      <span>GitHub</span>
    </NavItem>
    <NavItem to="https://blog.raisedadead.com">
      <span>Medium</span>
    </NavItem>
    <NavItem to="https://freeCodeCamp.org/raisedadead">
      <span>freeCodeCamp</span>
    </NavItem>
    <NavItem to="https://linkedin.com/in/mrugeshm">
      <span>LinkedIn</span>
    </NavItem>
  </PrimaryNav>
);

export default SocialNav;
